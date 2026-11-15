import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    imageUrl: { type: String, required: true, trim: true },
    stock: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Stock must be an integer.",
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Product =
  mongoose.models.Product ?? mongoose.model("Product", productSchema);

export default Product;
