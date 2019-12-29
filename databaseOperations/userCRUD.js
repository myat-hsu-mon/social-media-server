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
    await User.updateOne({ _id: data.id }, { $push: { posts: data.postedValue } });
    const result = await User.findOne({ _id: data.id });
    console.log("Result is ", result);
    return await result;
}
const search = async (searchValue) => {
    const result = await User.find({ $text: { $search: searchValue } }, { name: 1, posts: 1, relationship: 1, friendSuggests: 1, friendRequests: 1, friends: 1 }); 0
    return result;
}
const searchProfile = async (data) => {
    console.log("id", data.id);
    return await User.findOne({ _id: data.id }, { name: 1, posts: 1 });
}
const addFriend = async (data) => {
    const sender = {
        senderId: data.senderId,
        senderName: data.senderName,
    }
    await User.updateOne({ _id: data.senderId }, { $push: { friendRequests: data.receiverId }, $inc: { numberOfFriendRequests: 1 } });
    await User.updateOne({ _id: data.receiverId }, { $addToSet: { friendSuggests: data.senderId, friendSuggestsForNoti: sender }, $inc: { numberOfFriendSuggests: 1 } });
    return await User.findOne({ _id: data.receiverId }, { friendSuggestsForNoti: 1, numberOfFriendSuggests: 1, _id: 0 });
}

const removeFriendSuggestsNoti = async (id) => {
    await User.updateOne({ _id: id }, { $set: { numberOfFriendSuggests: 0 } });
    return await User.findOne({ _id: id }, { numberOfFriendSuggests: 1, _id: 0 });
}

const cancelRequest = async (data) => {
    await User.updateOne({ _id: data.senderId }, { $pull: { friendRequests: { $in: [data.receiverId] } } });
    await User.updateOne({ _id: data.receiverId }, {
        $pull: {
            friendSuggests: { $in: [data.senderId] },
            friendSuggestsForNoti: { senderId: data.senderId }
        }
    });
    await User.updateOne({ _id: data.receiverId, numberOfFriendSuggests: { $gt: 0 } }, { $inc: { numberOfFriendSuggests: -1 } })
    const sender = await User.findOne({ _id: data.senderId }, { name: 1, friendRequests: 1 });
    const receiver = await User.findOne({ _id: data.receiverId }, { friendSuggestsForNoti: 1, numberOfFriendSuggests: 1 });
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
    const senderInfo = await User.findOne({ _id: data.senderId }, { name: 1, friends: 1, friendSuggestsForNoti: 1 });
    const receiverInfo = await User.findOne({ _id: data.receiverId }, { name: 1, friends: 1, friendRequests: 1 });
    console.log("sender information is", senderInfo);
    console.log('/////////////////////////////////////////////////')
    console.log("receiver information is ", receiverInfo);
    return senderInfo;
}

const getFriends = async (data) => {
    return Promise.all(data.friends.map(async (id) => {
        return await User.findOne({ _id: id }, { name: 1 });
    }))
}
const saveMessage = async (message) => {
    //************/
    // conversation already exists

    const specificMessage = {
        senderId: message.from,
        messageBody: message.body
    }
    const isConversationInSender = await User.updateOne({ $and: [{ _id: message.from }, { "messages.conversationId": { $eq: message.to } }] }, {
        $push: { "messages.$.specificMessages": specificMessage }
    })
    const isConversationInReceiver = await User.updateOne({ $and: [{ _id: message.to }, { "messages.conversationId": { $eq: message.from } }] }, {
        $push: { "messages.$.specificMessages": specificMessage }
    })
    console.log("Is Conversation ok", isConversationInReceiver);
    //-------------------------------------------------------//

    /// conversation does not exist
    if (!isConversationInSender.n) {
        messageForSender = {
            conversationId: message.to,
            specificMessages: {
                senderId: message.from,
                messageBody: message.body
            }
        }
        await User.updateOne({ _id: message.from }, {
            $push: { messages: messageForSender }
        })
    }//end of if
    if (!isConversationInReceiver.n) {
        messageForReceiver = {
            conversationId: message.from,
            specificMessages: {
                senderId: message.from,
                messageBody: message.body
            }
        }
        await User.updateOne({ _id: message.to }, {
            $push: { messages: messageForReceiver }
        })
    }//end of if
    return await User.findOne({ _id: message.from ,"messages.conversationId":message.to},
        {"messages.$.specificMessages": 1, _id: 0})
}

module.exports = {
    existEmail,
    signup,
    login,
    search,
    addFriend,
    cancelRequest,
    acceptRequest,
    createPost,
    searchProfile,
    removeFriendSuggestsNoti,
    getFriends,
    saveMessage
}