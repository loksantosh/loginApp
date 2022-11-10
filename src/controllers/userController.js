const userModel=require('../models/userModel')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const createUser = async function (req, res) {
    try {
     
      const { name, email, phone, password } = req.body;
  
      if (Object.keys(req.body).length == 0) {
        return res
          .status(400)
          .send({
            status: false,
            msg: "Please enter request data to be created",
          });
      }
  
      //name
      
  if (!/^\w[a-zA-Z.\s_]*$/.test(name))
        return res
          .status(400)
          .send({ status: false, msg: "The  name may contain only letters" });
  
      
        //email
      let checkEmail = validator.validate(email);
      if (!checkEmail) {
        return res
          .status(400)
          .send({ status: false, msg: "please enter email in valid format " });
      }
  
      let uniqueEmail = await userModel.findOne({ email });
      if (uniqueEmail) {
        return res
          .status(400)
          .send({ status: false, msg: "This email already exists" });
      }
  
      //phone
      if (typeof phone !== "string")
        return res
          .status(400)
          .send({ status: false, msg: " Please enter  phone as a String" });
  
      if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(phone))
        return res.status(400).send({
          status: false,
          msg: "Please enter a valid Indian phone number",
        });
  
      let uniquephone = await userModel.findOne({ phone: phone });
      if (uniquephone) {
        return res
          .status(400)
          .send({ status: false, msg: "This phone number already exists" });
      }
  
      // password-encrypt
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(password, salt);
      req.body.password = hashedPass;

      let saveData = await userModel.create(req.body);
    return res.status(201).send({
      status: true,
      message: "User created successfully",
      data: saveData,
    });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};




//----------------------------------------------------------------------------------------

const loginUser = async function (req, res) {
    try {
        let data=req.body
      let { email, password } ={...data}
    
      return res.redirect('/dashboard')
     let user = await userModel.findOne({ email: email });
      
      if (!user) {
        return res.status(404).send({ status: false, messege: "no data found " });
      }
  
      let validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword)
        return res.status(400).send({ status: false, messege: "wrong password" });
        res.end("Login successful")
      let token = jwt.sign(
        {
          userId: user._id.toString(),
          batch: "radon",
          organisation: "functionUp",
        },
        "Group66",
        { expiresIn: "2H" }
      );
  
      let id = user._id;
      return res.status(200).send({
        status: true,
        messege: "User login successfull",
        data: { id, token },
      });
    } catch (err) {
      return res.status(500).send({ status: false, messege: err.message });
    }
  };

  module.exports={loginUser ,createUser}