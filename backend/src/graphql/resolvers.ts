import { DateTimeResolver } from 'graphql-scalars'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const toStr = (v: unknown) => (typeof v === 'bigint' ? v.toString() : v)
const toNum = (v: unknown) => (typeof v === 'bigint' ? Number(v) : Number(v))

export const resolvers = {
  DateTime: DateTimeResolver,
  Hotel: {
    id: (h: any) => toStr(h.id),
    rooms: (h: any) =>
      prisma.room.findMany({
        where: { hotelId: BigInt(h.id) },
        include: { roomType: true },
      }),
  },
  RoomType: {
    id: (r: any) => toStr(r.id),
    hotelId: (r: any) => toStr(r.hotelId),
    basePrice: (r: any) => toNum(r.basePrice),
    rooms: (r: any) =>
      prisma.room.findMany({
        where: { roomTypeId: BigInt(r.id) },
        include: { roomType: true },
      }),
  },
  Room: {
    id: (room: any) => toStr(room.id),
    hotelId: (room: any) => toStr(room.hotelId),
    roomTypeId: (room: any) => toStr(room.roomTypeId),
    roomType: (room: any) =>
      room.roomType ||
      prisma.roomType.findUnique({ where: { id: BigInt(room.roomTypeId) } }),
  },
  Reservation: {
    id: (x: any) => toStr(x.id),
    hotelId: (x: any) => toStr(x.hotelId),
    totalPrice: (x: any) => toNum(x.totalPrice),
  },
  Query: {
    hotels: () => prisma.hotel.findMany(),
    roomTypes: (_: unknown, { hotelId }: { hotelId: string }) =>
      prisma.roomType.findMany({
        where: { hotelId: BigInt(hotelId), active: true },
      }),
    rooms: (_: unknown, { hotelId }: { hotelId: string }) =>
      prisma.room.findMany({
        where: { hotelId: BigInt(hotelId) },
        include: { roomType: true },
      }),
    availableRoomTypes: async (
      _: unknown,
      {
        hotelId,
        from,
        to,
        rooms,
      }: { hotelId: string; from: string; to: string; rooms: number }
    ) => {
      const hotelIdBig = BigInt(hotelId)
      const roomTypes = await prisma.roomType.findMany({
        where: { hotelId: hotelIdBig, active: true },
        include: { rooms: { where: { active: true }, select: { id: true } } },
      })

      const fromDate = new Date(from)
      const toDate = new Date(to)

      const availables: any[] = []
      for (const rt of roomTypes) {
        const roomIds = rt.rooms.map((r) => r.id)
        if (roomIds.length === 0) continue

        const conflicts = await prisma.$queryRaw<Array<{ roomid: bigint }>>`
  SELECT DISTINCT "roomId" AS roomid
  FROM "RoomStay"
  WHERE "roomId" = ANY(${roomIds})
    AND "stayStart" < ${toDate}::timestamp
    AND "stayEnd"   > ${fromDate}::timestamp
`
        const busy = new Set(conflicts.map((c) => c.roomid.toString()))
        const freeCount = roomIds.filter(
          (id) => !busy.has(id.toString())
        ).length

        if (freeCount >= rooms) {
          availables.push(rt)
        }
      }
      return availables
    },
  },
  Mutation: {
    createReservation: async (_: unknown, { input }: any) => {
      const { hotelId, roomTypeId, checkIn, checkOut, guestName, guestEmail } =
        input
      const hotelIdBig = BigInt(hotelId)
      const roomTypeIdBig = BigInt(roomTypeId)
      const ci = new Date(checkIn)
      const co = new Date(checkOut)
      if (!(co > ci)) throw new Error('checkOut must be after checkIn')

      const rooms = await prisma.room.findMany({
        where: { hotelId: hotelIdBig, roomTypeId: roomTypeIdBig, active: true },
        select: { id: true, roomType: { select: { basePrice: true } } },
      })
      if (rooms.length === 0) throw new Error('No rooms of this type')

      const conflicts = await prisma.$queryRaw<Array<{ roomid: bigint }>>`
  SELECT DISTINCT "roomId" AS roomid
  FROM "RoomStay"
  WHERE "roomId" = ANY(${rooms.map((r) => r.id)})
    AND "stayStart" < ${co}::timestamp
    AND "stayEnd"   > ${ci}::timestamp
`
      const busy = new Set(conflicts.map((c) => c.roomid.toString()))
      const freeRoom = rooms.find((r) => !busy.has(r.id.toString()))
      if (!freeRoom) throw new Error('No available room for selected dates')

      const nights = Math.max(1, Math.ceil((+co - +ci) / (1000 * 60 * 60 * 24)))
      const pricePerNight = Number((rooms[0] as any).roomType.basePrice)
      const lineTotal = pricePerNight * nights

      const result = await prisma.$transaction(async (tx) => {
        let guest = null
        if (guestEmail) {
          guest = await tx.guest.findFirst({ where: { email: guestEmail } })
          if (guest) {
            guest = await tx.guest.update({
              where: { id: guest.id },
              data: { fullName: guestName },
            })
          } else {
            guest = await tx.guest.create({
              data: { fullName: guestName, email: guestEmail },
            })
          }
        }

        const reservation = await tx.reservation.create({
          data: {
            hotelId: hotelIdBig,
            guestId: guest?.id,
            bookerEmail: guestEmail ?? null,
            bookerName: guestName,
            checkIn: ci,
            checkOut: co,
            totalPrice: lineTotal,
          },
        })

        await tx.reservationRoom.create({
          data: {
            reservationId: reservation.id,
            roomId: freeRoom.id,
            roomTypeId: roomTypeIdBig,
            pricePerNight,
            nights,
            lineTotal,
          },
        })

        await tx.$executeRawUnsafe(
          `INSERT INTO "RoomStay" ("roomId","reservationId","stayStart","stayEnd","stay")
           VALUES ($1,$2,$3,$4, daterange($3::timestamp,$4::timestamp,'[]'))`,
          freeRoom.id,
          reservation.id,
          ci,
          co
        )

        return reservation
      })

      return result
    },

    cancelReservation: async (_: unknown, { id }: { id: string }) => {
      const rid = BigInt(id)
      await prisma.$transaction([
        prisma.reservation.update({
          where: { id: rid },
          data: { status: 'cancelled' },
        }),
        prisma.roomStay.deleteMany({ where: { reservationId: rid } }),
      ])
      return true
    },
  },
}
