const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const exp = require('constants');

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs)
});

test('GET all blog posts', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('Blogs have variable called id', async () => {
  const resultBlog = await api.get('/api/blogs').expect(200);
  const blog = resultBlog.body;

  expect(blog[0].id).toBeDefined();
});

test('POST is working', async () => {
  const newBlog = {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(3)
});

test('Like is zero or more', async () => {
  const resultBlog = await api.get('/api/blogs').expect(200)
  const blog = resultBlog.body[0]

  expect(blog.likes).toBeGreaterThan(0)
})

test('Like has default value of zero', async () => {
  const newBlog = {
    title: 'Post without likes',
    author: 'Developer',
    url: 'www.nolikes.com'
  }

  await api.post('/api/blogs').send(newBlog).expect(201)

  const resultBlog = await api.get('/api/blogs').expect(200)
  const blog = resultBlog.body[2]

  expect(blog.likes).toBeDefined()
})

test('Blog missing title', async () => {
  const newBlog = {
    author: "Blog Master",
    url: "wwww.blog.com"
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

test('Blog missing author', async () => {
  const newBlog = {
    title: "Missing blog",
    url: "www.blog.com"
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

afterAll(async () => {
  await mongoose.connection.close();
});