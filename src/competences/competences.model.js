import { Schema, model } from "mongoose"

const competenceSchema = Schema(
  {
    number: {
      type: number,
      required: [true, "Competence number is required"],
    },
    name: {
      type: String,
      required: [true, "Competence name is required"],
      maxLength: [100, "Can't be more than 100 characters"],
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