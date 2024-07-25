const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.q7bj24z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model('Person', personSchema);

// If command-line is -> node mongo.js password
if (process.argv.length === 3) {
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(person);
        });
        mongoose.connection.close();
    });
}
// If command-line is -> node mongo.js password name number
else if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then((result) => {
        console.log('Added', person.name, 'number', person.number, 'to phonebook');
        mongoose.connection.close();
    });
}
