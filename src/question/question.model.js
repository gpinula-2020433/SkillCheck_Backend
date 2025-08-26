import { Schema, model } from "mongoose"

const questionSchema = Schema(
    {
        questionId: {
            type: String,
            required: [true, 'Question ID is required'],
            unique: true
        },
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
        points: {
            type: Number,
            required: [true, 'Points are required']
        },
        options: [{
            optionId: {
                type: String,
                required: [true, 'Option ID is required']
            },
            text: {
                type: String,
                required: [true, 'Option text is required'],
                maxLength: [300, `Can't be more than 300 characters`]
            },
            isCorrect: {
                type: Boolean,
                required: [true, 'Is Correct flag is required']
            }
        }]
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model('Question', questionSchema)
