const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {check , validationResult} = require("express-validator")
const {secret} = require("../config")


const generateAccessToken = (_id, isAdmin) => {
  const payload = {
    _id,
    isAdmin
  }
  return jwt.sign(payload, secret, {expiresIn: "24h"})

}

//REGISTER
router.post("/register", [
  check("username", "имя не должно быть пустым").notEmpty(),
  check("password", "пароль не должен быть меньше 3 и больше 10 символов").isLength({min:3, max:10}),
  check("email", "email не должен быть пустым").notEmpty(),
], async (req, res) => {
  console.log( req.body)
  
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({message : "ошибка при регистрации", errors})
    }
    const userUniq = await User.findOne({ email: req.body.email });
    if(userUniq){
      return res.status(404).json( "пользователь с таким email уже создан" );
    }
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user and respond
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log( "q", req.body)
    const user = await User.findOne({ email: req.body.email });
    if(!user){
      return res.status(404).json("user not found");
       
    }
    // !user && res.status(404).json("user not found");
    
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword){
      return res.status(400).json("wrong password")
      
    }
    // !validPassword && res.status(400).json("wrong password")
    const token = generateAccessToken(user._id, user.isAdmin)
    res.status(200).json({token})
    // res.status(200).json(user)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
