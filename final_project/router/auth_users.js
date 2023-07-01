const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
        });
        if(userswithsamename.length > 0){
        return true;
        } else {
        return false;
        }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: username
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbnRequested = req.params.isbn;
    const review = req.body.review;
    const username = req.body.username;

    if(isValid(username)) {
        const requestedBook = books[isbnRequested];
        
        if(requestedBook) {
            if(requestedBook.reviews) {
                const userReviewAlreadyExists = Object.keys(requestedBook.reviews).filter(reviewUsername => reviewUsername === username);
                if(userReviewAlreadyExists.length > 0) {
                    requestedBook.reviews[username].review = review
                    res.end(username + ' review updated to ' + '"'+review+'"' +'.');
                } else {
                    requestedBook.reviews[username] = {'review': review};
                    res.end(username + ' added new review '+ '"'+review+'"' + '.');
                }
            }
        } else {
            return res.status(404).json({message: "Cannot find matching book with ISBN provided."});
        }
    } else {
        return res.status(404).json({message: "Invalid username."});
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbnRequested = req.params.isbn;
    const username = req.body.username;

    if(isValid(username)) {
        const requestedBook = books[isbnRequested];

        if(requestedBook) {
            if(requestedBook.reviews) {
                const userReviewAlreadyExists = Object.keys(requestedBook.reviews).filter(reviewUsername => reviewUsername === username);
                if(userReviewAlreadyExists.length > 0) {
                    delete requestedBook.reviews[username];
                    res.end(username + ' review deleted on ' + '"ISBN'+isbnRequested+'"' +'.');
                } else {
                    return res.status(404).json({message: "Cannot find a review under this username."});
                }
            }
        } else {
            return res.status(404).json({message: "Cannot find matching book with ISBN provided."});
        }
    } else {
        return res.status(404).json({message: "Invalid username."});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
