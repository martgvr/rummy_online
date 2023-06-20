import http from 'http'
import express from 'express'
import { Server } from 'socket.io'
import SocketHandler, { activeRooms } from './socketHandler.js'

const app = express()

const httpServer = http.createServer(app)
const socketServer = new Server(httpServer, { cors: { origin: "*" } })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send(activeRooms))

SocketHandler(socketServer)

const PORT = process.env.PORT || 8080
const server = httpServer.listen(PORT, () => console.log(`[ Listening port: ${PORT} ]`))

server.on('error', error => console.log(`Error: ${error}`))