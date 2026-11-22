import 'dotenv/config';
import mongoose from 'mongoose';
import { Quiz } from './models.js';

await mongoose.connect(process.env.MONGO_URI);
await Quiz.create({
  title: 'JavaScript Basics', category: 'Programming', durationMinutes: 5,
  description: 'Check your core JavaScript knowledge.',
  questions: [
    { text: 'Which keyword declares a block-scoped variable?', options: ['var', 'let', 'define', 'int'], correctIndex: 1 },
    { text: 'What does JSON stand for?', options: ['JavaScript Object Notation', 'Java Standard Object Name', 'JavaScript Online Network', 'Joined Script Object Node'], correctIndex: 0 },
    { text: 'Which method adds an item to the end of an array?', options: ['shift()', 'pop()', 'push()', 'unshift()'], correctIndex: 2 },
  ],
});
console.log('Sample quiz added');
await mongoose.disconnect();
