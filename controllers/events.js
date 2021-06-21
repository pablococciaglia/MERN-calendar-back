const { response } = require("express");
const Event = require ('../models/Event')

const getEvents = async ( req, res = response ) => {

    try {
        
        const events = await Event.find().populate('user', 'name');

        res.json({
            ok: true,
            events
        })
    
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de conexión al servidor'
        })

    }

}

const createEvent = async ( req, res = response ) => {
    const event = new Event ( req.body );

    try {

        event.user = req.uid;

        const savedEvent = await event.save()

        res.json({
            ok: true,
            msg: savedEvent
        })
    
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de conexión al servidor'
        })

    }

}

const updateEvent = async ( req, res = response ) => {

    try {
        const eventId = req.params.id; //asi traemos lo que figure en la url 

        if ( (eventId.length < 24) || (eventId.length > 24) ) {
            return res.status(404).json({
                ok:false,
                msg: "El evento no existe en la base de datos"
            })
        }
        
        uid = req.uid;

        const event = await Event.findById( eventId )

        if ( !event ) {
            return res.status(404).json({
                ok:false,
                msg: "El evento no existe en la base de datos"
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok:false,
                msg: "Solo el usuario que crea el evento lo puede editar"
            })
        }

        const newEvent = {
            ...req.body,
            user:uid
        }

        const eventUpdated = await Event.findByIdAndUpdate ( eventId, newEvent, { new: true } )

        res.json({

            ok: true,
            eventUpdated
        })
    
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de conexión al servidor'
        })

    }

}

const deleteEvent = async ( req, res = response ) => {

    try {

        const eventId = req.params.id; // Así traemos lo que figure en la url 
        
        if ( (eventId.length < 24) || (eventId.length > 24) ) {
            return res.status(404).json({
                ok:false,
                msg: "El evento no existe en la base de datos"
            })
        }

        const uid = req.uid; // Guardamos el id de la persona que hace la request para comparar si es la misma que lo creo

        const event = await Event.findById( eventId ) 

        if ( !event ) {
            return res.status(404).json({
                ok:false,
                msg: "El evento no existe en la base de datos"
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok:false,
                msg: "Solo el usuario que crea el evento lo puede eliminar"
            })
        }

        await Event.findByIdAndRemove ( eventId )

        res.json({
            ok: true,
            msg: 'Event deleted'
        })
    
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de conexión al servidor'
        })

    }

}


module.exports = 
{
    getEvents, 
    createEvent, 
    updateEvent, 
    deleteEvent
}