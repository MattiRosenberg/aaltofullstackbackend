const blogRouter = require('express').Router();
const { response } = require('../app');
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.status(200).json(blogs);
});

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user

 if (body.title === undefined) {
    response.status(400).send({ error: 'Title is missing' });
    return;
  } else if (body.author === undefined) {
    response.status(400).send({ error: 'Author missing' });
    return;
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id,
  });

  const result = await blog.save();
  response.status(201).json(result);
});

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== user.id) {
    return response
      .status(403)
      .json({ error: 'cannot delete other persons blogs' });
  }

  Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogRouter.patch('/:id', async (request, response) => {
  const newBlog = {
    likes: request.body.likes || 0,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, {
    new: true,
  });

  response.status(200).json(updatedBlog);
});

module.exports = blogRouter;
