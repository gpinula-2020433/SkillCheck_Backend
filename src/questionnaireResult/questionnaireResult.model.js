  import { Schema, model } from "mongoose"

  const questionnaireResultSchema = Schema(
    
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
      },
      competeceName: {
        type: Schema.Types.ObjectId,
        ref: 'Competence'
      },
      totalQuestions: {
        type: Number,
        required: [true, "Total questions are required"],
        min: [1, "Must be at least 1 question"],
      },
      correctAnswers: {
        type: Number,
        required: [true, "Correct answers are required"],
        min: [0, "Can't be less than 0"],
      },
      wrongAnswers: {
        type: Number,
        required: [true, "Wrong answers are required"],
        min: [0, "Can't be less than 0"],
      },
      percentage: {
        type: Number,
        required: [true, "Percentage is required"],
        min: [0, "Can't be less than 0"],
        max: [100, "Can't be more than 100"],
      },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  )

  questionnaireResultSchema.methods.toJSON = function () {
    const { __v, ...result } = this.toObject()
    return result
  }

  export default model("QuestionnaireResult", questionnaireResultSchema)