require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const time = new Date();

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (req, res) => {
    Person.find({}).then((people) => {
        res.json(people);
    });
});

app.get('/info', (req, res) => {
    const existingPeople = [];
    Person.find({}).then((people) => {
        people.forEach((person) => {
            console.log(people);
            existingPeople.push(person);
        });
        res.send(`<p>Phonebook has info for ${existingPeople.length} people</p>
            <p>${time}</p>`);
    });
});

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.findById(id)
        .then((person) => {
            res.json(person);
        })
        .catch((error) => {
            console.error(error);
            return res.status(404).end();
        });
});

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter((person) => person.id !== id);

    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing',
        });
    }

    const existingPerson = persons.find((person) => person.name === body.name);

    if (existingPerson) {
        return res.status(400).json({
            error: 'name must be unique',
        });
    }

    const person = {
        id: Math.random(1, 10000).toString(),
        name: body.name,
        number: body.number,
    };
    persons = persons.concat(person);

    res.json(person);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
