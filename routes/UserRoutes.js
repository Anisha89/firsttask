const express = require('express');
const router = express.Router()

const UserController = require('../Controller/UserController')

const AircraftParameterController = require('../Controller/AircraftParameterController');
const authenticate = require('../middleware/aunthenticate');

router.post('/register',UserController.register)
router.post('/login',UserController.login)
router.post('/forgotpassword',UserController.forgot_password)
router.put('/resetpassword',UserController.reset_password)

router.get('/list',authenticate,UserController.list)

router.get('/:id',authenticate,UserController.getbyid)
router.put('/update/:id',authenticate,UserController.update)
router.delete('/delete/:id',authenticate,UserController.remove)

router.get('/parameter/list',AircraftParameterController.list)
router.post('/parameter/add',AircraftParameterController.create)
router.get('/parameter/:id',AircraftParameterController.getbyid)
router.put('/parameter/update/:id',AircraftParameterController.update)
router.delete('/parameter/delete/:id',AircraftParameterController.remove)
router.get('/parameter/search/:name',AircraftParameterController.searchbyname)
router.get('/parameter/search/:group',AircraftParameterController.searchbygroup)





module.exports = router