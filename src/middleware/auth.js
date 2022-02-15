// const login = require("./db/db");
const { redirect } = require('express/lib/response');
const jwt = require('jsonwebtoken');



const auth = async(req,res,next)=>{
     try {
         const token = await req.cookies.jwt;
         const verifyuser =  jwt.verify(token, "qwertyuiopasdfghjklzxcvbnmqwertyu", (err, decoded)=>{
             if(decoded){
                 next()
             }else if(err){
                 res.redirect("/")
             }
         });
         
         
     }
      catch (error) {
         console.log(error);
     }
}

module.exports = auth;