import http from 'http'
import express from 'express'
import { Server } from 'socket.io'

const app = express()

const httpServer = http.createServer(app)
const socketServer = new Server(httpServer, { cors: { origin: "*" } })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send(activeRooms))

let activeRooms = []

const getRoom = (client) => new Promise((resolve, reject) => {
    client.rooms.forEach(clientRoom => {
        if (clientRoom != client.id) {
            const getRoomData = activeRooms.find(room => room.id == clientRoom)
            resolve(getRoomData)
        }
    })
})

socketServer.on('connection', (client) => {
    client
        .on("createRoom", async (nickname) => {
            const roomID = 'room' + Math.floor(Math.random() * 1000)
            await client.join(roomID)

            socketServer.to(client.id).emit("roomCreated", roomID)
            activeRooms.push({ id: roomID, users: [{ clientID: client.id, nickname: nickname }], messages: [], state: 'waiting' })
            setTimeout(() => socketServer.to(roomID).emit("clientConnected", [{ clientID: client.id, nickname: nickname }]), 100)
        })

        .on("joinRoom", async (roomID, nickname) => {
            const checkRoomExistence = activeRooms.find(room => room.id == roomID)

            if (checkRoomExistence === undefined) {
                socketServer.to(client.id).emit("log", `La sala ${roomID} no existe`)
            } else {
                await client.join(roomID)

                socketServer.to(client.id).emit("joinSuccess", roomID)
                socketServer.to(roomID).emit("newMessage", '', `${nickname} entró a la sala`)

                checkRoomExistence.users.push({ clientID: client.id, nickname: nickname })
                setTimeout(() => socketServer.to(roomID).emit("clientConnected", checkRoomExistence.users), 100)
            }
        })

        .on("leaveRoom", async () => {
            const clientRoom = await getRoom(client)
            client.leave(clientRoom.id)
            socketServer.to(client.id).emit("leaveSuccess")
        })

        .on("sendMessage", async (message) => {
            const clientRoom = await getRoom(client)
            const userData = clientRoom.users.find(user => user.clientID == client.id)
            socketServer.to(clientRoom.id).emit("newMessage", client.id, userData.nickname, message)
            clientRoom.messages.push({ clientID: client.id, nickname: userData.nickname, message: message })
        })

        .on("startGame", async () => {
            const clientRoom = await getRoom(client)
            const usersList = []

            if ((clientRoom.users.length > 0) && (clientRoom.state === 'waiting')) {
                const tokensTaken = []

                let timeLeft = 1

                clientRoom.users.forEach(user => {
                    usersList.push(user.clientID)
                    user.cards = []
                    let pushedCounter = 0

                    do {
                        const number = Math.floor(Math.random() * 106) + 1
                        const checkExistence = tokensTaken.some(token => token == number)

                        if (!checkExistence) {
                            tokensTaken.push(number)
                            user.cards.push(number)
                            pushedCounter++
                        }
                    } while (pushedCounter != 14)
                })

                function countdown() {
                    timeLeft--;
                    socketServer.to(clientRoom.id).emit("startGameCountdown", timeLeft)
                    if (timeLeft > 0) {
                        setTimeout(countdown, 1000)
                    }
                };
    
                setTimeout(countdown, 1000)

                setTimeout(() => {
                    socketServer.to(clientRoom.id).emit("startGame")
                    clientRoom.playing = usersList[0]
                    
                    setTimeout(() => {                        
                        socketServer.to(clientRoom.playing).emit("yourTurn", true)

                        clientRoom.users.forEach(user => {
                            socketServer.to(user.clientID).emit("gameData", user.cards, clientRoom.users)
                        })
                    }, 100);
                }, (timeLeft + 1) * 1000)
            }
        })

        .on("pass", async () => {
            const clientRoom = await getRoom(client)
            console.log(clientRoom);
        })

        .on("asktile", async () => {
            const clientRoom = await getRoom(client)
            console.log(clientRoom);
        })
})

socketServer.of("/").adapter.on("leave-room", (roomID, clientID) => {
    if (roomID != clientID) {
        socketServer.to(roomID).emit("newMessage", '', `${clientID} salió de la sala`)

        const getRoom = activeRooms.find(room => room.id == roomID)
        const clientIndex = getRoom.users.indexOf(clientID)

        getRoom.users.splice(clientIndex, 1)
        socketServer.to(roomID).emit("clientConnected", getRoom.users)

        if (getRoom.users.length === 0) {
            const emptyRoomIndex = activeRooms.indexOf(getRoom)
            activeRooms.splice(emptyRoomIndex, 1)
        }
    }
})

const PORT = process.env.PORT || 8080
const server = httpServer.listen(PORT, () => console.log(`[ Listening port: ${PORT} ]`))
server.on('error', error => console.log(`Error: ${error}`))