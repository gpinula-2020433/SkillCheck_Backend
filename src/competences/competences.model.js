import { Schema, model } from "mongoose"

const competenceSchema = Schema(
  {
    number: {
      type: Number,
      required: [true, "Competence number is required"],
    },
    competenceName: {
      type: String,
      required: [true, "Competence name is required"],
      maxLength: [100, "Can't be more than 100 characters"],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

competenceSchema.methods.toJSON = function () {
  const { __v, ...competence } = this.toObject()
  return competence
}

export default model("Competence", competenceSchema)