const express = require("express");

const db = require("../db/config");
const router = express.Router();

router.get("/all", (req, res) => {
    db("messages_table")
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
});

// CREATE message
router.post("/send", (req, res) => {
    const body = req.body;
    const {sender_id, receiver_id} = body;
    db("user_table")
        .where({user_id:sender_id})
        .then(sender => {
            if(sender.length === 1){
                db("user_table")
                    .where({user_id:receiver_id})
                    .then(receiv => {
                        if(receiv.length === 1){
                            db("messages_table")
                                .insert(body)
                                .then(response => {
                                    const response_message = "message sent";
                                    if(response.rowCount === 0){
                                        response_message = "send failed";
                                    }
                                    res.status(200).json({
                                        message:response_message,
                                        response
                                    });
                                }).catch(err => res.status(500).json(err.message));
                        }else{
                            res.status(404).json({message:"receiver not found", receiver_id});
                        }
                    }).catch(err => res.status(500).json(err.message));
            }else{
                res.status(404).json({message:"sender not found", sender_id});
            }
        }).catch(err => res.status(500).json(err.message));
})

module.exports = router;