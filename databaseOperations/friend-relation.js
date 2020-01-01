const User = require('../schemas/user');
const addFriend = async (data) => {
    const sender = {
        senderId: data.senderId,
        senderName: data.senderName,
    }
    await User.updateOne({ _id: data.senderId },
        { $push: { friendRequests: data.receiverId }, $inc: { numberOfFriendRequests: 1 } 
        });
    await User.updateOne({ _id: data.receiverId }, 
        { $addToSet: { friendSuggests: data.senderId, friendSuggestsForNoti: sender }, 
            $inc: { numberOfFriendSuggests: 1 } 
        });
    return await User.findOne({ _id: data.receiverId }, 
        { friendSuggestsForNoti: 1, numberOfFriendSuggests: 1, _id: 0 });
}

const cancelRequest = async (data) => {
    await User.updateOne({ _id: data.senderId }, 
        { $pull: { friendRequests: { $in: [data.receiverId] } } });
    await User.updateOne({ _id: data.receiverId }, {
        $pull: {
            friendSuggests: { $in: [data.senderId] },
            friendSuggestsForNoti: { senderId: data.senderId }
        }
    });
    await User.updateOne({ _id: data.receiverId, numberOfFriendSuggests: { $gt: 0 } },
         { $inc: { numberOfFriendSuggests: -1 } })
    const sender = await User.findOne({ _id: data.senderId }, 
        { name: 1, friendRequests: 1 });
    const receiver = await User.findOne({ _id: data.receiverId }, 
        { friendSuggestsForNoti: 1, numberOfFriendSuggests: 1 });
    console.log("sender information is ", sender);
    console.log("receiver information  is ,", receiver);
    return receiver;
}

const acceptRequest = async (data) => {
    const receiver = {
        receiverId: data.receiverId,
        receiverName: data.receiverName
    };
    const sender = {
        senderId: data.senderId,
        senderName: data.senderName
    }
    await User.updateOne({ _id: data.senderId }, {
        $pull: {
            friendSuggests: { $in: [data.receiverId] },
            friendSuggestsForNoti: { senderId: data.receiverId }
        }, $push: { friends: data.receiverId }
    });
    await User.updateOne({ _id: data.receiverId }, {
        $pull: { friendRequests: { $in: [data.senderId] } },
        $push: { friends: data.senderId }
    });
    const senderInfo = await User.findOne(
        { _id: data.senderId }, { name: 1, friends: 1, friendSuggestsForNoti: 1 });
    const receiverInfo = await User.findOne(
        { _id: data.receiverId }, { name: 1, friends: 1, friendRequests: 1 });
    return senderInfo;
}
const removeFriendSuggestsNoti = async (id) => {
    await User.updateOne({ _id: id }, { $set: { numberOfFriendSuggests: 0 } });
    return await User.findOne({ _id: id }, { numberOfFriendSuggests: 1, _id: 0 });
}

module.exports = {
    addFriend,
    cancelRequest,
    acceptRequest,
    removeFriendSuggestsNoti,
}