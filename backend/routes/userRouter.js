const router = require('express').Router()
const UserController = require('../controllers/UserController')

//middleware
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

//Rotas
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)

router.post('/register', UserController.register)
router.post('/login', UserController.login)


//Rota de atualização
router.patch(
    '/edit/:id', 
    verifyToken,
    imageUpload.single('image'),
    UserController.editUser
) 


module.exports = router

