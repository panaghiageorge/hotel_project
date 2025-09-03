import React from 'react'

type Props = {
  filter: string
  setFilter: (v: string) => void
  statusFilter: 'all' | 'active' | 'inactive'
  setStatusFilter: (v: 'all' | 'active' | 'inactive') => void
  floorFilter: string
  setFloorFilter: (v: string) => void
}

export default function RoomFilters({
  filter,
  setFilter,
  statusFilter,
  setStatusFilter,
  floorFilter,
  setFloorFilter,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 1000,
        margin: '0 auto 32px auto',
        padding: '0 16px',
        flexWrap: 'wrap',
      }}
    >
      <input
        type='text'
        placeholder='Filtrează camere după număr sau tip...'
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          padding: '10px 18px',
          borderRadius: 10,
          border: '1.5px solid #dde3ee',
          fontSize: 17,
          outline: 'none',
          minWidth: 220,
          color: '#223366',
          background: '#fff',
          boxShadow: '0 1px 4px #22336611',
          transition: 'border 0.18s, box-shadow 0.18s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = '1.5px solid #223366'
          e.currentTarget.style.boxShadow = '0 2px 8px #22336633'
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = '1.5px solid #dde3ee'
          e.currentTarget.style.boxShadow = '0 1px 4px #22336611'
        }}
      />
      <select
        value={statusFilter}
        onChange={(e) =>
          setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')
        }
        style={{
          padding: '10px 14px',
          borderRadius: 10,
          border: '1.5px solid #dde3ee',
          fontSize: 17,
          color: '#223366',
          background: '#fff',
          boxShadow: '0 1px 4px #22336611',
          transition: 'border 0.18s, box-shadow 0.18s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = '1.5px solid #223366'
          e.currentTarget.style.boxShadow = '0 2px 8px #22336633'
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = '1.5px solid #dde3ee'
          e.currentTarget.style.boxShadow = '0 1px 4px #22336611'
        }}
      >
        <option value='all'>Toate stările</option>
        <option value='active'>Active</option>
        <option value='inactive'>Inactive</option>
      </select>
      <input
        type='number'
        min='0'
        placeholder='Etaj'
        value={floorFilter}
        onChange={(e) => setFloorFilter(e.target.value)}
        style={{
          padding: '10px 14px',
          borderRadius: 10,
          border: '1.5px solid #dde3ee',
          fontSize: 17,
          width: 90,
          color: '#223366',
          background: '#fff',
          boxShadow: '0 1px 4px #22336611',
          transition: 'border 0.18s, box-shadow 0.18s',
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = '1.5px solid #223366'
          e.currentTarget.style.boxShadow = '0 2px 8px #22336633'
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = '1.5px solid #dde3ee'
          e.currentTarget.style.boxShadow = '0 1px 4px #22336611'
        }}
      />
    </div>
  )
}
