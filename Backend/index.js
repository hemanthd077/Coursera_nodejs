const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();

const monogourl = process.env.MONGO_URL
const monogoport = process.env.PORT


mongoose.connect(monogourl,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log('mongodb connected sucessfully');   ``
})
.catch(()=>{
    console.error(Error);
    console.log('failed to connect the database');
})


require('dotenv').config();
const Secret = process.env.SESSION_SECERT;

app.use(express.json())
app.use(cookieParser());

app.use(express.urlencoded({extended:false}))

const loginRoutes = require('./router/loginroutes')
const crudRoutes = require('./router/crudroutes')
const registerRoutes = require('./router/registerroutes')

const session = require('express-session');
app.use(
    session({
      secret: Secret, 
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false,
        maxAge: 36000000, 
      },
    })
  );


app.use(loginRoutes)
app.use(crudRoutes)
app.use(registerRoutes)



app.listen(monogoport,()=>{
    console.log(`Connected to Server on Port ${process.env.PORT}`);
})

