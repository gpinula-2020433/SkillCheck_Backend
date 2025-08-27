'use strict'
import jwt from 'jsonwebtoken'
import { findUser } from '../utils/db.validators.js'

export const validateJwt = async(req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).send(
      {
        success: false,
        message: 'Unauthorized, no token provided'
      }
    )
    
    const user = jwt.verify(token, process.env.SECRET_KEY_JWT)
    const validateUser = await findUser(user.uid)
    
    if (!validateUser) return res.status(404).send(
      {
        success: false,
        message: 'User not found, unauthorized'
      }
    )

    req.user = user
    next()
  } catch (err) {
    console.error(err)
    return res.status(401).send(
      {
        message: 'Invalid credentials'
      }
    )
  }
}

export const isAdmin = async(req, res, next) => {
  try {
    const { user } = req
    if (!user || user.role !== 'ADMIN') return res.status(403).send({
        success: false,
        message: 'Access denied, you are not an ADMIN'
    })
    next()
  } catch (err) {
    console.error('Admin role error', err)
    return res.status(403).send({
        success: false,
        message: 'Authorization error'
    })
  }
}

export const isTeacher = async(req, res, next) => {
  try {
    const {user} = req
    if(!user || user.role !== 'TEACHER') return res.status(403).send(
      {
        message: 'Access denied | Adapted for teachers only'
      }
    )
    next()
  } catch (err) {
    console.error('Teacher role error', err)
    return res.status(403).send(
      {
        message: 'Authorization error'
      }
    )
  }
}

export const isStudent = async(req,res,next)=>{
  try {
    const {user} = req
    if(!user || user.role !== 'STUDENT') return res.status(403).send(
      {
        message: 'Access denied | Adapted for students only'
      }
    )
    next()
  } catch (err) {
    console.error('Student role error', err)
    return res.status(403).send(
      {
        message: 'Authorization error'
      }
    )
  }
}

export const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).send({
          success: false,
          message: `Access denied - Required role: ${allowedRoles.join(' or ')}`
        })
      }
      next()
    } catch (err) {
      console.error(err)
      return res.status(403).send({
        success: false,
        message: 'Authorization error'
      })
    }
  }
}