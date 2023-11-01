const express = require("express");
const BookDB = require("../scr/bookdb");
const { use } = require("../router/loginroutes");
const login = require("./login")

const getallbook = async(req,res)=>{

    try {
        const books = await BookDB.find({});
        let resulttitle = [];
        for(let i=0;i<books.length;i++){
            resulttitle[i] = books[i].Title;
        }
        res.status(200).json({resulttitle});
      } catch (err) {
        res.status(401).json({message : "Error fetching BookData"})
      }
}

const getbyISBN = async(req,res)=>{
    await BookDB.aggregate([
        {
          $match: {
            ISBN: req.body.ISBN,
          },
        },
      ]).then((result) => {
        if(result.length){
            res.status(200).json({result});
        }
        else{
            res.status(400).json({message : "No Books Available in this ISBN"});
        }
      })

}

const getbyAuthor = async(req,res)=>{
    await BookDB.aggregate([
        {
          $match: {
            Author: req.body.Author,
          },
        },
      ]).then((result) => {
        if(result.length){
            res.status(200).json({result});
        }
        else{
            res.status(400).json({message : "No Books Available in this Author"});
        }
      })
}

const getbyTitle = async(req,res)=>{
    await BookDB.aggregate([
        {
          $match: {
            Title: req.body.Title,
          },
        },
      ]).then((result) => {
        if(result.length){
            res.status(200).json({result});
        }
        else{
            res.status(400).json({message : "No Books Available in this Title"});
        }
      })
}

const getbyReview = async(req,res)=>{
    await BookDB.findOne({ ISBN: req.body.ISBN}).then((result)=>{
        if(result){
            let resultReview = [];
            for(let i=0;i<result.Review.length;i++){
                resultReview[i] = result.Review[i].comment;
            }
            res.status(200).json({resultReview});
        }
        else{
            res.status(400).json({message : "No Books Review Available in this ISBN"});
        }
    }).catch((e)=>{
        res.status(400).json({message : "No Books Review Available in this ISBN"});
    })
}

const addBook = async(req,res)=>{
    const NewData = new BookDB({
        ISBN: req.body.ISBN,
        Author: req.body.Author,
        Title: req.body.Title,
        Review: req.body.Review,
      });
      await NewData.save()
        .then((data) => {
          if (data) {
            res
              .status(200)
              .json({ message: "Successfully Book Added" });
          } else {
            res.status(401).json({ message: "Failed to add Book" });
          }
        })
        .catch((e) => {
          console.log(e);
          res.status(401).json({ message: "Failed to add Book" });
        });
}

const reviewadded = async(req,res)=>{
    const { ISBN, Review } = req.body;
    const bodyReview = Review;
    const email = login.userdataArr[0];
  
    console.log(email);

    BookDB.findOne({ ISBN }).then(async(book) => {
  
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
  
      if(!book.Review){
        book.Review=[];
      }

      let existingReviewIndex = book.Review.findIndex((review) => review.email === email);
  
      if (existingReviewIndex !== -1) {
        book.Review[existingReviewIndex].comment = bodyReview;
        await book.save();
      } else {
        console.log(bodyReview+ "---fdsbd");
        book.Review.push({ "email":email, "comment" : bodyReview });
        await book.save();
      }
  
        res.status(200).json({ message: 'Review posted/modified successfully' });
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({ error: 'Failed to save review' });
    })
  
}

const deleteBook = async(req,res)=>{
  const ISBN = req.body.ISBN; 
  const emailToDelete = login.userdataArr[0]; 

  BookDB.findOneAndUpdate(
    { ISBN },
    { $pull: { Review: { email: emailToDelete } } },
    { new: true },
  )
    .then((updatedBook) => {
      if (updatedBook) {
        res.status(200).json({ message: 'Review comment deleted successfully' });
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: 'Failed to delete review comment' });
    });
}
 
module.exports={
    getallbook,
    getbyISBN,
    getbyAuthor,
    getbyTitle,
    getbyReview,
    addBook,
    reviewadded,
    deleteBook,
}