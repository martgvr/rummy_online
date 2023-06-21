export let activeRooms = []

const getRoom = (client) => new Promise((resolve, reject) => {
    client.rooms.forEach(clientRoom => {
        if (clientRoom != client.id) {
            const getRoomData = activeRooms.find(room => room.id == clientRoom)
            resolve(getRoomData)
        }
    })
})

export default (socketServer) => {
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
                    clientRoom.state = 'playing'
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
                            clientRoom.users.forEach(user => socketServer.to(user.clientID).emit("gameData", user.cards, clientRoom.users))
                        }, 100)}, (timeLeft + 1) * 1000)
                }
            })
    
            .on("pass", async () => {
                const clientRoom = await getRoom(client)
    
                if (client.id == clientRoom.playing) {
                    const usersList = []
                    clientRoom.users.map(client => usersList.push(client.clientID))
    
                    const playingUserIndex = usersList.findIndex(user => user == client.id)
                    clientRoom.playing = (playingUserIndex + 1 == usersList.length) ? usersList[0] : usersList[playingUserIndex + 1]
                    
                    const tokensTaken = []
                    clientRoom.users.forEach(user => user.cards.forEach(card => tokensTaken.push(card)))
    
                    // get current player server location to push new token
                    const currentPlayer = clientRoom.users.find(client => client.clientID == clientRoom.playing)
    
                    let number = Math.floor(Math.random() * 106) + 1
                    let checkExistence = tokensTaken.some(token => token == number)
    
                    if (!checkExistence) {
                        currentPlayer.cards.push(number)
                        tokensTaken.push(number)
                    } else {
                        while (checkExistence) {
                            number = Math.floor(Math.random() * 106) + 1
                            checkExistence = tokensTaken.some(token => token == number)
    
                            if (!checkExistence) {
                                tokensTaken.push(number)
                                currentPlayer.cards.push(number)
                            }
                        }
                    }
    
                    // emit new number to client
                    clientRoom.users.forEach(user => socketServer.to(user.clientID).emit("gameData", user.cards, clientRoom.users))
                    usersList.map(user => socketServer.to(user).emit("yourTurn", false))
                    socketServer.to(clientRoom.playing).emit("yourTurn", true, number)
                }
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
}