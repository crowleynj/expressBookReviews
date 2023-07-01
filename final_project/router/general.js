const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Function to check if the user exists
const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

//Register new users
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login."});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.end(JSON.stringify(books), null, 4);  
  });

// Task 10 - Get the list of books available in the shop using promises
public_users.get('/async-get-books',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
    });
    get_books
        .then(() => console.log("Promise for Task 10 resolved"))
        .catch((e) => {
            console.error(e);
          });
});
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
const isbnRequested = req.params.isbn;
const result = books[isbnRequested];
res.end(JSON.stringify(result), null, 4);  
});

// Task 11 - Get book details based on ISBN using promises
public_users.get('/async-get-book-by-isbn/:isbn',function (req, res) {
    const get_book_by_ISBN = new Promise((resolve, reject) => {
        const isbnRequested = req.params.isbn;
        const result = books[isbnRequested];
        resolve(res.send(JSON.stringify({result}, null, 4)));
    });
    get_book_by_ISBN
        .then(() => console.log("Promise for Task 11 resolved"))
        .catch((e) => {
            console.error(e);
          });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorRequested = req.params.author;
    const result = Object.values(books).filter(item => item.author === authorRequested);
    res.end(JSON.stringify(result), null, 4);  
});

// Task 12 - Get book details based on author using promises
public_users.get('/async-get-book-by-author/:author',function (req, res) {
    const get_book_by_author = new Promise((resolve, reject) => {
        const authorRequested = req.params.author;
        const result = Object.values(books).filter(item => item.author === authorRequested);
        resolve(res.send(JSON.stringify({result}, null, 4)));
    });
    get_book_by_author
        .then(() => console.log("Promise for Task 12 resolved"))
        .catch((e) => {
            console.error(e);
          });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titleRequested = req.params.title;
    const result = Object.values(books).filter(item => item.title === titleRequested);
    res.end(JSON.stringify(result), null, 4);  
});

// Task 13 - Get book details based on title using promises
public_users.get('/async-get-book-by-title/:title',function (req, res) {
    const get_book_by_title = new Promise((resolve, reject) => {
        const titleRequested = req.params.title;
        const result = Object.values(books).filter(item => item.title === titleRequested);
        resolve(res.send(JSON.stringify({result}, null, 4)));
    });
    get_book_by_title
        .then(() => console.log("Promise for Task 13 resolved"))
        .catch((e) => {
            console.error(e);
          });
});

  
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnRequested = req.params.isbn;
    const result = Object.values(books).filter(item => item.isbn === isbnRequested);
    res.end(JSON.stringify(result[0].reviews), null, 4); 
});

module.exports.general = public_users;
