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
const createPost = async (data) => {
     await User.updateOne({ _id: data.id },{ $push: { posts: data.postedValue } });
     const result = await User.findOne({_id : data.id});
     console.log("Result is ",result);
     return await result;
}
const search = async (searchValue) => {
    const result = await User.find({ $text: { $search: searchValue } },{name:1, posts:1, relationship:1,friendSuggests:1, friendRequests:1, friends:1});0
    return result;
}
const searchProfile = async (data) =>{
    console.log("id",data.id);
    return await User.findOne({_id:data.id},{name:1,posts:1});
}
const addFriend = async (data) =>{
   
     await User.updateOne({_id:data.senderId},{$push:{friendRequests:data.receiverId}, $inc:{numberOfFriendRequests:1}});
     await User.updateOne({_id:data.receiverId},{$addToSet:{friendSuggests:data.senderId},  $inc:{numberOfFriendSuggests:1}});
    //  const result1 = await User.findOne({_id:data.senderId},{friendRequests:1,name:1,numberOfFriendRequests:1});
    //  const result2 = await User.findOne({_id:data.receiverId},{friendSuggests:1,name:1,numberOfFriendSuggests:1});
    
}
const cancelRequest = async (data)=>{
    await User.updateOne({_id:data.senderId}, {$pull:{friendRequests:{receiverId:data.receiverId},$inc:{numberOfFriendRequests:-1}}});
    await User.updateOne({_id:data.receiverId},{$pull:{friendSuggests:{senderId:data.senderId}}, $inc:{numberOfFriendSuggests:-1}});
    const result = await User.findOne({_id:data.receiverId},{name:1,friendSuggests:1, friends:1});
    const result2 = await User.findOne({_id:data.senderId},{name:1,friendRequests:1,friends:1});
    console.log("sender information is ", result2);
    console.log("receiver information  is ,", result);   
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
const find = async (data)=>{
    return await User.findOne({_id:data.id});
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
    find
}