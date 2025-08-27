import {Schema, model } from 'mongoose'

const studentCourseSchema = Schema(
    {
        name: {
            type: String,
            required: [true, 'Course name is required'],
            maxLength: [100, `Can't be more than 80 characters`]
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course is required"],
        },
        questionnaires: [{
            type: Schema.Types.ObjectId,
            ref: 'Questionnaire'
        }]
    },
    {
        versionKey: false,
        timestamps: true
    }
)

studentCourseSchema.methods.toJSON = function(){
    const { __v, ...course } = this.toObject()
    return course
}

export default model('StudentCourse', studentCourseSchema)