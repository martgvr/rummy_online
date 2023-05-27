import http from 'http'
import express from 'express'
import { Server } from 'socket.io'

const app = express()

const httpServer = http.createServer(app)
const socketServer = new Server(httpServer, { cors: { origin: "*" } })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('home'));

let activeRooms = []

socketServer.on('connection', (client) => {
    console.log('Nuevo cliente conectado', client.id);

    socketServer.to(client.id).emit("log", `Bienvenido`)

    client.on("createRoom", async () => {
        const roomID = 'room' + Math.floor(Math.random() * 1000)
        socketServer.to(client.id).emit("log", `Creando sala...`)
        await client.join(roomID)

        activeRooms.push({ id: roomID, users: [ client.id ] })

        socketServer.to(roomID).except(client.id).emit("log", `Nuevo cliente conectado ${client.id}`)
        socketServer.to(client.id).emit("roomCreated", roomID)
    });

    client.on("joinRoom", async (roomID) => {
        const checkRoomExistence = activeRooms.find(room => room.id == roomID)

        if (checkRoomExistence === undefined) {
            socketServer.to(client.id).emit("log", `La sala ${roomID} no existe`)
        } else {
            const checkUserExistence = activeRooms.find(room => room.users.includes(client.id))
            
            if (checkUserExistence == undefined) {
                socketServer.to(client.id).emit("log", `Entrando en la sala: ${roomID}`)
                await client.join(roomID)
                
                socketServer.to(roomID).except(client.id).emit("clientConnected", client.id)
                checkRoomExistence.users.push(client.id)
            } else {
                socketServer.to(client.id).emit("log", `Ya te encuentras en la sala: ${roomID}`)
            }
        }
    });

    client.on("sendMessage", async (message) => {
        client.rooms.forEach(room => {
            if (room != client.id) {
                socketServer.to(room).emit("log", `Mensaje para la sala ${room}: ${message}`)
            }
        })
    });
})

socketServer.of("/").adapter.on("join-room", (room, id) => {
    if (room != id) {
        console.log(`El cliente ${id} entro a la sala: ${room}`);
    }
});

const PORT = process.env.PORT || 8080

const server = httpServer.listen(PORT, (req, res) => {
    console.log(`[ Listening port: ${PORT} ]`)
})

server.on('error', error => console.log(`Error: ${error}`))