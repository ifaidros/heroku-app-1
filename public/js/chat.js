const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const mine = document.querySelector('button')

socket.on('message', (message) => {
    console.log(message)
    let divOutput = document.querySelector('#output')
    //output.innerHTML += '<p>' + message + '</p>'
    divOutput.insertAdjacentHTML('beforeend', '<p>' + moment(message.createdAt).format('h:mm a') + '   ' + message.text + '</p>')
})

socket.on('messageHistory', (messages) => {
    console.log(messages)
    console.log('messageHistory arrived with content ' + messages)
    const toArray = Object.values(messages)
    console.log(toArray)
    toArray.forEach((message) => {
        let divOutput = document.querySelector('#output')
        divOutput.insertAdjacentHTML('beforeend', '<p>' + moment(message.createdAt).format('h:mm a') +'  '+ message.text + '</p>')
    })
})

socket.on('users', (users) => {
    console.log(`the users are ${users}`)
    let userList = document.querySelector('#users-list')
    userList.insertAdjacentHTML('beforeend', '<p>' + users + '</p>')
})

socket.on('sendMessageMouseMove', (message) => {
    document.querySelector('#mouse-position').textContent = message
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()
    //console.log(e)
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered')
    })

    document.querySelector('input').value = ''
    document.querySelector('input').focus()
})

window.addEventListener('mousemove', e => {
   socket.emit('sendMessageMouseMove', `X is ${e.clientX}, Y is ${e.clientY}`)
});

document.querySelector('#input_txt').addEventListener('input', (e) => {
    //console.log(e.target.value)
    socket.emit('typing', 'Typing...')
})