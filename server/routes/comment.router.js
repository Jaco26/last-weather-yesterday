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
    })
    }
    
    
})


module.exports = router;