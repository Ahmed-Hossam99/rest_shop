const userModel = require('../models/user')
const bCrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Add User
exports.postSignup = (req, res, next) => {
  userModel.find({ email: req.body.email })
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({//409 mean reject req with sourced we have like this case existed email
          message: 'user exist'
        })
      }
      else {
        // 10 here = saltRonds => that take original password and addto this some random string before is gone to hash to protect it from (hash dictionary table)  
        bCrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            const error = new Error('can not hash your password')
            error.satausCode(500)
            throw error;
          }
          else {
            // create New User
            const user = new userModel({
              name: req.body.name,
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(user => {
                console.log(user)
                res.status(201).json({
                  message: 'user created',
                  user: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    request: {
                      type: 'DELETE',
                      url: 'http://localhost:3000/user/' + user._id
                    }
                  }
                })
              })
              .catch(err => {
                if (!err.statusCode) {
                  err.statusCode = 500;
                }
                next(err);
              });
          }
        })
      }
    })
}

// post Login 
exports.postLogin = (req, res, next) => {
  userModel.find({ email: req.body.email })
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({//401 to un Auth status
          message: 'Auth failed'
        })
      }
      bCrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({//401 to un Auth status
            message: 'Auth failed !!'
          })
        }
        if (result) {
          const token = jwt.sign({
            email: user[0].email,
            user_id: user[0]._id
          },
            "secret",
            {
              expiresIn: "1h"
            }
          )
          return res.status(201).json({
            message: ' Auth succsseful !! ',
            token: token
          })
        }
        // to wrong Email address if pass is success
        res.status(401).json({
          message: ' Auth failed !! '
        })
      })
    })
}

// delete user
exports.deleteUser = (req, res, next) => {
  userModel.deleteOne({ _id: req.params.userId })
    .then(() => {
      res.status(201).json({
        message: 'user deleted !!'
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}