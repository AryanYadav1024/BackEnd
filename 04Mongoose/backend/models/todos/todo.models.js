import mongoose from "mongoose";

const todoSchema = new mongoose(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        complete: {
            type: Boolean,
            default: false
        },
        // now we have to relate it to user now user will own todos 
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)

export const Todo = mongoose.model('Todo',todoSchema)
// collection name in mongoDb will be todos pluralized and lowercase