import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image1: {
      type: String,
      required: true,
    },
    image2: {
      type: String,
      required: true,
    },
    image3: {
      type: String,
      required: true,
    },
    image4: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      enum: ["Gold", "Silver", "Platinum", "Gemstone"],
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },

    // 🆕 Added field for Product Type
    productType: {
      type: String,
      enum: [
        "Necklaces",
        "Rings",
        "Bangles",
        "Bracelets",
        "Anklets",
        "Ear Rings",
        "Pendants",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
