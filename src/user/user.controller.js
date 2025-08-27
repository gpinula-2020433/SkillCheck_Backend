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