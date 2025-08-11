import mongoose, { Schema, Document } from "mongoose";

export interface ILostItem extends Document {
  name: string;
  color?: string;
  brand?: string;
  uniqueId?: string;
  dateLost: Date;
  timeLost: string;
  imageUrl?: string;
  location: string;
  category?: string;
  phone: string;
  email: string;
}

const LostItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    color: { type: String },
    brand: { type: String },
    uniqueId: { type: String },
    dateLost: { type: Date, required: true },
    timeLost: { type: String, required: true },
    imageUrl: { type: String },
    location: { type: String, required: true },
    category: { type: String, default: "Bag" },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILostItem>("LostItem", LostItemSchema);
