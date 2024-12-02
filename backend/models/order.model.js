import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
      trackingId: {
        type: String,
        required: true
    },
    user: {
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String
        }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    orderItems: [
        { // Array of products
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            salePrice: {
                type: Number,
                required: true
            }
        }
    ],
    paymentReference: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true
    }, // e.g., 'successful'
    orderDate: {
        type: Date,
        default: Date.now
    }, // Auto-set order date
    paymentDate: {
        type: Date
      }
}, {timestamps: true}); // Adds createdAt, updatedAt

export const Order = mongoose.model('Order', orderSchema);
