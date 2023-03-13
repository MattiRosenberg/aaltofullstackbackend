const express = require('express');
const morgan = require('morgan')

const app = express();

app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

morgan.token('body', function logBody(req) {
  return JSON.stringify(req.body);
});

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5325523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.get('/api/info', (req, res) => {
  const info = `Phonebook has info for ${persons.length} people`;
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();

  const time = `${day} ${month} ${year}`;

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`${info} \n ${time}`);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  console.log(`Person with id:${id} removed`);
  res.status(204).end();
});

const getNewId = () => {
  const generateId = () => {
    return Math.floor(Math.random() * 1000);
  };

  let randomId = generateId();
  while (persons.find((person) => person.id === randomId)) {
    randomId = generateId();
  }

  return randomId;
};

const hasNameAndNumber = (newPerson) => {
  return newPerson.name && newPerson.number;
};

const personExists = (newPerson) => {
  return persons.find((person) => newPerson.name === person.name);
};

app.post('/api/persons', (req, res) => {
  const person = req.body;
  if (!hasNameAndNumber((newPerson = person))) {
    return res.status(400).json({ error: 'name or number missing' });
  }

  if (personExists((newPerson = person))) {
    return res.status(400).json({ error: 'person exist' });
  }

  person.id = getNewId();
  persons = [...persons, person];

  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
