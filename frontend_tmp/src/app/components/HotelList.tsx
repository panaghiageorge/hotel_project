import React from 'react'

type Room = {
  id: string
  number: string
  type: { name: string }
  status: string
  floor: number
}

type Hotel = {
  id: string
  name: string
  address: string
  rooms: Room[]
}

type Props = {
  hotels: Hotel[]
  filter: string
  statusFilter: 'all' | 'active' | 'inactive'
  floorFilter: string
}

export default function HotelList({
  hotels,
  filter,
  statusFilter,
  floorFilter,
}: Props) {
  // Filtering logic
  const filterRooms = (rooms: Room[]) => {
    return rooms.filter((room) => {
      const matchesFilter =
        room.number.toLowerCase().includes(filter.toLowerCase()) ||
        room.type.name.toLowerCase().includes(filter.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' || room.status === statusFilter
      const matchesFloor = !floorFilter || room.floor === Number(floorFilter)
      return matchesFilter && matchesStatus && matchesFloor
    })
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
      {hotels.map((hotel) => {
        const filteredRooms = filterRooms(hotel.rooms)
        return (
          <div
            key={hotel.id}
            style={{
              marginBottom: 40,
              background: '#f8faff',
              borderRadius: 12,
              boxShadow: '0 2px 12px #22336622',
              padding: 24,
              transition: 'box-shadow 0.18s, transform 0.18s',
            }}
            onMouseOver={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 6px 24px #22336633'
              ;(e.currentTarget as HTMLDivElement).style.transform =
                'translateY(-2px) scale(1.01)'
            }}
            onMouseOut={(e) => {
              ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                '0 2px 12px #22336622'
              ;(e.currentTarget as HTMLDivElement).style.transform = 'none'
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: '#223366',
                marginBottom: 8,
              }}
            >
              {hotel.name}
            </div>
            <div style={{ color: '#888', marginBottom: 16 }}>
              {hotel.address}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
              {filteredRooms.length === 0 ? (
                <div style={{ color: '#bbb', fontStyle: 'italic' }}>
                  Nicio cameră găsită.
                </div>
              ) : (
                filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    style={{
                      ...roomCardStyle,
                      transition: 'box-shadow 0.18s, transform 0.18s',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                        '0 4px 16px #22336633'
                      ;(e.currentTarget as HTMLDivElement).style.transform =
                        'translateY(-2px) scale(1.03)'
                    }}
                    onMouseOut={(e) => {
                      ;(e.currentTarget as HTMLDivElement).style.boxShadow =
                        '0 1px 4px #22336611'
                      ;(e.currentTarget as HTMLDivElement).style.transform =
                        'none'
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 18 }}>
                      {room.number}
                    </div>
                    <div style={{ color: '#223366', fontWeight: 500 }}>
                      {room.type.name}
                    </div>
                    <div
                      style={{
                        color: room.status === 'active' ? '#2e8b57' : '#b22222',
                        fontWeight: 500,
                      }}
                    >
                      {room.status === 'active' ? 'Activă' : 'Inactivă'}
                    </div>
                    <div style={{ color: '#888' }}>Etaj: {room.floor}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const roomCardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 10,
  boxShadow: '0 1px 4px #22336611',
  padding: '18px 24px',
  minWidth: 140,
  marginBottom: 12,
}
