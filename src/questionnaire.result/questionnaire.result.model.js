import { Schema, model } from "mongoose"

const questionnaireResultSchema = Schema(
  {
    studentCourseId: {
      type: Schema.Types.ObjectId,
      ref: "StudentCourse",
      required: [true, "Student Course is required"]
    },
    questionnaireId: {
      type: Schema.Types.ObjectId,
      ref: "Questionnaire",
      required: [true, "Questionnaire is required"]
    },
    totalQuestions: {
      type: Number,
      required: [true, "Total questions are required"],
      min: [1, "Must be at least 1 question"]
    },
    correctAnswers: {
      type: Number,
      required: [true, "Correct answers are required"],
      min: [0, "Can't be less than 0"]
    },
    wrongAnswers: {
      type: Number,
      required: [true, "Wrong answers are required"],
      min: [0, "Can't be less than 0"]
    },
    percentage: {
      type: Number,
      required: [true, "Percentage is required"],
      min: [0, "Can't be less than 0"],
      max: [100, "Can't be more than 100"]
    },
    status: {
      type: String,
      enum: ["Passed", "Failed"],
      required: [true, "Status is required"]
    },
    completionDate: {
      type: Date,
      default: Date.now,
      required: [true, "Completion date is required"]
    },
    competencies: [
      {
        competencyId: { type: Schema.Types.ObjectId, ref: "Competence", required: true },
        competencyNumber: {type: Number, required: true}, 
        competencyName: { type: String, required: true },
        totalQuestionsInCompetency: { type: Number, required: true },
        correctAnswers: { type: Number, required: true },
        wrongAnswers: { type: Number, required: true },
        percentage: { type: Number, required: true }
      }
    ],
    maxGrade: {
      type: Number,
      required: [true, 'Maximum grade is required']
    },
    passingGrade: {
      type: Number,
      required: [true, 'Passing grade is required']
    },
    maxAllowedGrade: {
      type: Number,
      required: [true, 'Maximum allowed grade is required']
    },
    weightOverMaxGrade: {
      type: Number,
      required: [true, 'Weight over max grade is required']
    },
    scoreOverMaxGrade: {
      type: Number,
      required: true
    },
    scoreOverAllowedGrade: {
      type: Number,
      required: true
    },
    approvalStatus: {
      type: String,
      enum: ["Passed", "Failed"],
      required: true
    },
    weightedScore: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

questionnaireResultSchema.methods.toJSON = function () {
  const { __v, ...result } = this.toObject()
  return result
}

export default model("QuestionnaireResult", questionnaireResultSchema)
