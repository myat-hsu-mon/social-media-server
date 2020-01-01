const User = require('../schemas/user')

const like = async (likeData)=>{

    const { postAuthorId, postId, likedUserId } = likeData;
    await User.updateOne(
        { $and:[{_id:postAuthorId},{"posts._id": postId}]},
        { $addToSet:{"posts.$.likes": likedUserId}, $inc:{"posts.$.likeCount": 1} }
        )
    return await User.findOne(
        { $and:[{_id: postAuthorId}, {"posts._id": postId}]},
        { "posts.$.likes":1, "posts.$.likeCount":1})
}

module.exports = {
    like,
}