const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {
    static async register(req, res){
        const {name, email, phone, password, confirmpassword} = req.body

        if(!name){
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }

        if(!email){
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }

        if(!phone){
            res.status(422).json({message: 'O telefone é obrigatório'})
            return
        }

        if(!password){
            res.status(422).json({message: 'A senha é obrigatório'})
            return
        }

        if(!confirmpassword){
            res.status(422).json({message: 'A confirmação da senha é obrigatório'})
            return
        }

        if(password !== confirmpassword){
            res
            .status(422)
            .json({message: 'As senhas precisam ser iguais!'})
            return
        }

        const userExists = await User.findOne({ email: email })

        if(userExists) {
            res
            .status(422)
            .json({message: 'Por favor utilize outro e-mail!'})
            return
        }

        //create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)


        //create a user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
            
        })

        try {
          const newUser = await user.save()  
          await createUserToken(newUser, req, res)  
        } catch (error) {
           res.status(500).json({message: error}) 
        }

    }

    static async login(req, res) {
        const {email, password} = req.body

        if(!email){
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }

        if(!password) {
            res.status(422).json({message: 'A senha é obrgatória!'})
            return
        }

        // check if user exists
        const user = await User.findOne({ email: email })

        if(!user) {
            res
            .status(422)
            .json({message: 'Não há usuário cadastrado  para esse e-mail!'})
            return
        }

        //check if password match with bd password
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword) {
            res.status(422).json({
                message:'Senha inválida!'
            })
            
            return
        }

        await createUserToken(user, req, res)  

    }

    static async checkUser(req, res) {
        let currentUser

        //console.log(req.headers.authorization)
        
        if(req.headers.authorization){ //req.headers.authorization --> Postman

            const token = getToken(req) 
            const decoded = jwt.verify(token, 'nossosecret')

            currentUser = await User.findById(decoded.id) 

            //Como vamos enviar o usuário retiramos a senha.
            currentUser.password = undefined

          /*console.log('token:', token)
            console.log('decoded:', decoded)
            console.log('currenteUser:', currentUser)
            console.log('current.password:', currentUser.password) */

        } else {

            currentUser = null
            
        }

        //Retorna todos os dados do usuário, menos o password.
        res.status(200).send(currentUser)
    }

    static async getUserById(req, res) {
        const id = req.params.id

        //O user vai exibir tudo menos o password
        const user = await User.findById(id).select('-password')

        if(!user) {
            res.status(422).json(
                {
                    message: 'Usuário não encontrado!'
                }
            )

            return
        } 

        res.status(200).json({ user })
    }

/*      static async editUser(req, res) {

        const id = req.params.id

        //check if user exists
        const token = getToken(req)
        const reqUser = await getUserByToken(token)
        const user = await User.findById(id);// retorna um doc usuário
        
        if (!user) return res.status(201).send({});

        console.log('user to update', user)
        console.log('data from body', req.body)

        const{ name, email, phone, password, confirmpassword } = req.body

        let image = ''

        //Validations
        
        if(!name){
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }

        user.name = name

        if(!email){
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }

        
        const userExists = await User.find({email: email})
        // user.email => tiago2@email
        // diferente de
        // email => tiago2@email
        console.log("user.email !== email", user.email, "!==", email, user.email !== email)
        // garantir que não é atualizado o email do usuário
        if(user.email !== email && userExists.length > 0) {
            res.status(422).json({ message: 'Por favor, utilize outro email!'})
            return
        }

        user.email = email

        if(!phone){
            res.status(422).json({message: 'O telefone é obrigatório'})
            return
        }

        user.phone = phone

        if(password != confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem!'})
            return

        } else if( password === confirmpassword && password != null ) {
            //creating password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            
            await User.findOneAndUpdate(
                {_id: user._id},
                {$set: reqUser},
                { new: true },
            )

            res.status(200).json({
                message: 'Usuário atualizado com sucesso!'
            })

        } catch (error) {
            res.status(500).json({ message: error})
            return
        }
        
    } 
 */
   
    
    static async editUser(req, res) {

        const id = req.params.id

        //check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)


        const{ name, email, phone, password, confirmpassword } = req.body

        

        if (req.file) {
            user.image = req.file.filename
        }

        //Validations
        if(!name){
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        }

        user.name = name

        if(!email){
            res.status(422).json({message: 'O email é obrigatório'})
            return
        }

        const userExists = await User.findOne({email: email})

        //console.log('email:', userExists)
        //console.log('Email do usuário:', user.email)

        if(user.email !== email && userExists) {
            res.status(422).json({ message: 'Por favor, utilize outro email!'})
            return
        }

        user.email = email

        if(!phone){
            res.status(422).json({message: 'O telefone é obrigatório'})
            return
        }

        user.phone = phone



        if(password != confirmpassword) {
            res.status(422).json({ message: 'As senhas não conferem!'})
            return

        } else if( password === confirmpassword && password != null ) {
            //creating password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            
            await User.findOneAndUpdate(
                {_id: user._id},
                {$set: user},
                { new: true },
            )

            res.status(200).json({
                message: 'Usuário atualizado com sucesso!'
            })

        } catch (error) {
           res.status(500).json({ message: error})
           return
        }
        
    } 
}