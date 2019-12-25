const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    posts:Array,
    friendRequests:Array,
    numberOfFriendRequests:Number,
    friendSuggests:Array,
    numberOfFriendSuggests:Number,
    friends:Array,
    numberOfFriends:Number,
    relationship:{
        type: String,
        default:'Add Friend'
    }
});
const index={name:"text"};
userSchema.index(index);
const User = mongoose.model('user',userSchema);
module.exports = User;