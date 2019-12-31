const User = require('../schemas/user');

const saveMessage = async (message) => {
    // if conversation already exists
    const specificMessage = {
        senderId: message.from,
        messageBody: message.body
    }
    const isConversationInSender = await User.updateOne(
    { $and: [{ _id: message.from }, { "messages.conversationId": { $eq: message.to } }] }, 
    {
        $push: { "messages.$.specificMessages": specificMessage }
    })
    const isConversationInReceiver = await User.updateOne(
    { $and: [{ _id: message.to }, { "messages.conversationId": { $eq: message.from } }] }, 
    {
        $push: { "messages.$.specificMessages": specificMessage }
    })
    
    
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

const openMessageConversation = async (conversationData)=>{
    return await User.findOne(
    {
        $and:[{_id:conversationData.viewerId},{"messages.conversationId":conversationData.conversationId}]
    },
    {"messages.$.specificMessages":1, _id:0})  
}

module.exports = {
    saveMessage,
    openMessageConversation
};