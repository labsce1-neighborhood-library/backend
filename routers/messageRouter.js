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

// promise that checks if sender and receiver exist in user_table
function checkUsers(sender_id, receiver_id) {
    return new Promise(function(resolve, reject) {
        db("user_table")
            .where({user_id:sender_id})
            .then(sender => {
                if(sender.length === 1){
                    db("user_table")
                    .where({user_id:receiver_id})
                    .then(receiv => {
                            if(receiv.length === 1){
                                resolve(1);
                            }else{
                                reject(3);
                            }
                        }).catch(err => {
                            reject(4);
                        });
                }else{
                    reject(2);
                }
            }).catch(err => {
                reject(4);
            });
      });
};

// CREATE message
router.post("/send", (req, res) => {
    const body = req.body;
    const {sender_id, receiver_id} = body;
    checkUsers(sender_id, receiver_id)
        .then(id => {
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
        })
        .catch(id => {
            if(id === 2){
                res.status(404).json({message:"sender not found", sender_id});
            }else if(id === 3){
                res.status(404).json({message:"receiver not found", receiver_id});
            }else{
                res.status(500).json({message:"server error", id});
            }
        });
});

// READ messages, will truncate to latest 100
router.get("/get_messages", (req, res) => {
    const body = req.body;
    const {sender_id, receiver_id} = body;
    checkUsers(sender_id, receiver_id)
        .then(id => {
            db("messages_table")
                .where({sender_id, receiver_id})
                .then(first => {
                    db("messages_table")
                        .where({
                            sender_id:receiver_id,
                            receiver_id:sender_id
                        })
                        .then(second => {
                            let messages = [];
                            let j = 0;
                            let k = 0;
                            let firstCurrent;
                            let secondCurrent;
                            while(j!=first.length && k!=second.length){
                                if(j < first.length){
                                    firstCurrent = first[j];
                                }
                                if(k < second.length){
                                    secondCurrent = second[k];
                                }
                                if(firstCurrent.id < secondCurrent.id){
                                    messages.push(firstCurrent);
                                    j++;
                                }else{
                                    messages.push(secondCurrent);
                                    k++;
                                }
                            }
                            if(messages.length < 100){
                                res.status(200).json(messages);
                            }else{
                                res.status(200).json({messages:messages.slice(messages.length-100)});
                            }
                        }).catch(err => res.status(500).json(err.message));
                }).catch(err => res.status(500).json(err.message));
        })
        .catch(id => {
            if(id === 2){
                res.status(404).json({message:"sender not found", sender_id});
            }else if(id === 3){
                res.status(404).json({message:"receiver not found", receiver_id});
            }else{
                res.status(500).json({message:"server error", id});
            }
        });
});

module.exports = router;