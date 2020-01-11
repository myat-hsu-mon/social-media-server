const User = require('../schemas/user')

const like = async (likeData)=>{
    const { postAuthorId, postId, likedUserId } = likeData;
    await User.updateOne(
        { $and:[{_id:postAuthorId},{"posts._id": postId}]},
        { $push:{"posts.$.likes": likedUserId}, $inc:{"posts.$.likeCount": 1} }
        )
    return await User.findOne(
        { $and:[{_id: postAuthorId}, {"posts._id": postId}] }, 
        { posts:1}
        )
}

const dislike = async (dislikeData)=>{
    const { postAuthorId, postId, likedUserId  } = dislikeData;
    await User.updateOne(
        { $and:[{_id:postAuthorId},{"posts._id": postId}]},
        { $pull:{"posts.$.likes": likedUserId}, $inc:{"posts.$.likeCount": -1} }
    )
    return await User.findOne(
        { $and:[{_id: postAuthorId}, {"posts._id": postId}] },
        { posts:1 }        
    )
}

const sendComment = async(commentData)=>{
    const{authorId, authorName, body, postId, postAuthorId } = commentData;
    console.log("CommentData:",commentData);
    const comment = {
        authorId ,
        authorName,
        body
    }
    await User.updateOne(
        {$and:[{_id:postAuthorId},{"posts._id":postId}]},
        {$push:{"posts.$.comments": comment}}
    )
    const result = await User.findOne(
        {$and:[{_id:postAuthorId},{"posts._id":postId}]},
        {"posts.$.comments":1}
    )

    console.log("result:",result.posts.comments);
    return result;
}



module.exports = {
    like, dislike,sendComment
}