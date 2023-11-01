const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Register = require("../scr/registerdb");

let userdataArr = [];

const verifyToken = (req, res, next) => {
    try {
      const cookies = req.headers.cookie;
      if(!cookies){
        return res.status(404).json({ message: "No token found" });
      }
      const token = cookies.split(";")[0].split("=")[1];
      if (!token) {
        return res.status(404).json({ message: "No token found" });
      }
  
      jwt.verify(String(token), process.env.JWT, (err, user) => {
        if (err) {
            // console.log(token);
          return res.status(400).json({ message: "Invalid Token Login First!!!" });
        }
        req._id = user._id;
        next();
      });
    } catch (error) {
      return res.status(500).json({ message: "Cookies Not Found" });
    }
  };


const login = async (req, res, next) => {
    const { email, password } = req.body;
    userdataArr[0] = email;
    try {
      const user = await Register.findOne({ email: email });

      if (!user) {
        return res.status(404).send("User Not Found! Please Register...");
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
      if (!isPasswordCorrect) {
        return res.status(401).send("Wrong email or password!");
      }
    //   creating token
      const token = jwt.sign({ _id: user._id },process.env.JWT, {
        expiresIn: "1hr",
      });
  
      if (req.cookies[`${user._id}`]) {
        req.cookies[`${user._id}`] = "";
      }
  
      res.cookie(String(user._id), token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        httpOnly: true,
        sameSite: "lax",
      });

  
      return res
        .status(200)
        .json({ message: "Logged In SuccessFully!!!", user: user });
    } catch (err) {
      next(err);
    }
  };
  


module.exports={
    login,
    verifyToken,
    userdataArr,
}