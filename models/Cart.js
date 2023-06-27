import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    dishes: [
      {
        title: {
          // unique: false,
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
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", CartSchema);
