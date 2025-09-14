const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return res.status(400).json({ message: "User already exists" });
  }

  users[username] = { username, password };
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn] ? books[isbn] : { message: "Book not found" });
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   const author = req.params.author;
  let filteredBooks = [];

  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      filteredBooks.push(books[key]);
    }
  });

  res.send(filteredBooks.length > 0 ? filteredBooks : { message: "No books found for this author" });
});
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filteredBooks = [];

  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      filteredBooks.push(books[key]);
    }
  });

  res.send(filteredBooks.length > 0 ? filteredBooks : { message: "No books found with this title" });
});
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn] ? books[isbn].reviews : { message: "No reviews found for this book" });
});
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
