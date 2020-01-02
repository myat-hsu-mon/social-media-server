const mongoose = require('mongoose');

const specificMessageSchema = mongoose.Schema({
    senderId : String,
    messageBody : String
})

const messagesSchema = mongoose.Schema({
    conversationId : String,
    specificMessages : [ specificMessageSchema ]
})

const commentSchema = mongoose.Schema({
    authorName: String,
    authorId: String,
    body: String
})
const postSchema = mongoose.Schema({
    authorName: String,
    authorId: String,
    body: String,
    likes:Array,
    isLike: {
        type: Boolean,
        default : false,
    },
    likeCount: Number,
    comments:[commentSchema]
})

const userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    messages : [ messagesSchema ],
    posts : [postSchema],
    friendRequests : Array,
    friendSuggests : Array,
    friendSuggestsForNoti : Array,
    numberOfFriendSuggests : Number,
    friends : Array,
    activeFriends: Array,
    numberOfFriends : Number,
    relationship : {
        type : String,
        default :'Add Friend'
    }
});
const index = {name : "text"};
userSchema.index(index);
const User = mongoose.model('user',userSchema);
module.exports = User;