// Gestionar las imágenes
import multer, { diskStorage } from "multer"
import { dirname, extname, join } from 'path'
import { fileURLToPath } from "url"

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const MIMETYPES = ["image/jpeg", "image/png", 'image/jpg']
const MAX_SIZE = 20000000

const multerConfig = (destinationPath)=>{
    return multer(
        {
            storage: diskStorage(
                {
                    destination: (req, file, cb) => {
                        const fullPath = join(CURRENT_DIR, destinationPath)
                        req.filePath = fullPath
                        cb(null, fullPath)
                    },
                    filename: (req, file, cb) => {
                        const fileExtension = extname(file.originalname)
                        const fileName = file.originalname.split(fileExtension)[0]
                        cb(null, `${fileName}-${Date.now()}${fileExtension}`)
                    }
                }
            ),
            fileFilter: (req, file, cb) => { 
                console.log(file.mimetype)
                if (MIMETYPES.includes(file.mimetype)) {
                    cb(null, true)
                } else {
                    cb(new Error(`Solo se permiten los siguientes tipos de archivo: ${MIMETYPES.join(", ")}`))
                }
            },
            limits: { 
                fileSize: MAX_SIZE
            }
        }
    )
}

export const uploadCourseImage = multerConfig('../uploads/img/courses')