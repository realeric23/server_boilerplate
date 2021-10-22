const Transaction = require ('../src/models/transaction')

const generateTransaction = (fromAccount, toAccount, description, amount) => {
    const transaction = new Transaction({
        fromAccount,
        toAccount,
        description,
        amount
    })
     if (!transaction) {
       res.status(400).send({ message: 'there are not transaction for this accoutn!' })
    }
    return transaction
}

module.exports = {
    generateTransaction
};