const Pet = require('../models/Pet')

//helpers
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

module.exports = class Petcontroller {

    //create a pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body

        const images = req.files               // As imagens vem por files e não pelo body.

        const available = true

        //images upload

        //validations
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        }

        if(!age) {
            res.status(422).json({message: 'A idade é obrigatório!'})
            return
        }

        if(!weight) {
            res.status(422).json({message: 'O peso é obrigatório!'})
            return
        }

        if(!color) {
            res.status(422).json({message: 'A cor é obrigatório!'})
            return
        }

        // As images vem como array.
        // console.log(images) --> Está chegando um array vazio
        if(images.length === 0 ) {
            res.status(422).json({message: 'A imagem é obrigatória!'})
            return
        }


        //get pet owner
        const token = getToken(req)
        const user = await getUserByToken(token)

        console.log(user)

        //create a pet
        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            }
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })

        try {

            const newPet = await pet.save()
            res.status(201).json({
                message: 'Pet cadastrado com sucesso!',
                newPet,
        
            })

            return
            
        } catch (error) {
            res.status(500).json({message: error})
        }
    }

    //viewing the pets
    static async getAll(req, res) {

        //O método sort('-createdAt') ordena do mais recente p/ o mais antigo.
        // O createdAt está no BD por que definir no models timestamps: true.
        const pets = await Pet.find().sort('-createdAt')

        res.status(200).json({
            pets: pets,
        })
    }

    //Pets registered by the user
    static async getAllUserPets(req, res) {
        
        //get uer from token
        const token = getToken(req)
        const user =  await getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        res.status(200).json({
            pets,
        })

    }

    //Pets adopted by the user
    static async getAllUserAdoptions(req, res) {

          //get uer from token
          const token = getToken(req)
          const user =  await getUserByToken(token)
  
          const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')
  
          res.status(200).json({
              pets,
          })
    }

    //Get pet by Id
    static async getPetById(req, res) {
        const id = req.params.id

        if(!ObjectId.isValid(id)){
            res.status(422).json({message: 'ID inválodo!'})
            return
        }

        //check if pet exixts
        const pet = await Pet.findOne({ _id: id})

        if(!pet){
            res.status(404).json({message: 'Pet não encontrado!'})
        }

        res.status(200).json({
            pet,
        })
    }

    //Remove pet by Id
    static async removePetById(req, res){
        const id = req.params.id

        //check id is valid
        if(!ObjectId.isValid(id)){
            res.status(422).json({message:'ID inválido!'})
            return
        }

        //check if pet exists
        const pet = await Pet.findOne({ _id: id})

        if(!pet){
            res.status(404).json({message: 'Pet não encontrado!'})
            return
        }

        //check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() !== user.id.toString()) {
            res.status(422).json({
                message: 'Houve um problema com sua solicitação, tente novamente mais tarde!'
            })

            return
        }

        await Pet.findByIdAndRemove(id)
        
        res.status(200).json({message: 'Pet removido com sucesso!'}) 

    }

    //updating a pet
    static async updatePet(req, res) {
        const id = req.params.id

        const { name, age, weight, color, available } = req.body

        const images = req.files

        const updatedData = {}

        //check if pet exixts
        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado!'})
        }

        //check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        // console.log('token:',token)
        // console.log('user:',user)

        //  console.log('pet.user._id.toString():', pet.user._id.toString())
        //  console.log('de quem é o dono desse pet?:', pet.user.name)

        //  console.log('Qual o usuário altenticado?:', user.name) 

        if(pet.user._id.toString() != user._id.toString()) {
            res.status(422).json({
                message: 'Houve um problema com sua solicitação, tente novamente mais tarde!'
            })

            return
        }

        //Validations
        if(!name) {
            res.status(422).json({message: 'O nome é obrigatório!'})
            return
        } else {
            updatedData.name = name
        }

        if(!age) {
            res.status(422).json({message: 'A idade é obrigatório!'})
            return
        } else {
            updatedData.age = age
        }

        if(!weight) {
            res.status(422).json({message: 'O peso é obrigatório!'})
            return
        } else {
            updatedData.weight = weight
        }

        console.log(color)

        if(!color) {
            res.status(422).json({message: 'A cor é obrigatório!'})
            return

        } else {
            updatedData.color = color
        }

        if(images.length === 0) {
            res.status(422).json({message: 'A imagem é obrigatório!'})
            return
        } else {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }


        await Pet.findByIdAndUpdate(id, updatedData)

        res.status(200).json({message: 'Pet atualizado com sucesso!'}) 

    }

    //schedule
    static async schedule(req, res) {
        const id = req.params.id

        //check if pet exists
        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({
                message: 'Pet não encontrado!'
            })
            return  
        }

        //check if user register the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.equals(user._id)) {
            res.status(422).json({
                message: 'Você não pode agendar uma visita para o seu próprio pet!'
            })
            return
        }

        //check if user has already schedule a visit
        if(pet.adopter) {
            if(pet.adopter._id.equals(user._id)){
                res.status(422).json({
                    message: 'Você já agendou uma visita para esse pet!'
                })

                return
            }
        }

        //add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}`,
        })
    }

    static async concludeAdoption(req, res) {
        const id = req.params.id

        //check if exists pet
        const pet = await Pet.findOne({_id: id})

        if(!pet) {
            res.status(404).json({message: 'Pet não encontrado!'})
            return
        }

        //check if logged in user registered the pet
        const token = getToken(req)
        const user = await getUserByToken(token)

        if(pet.user._id.toString() != user._id.toString()) {
            res.status(422).json({
                message: 'Houve um problema com sua solicitação, tente novamente mais tarde!'
            })

            return
        }

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        res.status(200).json({
            message:'Parabéns, O ciclo de adoção foi finalizado com sucesso!'
        })
    }
    
}