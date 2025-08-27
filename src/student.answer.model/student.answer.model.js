import { Schema, model } from "mongoose"

const studentAnswerSchema = Schema(
    {
        studentCourseId: {
            type: Schema.Types.ObjectId,
            ref: 'StudentCourse',
            required: [true, 'Student Course is required']
        },
        questionnaireId: {
            type: Schema.Types.ObjectId,
            ref: 'Questionnaire',
            required: [true, 'Questionnaire is required']
        },
        questionId: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: [true, 'Question is required']
        },
        type: {
            type: String,
            enum: ['CHOICE', 'OPEN'],
            required: [true, 'Question type is required']
        },
        selectedOptionId: {
            type: Schema.Types.ObjectId,
            ref: 'Option',
        },
        answerText: {
            type: String,
            default: null
        },
        isCorrect: {
            type: Boolean,
            default: null
        },
        pointsObtained: {
            type: Number,
            default: 0
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model('StudentAnswer', studentAnswerSchema)
