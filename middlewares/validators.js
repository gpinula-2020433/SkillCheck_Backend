import { body } from "express-validator";
import { param } from "express-validator";
import { isValidObjectId } from 'mongoose'
import { validateErrors } from "./validate.errors.js";
import { existEmail, notRequiredField, } from "../utils/db.validators.js";

export const userRegistrationValidator = [
    body('name', 'El nombre no puede estar vacío')
        .notEmpty(),
    body('surname', 'El apellido no puede estar vacío')
        .notEmpty(),
    body('email', 'El correo electrónico no puede estar vacío')
        .notEmpty()
        .isEmail()
        .withMessage('El correo electrónico no es válido')
        .custom(existEmail),
    body('password', 'La contraseña no puede estar vacía')
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .isStrongPassword()
        .withMessage('La contraseña debe ser más fuerte, debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.'),
    body('role', 'El rol no puede estar vacío')
        .notEmpty()
        .customSanitizer(value => value.trim().toUpperCase())
        .isIn(['ADMIN', 'TEACHER', 'STUDENT'])
        .withMessage('El rol debe ser ADMIN, TEACHER o STUDENT'),
    validateErrors
]

export const userLoginValidator = [
    body('userLogin', 'El correo electrónico o usuario no puede estar vacío')
        .notEmpty(),
    body('password', 'La contraseña no puede estar vacía')
        .notEmpty(),
    validateErrors
]
