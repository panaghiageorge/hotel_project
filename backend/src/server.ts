import Fastify from 'fastify'
import mercurius from 'mercurius'
import cors from '@fastify/cors'
import 'dotenv/config'
import { schema, resolvers } from './graphql'

const app = Fastify({ logger: true })

// Enable CORS for all origins (for dev)
await app.register(cors, { origin: true })

await app.register(mercurius, { schema, resolvers, graphiql: true })

const port = Number(process.env.PORT ?? 3001)
app.listen({ port, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err)
  process.exit(1)
})
