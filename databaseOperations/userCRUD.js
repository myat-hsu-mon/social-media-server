const User = require('../schemas/user');
const messageOperation = require('./message')
const friendRelation = require('./friend-relation')
const LogInOut = require('./logged-in-out')
const post = require('./post')
const existEmail = async (email) => {
    return await User.findOne({ email });
}
const signup = async (user) => {
    return await User.create(user);
}
const login = async (user) => {
    return await User.findOne(user,{name:1, friendSuggestsForNoti:1, activeFriends:1});
}

const sendLogin = (user) =>{
    return  LogInOut.sendLogin(user);
}
const createPost = async (data) => {
    await User.updateOne({ _id: data.id }, { $push: { posts: data.postedValue } });
    const result = await User.findOne({ _id: data.id });
    console.log("Result is ", result);
    return await result;
}
const search = async (searchValue) => {
    const result = await User.find({ $text: { $search: searchValue } }, { name: 1, posts: 1, relationship: 1, friendSuggests: 1, friendRequests: 1, friends: 1 }); 
    return result;
}
const getSearchUserData = async (id) => {
    console.log("id", id);
    return await User.findOne({ _id: id }, { name: 1, posts: 1 });
}

const addFriend = (data)=>{
     return friendRelation.addFriend(data);
 }

 const cancelRequest = (data)=>{
     return friendRelation.cancelRequest(data);
 }
 
 const acceptRequest = (data)=>{
     return friendRelation.acceptRequest(data);
 }

 const removeFriendSuggestsNoti = (id) =>{
     return friendRelation.removeFriendSuggestsNoti(id);
 }
 
 const sendMessage = (message) =>{
    return  messageOperation.saveMessage(message);
 }

 const getMessageList = async (id)=>{
    let messageList = await User.findOne({_id:id},{messages:1, _id:0})
    messageList = messageList.messages.map( user =>{
        return user.conversationId;
    })
    return Promise.all(messageList.map( id =>{
        return User.findOne({_id:id}, {name:1})
    }))  
 }
 
 const openMessageConversation = (conversationData)=>{
    return messageOperation.openMessageConversation(conversationData)
 }
const getFriends = async (data) => {
    return Promise.all(data.friends.map(async (id) => {
        return await User.findOne({ _id: id }, { name: 1 });
    }))
}

const like = (likeData)=>{
    return post.like(likeData);
}

const dislike = (dislikeData)=>{
    return post.dislike(dislikeData);
}
module.exports = {
    existEmail, signup, login, search, addFriend,
    cancelRequest, acceptRequest, createPost, getSearchUserData,
    removeFriendSuggestsNoti, getFriends,  sendMessage, getMessageList,
    openMessageConversation, sendLogin, like
}