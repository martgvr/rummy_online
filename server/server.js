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

socketServer.on('connection', (client) => {
    client.on("createRoom", async (nickname) => {
        const roomID = 'room' + Math.floor(Math.random() * 1000)
        await client.join(roomID)

        socketServer.to(client.id).emit("roomCreated", roomID)

        activeRooms.push({
            id: roomID,
            users: [{
                clientID: client.id,
                nickname: nickname,
            }],
            messages: [],
            state: 'waiting'
        })

        setTimeout(() => socketServer.to(roomID).emit("clientConnected", [{ clientID: client.id, nickname: nickname }]), 100)
    });

    client.on("joinRoom", async (roomID, nickname) => {
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
    });

    client.on("leaveRoom", () => {
        client.rooms.forEach(clientRoom => {
            if (clientRoom != client.id) {
                client.leave(clientRoom)
                socketServer.to(client.id).emit("leaveSuccess")
            }
        })
    });

    client.on("sendMessage", async (message) => {
        client.rooms.forEach(clientRoom => {
            if (clientRoom != client.id) {
                const getRoom = activeRooms.find(room => room.id == clientRoom)
                const userData = getRoom.users.find(user => user.clientID == client.id)

                socketServer.to(clientRoom).emit("newMessage", client.id, userData.nickname, message)

                if (getRoom !== undefined) {
                    getRoom.messages.push({ clientID: client.id, nickname: userData.nickname, message: message })
                }
            }
        })
    });

    client.on("startGame", () => {
        client.rooms.forEach(clientRoom => {
            if (clientRoom != client.id) {
                const getRoom = activeRooms.find(room => room.id == clientRoom)

                if ((getRoom.users.length > 0) && (getRoom.state === 'waiting')) {
                    const tokensTaken = []

                    getRoom.users.forEach(user => {
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

                        console.log(user.cards);
                    })
                }

                // let timeLeft = 11;

                // function countdown() {
                //     timeLeft--;
                //     socketServer.to(clientRoom).emit("startGameCountdown", timeLeft)
                //     if (timeLeft > 0) {
                //         setTimeout(countdown, 1000);
                //     }
                // };

                // setTimeout(countdown, 1000);
            }
        })
    });
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
});

const PORT = process.env.PORT || 8080
const server = httpServer.listen(PORT, (req, res) => console.log(`[ Listening port: ${PORT} ]`))
server.on('error', error => console.log(`Error: ${error}`))