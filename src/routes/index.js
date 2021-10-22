const { Router } = require('express');
// importamos las rutas
const user = require('./user.js');
const auth = require('./routeAuth.js');
const address = require('./address.js');
// const messages = require('./messages.js');
const account = require('./account.js');
const transaction = require('./transaction.js');
const contact = require('./contacts')
const card = require('./cards.js');
const router = Router();


router.use("/users", user); 
router.use("/users", auth);
router.use('/accounts', account);
router.use('/transactions', transaction);
router.use('/address', address);
router.use('/cards', card);
router.use('/contact', contact);

// router.use('/messages', messages);
//router.use("/auth", auth)

module.exports = router;
