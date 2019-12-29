const mongoose = require('mongoose');
const specificMessageSchema = mongoose.Schema({
    senderId : String,
    messageBody : String
})

const messagesSchema = mongoose.Schema({
    conversationId : String,
    specificMessages : [ specificMessageSchema ]
})
const userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    posts : Array,
    friendRequests : Array,
    friendSuggests : Array,
    friendSuggestsForNoti : Array,
    numberOfFriendSuggests : Number,
    friends : Array,
    numberOfFriends : Number,
    messages : [ messagesSchema ],
    relationship : {
        type : String,
        default :'Add Friend'
    }
});
const index = {name : "text"};
userSchema.index(index);
const User = mongoose.model('user',userSchema);
module.exports = User;