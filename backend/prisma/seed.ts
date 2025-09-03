import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const hotel = await prisma.hotel.create({
    data: { name: 'Demo Hotel', city: 'București', country: 'RO' },
  })
  const std = await prisma.roomType.create({
    data: {
      hotelId: hotel.id,
      code: 'STD',
      name: 'Standard',
      basePrice: 250,
      capacityAdults: 2,
    },
  })
  const dlx = await prisma.roomType.create({
    data: {
      hotelId: hotel.id,
      code: 'DLX',
      name: 'Deluxe',
      basePrice: 380,
      capacityAdults: 2,
    },
  })
  await prisma.room.createMany({
    data: [
      { hotelId: hotel.id, roomTypeId: std.id, roomNumber: '101' },
      { hotelId: hotel.id, roomTypeId: std.id, roomNumber: '102' },
      { hotelId: hotel.id, roomTypeId: dlx.id, roomNumber: '201' },
      { hotelId: hotel.id, roomTypeId: dlx.id, roomNumber: '202' },
    ],
  })
  console.log('Seed done')
}
main().finally(() => prisma.$disconnect())
