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
    Person.find({})
        .then((people) => {
            res.json(people);
        })
        .catch((error) => next(error));
});

app.get('/info', (req, res, next) => {
    const existingPeople = [];
    Person.find({})
        .then((people) => {
            people.forEach((person) => {
                existingPeople.push(person);
            });
            res.send(`<p>Phonebook has info for ${existingPeople.length} people</p>
            <p>${time}</p>`);
        })
        .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findById(id)
        .then((person) => {
            res.json(person);
        })
        .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id)
        .then((result) => {
            res.status(204).end();
        })
        .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing',
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });
    person
        .save()
        .then((savedPerson) => {
            res.json(savedPerson);
        })
        .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    const {name, number} = req.body;

    Person.findByIdAndUpdate(req.params.id, {name, number}, {new: true, runValidators: true, context: 'query'})
        .then((updatedPerson) => {
            res.json(updatedPerson);
        })
        .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'});
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message});
    } else {
        res.status(500).end();
    }
    next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
