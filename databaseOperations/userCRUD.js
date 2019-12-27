const User = require('../schemas/user');
const existEmail = async (email) => {
    return await User.findOne({ email });
}
const signup = async (user) => {
    return await User.create(user);
}
const login = async (user) => {
    return await User.findOne(user);
}
// const createPost = async (data) => {
//      await User.updateOne({ _id: data.id },{ $push: { posts: data.postedValue } });
//      const result = await User.findOne({_id : data.id});
//      console.log("Result is ",result);
//      return await result;
// }
const search = async (searchValue) => {
    const result = await User.find({ $text: { $search: searchValue } },{name:1, posts:1, relationship:1,friendSuggests:1, friendRequests:1, friends:1});0
    return result;
}
// const searchProfile = async (data) =>{
//     console.log("id",data.id);
//     return await User.findOne({_id:data.id},{name:1,posts:1});
// }
const addFriend = async (data) =>{
    const sender = {
        senderId: data.senderId,
        senderName: data.senderName,
    }
     await User.updateOne({_id:data.senderId},{$push:{friendRequests:data.receiverId}, $inc:{numberOfFriendRequests:1}});
     await User.updateOne({_id:data.receiverId},{$addToSet:{friendSuggests:data.senderId, friendSuggestsForNoti:sender},  $inc:{numberOfFriendSuggests:1}});
    return await User.findOne({_id:data.receiverId},{friendSuggestsForNoti:1,numberOfFriendSuggests:1,_id:0});    
}

const removeFriendSuggestsNoti = async(id) =>{
    await User.updateOne({_id:id},{$set:{numberOfFriendSuggests:0}});
    return await User.findOne({_id:id},{numberOfFriendSuggests:1,_id:0});
}

const cancelRequest = async (data)=>{
    console.log('cancel request works in db operation')
    await User.updateOne({_id:data.senderId}, {$pull:{friendRequests:{$in:[data.receiverId]}}});
    await User.updateOne({_id:data.receiverId},{$pull:{friendSuggests:{$in:[data.senderId]},
        friendSuggestsForNoti:{senderId:data.senderId}}});
    await User.updateOne({_id:data.receiverId, numberOfFriendSuggests:{$gt:0}},{ $inc:{numberOfFriendSuggests:-1}})
    const sender = await User.findOne({_id:data.senderId},{name:1,friendRequests:1});
    const receiver = await User.findOne({_id:data.receiverId},{friendSuggestsForNoti:1,numberOfFriendSuggests:1});
    console.log("sender information is ", sender);
    console.log("receiver information  is ,", receiver); 
    return receiver; 
}
const confirm = async (data) =>{
    const receiver ={
        receiverId:data.receiverId,
        receiverName:data.receiverName
    };

    const sender ={
        senderId :data.senderId,
        senderName: data.senderName
    }
    await User.updateOne({_id:data.senderId},{$pull:{friendRequests:{receiverId:data.receiverId}},$push:{friends:receiver}});
    await User.updateOne({_id:data.receiverId},{$pull:{friendSuggests:{senderId:data.senderId}},$push:{friends:sender}});// { $addToSet: { tags: "camera"  } }
    const result=await User.findOne({_id:data.senderId},{name:1,friends:1,friendRequests:1});
    const result2=await User.findOne({_id:data.receiverId},{name:1,friends:1,friendSuggests:1});
    console.log("sender is",result);
    console.log("receiver is ", result2);
}


module.exports = {
    existEmail,
    signup,
    login,
    search,
    createPost,
    searchProfile,
    addFriend,
    cancelRequest,
    confirm,
    removeFriendSuggestsNoti
}