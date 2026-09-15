import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema(
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
        todo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Todo",
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const SubTodo = mongoose.model("SubTodo", subTodoSchema);