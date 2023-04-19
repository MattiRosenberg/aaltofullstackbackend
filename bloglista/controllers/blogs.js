const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.status(200).json(blogs);
});

blogRouter.post('/', async (request, response) => {
  const body = request.body;

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
  });

  const result = await blog.save();

  response.status(201).json(result);
});

blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
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
