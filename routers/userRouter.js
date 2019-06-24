const express = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require("../db/config");
const router = express.Router();

router.get("/all", (req, res) => {
  db("user_table")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(501).json(err);
    });
});

// CREATE a user
router.post("/", (req, res) => {
  const user = req.body;
  // lower case the email to make sure all emails are unique
  if(user.hasOwnProperty('email') && typeof user.email==='string'){
    // typically wouldn't have to check for property since it would be dealt with later,
    // but will be performing operations on the property
    // so check necesary to avoid fatal error
    user.email = user.email.toLocaleLowerCase();
  }else{
    res.status(400).json({message:"body missing email or value type is not string"});
  }

  db("user_table")
    .insert(user)
    .then(info => {
      db("user_table")
        .where({username:user.username})
        .then(user_info => {
          res.status(200).json({
            "message":"new user successfully created",
            "user":user_info[0]
          });
        })
        .catch(err => res.status(500).json(err.message));
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

// READ a user
// by user_id
router.get("/id/:user_id", (req, res) => {
  const {user_id} = req.params;
  db("user_table")
    .where({user_id})
    .then(array => {
      if(array.length === 1){
        res.status(200).json({
          message:"found user",
          user:array[0]
        });
      }else{
        res.status(404).json({
          message:"user with that user_id does not exist",
          user_id
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message)
    });
});

//by firebase_id
router.get("/firebase_id/:firebase_id", (req, res) => {
  const {firebase_id} = req.params;
  db("user_table")
    .where({firebase_id})
    .then(array => {
      if(array.length === 1){
        res.status(200).json({
          message:"found user",
          user:array[0]
        });
      }else{
        res.status(400).json({
          message:"user with that firebase_id does not exist",
          firebase_id
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message)
    });
});

//by username
router.get("/username/:username", (req, res) => {
  const {username} = req.params;
  db("user_table")
    .where({username})
    .then(array => {
      if(array.length === 1){
        res.status(200).json({
          message:"found user",
          user:array[0]
        });
      }else{
        res.status(404).json({
          message:"user with that username does not exist",
          username
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message)
    });
});

//by email
router.get("/email/:email", (req, res) => {
  const {email} = req.params;
  db("user_table")
    .where({email})
    .then(array => {
      if(array.length === 1){
        res.status(200).json({
          message:"found user",
          user:array[0]
        });
      }else{
        res.status(404).json({
          message:"user with that email does not exist",
          email
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message)
    });
  });
  
// by book_id
router.get("/book_id/:book_id", (req, res) => {
  const {book_id} = req.params;
  db("book_table")
    .where({book_id})
    .then(book => {
      if(book.length === 1){
        db("user_table")
          .where({user_id:book[0].user_id})
          .then(user => {
            if(user.length === 1){
              res.status(200).json({
                message:"found user",
                user:user[0]
              });
            }else{
              res.status(404).json({
                message:"book's user does not exist",
                user_id,
                book_id
              })
            }
          })
          .catch(err => res.status(500).json(err.message));
      }else{
        res.status(400).json({
          message:"book with that book_id does not exist",
          book_id
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});
  
// UPDATE user
router.put("/:user_id", (req, res) => {
  const body = req.body;
  const {user_id} = req.params;
  const currentDate = new Date();
  body.updated_at = currentDate;
  if(body.hasOwnProperty('email')){
    if(typeof body.email==='string'){
      body.email = body.email.toLocaleLowerCase();
    }else{
      res.status(400).json({message:"email property is not of type string"});
    }
  }

  db("user_table")
    .where({user_id})
    .then(user => {
      // found user with that user_id
      if(user.length === 1){
        // check if unique parameters are trying to be violated
        // if the user already has it delete those properties and proceed
        let checkUsername = false;
        let checkEmail = false;
        if(body.hasOwnProperty('username')){
          if(user[0].username === body.username){
            delete body.username;
          }else{
            checkUsername = true;
          }
        }
        if(body.hasOwnProperty('email')){
          if(user[0].email === body.email){
            delete body.email;
          }else{
            checkEmail = true;
          }
        }
        // if another user already has that username then return client error
        // if another user already has that email then return client error
        // due to the asynchronous behavior when js executes http requests
        // I decided to have this weird checking system
        if(checkEmail || checkUsername){
          // if the request is trying to update both the username and email,
          // then username and email will be checked in sequential order
          // if neither are already taken by the other user,
          // then the user will be updated
          if(checkEmail && checkUsername){
            db("user_table")
              .where({username:body.username})
              .then(user => {
                if(user.length === 1){
                  // different user found with that username
                  res.status(400).json({
                    message:"username taken by another user",
                    username: body.username
                  });
                }else{
                  db("user_table")
                    .where({email:body.email})
                    .then(user => {
                      if(user.length === 1){
                        // different user found with that email
                        res.status(400).json({
                          message:"email already used",
                          email:body.email
                        });
                      }else{
                        // no other user has that username nor email so both can be updated in the user
                        update(user_id, body);
                      }
                    })
                    .catch(err => res.status(500).json(err.message));
                }
              })
          // just need to check if the email is already taken by another user
          }else if(checkEmail){
            db("user_table")
              .where({email:body.email})
              .then(user => {
                if(user.length === 1){
                  res.status(400).json({
                    message:"email already used",
                    email:body.email
                  });
                }else{
                  update(user_id, body);
                }
              })
              .catch(err => res.status(500).json(err.message));
          }else{
            // just need to check if the username is already taken by another user
            db("user_table")
              .where({username:body.username})
              .then(user => {
                if(user.length === 1){
                  res.status(400).json({
                    message:"username taken by another user",
                    username:body.username
                  });
                }else{
                  update(user_id, body);
                }
              })
              .catch(err => res.status(500).json(err.message));
          }
        }
        update(user_id, body);
      }else{
        // user_id not found
        res.status(404).json({
          message:"user with that user_id does not exist",
          user_id
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message)
    });
    
    function update(user_id, body) {
      db("user_table")
      .where({user_id})
      .update(body)
      .then(count => {
        if(count === 1){
          res.status(200).json({
            message:"updated user",
            body
          });
        }else{
          res.status(404).json({
            message:"user with that user_id does not exist",
            user_id
          });
        }
      })
      .catch(err => res.status(500).json(err.message));
    }
});

// DELETE user
router.delete("/:user_id", (req, res) => {
  const {user_id} = req.params;
  db("user_table")
  .where({user_id})
  .del()
  .then(count => {
    if(count === 1){
      res.status(200).json({
        message:"deleted user",
        user_id
      });
    }else{
      res.status(404).json({
        message:"user with that user_id not found",
        user_id
      });
    }
  })
  .catch(err => {
    res.status(500).json(err.message);
  });
});

// READ all users by location
router.get("/location/:latitude/:longitude", (req, res) => {
  const {latitude, longitude} = req.params;
  db("user_table")
    .where({latitude, longitude})
    .then(users => {
      if(users.length > 0){
        res.status(200).json({
          message:"found users",
          users
        });
      }else{
        res.status(404).json({
          message:"user with that latitude and longitude does not exist",
          latitude,
          longitude
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

// READ all users by location range
router.get("/location/:latitude/:longitude/:range", (req, res) => {
  const {latitude, longitude, range} = req.params;
  const latLB = latitude-range;
  const latUB = Number(latitude)+Number(range);
  const lonLB = longitude-range;
  const lonUB = Number(longitude)+Number(range);
  db("user_table")
    .where(db.raw(`
      latitude between ${latLB} and ${latUB}
      AND
      longitude between ${lonLB} and ${lonUB}
    `))
    .then(users => {
      if(users.length > 0){
        res.status(200).json({
          message:"found users",
          users
        });
      }else{
        res.status(400).json({
          message:"user with that latitude and longitude does not exist",
          latitude,
          longitude,
          range,
          latLB,
          latUB,
          lonLB,
          lonUB
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

// READ all users by ISBN
router.get("/isbn/:isbn", (req, res) => {
  const {isbn} = req.params;
  db("book_table")
  .where({isbn})
  .then(books => {
    if(books.length > 0){
      const users = [];
      books.forEach(function(book, index){
        db("user_table")
          .where({user_id:book.user_id})
          .then(user => {
            if(user.length === 0){
              res.status(400).json({message:"could not find user with that book"});
            }
            users.push(user[0]);
            if(index+1 === books.length){
              res.status(200).json(users);
            }
          })
          .catch(err => res.status(500).json(err.message));
      });
    }else{
      res.status(400).json({
        message:"no books with that isbn exist",
        isbn
      });
    }
  })
  .catch(err => {
    res.status(500).json(err.message)
  });
});

// READ cc info by user_id
router.get("/cc/:user_id", (req, res) => {
  const {user_id} = req.params;
  db("user_table")
    .where({user_id})
    .then(user => {
      if(user.length === 1){
        res.status(200).json({cc:user[0].payment_info});
      }else{
        res.status(400).json({
          message:"user with that user_id does not exist",
          user_id
        });
      }
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

// check if username exists
router.get("/check_username_exists/:username", (req, res) => {
  const {username} = req.params;
  db("user_table")
    .where({username})
    .then(user => {
      const bool = user.length===1;
      res.status(200).json({exists:bool});
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

//login
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;

  // Find user by username
  User.findOne({ username }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, username.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: username.id, name: username.name }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});


module.exports = router;
