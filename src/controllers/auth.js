const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require('crypto');


// register
exports.createUser = async (req, res) => {
  let nuevoUser;
  const { name, lastName, email, password, address, dni } = req.body;

  let { AUTH_EMAIL, AUTH_PASS } = process.env;

  let transporter = nodemailer.createTransport({
    service: "gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: `${AUTH_EMAIL}`, 
      pass: `${AUTH_PASS}`, 
    },
  });

  Users.insertMany({ name, lastName, email, password, address, dni})
    .then(user => {
      nuevoUser = user[0];
      nuevoUser.pin = crypto.randomBytes(3).toString('hex').toUpperCase();

     setTimeout(() => {
      nuevoUser.pin = null;
      nuevoUser.save();
    }, 300000);
     
    let data = {
      from: '"VESKI 👩‍🚀" <veskibank@gmail.com>', 
      to: `${nuevoUser.email}`, 
      subject: "Code validation ✔",
      text: `Here you have your code to validate your Veski account: ${nuevoUser.pin}. It expires in 10 minutes! `,
    }
    
    transporter.sendMail(data, (err, info) => {
      if (!err) {
        res.status(200).json({ msg: "PIN sent" });
      } else {
        res.status(500).json({ msg: "PIN not send" });
      }
    });
 
      return nuevoUser.encryptPassword(password);
    })
    .then((nuevoPass) => {
      nuevoUser.password = nuevoPass;
      return nuevoUser.save();
    })
    .then((user) => res.status(200).json({ status: "success", response: user }))
    .catch((error) =>
      res.status(400).json({ status: "error", message: error.message })
    );
};

//login
exports.postLogin = async (req, res) => {

  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await Users.findOne({ email: email });
    if (user) {
      const validPassword = await bcrypt.compareSync(password, user.password);
      if (user && validPassword) {
        const token = await user.generateAuthToken();
        res
          .status(200)
          .json({ status: "success", response: user});
      } else {
        throw new Error(" Incorrect Password");
      }
    } else {
      throw new Error("Not found Email");
    }
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};


exports.validatePIN = (req, res ) => {
  const { pin } = req.params;

  Users.findOne({pin: pin})
  .then(user => {
    if(user.pin === pin){
     return res.status(200).json({msg: 'correct', res: user})
    }else{
     return res.status(400).json({msg: 'incorrect'})
    }
  })
  .catch(err => {
    res.status(400).json({msg: 'User not found', err})
  })
}

exports.resendPin = (req, res) => {
  const { email } = req.body;

  let { AUTH_EMAIL, AUTH_PASS } = process.env;

  let transporter = nodemailer.createTransport({
    service: "gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: `${AUTH_EMAIL}`, 
      pass: `${AUTH_PASS}`, 
    },
  });
  
  const pin = crypto.randomBytes(3).toString('hex').toUpperCase();

  Users.findOneAndUpdate({ email: email}, pin)
    .then(user => {
      user.pin = pin
      user.save();

     setTimeout(() => {
      user.pin = null;
      user.save();
    }, 300000);
     
    let data = {
      from: '"VESKI 👩‍🚀" <veskibank@gmail.com>', 
      to: `${user.email}`, 
      subject: "Code validation ✔",
      text: `Here you have your code to validate your Veski account: ${user.pin}. It expires in 10 minutes! `,
    }
    
    transporter.sendMail(data, (err, info) => {
      if (!err) {
        return res.status(200).json({ msg: "PIN resent succesfully" });
      } else {
        return res.status(500).json({ msg: "PIN not resent" });
      }
    });
    })
    .catch(err => {
      res.status(400).json({msg: 'User not found', response: err.msg})
    })
}
