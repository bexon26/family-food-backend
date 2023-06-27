import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
    },
    dishes: [
      
    ],
    totalPrice:{type:Number}
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", CartSchema);
