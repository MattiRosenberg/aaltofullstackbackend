const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const { beforeEach } = require('node:test');
const { describe } = require('yargs');

const initialUser = [
  {
    username: 'UserUser',
    name: 'Test User',
  },
];

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(initialUser);
});

test('POST new user with too short username', async () => {
  const shortUsername = {
    username: 'as',
    name: 'Test Test',
    password: 'normal',
  };

  await api.post('/api/users').send(shortUsername).expect(401);
});

test('POST new user with too sorth password', async () => {
  const shortPassword = {
    username: 'normal',
    name: 'Test Test',
    password: 'aa',
  };

  await api.post('/api/users').send(shortPassword).expect(401);
});

test('POST new user with reserved username', async () => {
  const reservedUsername = {
    username: 'UserUser',
    name: 'Test Test',
    password: 'normal',
  };

  await api.post('/api/users').send(reservedUsername).expect(401);
});
