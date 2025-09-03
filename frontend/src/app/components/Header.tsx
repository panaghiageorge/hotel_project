import Link from 'next/link'

export default function Header() {
  return (
    <header
      style={{
        background: '#223366',
        color: '#fff',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 8px #22336655',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>
        Hotel Admin
      </div>
      <nav style={{ display: 'flex', gap: 32 }}>
        <Link
          href='#about'
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 500,
            padding: '6px 18px',
            borderRadius: 8,
            transition: 'background 0.18s, color 0.18s',
            position: 'relative',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#fff2')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Despre
        </Link>
        <Link
          href='#hotels-list'
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 500,
            padding: '6px 18px',
            borderRadius: 8,
            transition: 'background 0.18s, color 0.18s',
            position: 'relative',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#fff2')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          Hoteluri
        </Link>
      </nav>
    </header>
  )
}
