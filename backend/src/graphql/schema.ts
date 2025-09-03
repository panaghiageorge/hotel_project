export const schema = /* GraphQL */ `
  scalar DateTime

  type Room {
    id: ID!
    hotelId: ID!
    roomTypeId: ID!
    roomNumber: String!
    floor: Int
    active: Boolean!
    roomType: RoomType!
  }

  type Hotel {
    id: ID!
    name: String!
    city: String
    country: String
    rooms: [Room!]!
  }

  type RoomType {
    id: ID!
    hotelId: ID!
    code: String!
    name: String!
    basePrice: Float!
    capacityAdults: Int!
    rooms: [Room!]!
  }

  type Reservation {
    id: ID!
    hotelId: ID!
    checkIn: DateTime!
    checkOut: DateTime!
    status: String!
    totalPrice: Float!
  }

  type Query {
    hotels: [Hotel!]!
    roomTypes(hotelId: ID!): [RoomType!]!
    rooms(hotelId: ID!): [Room!]!
    availableRoomTypes(
      hotelId: ID!
      from: DateTime!
      to: DateTime!
      rooms: Int = 1
    ): [RoomType!]!
  }

  input CreateReservationInput {
    hotelId: ID!
    roomTypeId: ID!
    checkIn: DateTime!
    checkOut: DateTime!
    guestName: String!
    guestEmail: String
  }

  type Mutation {
    createReservation(input: CreateReservationInput!): Reservation!
    cancelReservation(id: ID!): Boolean!
  }
`
