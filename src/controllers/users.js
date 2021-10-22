const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const bcrypt = require('bcrypt');
const { EMAIL_ACCOUNT, EMAIL_PASSWORD } = process.env;
var nodemailer = require('nodemailer');
const { generateCode } = require('../../utils/codeGen');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; revisar porque tira error
// const NODE_TLS_REJECT_UNAUTHORIZED = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
const jwt = require('jsonwebtoken');

exports.getUsers = (req, res) => {
  Users.find()
    .then((users) =>
      res.status(200).json({
        status: 'success',
        response: users,
      })
    )
    .catch((error) =>
      res.status(400).json({ status: 'error', message: error.message })
    );
};

exports.getUserId = (req, res) => {
  const { id } = req.params;
  Users.findOne({ _id: id })
    .populate('accounts')
    .then((user) => res.status(200).json({ status: 'success', response: user }))
    .catch((error) =>
      res.status(400).json({ status: 'error', message: error.message })
    );
};

exports.updateDataUser = async (req, res) => {
  const { id } = req.params;
  const cambios = req.body;

  Users.findByIdAndUpdate(id, cambios, async (err, userUpdate) => {
    if (err) {
      res
        .status(400)
        .json({ message: `Error updating user data: ${err.message}` });
    } else {
      const userUp = await Users.findById(userUpdate.id);
      await userUp.populated('Accounts');
      userUp.save();
      console.log(userUp);
      res.status(200).json({ status: 'success', response: userUp });
    }
  });
};

exports.sendEmail = (req, res) => {
  const { name, email, code, text, subject } = req.body;
  // const { code, email } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_ACCOUNT,
      pass: EMAIL_PASSWORD,
    },
  });

  transporter
    .sendMail({
      from: '"Veski" <veski@gmail.com>',
      to: email,
      subject: subject,
      text: text + code || '',
    })
    .then((mail) => {
      res.status(200).json({
        message: 'Mail send success',
        info: mail,
      });
    })
    .catch((error) => {
      res.status(404).json({
        message: 'Mail not send ' + error,
      });
    });
};

exports.emailCode = async (req, res) => {
  try {
    const { userEmail } = req.body;

    const userfind = await Users.findOneAndUpdate(
      { email: userEmail },
      { resetCode: generateCode(6) },
      { new: true }
    );
    console.log('SOY------->', userfind);
    if (userfind) {
      res.status(200).json({
        message: 'Code generated correctly',
        user: userfind,
      });
    } else {
      res.status(400).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.passwordReset = async (req, res) => {
  try {
    const { resetCode, userEmail, newPass } = req.body;
    console.log('soy----->', resetCode);

    const user = await Users.findOne({ email: userEmail });
    if (user && user.resetCode === resetCode) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPass, salt);
      user.password = hash;
      await user.save();
      res.status(200).json({
        message: 'Password Updated correctly',
        user: user,
      });
    } else {
      res.status(400).json({
        message: 'User not found or reset code does not match',
      });
    }
  } catch (error) {
    res.status(400).json({
      message: 'Error: ' + error,
    });
  }
};
