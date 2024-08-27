const express = require('express')
const morgan = require('morgan')
const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.use(express.json())
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }))

app.get('/info', (req, res) => {
    const d = new Date()
    res.send(`<h3>Phonebook has info for ${persons.length} people<br><br>${d}</h3>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
    }
)

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)

    if (!person) return res.status(404).send('person not found') 
    res.json(person)
    }
)

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)
    if (!person) return res.status(404).send('Person not found')

    persons = persons.filter(p => p.id !== person.id)
    res.status(204).end()    
})

const getRandomId = () => {
    const maxId = persons.length > 0? Math.max(...persons.map(p => Number(p.id))): 0
    let randomId =  Math.random() * (20 - (maxId + 1)) + (maxId + 1)
    return String(Math.floor(randomId))
  }

app.post('/api/persons/', (req, res) => {
    const body = req.body

    if((!body.name) || (!body.number)) {
        return res.status(400).json({ 
            error: 'name or number is missing' 
          })
    }
    if(persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())){
        return res.status(400).json({ 
            error: 'name must be unique'
          })
    }
    const newPerson = {
        name : body.name,
        number : body.number,
        id: getRandomId()
    }

    persons = persons.concat(newPerson)
    res.json(persons)
    
})









const PORT =  process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server running on port", PORT)
})