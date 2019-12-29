const userController = require('./controllers/userController');
const userCRUD = require('./databaseOperations/userCRUD');
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
app.use(cors());
app.use(express.json());
const port = 3000;
app.set('port', port)
const server = http.createServer(app)
const io = require('socket.io').listen(server)
io.on('connection', (socket) => {
    console.log('socket connected');
    console.log(socket.id)
    socket.on('addFriend', async(data) => {
        const notiData = await userCRUD.addFriend(data)
        socket.emit(`${data.senderId}friendRequest`, { _id: data.receiverId, name: data.receiverName })
        socket.broadcast.emit(`${data.receiverId}friendSuggestNoti`, notiData);
    })

    socket.on('cancelRequest', async(data) => {
        const receiver = await userCRUD.cancelRequest(data);
        socket.emit(`${data.senderId}canceledRequest`, receiver)
        socket.broadcast.emit(`${data.receiverId}friendSuggestNoti`, receiver)
    })

    socket.on('removeFriendSuggestsNoti',async(id)=>{
       const numberOfFriendSuggests = await userCRUD.removeFriendSuggestsNoti(id);
       socket.emit(`${id}removedFriendSuggestsNoti`,numberOfFriendSuggests);
    })

    socket.on('acceptRequest', async(data) => {
        const sender = await userCRUD.acceptRequest(data);
        socket.emit(`${data.senderId}acceptedRequest`, sender);
        // socket.emit(data.receiverId,{_id:data.senderId,name:data.senderName})
    })

    socket.on('sendMessage', async (msg)=>{
        // db operation
       const messages = await userCRUD.sendMessage(msg);
       console.log("Specific messages inside in app : ",messages.messages[0].specificMessages);
        socket.emit(`getMyMessage`, messages.messages[0].specificMessages)
        socket.broadcast.emit(`${msg.to}receivedMessage`, messages.messages[0].specificMessages)
    })

    socket.on('getMessageList', async (id)=>{
        const messageList = await userCRUD.getMessageList(id);
        socket.emit('gotMessageList', messageList)
    })

    socket.on('getFriendsLists',  async (data) =>{
        const friendsWithIdAndName = await userCRUD.getFriends(data);
        socket.emit(`${data.id}friendsWithIdAndName`, friendsWithIdAndName);
    })

    socket.on('create post', async(data) => {
        const userWithNewPost = await userCRUD.createPost(data);
        socket.emit(data.id, userWithNewPost);
    })

    // socket.on('sendMessage', message =>{
    //     console.log("send message:",message);
    //     socket.emit('receivedMessage',message);
    // })

    









})


app.get('/', (req, res) => {
    console.log("Success");
});
app.post('/signup', userController.signup);
app.post('/login', userController.login);
app.post('/post', userController.createPost);
app.post('/search', userController.search);
app.post('/profile', userController.searchProfile);


server.listen(port, () => {
    console.log('server is listening on port:', port)
})


const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/social-media", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongodb successfully connected");

    })
    .catch(() => {
        console.log("Mongodb is not connected");
    })
    //module.exports = app;