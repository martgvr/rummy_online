import http from 'http'
import express from 'express'
import { Server } from 'socket.io'

const app = express()

const httpServer = http.createServer(app)
const socketServer = new Server(httpServer, { cors: { origin: "*" } })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

let activeRooms = []

socketServer.on('connection', (client) => {
    console.log('Nuevo cliente conectado', client.id);

    client.on("createRoom", async () => {
        const roomID = 'room' + Math.floor(Math.random() * 1000)
        socketServer.to(client.id).emit("log", `Creando sala...`)
        await client.join(roomID)
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
                socketServer.to(client.id).emit("joinSuccess", roomID)
                await client.join(roomID)
            } else {
                socketServer.to(client.id).emit("log", `Ya te encuentras en la sala: ${roomID}`)
            }
        }
    });

    client.on("sendMessage", async (message) => {
        client.rooms.forEach(room => {
            if (room != client.id) {
                socketServer.to(room).emit("newMessage", client.id, message)
            }
        })
    });
})

socketServer.of("/").adapter.on("join-room", (roomID, clientID) => {
    if (roomID != clientID) {
        const checkRoomExistence = activeRooms.find(room => room.id == roomID)
        
        if (checkRoomExistence !== undefined) {
            console.log(`El cliente ${clientID} entró a la sala: ${roomID}`);

            checkRoomExistence.users.push(clientID)
            socketServer.to(roomID).except(clientID).emit("log", `Nuevo cliente conectado ${clientID}`)
            setTimeout(() => socketServer.to(roomID).emit("clientConnected", checkRoomExistence.users), 100)
        } else {
            console.log(`El cliente ${clientID} creó la sala: ${roomID}`)
            activeRooms.push({ id: roomID, users: [ clientID ], messages: [] })
            setTimeout(() => socketServer.to(roomID).emit("clientConnected", [ clientID ]), 100)
        }
    }
});

socketServer.of("/").adapter.on("leave-room", (roomID, clientID) => {
    if (roomID != clientID) {
        console.log(`El cliente ${clientID} dejó la sala: ${roomID}`)

        const getRoom = activeRooms.find(room => room.id == roomID)
        const clientIndex = getRoom.users.indexOf(clientID)

        getRoom.users.splice(clientIndex, 1)
        socketServer.to(roomID).emit("clientConnected", getRoom.users)

        if (getRoom.users.length === 0) {
            const emptyRoomIndex = activeRooms.indexOf(getRoom)
            activeRooms.splice(emptyRoomIndex, 1)
        }
    }
});

const PORT = process.env.PORT || 8080

const server = httpServer.listen(PORT, (req, res) => {
    console.log(`[ Listening port: ${PORT} ]`)
})

server.on('error', error => console.log(`Error: ${error}`))