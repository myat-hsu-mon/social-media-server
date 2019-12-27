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
io.on('connection',  (socket)=>{
    console.log('socket connected');
    console.log(socket.id)
    socket.on('addFriend',async  (data)=>{
        const notiData = await userCRUD.addFriend(data)
        socket.emit(`${data.senderId}friendRequest`, {_id: data.receiverId,name:data.receiverName})
        socket.broadcast.emit(`${data.receiverId}friendSuggestNoti`,notiData);
    })

    socket.on('cancelRequest', async (data)=>{
        const receiver = await userCRUD.cancelRequest(data);
        socket.emit(`${data.senderId}canceledRequest`,receiver)
        socket.broadcast.emit(`${data.receiverId}friendSuggestNoti`,receiver)
    })

    socket.on('removeFriendSuggestsNoti',async(id)=>{
       const numberOfFriendSuggests = await userCRUD.removeFriendSuggestsNoti(id);
       socket.emit(`${id}removedFriendSuggestsNoti`,numberOfFriendSuggests);
    })

    

    socket.on('confirm', (data)=>{
        console.log("confirm data is ",data)
        userCRUD.confirm(data);
        socket.emit(`${data.senderId}confirmEmit`,{_id:data.receiverId,name:data.receiverName})
        // socket.emit(data.receiverId,{_id:data.senderId,name:data.senderName})
    })
    socket.on('create post',async(data)=>{
      
       const userWithNewPost =await userCRUD.createPost(data);
        socket.emit(data.id,userWithNewPost);
    })
})


app.get('/',(req, res)=>{
    console.log("Success");    
});
app.post('/signup',userController.signup);
app.post('/login',userController.login);
app.post('/post', userController.createPost);
app.post('/search',userController.search);
app.post('/profile',userController.searchProfile);


server.listen(port, ()=>{
    console.log('server is listening on port:', port)
})


const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/social-media",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log("Mongodb successfully connected");
    
})
.catch(()=>{
    console.log("Mongodb is not connected");
})
//module.exports = app;