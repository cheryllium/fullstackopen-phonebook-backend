const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Must give password as an argument')
  process.exit(1)
}

// Connect to mongoose
const password = process.argv[2]
const url =
      `mongodb+srv://fullstack:${password}@cluster0.ctxhdl6.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Create schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // Display all the entries in the phonebook
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  if (process.argv.length !== 5) {
    console.log('Must give name and number as additional arguments')
    mongoose.connection.close()
    process.exit(1)
  }

  const name = process.argv[3]
  const number = process.argv[4]
  
  // Add the new entry to the phonebook
  const person = new Person({
    name, number
  })
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
