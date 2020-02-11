const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage} = require('./messages')
const fs = require('fs')
const moment = require('moment')


const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


const chatMessages = []
console.log('chatMessages length ', chatMessages.length )

io.on('connection', (socket) => {
    console.log('New WebSocket connection with socket.id: ', socket.id)
    socket.emit('message', generateMessage('Welcome to our Chat! Socket id ' + socket.id))
    socket.broadcast.emit('message', generateMessage('A new user has joined...'))
    socket.emit('messageHistory', chatMessages)
    console.log('The chat messages are ', chatMessages)
    socket.emit('sendMessageMouseMove', 'X is 0, Y is 0')

    io.emit('users', socket.id)


    socket.on('sendMessage', handleSendMessage)
    
    socket.on('sendMessageMouseMove', (message) => {
        socket.broadcast.emit('sendMessageMouseMove', message)
    })

    socket.on('typing', (message) => {
        //socket.broadcast.emit('message', message)
        //console.log(message)
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has just left the chat...'))

        const transcriptArray = []
        let transcriptString = ''
        let transcriptToSend = ''
        chatMessages.forEach((message) => {
            console.log(message.text)
            transcriptArray.push(moment(message.createdAt).format('h:mm a'), ' ', message.text)
            
            transcriptArray.push('\n')
            console.log(transcriptArray)
            transcriptString = transcriptArray.join()
            transcriptToSend = transcriptString.replace(/,/g, '')
            console.log(transcriptToSend)
        })
    })
})

function handleSendMessage (message, callback) {
    const filter = new Filter()

    if (filter.isProfane(message) ) {
        return callback('Profanity is not allowed')
    }
    
    console.log(message)
    chatMessages.push(generateMessage(message))
    console.log(chatMessages)

    io.emit('message', generateMessage(message))
    callback()
}

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})