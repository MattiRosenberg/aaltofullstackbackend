const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const { describe } = require('yargs');

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '64424f8ad641bd177fed56c6',
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '64424f8ad641bd177fed56c6',
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test('GET all blog posts', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('POST is working', async () => {
  const newBlog = {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  };

  const tempUser = {
    username: 'matti',
    password: 'rosenberg',
  };

  const loginResponse = await api.post('/api/login').send(tempUser);

  await api
    .post('/api/blogs')
    .set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hdHRpIiwiaWQiOiI2NDQyNGY4YWQ2NDFiZDE3N2ZlZDU2YzYiLCJpYXQiOjE2ODIzMjgyNDB9.z1PwsaV-FXkMyyZZ4-JT8rCt2hreBquSm0KbS3HKnFI'
    )
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(3);
});

test('DELETE blog', async () => {
  const blog = (await api.get('/api/blogs')).body[0];

  await api
    .delete(`/api/blogs/${blog.id}`)
    .set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hdHRpIiwiaWQiOiI2NDQyNGY4YWQ2NDFiZDE3N2ZlZDU2YzYiLCJpYXQiOjE2ODIzMjgyNDB9.z1PwsaV-FXkMyyZZ4-JT8rCt2hreBquSm0KbS3HKnFI'
    )
    .expect(204);
});

test('PATCH blog likes', async () => {
  const blog = (await api.get('/api/blogs')).body[0];
  blog.likes = blog.likes + 1;

  const response = await api
    .patch(`/api/blogs/${blog.id}`)
    .send(blog)
    .expect(200);

  expect(response.body.likes).toBe(blog.likes);
});

test('Blogs have variable called id', async () => {
  const resultBlog = await api.get('/api/blogs').expect(200);
  const blog = resultBlog.body;

  expect(blog[0].id).toBeDefined();
});

test('Like is zero or more', async () => {
  const resultBlog = await api.get('/api/blogs').expect(200);
  const blog = resultBlog.body[0];

  expect(blog.likes).toBeGreaterThan(0);
});

test('Like has default value of zero', async () => {
  const newBlog = {
    title: 'Post without likes',
    author: 'Developer',
    url: 'www.nolikes.com',
  };

  await api
    .post('/api/blogs')
    .set(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hdHRpIiwiaWQiOiI2NDQyNGY4YWQ2NDFiZDE3N2ZlZDU2YzYiLCJpYXQiOjE2ODIzMjgyNDB9.z1PwsaV-FXkMyyZZ4-JT8rCt2hreBquSm0KbS3HKnFI'
    )
    .send(newBlog)
    .expect(201);

  const resultBlog = await api.get('/api/blogs').expect(200);
  const blog = resultBlog.body[2];

  expect(blog.likes).toBeDefined();
});

test('Blog missing title', async () => {
  const newBlog = {
    author: 'Blog Master',
    url: 'wwww.blog.com',
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
});

test('Blog missing author', async () => {
  const newBlog = {
    title: 'Missing blog',
    url: 'www.blog.com',
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
});
