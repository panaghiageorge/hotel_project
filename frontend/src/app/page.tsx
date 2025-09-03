'use client'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useState } from 'react'

import Header from './components/Header'
import RoomFilters from './components/RoomFilters'
import DashboardCards from './components/DashboardCards'
import HotelList from './components/HotelList'

type RoomType = {
  id: string
  name: string
}
type Room = {
  id: string
  roomNumber: string
  floor?: number
  active: boolean
  roomType: RoomType
}
type Hotel = {
  id: string
  name: string
  city?: string
  country?: string
  rooms: Room[]
}
type HotelsQueryResult = { hotels: Hotel[] }

const HOTELS_QUERY = gql`
  query Hotels {
    hotels {
      id
      name
      city
      country
      rooms {
        id
        roomNumber
        floor
        active
        roomType {
          id
          name
        }
      }
    }
  }
`

function IconHotel() {
  return (
    <svg width='40' height='40' fill='none' viewBox='0 0 24 24'>
      <rect x='3' y='7' width='18' height='13' rx='2' fill='#223366' />
      <rect x='7' y='11' width='2' height='2' rx='1' fill='#fff' />
      <rect x='11' y='11' width='2' height='2' rx='1' fill='#fff' />
      <rect x='15' y='11' width='2' height='2' rx='1' fill='#fff' />
      <rect x='7' y='15' width='2' height='2' rx='1' fill='#fff' />
      <rect x='11' y='15' width='2' height='4' rx='1' fill='#fff' />
      <rect x='15' y='15' width='2' height='2' rx='1' fill='#fff' />
    </svg>
  )
}
function IconRoom() {
  return (
    <svg width='40' height='40' fill='none' viewBox='0 0 24 24'>
      <rect x='4' y='10' width='16' height='8' rx='2' fill='#fbbf24' />
      <rect x='8' y='14' width='2' height='2' rx='1' fill='#fff' />
      <rect x='14' y='14' width='2' height='2' rx='1' fill='#fff' />
    </svg>
  )
}
function IconBooking() {
  return (
    <svg width='40' height='40' fill='none' viewBox='0 0 24 24'>
      <rect x='5' y='7' width='14' height='12' rx='2' fill='#10b981' />
      <rect x='9' y='11' width='6' height='2' rx='1' fill='#fff' />
      <rect x='9' y='15' width='6' height='2' rx='1' fill='#fff' />
    </svg>
  )
}

export default function Home() {
  const { data, loading, error } = useQuery<HotelsQueryResult>(HOTELS_QUERY)
  const [filter, setFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [floorFilter, setFloorFilter] = useState('')

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <Header />
      <RoomFilters
        filter={filter}
        setFilter={setFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        floorFilter={floorFilter}
        setFloorFilter={setFloorFilter}
      />

      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(90deg, #223366 60%, #fbbf24 100%)',
          color: '#fff',
          padding: '72px 0 56px 0',
          textAlign: 'center',
          boxShadow: '0 4px 24px #22336622',
        }}
      >
        <h1
          style={{
            fontSize: 54,
            fontWeight: 900,
            marginBottom: 18,
            letterSpacing: 1,
          }}
        >
          Sistem Hotel Management
        </h1>
        <p style={{ fontSize: 22, color: '#e6ecf5', marginBottom: 36 }}>
          Rezervă, administrează și monitorizează hotelurile tale cu ușurință.
        </p>
        <a
          href='#hotels-list'
          style={{
            background: '#fbbf24',
            color: '#223366',
            fontWeight: 700,
            fontSize: 20,
            padding: '16px 44px',
            borderRadius: 32,
            textDecoration: 'none',
            boxShadow: '0 2px 8px #22336633',
            display: 'inline-block',
          }}
        >
          Vezi hoteluri
        </a>
      </section>

      <DashboardCards
        hotelsCount={loading ? 0 : error ? 0 : data?.hotels?.length ?? 0}
        roomsCount={
          loading || error || !data?.hotels
            ? 0
            : data.hotels.reduce((acc, h) => acc + h.rooms.length, 0)
        }
        reservationsCount={0} // Placeholder, update with real data if available
      />

      {/* About Section */}
      <section
        id='about'
        style={{
          maxWidth: 1000,
          margin: '0 auto 56px auto',
          display: 'flex',
          alignItems: 'center',
          gap: 48,
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 24px #22336611',
          padding: 40,
          border: '1px solid #dde3ee',
        }}
      >
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: '#223366',
              marginBottom: 18,
            }}
          >
            Despre platformă
          </h2>
          <p style={{ fontSize: 18, color: '#223366', marginBottom: 18 }}>
            Platforma Hotel Admin te ajută să administrezi rapid hoteluri,
            camere și rezervări, cu o interfață modernă și intuitivă inspirată
            de Sogo.
          </p>
          <ul
            style={{
              color: '#223366',
              fontSize: 16,
              lineHeight: 2,
              marginLeft: 18,
            }}
          >
            <li>Administrare centralizată hoteluri</li>
            <li>Vizualizare rapidă camere și rezervări</li>
            <li>Design responsive și modern</li>
          </ul>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img
            src='/hotel-hero.png'
            alt='Hotel'
            style={{
              maxWidth: 320,
              borderRadius: 16,
              boxShadow: '0 4px 24px #22336622',
            }}
          />
        </div>
      </section>

      <main id='hotels-list'>
        <h2
          style={{
            fontSize: 30,
            fontWeight: 900,
            marginBottom: 24,
            color: '#223366',
          }}
        >
          Lista hoteluri
        </h2>
        {loading && <p>Se încarcă hotelurile...</p>}
        {error && <p style={{ color: '#c00' }}>Eroare: {error.message}</p>}
        {data && data.hotels && data.hotels.length > 0 ? (
          <HotelList
            hotels={data.hotels.map((h) => ({
              id: h.id,
              name: h.name,
              address: [h.city, h.country].filter(Boolean).join(', '),
              rooms: h.rooms.map((r) => ({
                id: r.id,
                number: r.roomNumber,
                type: { name: r.roomType?.name || '-' },
                status: r.active ? 'active' : 'inactive',
                floor: r.floor ?? 0,
              })),
            }))}
            filter={filter}
            statusFilter={statusFilter}
            floorFilter={floorFilter}
          />
        ) : (
          !loading && (
            <p style={{ color: '#888' }}>Nu există hoteluri în sistem.</p>
          )
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          textAlign: 'center',
          color: '#fff',
          background: '#223366',
          padding: 36,
          fontSize: 18,
          letterSpacing: 1,
        }}
      >
        &copy; {new Date().getFullYear()} Hotel Admin. Inspirat de{' '}
        <a
          href='https://themewagon.github.io/sogo/'
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: '#fbbf24', fontWeight: 700 }}
        >
          Sogo
        </a>{' '}
        &amp; GitHub Copilot.
      </footer>
    </div>
  )
}
