const { response } = require ('express');
const User = require ('../models/User')
const bcrypt = require('bcryptjs');
const { JWTgenerator } = require('../helpers/jwt');

const createUser = async ( req, res = response ) => {

    // Desestructuracion de los datos que llegan de la request del usuario
    const { email, password} = req.body;
    
    try {

        // Corroborar existencia del email dentro de DB 
        let user = await User.findOne ( { email } )

        if ( user ) {

            return res.status(400).json({
                ok:false,
                msg: 'Ya existe un usuario con ese correo electrónico'
            });
        }
        
        user = new User ( req.body )

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync( 10 );
        user.password = bcrypt.hashSync ( password, salt );
    
        await user.save();

        // Generar JWT
        const token = await JWTgenerator ( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de conexión al servidor'
        })

    }

}

const revalidarToken = async ( req, res = response ) => {
    
    const { uid, name } = req;

    // Generación de un nuevo JWT
    const token = await JWTgenerator ( uid, name );

    res.json({
        ok: true,
        token
    })
    
}

const loginUser = async ( req, res = response ) => {

    const {email, password} = req.body;

    try {
        
        // Corroborar existencia del email dentro de DB 
        const user = await User.findOne ( { email } )

        if ( !user ) {

            return res.status(400).json({
                ok:false,
                msg: 'El correo o la contraseña no son correctos'
            });
        }

        // Confirmar el password
        const validPassword = bcrypt.compareSync(password, user.password); // compara el password de request con el de la base de datos
        if ( !validPassword ){
            return res.status(400).json ({
                ok: false,
                msg:  'El correo o la contraseña no son correctos'
            })
        }

        // Generar JWT
        const token = await JWTgenerator ( user.id, user.name );
        
        res.json({
            ok: true,
            uid: user.id, 
            name: user.name,
            token
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
    createUser,
    revalidarToken,
    loginUser
}