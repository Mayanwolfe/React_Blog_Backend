const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to DB!'))
.catch(error => {
  console.error('Error connecting to DB:', error.message);
  process.exit(1);
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String, required: true },
  content: { type: String, required: true }
});

const Post = mongoose.model('Post', postSchema);

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching posts' });
  }
});

app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ error: 'Post not found' });
    }
    res.send(post);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching the post' });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).send(savedPost);
  } catch (error) {
    res.status(500).send({ error: 'Error creating a new post' });
  }
});

app.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).send('Post deleted');
  } catch (error) {
    res.status(500).send({ error: 'Error deleting the post' });
  }
});

app.listen(port, () => console.log(`Server started on port ${port}`));
