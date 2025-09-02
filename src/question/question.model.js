import { Schema, model } from "mongoose"

const questionSchema = Schema(
    {
        questionnaireId: {
            type: Schema.Types.ObjectId,
            ref: 'Questionnaire',
            required: [true, 'Questionnaire is required']
        },
        statement: {
            type: String,
            required: [true, 'Statement is required'],
            maxLength: [500, `Can't be more than 500 characters`]
        },
        competencyId: {
            type: Schema.Types.ObjectId,
            ref: 'Competency',
            required: [true, 'Competency is required']
        },
        type: {
            type: String,
            enum: ['CHOICE', 'OPEN'],
            required: [true, 'Question type is required']
        },
        options: [
            {
                text: {
                    type: String,
                    maxLength: [300, `Can't be more than 300 characters`]
                },
                isCorrect: {
                    type: Boolean,
                    default: false
                }
            }
        ],
        correctAnswer: {
            type: String,
            maxLength: [300, `Can't be more than 300 characters`]
        },
        points: {
            type: Number,
            required: [true, 'Points are required'],
            min: [0, 'Points must be at least 0']
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model('Question', questionSchema)
