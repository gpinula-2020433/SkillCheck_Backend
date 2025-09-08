import User from './user.model.js'
import { encrypt } from '../../utils/encrypt.js'


export const defaultAdmin = async () => {
    try {
        let adminUser = await User.findOne(
            {name: process.env.ADMIN_NAME},
            {email: process.env.ADMIN_EMAIL}
        )
        if (!adminUser){
            const data = {
                name: process.env.ADMIN_NAME,
                surname: process.env.ADMIN_SURNAME,
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: process.env.ADMIN_ROLE
            }
            let adminUser = new User(data)
            adminUser.password = await encrypt(adminUser.password)
            await adminUser.save()
            console.log('Default admin user created')
        }else{
            console.log('Default admin user already exists')
        }
    } catch (err) {
        console.error('Error creating default admin user', err)
    }
}

export const getAllUsers = async (req, res) => {
    let { limit = 10, skip = 0 } = req.query
    limit = parseInt(limit)
    skip = parseInt(skip)
    
    try {
       const users = await User.find()
            .limit(limit).skip(skip)


        if (users.length === 0){
            return res.status(204).send(
                {
                    message: 'No hay usuarios registrados'
                }
            )
        }

        return res.status(200).send(
            {
                message: 'Usuarios obtenidos con éxito',
                total: users.length,
                data: users
            }
        )
    } catch (err) {
        console.error('Error al obtener cuestionarios:', err)
        return res.status(500).send(
        {
            message: 'Error interno del servidor',
            error: err.message || err
        }
        )
    }
}

export const getAuthenticatedUser = async(req, res)=>{
    const {uid} = req.user
    try {
        const user = await User.findById(uid)

        if(!user){
            res.status(204).send(
                {
                    message: 'User not found'
                }
            )
        }

        return res.status(200).send(
            {
                message: 'Usuario encontrado',
                user
            }
        )
    } catch (err) {
        console.error('Error al obtener cuestionarios:', err)
        return res.status(500).send(
            {
                message: 'Error interno del servidor',
                error: err.message || err
            }
        )
    }
} 