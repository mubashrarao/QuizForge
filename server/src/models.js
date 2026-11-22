import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export const User = model('User', new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
}, { timestamps: true }));

export const Quiz = model('Quiz', new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  durationMinutes: { type: Number, min: 1, default: 10 },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  questions: [{
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
  }],
}, { timestamps: true }));

export const Attempt = model('Attempt', new Schema({
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  score: Number,
  total: Number,
  timeTakenSec: Number,
  answers: [Number],
}, { timestamps: true }));
