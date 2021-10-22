const Account = require ('../src/models/account')

const generateCBU = () => {
    const cbu = "00000000" + Math.floor(Math.random() * 99999999999999)
    return cbu
}
 const generateAccount = (cbu, currency,balance, userId) => {
    const account = new Account({
        cbu,
        currency,
        balance,
        userId
    })
    if (!account) {
       res.status(400).send({ message: 'there are not accounts for this user!' })
    }
    return account
}

module.exports = {
    generateCBU,
    generateAccount
};