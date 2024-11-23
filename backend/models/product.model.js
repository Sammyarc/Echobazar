import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    salePrice: Number,
    quantity: { type: Number, required: true, default: 0 },
    productSummary: String,
    description: String,
    benefits: [String],
    additionalDescription: String,
    categories: [String],
    images: [String], // URLs from Cloudinary
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
},
{ timestamps: true }
);

export const Product = mongoose.model('Product', productSchema);
