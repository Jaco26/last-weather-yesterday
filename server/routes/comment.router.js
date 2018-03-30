const express = require('express');
const router = express.Router();
const mongoose = require('../modules/db-config');
// Models 
const Comment = require('../models/Comments');
const User = require('../models/User');

router.post('/:userId', (req, res) => {
    if(req.isAuthenticated()) {
        let userId = req.params.userId;
        let newComment = new Comment(req.body);
        console.log(newComment);
        newComment.save((err, savedComment) => {
            if(err){
                console.log('ERROR on newComment.save', err);
                res.sendStatus(500);                
            } else {
                User.findByIdAndUpdate(
                    {"_id": req.user._id},
                    {$push: {comments: {commentId: savedComment._id}}},
                    (pusherr, updatedUser) => {
                        if(pusherr) {
                            console.log('PUSHERROR on User.fbiau savedComment._id', pusherror);
                            res.sendStatus(500);
                        } else {
                            res.sendStatus(200);
                        }
                    }
                )
            }
        });
    } else {
        res.sendStatus(403);
    }
}); 

router.get('/blabla', (req, res) => {
    User.findById(req.user._id, (err, foundUser) => {
        if(err) {
            console.log('ERROR on User.findById');
            res.sendStatus(500);
        } else {
            console.log('foundUser.comments--------', foundUser.comments);
            let userComments = [];
            for(let comment of foundUser.comments){
                Comment.findById({"_id": comment.commentId}).populate('users').exec((err, foundComment) => {
                    if(err){   
                        console.log('ERROR on Comment.findById', err);
                        res.sendStatus(500);
                    } else {
                        userComments.push(foundComment);
                        if(userComments.length == foundUser.comments.length){
                            res.send(userComments);
                        }
                    }
                });
            }
        }
    });
});

router.get('/:commentId', (req, res) => {
    if(req.isAuthenticated()){
        let commentId = req.params.commentId;
        Comment.findById({ "_id": commentId }).populate('users').exec((err, foundComment) => {
            if (err) {
                console.log('ERROR on Comment.findById', err);
                res.sendStatus(500);
            } else {
                res.send(foundComment);
            }
        });
    } else {
        res.sendStatus(403);
    }
});

router.put('/:commentId', (req, res) => {
    if(req.isAuthenticated()){
        let commentId = req.params.commentId;
        Comment.findByIdAndUpdate(
            {"_id": commentId},
            {$set: {comment: req.body.updatedComment}},
            (err, updatedComment) => {
                if(err){
                    console.log('ERROR on Comment.findByIdAndUpdate', err);
                    res.sendStatus(500);
                } else {
                    console.log('updatedComment --------', updatedComment);
                    res.sendStatus(200);
                }
            }
        )
    } else {
        res.sendStatus(403);
    }
});

router.delete('/:commentId/:objectId', (req, res) => {
    if(req.isAuthenticated()) {
        let commentId = req.params.commentId;
        let objectId = req.params.objectId;
        Comment.findByIdAndRemove(
            {"_id": commentId},
            (err, removedComment) => {
                if(err){
                    console.log('ERROR on Comment.findByIdAndRemove', err);
                    res.sendStatus(500);
                } else {
                    User.findByIdAndUpdate(
                        {"_id": req.user._id},
                        {$pull: {comments: {_id: objectId}}},
                        (err, deletedReference) => {
                            if(err) {
                                console.log('ERROR on User.findByIdAndUpdate $pull', err);
                                res.sendStatus(500);
                            } else {
                                res.sendStatus(200);
                            }
                        }
                    )
                }
            }
        )
    } else {
        req.sendStatus(403);
    }
})




module.exports = router;