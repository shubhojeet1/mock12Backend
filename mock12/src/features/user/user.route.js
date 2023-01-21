const userModel = require('./user.model')
const express = require('express')
const app = express.Router()
const bcrypt  =require("bcrypt")
const jwt = require("jsonwebtoken");
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const SECRET_REFRESH_TOKEN = process.env.SECRET_REFRESH_TOKEN;





app.get('/',async (req,res)=>{
  const user = await  userModel.find({});
  return res.status(201).send(user)
})






app.post('/calculate',async (req,res)=>{
   const  {invest , time } = req.body
  console.log(req.body)
  if(!invest || !time  ) return res.status(401).send({message:"Something went wrong"})
 try{
  let i = (1+0.071)
  i = Math.pow(i,time)
  console.log(i)
  i = (i-1)/0.071
  console.log(i)
  let Total_Maturity_Value = Math.round(Number(invest)*i)
  let Total_Investment_Amount = time*invest
  let Total_Interest_Gained = Total_Maturity_Value  - Total_Investment_Amount 
 console.log(Total_Maturity_Value)  
 console.log(Total_Investment_Amount)  
 console.log(Total_Interest_Gained)  
 res.status(200).send({Total_Maturity_Value,Total_Investment_Amount,Total_Interest_Gained})
}
 catch(err){
  return res.status(403).send({message:"Something went wrong"})
 }
})







app.post('/getProfile',async (req,res)=>{
  let { userId } = req.body
  console.log(req.body)
  if(!userId) return res.status(401).send({message:"Something went wrong"})
 try{
  const user = await  userModel.findById(userId);
  return res.status(201).send(user)
 }
 catch(err){
  return res.status(403).send({message:"Something went wrong"})
 }
})







app.post('/register',async (req,res)=>{
    const { name, email, password } = req.body
    if(!name || !email || !password ) return res.status(403).send({message:"Please Enter All Credential"})

    const exsist = await userModel.findOne({ email })
    if(exsist) return res.status(404).send({message:"User already exists please login"})

    console.log(req.body);
    const hash = bcrypt.hashSync(password, 10);
    const user = await  userModel({  name, email, password:hash });
                 user.save()
  
    return res.status(201).send({user,message:"Signup Successfully"});
})







app.post('/login',async (req,res)=>{
    const { email, password } = req.body;

    console.log(email,password)

  if (!email || !password) {
    return res.status(403).send({message:"Please Enter All Credentials"});
  }
  const User = await userModel.findOne({ email })





  try {
    const match = bcrypt.compareSync(password, User.password);
   console.log(match)
    if (match) {
  



      const token = jwt.sign(
        {
          _id: User.id,
          username: User.username,
          email:User.email,
          password: User.password,
        },
        SECRET_TOKEN,
        {
          expiresIn: "7 days",
        }
      );
      const refresh_token = jwt.sign(
        {
          _id: User.id,
          username: User.username,
          email:User.email,
          password: User.password,
        },
        SECRET_REFRESH_TOKEN,
        {
          expiresIn: "28 days",
        }
      );


      return res
        .status(200)
        .send({ message: "Login Successfully", token, userId:User.id});
    } else {
      return res.status(401).send({ message: "Password is wrong" });
    }
  } catch {
    return res.status(401).send({ message: "Invalid Credentials" });
  }
})
module.exports = app