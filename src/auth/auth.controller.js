import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { generateJwt } from '../../utils/jwt.js'
import User from '../user/user.model.js'

export const register = async(req, res)=>{
    try {
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(data.password)
        await user.save()

        return res.status(201).send(
            {
                message: 'User registered successfully',
                registeredUser: user
            }
        )
    } catch (err) {
        console.error('Error registering user', err)
        return res.status(500).send(
            {
                message: 'Error registering user',
                error: err.message || err
            }
        )
    }
}


export const registerStudent = async (req, res) => {
  try {
    const data = req.body
    data.role = 'STUDENT'
    let user = new User(data)
    user.password = await encrypt(data.password)
    await user.save()

    return res.status(201).send({
      message: 'Estudiante registrado exitosamente',
      registeredUser: user
    })
  } catch (err) {
    console.error('Error al registrar estudiante', err)
    return res.status(500).send({
      message: 'Error al registrar estudiante',
      error: err.message || err
    })
  }
}

export const registerTeacher = async (req, res) => {
  try {
    const data = req.body
    data.role = 'TEACHER'
    let user = new User(data)
    user.password = await encrypt(data.password)
    await user.save()

    return res.status(201).send({
      message: 'Profesor registrado exitosamente',
      registeredUser: user
    })
  } catch (err) {
    console.error('Error al registrar profes@r', err)
    return res.status(500).send({
      message: 'Error al registrar profes@r',
      error: err.message || err
    })
  }
}

export const login = async(req,res)=>{
    try {
        let { userLogin, password} = req.body
        let user = await User.findOne({email: userLogin})
        if(user && await checkPassword(user.password, password)){
            let loggedUser = {
                uid: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role
            }
            const token = await generateJwt(loggedUser)
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 1000*60*60*24,
            }
            return res
                .cookie('token', token, cookieOptions)
                .status(200)
                .send(
                {
                    message: `Bienvenido ${user.name}`,
                    loggedUser
                }
            )
        }

        return res.status(401).send(
            {
                message: 'Credenciales no válidas'
            }
        )
    } catch (err) {
        console.error('Login error', err)
        return res.status(500).send(
            {
                message: 'Login error',
                error: err.message || err
            }
        )
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        })

        return res.status(200).send(
            {
                message: 'Cierre de sesión exitoso'
            }
        )
    } catch (err) {
        console.error('Logout error', err)
        return res.status(500).send(
            {
                message: 'Logout error',
                error: err.message || err
            }
        )
    }
}

export const test = (req, res)=>{
    console.log('Test is running')
    res.send({message: 'Test is running'})
}