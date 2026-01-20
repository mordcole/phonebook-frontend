import { useState, useEffect} from 'react'
import Notification from './components/Notification'
import numberService from './services/numbers'

const Filter = ({value, onChange}) => {
  return (
    <div>
      filter shown with:
      <input
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

const PersonForm = ({addName, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={addName}>
        <div>
          name: <input
          value={newName}
          onChange={handleNameChange}/>
        </div>
         <div>
          number: <input
          value={newNumber}
          onChange={handleNumberChange}/>
       </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({ personsToShow, handleDelete }) => {
  return (
    <ul>
      {personsToShow.map(person =>
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id, person.name)}>
            delete
          </button>
        </li>
      )}
    </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() =>{
    numberService
      .getAll()
      .then(initialPersons => {
        console.log('Fetched persons:', initialPersons)
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    if (persons.some(p => p.name === newName)) {
    alert(`${newName} is already added to phonebook`)
    return
    }

    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }

    numberService
      .addName(nameObject)
      .then(returnedName => {
        setPersons(persons.concat(returnedName))
        setNewName('')
        setNewNumber('')

        setNotification(`Added ${returnedName.name}`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const handleDelete = (id, name) => {
  const ok = window.confirm(`Delete ${name}?`)
  if (!ok) return

  numberService
    .remove(id)
    .then(() => {
      setPersons(persons.filter(p => p.id !== id))
    })
}

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter
        value={filter}
        onChange={handleFilterChange}
      />
      <h2>Add New:</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        personsToShow={personsToShow}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App
