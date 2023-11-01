const Register = require("../scr/registerdb");
const bcrypt = require("bcrypt");
const express = require("express");


const register = async (req, res, next) => {
    // console.log(req.body);
    const { firstname, lastname,email, password } = req.body;
    let existingUser;

    try {
        existingUser = await Register.findOne({ email: email });
    } catch (err) {
        next(err);
    } 

    if (existingUser) {
        return res.status(409).send("User Already Exists!! Login Instead");
    }

    //  Creating new User
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new Register({
            firstname: firstname,
            lastname : lastname,
            email: email,
            password: hash,
        });

        // Saving new User
        await newUser.save();
        return res.status(200).send(newUser);
    } catch (err) {
        next(createError(500, "Can't able to Register new User"));
    }

};

module.exports = {
    register,
}