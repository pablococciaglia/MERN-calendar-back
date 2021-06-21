/*  
    Rutas de Auth 
    Host + /api/auth
*/

const { Router } = require ('express');
const router = Router();
const { createUser, revalidarToken, loginUser } = require ('../controllers/auth');
const { check } = require ('express-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { JWTvalidator } = require('../middlewares/jwt-validator');

// Ruta para la creación de usuario, con middleware para validación 
router.post('/new', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener mínimo 6 caracteres').isLength(6),
        fieldValidator,
    ],  
    createUser
)

// Ruta para renovación de JWT con middleware de validación de JWT
router.get('/renew', JWTvalidator,  revalidarToken)

// Ruta para login de usuario, con middleware para validación 
router.post('/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener mínimo 6 caracteres').isLength(6),
        fieldValidator,
    ],  
    loginUser
)

module.exports = router;