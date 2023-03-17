const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();

const Person = require('./models/person');
const app = express();

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(cors());
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(express.static('build'));

morgan.token('body', function logBody(req) {
  return JSON.stringify(req.body);
});

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      console.log(`Person with id:${req.params.id} removed`);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  
  console.log("#")
  if (!body.name) {
    return res.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  const newPerson = new Person({
    name: req.body.name,
    number: req.body.number,
  });

  console.log(newPerson);

  newPerson
    .save()
    .then((savedPerson) => {
      res.json(newPerson);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  console.log(person);

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  }).then((updatedPerson) => {
    res.json(updatedPerson);
  });
});

app.get('/api/info', (req, res) => {
  Person.find({}).then((result) => {
    const info = `Phonebook has info for ${result.length} people`;
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    const time = `${day} ${month} ${year}`;

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`${info} \n ${time}`);
  });
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
