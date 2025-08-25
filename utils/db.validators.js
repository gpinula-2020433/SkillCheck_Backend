import { isValidObjectId } from 'mongoose'
import User from '../src/user/user.model.js'

export const existUsername = async (username, user) => {
  const alreadyUsername = await User.findOne({ username })
  if (alreadyUsername && alreadyUsername._id != user.uid) {
    console.error(`El nombre de usuario ${username} ya existe`)
    throw new Error(`El nombre de usuario ${username} ya existe`)
  }
}

export const existEmail = async (email, user) => {
  const alreadyEmail = await User.findOne({ email })
  if (alreadyEmail && alreadyEmail._id != user.uid) {
    console.error(`El correo electrónico ${email} ya existe`)
    throw new Error(`El correo electrónico ${email} ya existe`)
  }
}

export const notRequiredField = (field) => {
  if (field) {
    throw new Error(`${field} no es requerido`)
  }
}

export const findUser = async (id) => {
  try {
    const userExist = await User.findById(id)
    if (!userExist) return false
    return userExist
  } catch (err) {
    console.error(err)
    return false
  }
}

export const objectIdValid = (objectId) => {
  if (!isValidObjectId(objectId)) {
    throw new Error(`El valor del campo no es un ObjectId válido`)
  }
}
