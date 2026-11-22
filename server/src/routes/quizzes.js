import { Router } from 'express';
import { Quiz, Attempt, User } from '../models.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect);

// List all quizzes (no questions)
router.get('/', async (_req, res, next) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes.map((q) => ({
      id: q._id, title: q.title, description: q.description, category: q.category,
      durationMinutes: q.durationMinutes, questionCount: q.questions.length,
    })));
  } catch (e) { next(e); }
});

// My attempt history
router.get('/me/attempts', async (req, res, next) => {
  try {
    const list = await Attempt.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20).populate('quiz', 'title');
    res.json(list.map((a) => ({
      id: a._id, quiz: a.quiz?.title || 'Deleted quiz', score: a.score, total: a.total,
      timeTakenSec: a.timeTakenSec, date: a.createdAt,
    })));
  } catch (e) { next(e); }
});

// Admin dashboard numbers
router.get('/admin/stats', adminOnly, async (_req, res, next) => {
  try {
    const [users, quizzes, attempts, avg] = await Promise.all([
      User.countDocuments(), Quiz.countDocuments(), Attempt.countDocuments(),
      Attempt.aggregate([{ $group: { _id: null, avg: { $avg: { $multiply: [{ $divide: ['$score', '$total'] }, 100] } } } }]),
    ]);
    res.json({ users, quizzes, attempts, averagePercent: Math.round(avg[0]?.avg || 0) });
  } catch (e) { next(e); }
});

// Create quiz (admin)
router.post('/', adminOnly, async (req, res, next) => {
  try {
    const { title, description, category, durationMinutes, questions } = req.body;
    const valid = Array.isArray(questions) && questions.length > 0 && questions.every((q) =>
      q.text && Array.isArray(q.options) && q.options.length >= 2 && q.options.every(Boolean) &&
      Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < q.options.length);
    if (!title || !valid) return res.status(400).json({ message: 'Add a title and at least one complete question' });
    const quiz = await Quiz.create({ title, description, category, durationMinutes, questions, createdBy: req.user._id });
    res.status(201).json({ id: quiz._id });
  } catch (e) { next(e); }
});

// Get quiz to play (correct answers hidden)
router.get('/:id', async (req, res, next) => {
  try {
    const q = await Quiz.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Quiz not found' });
    res.json({
      id: q._id, title: q.title, description: q.description, durationMinutes: q.durationMinutes,
      questions: q.questions.map((x) => ({ text: x.text, options: x.options })),
    });
  } catch (e) { next(e); }
});

// Submit attempt: scoring happens on the server
router.post('/:id/attempt', async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    const { answers = [], timeTakenSec = 0 } = req.body;
    if (timeTakenSec > quiz.durationMinutes * 60 + 15)
      return res.status(400).json({ message: 'Time limit exceeded' });
    const review = quiz.questions.map((q, i) => ({
      text: q.text, options: q.options, correctIndex: q.correctIndex, yourIndex: answers[i] ?? -1,
    }));
    const score = review.filter((r) => r.yourIndex === r.correctIndex).length;
    await Attempt.create({
      quiz: quiz._id, user: req.user._id, score, total: review.length,
      timeTakenSec, answers: review.map((r) => r.yourIndex),
    });
    res.json({ score, total: review.length, review });
  } catch (e) { next(e); }
});

// Leaderboard: best attempt per user
router.get('/:id/leaderboard', async (req, res, next) => {
  try {
    const all = await Attempt.find({ quiz: req.params.id })
      .sort({ score: -1, timeTakenSec: 1 }).limit(200).populate('user', 'name');
    const seen = new Set();
    const board = [];
    for (const a of all) {
      const key = String(a.user?._id);
      if (seen.has(key)) continue;
      seen.add(key);
      board.push({ name: a.user?.name || 'Unknown', score: a.score, total: a.total, timeTakenSec: a.timeTakenSec });
      if (board.length === 10) break;
    }
    res.json(board);
  } catch (e) { next(e); }
});

// Delete quiz (admin)
router.delete('/:id', adminOnly, async (req, res, next) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    await Attempt.deleteMany({ quiz: req.params.id });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
