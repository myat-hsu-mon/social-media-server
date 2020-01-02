const User = require('../schemas/user')

const like = async (likeData)=>{
    const { postAuthorId, postId, likedUserId } = likeData;
    await User.updateOne(
        { $and:[{_id:postAuthorId},{"posts._id": postId}]},
        { $push:{"posts.$.likes": likedUserId}, $inc:{"posts.$.likeCount": 1} }
        )
    return await User.findOne(
        { $and:[{_id: postAuthorId}, {"posts._id": postId}] }
        )
}

const dislike = async (dislikeData)=>{
    const { postAuthorId, postId, dislikedUserId } = dislikeData;
    await User.updateOne(
        { $and:[{_id:postAuthorId},{"posts._id": postId}]},
        { $pull:{"posts.$.likes": dislikedUserId}, $inc:{"posts.$.likeCount": -1} }
    )
    return await User.findOne(
        { $and:[{_id: postAuthorId}, {"posts._id": postId}] },
        { "posts.$.likes":1, "posts.$.likeCount":1 }
    )
}



module.exports = {
    like, dislike
}