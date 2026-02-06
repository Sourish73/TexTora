const express = require('express');
const cors = require('cors');
const http = require('http');

const authRouter = require('./controllers/authController');
const userRouter = require('./controllers/userController');
const chatRouter = require('./controllers/chatController');
const messageRouter = require('./controllers/messsageController');

const app = express();
app.use(cors());
app.use(express.json(
  {
    limit:"50mb"
  }
));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

const server = http.createServer(app);
const onlineUser = [];

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  
   socket.on('join-room',userid =>{
    socket.join(userid);
   })

   socket.on('send-message',(message)=>{
    console.log('MESSAGE RECEIVED AT SERVER:',message);
    io
    .to(message.members[0])
    .to(message.members[1])
    .emit('receive-message', message);

        io
    .to(message.members[0])
    .to(message.members[1])
    .emit('set-message-count', message);

    
   })

   socket.on('clear-unread-messages',data=>{
    io
    .to(data.members[0])
    .to(data.members[1])
    .emit('message-count-cleared',data);
   })

   socket.on('user-typing', (data) => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('started-typing', data)
    })

        socket.on('user-stopped-typing', (data) => {
        io
        .to(data.members[0])
        .to(data.members[1])
        .emit('stopped-typing', data)
    })

   socket.on('user-login',userId =>{
    if(!onlineUser.includes(userId)){
      onlineUser.push(userId);
    }
    socket.emit('online-users',onlineUser);
   })

   socket.on('user-offline',userId =>{
onlineUser.splice(onlineUser.indexOf(userId),1);
    io.emit('online-users-updated',onlineUser);
   })

});



module.exports = server;
