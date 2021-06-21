const { Schema, model } = require ( 'mongoose' );

const EventSchema = Schema ({

    title: { // title, notes, start y end, es lo que graba y luego pide el calendar
        type: String,
        required: true
    },

    notes: {
        type: String,
    },

    start: {
        type: Date,
        required: true,
    },

    end: {
        type: Date,
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId, //referencia en la base de datos
        ref: 'User',
        required: true,
    }

});

module.exports = model ( 'Event', EventSchema );