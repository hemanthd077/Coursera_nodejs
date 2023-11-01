const express = require('express')
const router = express.Router();

const crudController = require("../controller/crud");
const loginController = require("../controller/login");


//read book data
router.get("/",crudController.getallbook);
router.get("/getbyISBN",crudController.getbyISBN);
router.get("/getbyAuthor",crudController.getbyAuthor);
router.get("/getbyTitle",crudController.getbyTitle);
router.get("/getbyReview",crudController.getbyReview);


//write book data
router.post("/addBook",loginController.verifyToken,crudController.addBook);

//update book data
router.post("/reviewadded",loginController.verifyToken,crudController.reviewadded);

//delete book data
router.post("/deleteBook",loginController.verifyToken,crudController.deleteBook);

module.exports =router;