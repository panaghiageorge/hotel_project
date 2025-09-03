import React from 'react'

type Props = {
  hotelsCount: number
  roomsCount: number
  reservationsCount: number
}

export default function DashboardCards({
  hotelsCount,
  roomsCount,
  reservationsCount,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 32,
        justifyContent: 'center',
        margin: '32px 0',
      }}
    >
      <div style={cardStyle}>
        <div style={labelStyle}>Hoteluri</div>
        <div style={valueStyle}>{hotelsCount}</div>
      </div>
      <div style={cardStyle}>
        <div style={labelStyle}>Camere</div>
        <div style={valueStyle}>{roomsCount}</div>
      </div>
      <div style={cardStyle}>
        <div style={labelStyle}>Rezervări</div>
        <div style={valueStyle}>{reservationsCount}</div>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 2px 12px #22336622',
  padding: '24px 40px',
  minWidth: 180,
  textAlign: 'center',
  transition: 'box-shadow 0.18s, transform 0.18s',
  cursor: 'pointer',
}
const labelStyle: React.CSSProperties = {
  fontSize: 18,
  color: '#223366',
  marginBottom: 8,
  fontWeight: 500,
}
const valueStyle: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  color: '#223366',
}
