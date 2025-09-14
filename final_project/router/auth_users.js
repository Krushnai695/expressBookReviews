const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {}; // store registered users here
const SECRET_KEY = "mysecretkey";

// Utility function
const isValid = (username) => {
  return users[username] ? true : false;
};

// Task 6: Register new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return res.status(400).json({ message: "User already exists" });
  }

  users[username] = { username, password };
  return res.status(200).json({ message: "User registered successfully" });
});

// Task 7: Login as a registered user (with JWT)
regd_users.post("/customer/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (users[username] && users[username].password === password) {
    const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: "1h" });
    req.session.authorization = { token, username };

    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 9: Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
    } else {
      return res.status(404).json({ message: "No review by this user for this book" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
