const User = require('../schemas/user')

const sendLogin = async (user) =>{
    // return 

    //  get friend lists
    let friends = await User.findOne({_id:user.userId}, {friends:1, _id:0})
    friends = friends.friends;

    // 2 push my loginId to friends' activeFriends
    Promise.all(friends.map( friendId =>{
       return  User.updateOne({_id: friendId}, {$addToSet:{ activeFriends:user }})
    }))
    
    // 3 get friends' activeFriends array
    return Promise.all(friends.map( friendId =>{
        return User.findOne({_id: friendId}, {activeFriends:1})
    }))

}

module.exports = {
    sendLogin,
}