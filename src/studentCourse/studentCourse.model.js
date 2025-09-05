import {Schema, model } from 'mongoose'

const studentCourseSchema = Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, 'User is required']
        },
        course: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course is required"],
        }
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