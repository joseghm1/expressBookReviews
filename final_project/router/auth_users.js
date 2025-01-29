const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { 
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT
    const accessToken = jwt.sign({ username: username }, "fingerprint_customer", { expiresIn: '1h' });
    
    // Save the token in the session 
    // Note: Session middleware must be set up in your main app file for this to work
    // Here, we're assuming session middleware is set up
    // req.session.accessToken = accessToken;

    // Since session is not directly accessible here, we'll send the token in the response
    return res.status(200).json({ message: "Login successful", accessToken: accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn, 10);
    const { review } = req.body;
    const username = req.user.username; // Assuming req.user is set by JWT middleware

    if (isNaN(isbn) || !review) {
        return res.status(400).json({ message: "Invalid ISBN or review content missing" });
    }

    if (!books.hasOwnProperty(isbn)) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added or updated successfully", review: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;