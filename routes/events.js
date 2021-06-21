/*  
    Rutas de Events 
    Host + /api/events
*/

const { Router } = require ('express');
const router = Router();
const { JWTvalidator } = require("../middlewares/jwt-validator")
const { getEvents, createEvent, updateEvent, deleteEvent } = require ('../controllers/events');
const { check } = require ('express-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { isDate } = require('../helpers/isDate');

// Obtener eventos 
router.get(
    '/', 
    JWTvalidator, 
    getEvents
)

// Crear nuevo evento
router.post(
    '/', 
    JWTvalidator, 
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalización es obligatoria').custom( isDate ),
        fieldValidator,
    ], 
    createEvent)

// Actualizar evento
router.put('/:id', JWTvalidator, updateEvent)

// Eliminar evento
router.delete('/:id', JWTvalidator, deleteEvent)

module.exports = router;