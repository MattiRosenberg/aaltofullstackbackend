const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 3 || username.length < 3) {
    response
      .status(401)
      .json({ error: 'password and username must be three characters long or more' });

    return
  }

  const allUsers = await User.find({})
  const usernamesInUse = allUsers.map(u => u.username)

  if (usernamesInUse.includes(username)) {
    response.status(401).json({ error: 'username is taken' })
    return
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save()

  response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = usersRouter;
