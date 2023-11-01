const express = require('express')
const router = express.Router();

const registerController = require("../controller/register");

router.post("/register",registerController.register);

module.exports =router;