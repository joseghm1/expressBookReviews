const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/', function (req, res) {
    // Convert the 'books' object into an array of book objects
    const booksArray = Object.values(books);
  
    // If you want to filter by availability, make sure to have an 'available' property in your books.
    // For now, I'll skip the availability filter as the 'available' property doesn't exist in your data.
  
    // If there are no books, return a 404 error
    if (booksArray.length === 0) {
      return res.status(404).json({ message: "No books available" });
    }
  
    // If books are available, send them as a response
    return res.status(200).json(booksArray);
  });

  public_users.get('/isbn/:isbn', function (req, res) {
    // Convert the isbn parameter to a number since keys in books are numbers
    const isbn = parseInt(req.params.isbn, 10);
    
    // Check if the parsed ISBN is valid (not NaN)
    if (isNaN(isbn)) {
        return res.status(400).json({ message: "Invalid ISBN format" });
    }

    // Look up the book in the books object
    if (books.hasOwnProperty(isbn)) {
        // If the book exists, return the book details
        return res.status(200).json(books[isbn]);
    } else {
        // If the book doesn't exist, return a 404 error
        return res.status(404).json({ message: "Book not found" });
    }
});


  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;