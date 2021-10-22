const mongoose = require("mongoose");
const Users = mongoose.model("Users")
const Accounts = mongoose.model("Accounts")
const { generateAccount, generateCBU } = require('../../utils/accountGen');

exports.createAccount = async (req, res) => {
    const {id} = req.params
    
    const user = await Users.findById(id)
    if(user.accounts.length === 0) {
        console.log('no tiene cuentas')
    
        

    const pesosCVU = await generateCBU()
    const dolaresCVU = await generateCBU()
    const accountOne = await generateAccount(pesosCVU, 'Pesos',0, user._id)
    const accountTwo = await generateAccount(dolaresCVU, 'Dolares',0, user._id);
    await accountOne.save();
    await accountTwo.save();
    user.accounts.push(accountOne, accountTwo);
    await user.save()
    console.log(user.accounts)
    

    res.status(200).json({ 'CuentaEnPesos': accountOne, 'CuentaEnDolares': accountTwo })
    }else{
    res.status(400).json({message: 'la cuenta ya existe'})

    }
} 

exports.getAccount = async (req, res) =>{
        const { id } = req.params
        console.log(Accounts.find({userId:id}))
        const accounts = await Accounts.find({ userId: id })
        

        if (!accounts) {
            res.status(400).json({ message: 'there are not accounts for this user!' })
        }
        console.log(accounts)
        res.status(200).send(accounts)
        return
    }

exports.deleteAccount = async (req, res)=>{
    const {id} = req.params
  
    const account = Accounts.find({_id: id}, function(err){
        console.log(account)
        Accounts.remove()
        
            res.status(200).json({message :'las cuentas han sido borradas'})
        
    })
}    
