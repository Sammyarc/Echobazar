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
    }, 
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date
    },
    orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
}, {timestamps: true}); // Adds createdAt, updatedAt


// Format deliveryDate when converting to JSON
orderSchema.methods.toJSON = function () {
    const order = this.toObject();  // Get the plain JS object from Mongoose doc

    // Format deliveryDate
    if (order.deliveryDate) {
        order.deliveryDate = new Date(order.deliveryDate).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Format orderDate
    if (order.orderDate) {
        order.orderDate = new Date(order.orderDate).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return order;
};



export const Order = mongoose.model('Order', orderSchema);
