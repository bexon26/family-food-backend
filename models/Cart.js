import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    titleEN: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    imageUrl: String,
    userId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", CartSchema);
