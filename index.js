require('dotenv').config() // Enable dotenv
const express = require('express')
const app = express()
const Person = require('./models/person') // Require MongoDB model

// Enable middleware that gets the JSON of body of requests in request.body
app.use(express.json())

// Enable cors so that the frontend can make connections from a different host
const cors = require('cors')
app.use(cors())

// Serve the frontend from the build directory
app.use(express.static('build'))

// Enable logging of requests to the console with morgan
let morgan = require('morgan')
morgan.token('body', function (req) {
  const stringBody = JSON.stringify(req.body)
  if(stringBody === '{}') {
    return ' '
  }
  return stringBody
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', (request, response, next) => {
  const date = new Date()
  Person.countDocuments({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people</p><p>${date}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const newPerson = new Person({
    name, number
  })
  newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// error handling middleware
const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT=3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
