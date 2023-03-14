const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const showAll = (password) => {
  const url = `mongodb+srv://fullstack:${password}@cluster0.0f0rbav.mongodb.net/phonebookApp?retryWrites=true&w=majority`;
  mongoose.set('strictQuery', false);
  mongoose.connect(url);

  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name, person.number);
    });

    mongoose.connection.close();
  });
};

const add = (password, personName, number) => {
  const url = `mongodb+srv://fullstack:${password}@cluster0.0f0rbav.mongodb.net/phonebookApp?retryWrites=true&w=majority`;
  mongoose.set('strictQuery', false);
  mongoose.connect(url);

  const person = new Person({
    name: personName,
    number: number,
  });

  person.save().then((result) => {
    console.log(`${personName} added to phonebook!`);
    mongoose.connection.close();
  });
};

switch (process.argv.length) {
  case 0:
  case 1:
  case 2:
    console.log('too few argument');
    process.exit(1);
    break;

  case 3:
    showAll((password = process.argv[2]));
    break;

  case 5:
    add(
      (password = process.argv[2]),
      (personName = process.argv[3]),
      (number = process.argv[4])
    );
    break;

  default:
    console.log('node mongo.js <password> (<Name>) (<Number>)');
    process.exit(1);
}
