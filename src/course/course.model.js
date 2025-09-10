import { Schema, model } from "mongoose"

const courseSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      maxLength: [100, "Can't be more than 100 characters"],
    },
    description: {
      type: String,
      maxLength: [300, "Can't be more than 300 characters"],
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher is required"],
    },
    imageCourse:{
      type: String, 
      default: null
    },
    competences: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Competence' 
    }]
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

courseSchema.methods.toJSON = function () {
  const { __v, ...course } = this.toObject()
  return course
}

export default model("Course", courseSchema)