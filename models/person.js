const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

// Get connection URL from the environmental variable
const url = process.env.MONGODB_URI

// Attempt connecting to MongoDB
console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

// Define the Person schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3, 
    required: true,
  },
  number: {
    type: String,
    required: true,
  }
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
