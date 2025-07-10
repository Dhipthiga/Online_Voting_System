const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect('mongodb+srv://dhipthiga123:dhipthi4525@voting.galtyno.mongodb.net/?retryWrites=true&w=majority&appName=Voting', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: 'user' }
}));

// Poll Model
const Poll = mongoose.model('Poll', new mongoose.Schema({
  question: String,
  options: [{ text: String, votes: Number }],
  createdBy: String
}));

// Vote Model
const Vote = mongoose.model('Vote', new mongoose.Schema({
  userId: String,
  pollId: String
}));

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ msg: 'Invalid token' });
  }
}

// Register
app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).json({ msg: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashed, role });
  await newUser.save();
  res.json({ msg: 'Registered successfully' });
});

// Login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey');
  res.json({ token, role: user.role });
});

// Create Poll (admin only)
app.post('/polls', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  const { question, options } = req.body;
  const newPoll = new Poll({
    question,
    options: options.map(opt => ({ text: opt, votes: 0 })),
    createdBy: req.user.id
  });
  await newPoll.save();
  res.json(newPoll);
});

// Get all polls
app.get('/polls', async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
});

// Vote on poll (user only, once)
app.post('/vote', authMiddleware, async (req, res) => {
  const { pollId, optionIndex } = req.body;
  const alreadyVoted = await Vote.findOne({ userId: req.user.id, pollId });
  if (alreadyVoted) return res.status(400).json({ msg: 'You already voted' });

  const poll = await Poll.findById(pollId);
  poll.options[optionIndex].votes += 1;
  await poll.save();

  const vote = new Vote({ userId: req.user.id, pollId });
  await vote.save();

  res.json({ msg: 'Vote recorded' });
});

// Run server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
