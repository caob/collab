import mongoose, { Document, Schema } from 'mongoose';

export interface IDrawing extends Document {
  paths: Array<{brush: string, color: number, points: number[]}>;
  mode: string,
  votes: number,
  owner: string
}

const PathSchema = new mongoose.Schema({
  brush: String,
  color: Number,
  points: [Number]
}, {
  _id: false
});

const Drawing: Schema = new Schema<IDrawing>({
  paths: [PathSchema],
  mode: String,
  votes: Number,
  owner: String,
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model<IDrawing>('Drawing', Drawing);
