import mongoose, { Schema, Document } from "mongoose";

export interface IFoundItem extends Document {
  name: string;
  color?: string;
  brand?: string;
  uniqueId?: string;
  dateFound: Date;
  imageUrl?: string;
  location: string;
  category?: string;
  phone: string;
  email: string;
}

const FoundItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    color: { type: String },
    brand: { type: String },
    uniqueId: { type: String },
    dateFound: { type: Date, required: true },
    imageUrl: { type: String },
    location: { type: String, required: true },
    category: { type: String, default: "Bag" },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFoundItem>("FoundItem", FoundItemSchema);
