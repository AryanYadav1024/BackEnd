import mongoose from "mongoose"
// mini models
const orderItemSchema = new mongoose(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        }
    }
)

const orderSchema = new mongoose(
    {
        orderPrice: {
            type: Number,
            required: true
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        orderItems: {
            type: [orderItemSchema]
        },
        address: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["PENDING","CANCELLED","DELIVERED"], // restriction of choice 
            default: "PENDING"
        }
    },
    {
        timestamps: true
    }
)

export const Order = mongoose.model('Order',orderSchema)