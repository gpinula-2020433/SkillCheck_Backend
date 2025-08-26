import { Schema, model } from "mongoose"

const studentAnswerSchema = Schema(
    {
        studentEnrollmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Enrollment',
            required: [true, 'Student Enrollment is required']
        },
        questionId: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: [true, 'Question is required']
        },
        selectedOptionId: {
            type: Schema.Types.ObjectId,
            ref: 'Option',
            required: [true, 'Selected option is required']
        },
        isCorrect: {
            type: Boolean,
            required: [true, 'Correct answer flag is required']
        },
        pointsObtained: {
            type: Number,
            required: [true, 'Points obtained are required']
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model('StudentAnswer', studentAnswerSchema)
