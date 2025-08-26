import { Schema, model } from "mongoose"

const questionnaireSchema = Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            maxLength: [200, `Can't be more than 200 characters`]
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxLength: [500, `Can't be more than 500 characters`]
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required']
        },
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
            required: [true, 'Weight over maximum grade is required']
        },
        deadline: {
            type: Date,
            required: [true, 'Deadline is required']
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
)

export default model('Questionnaire', questionnaireSchema)
