import { unlink } from "fs/promises"
import { join } from "path"

export const deleteFileOnError = async (error, req, res, next) => {
  try {
    if (req.file) {
      const filePath = join("uploads/img/courses", req.file.filename)
      await unlink(filePath)
      console.log("Archivo eliminado por error:", filePath)
    }
  } catch (unlinkErr) {
    console.error("Error deleting file", unlinkErr)
  }

  if (error.status === 400 || error.errors) {
    return res.status(400).json({
      success: false,
      message: "Error en la validación de datos",
      error
    })
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Error interno del servidor"
  })
}
