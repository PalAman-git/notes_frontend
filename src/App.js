import { useEffect,useState } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import noteServices from './services/notes'


const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}



const App = () => {

  const [notes,setNotes] = useState([]);
  const [newNote,setNewNote] = useState('');
  const [showAll,setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);//the node to be changed
    const changedNote = {...note,important: !note.important}//the changed note

    noteServices
      .update(id,changedNote)
      .then((returnedNote) => {//putting the changed note into the actual server data
      setNotes(notes.map((n) => n.id !== id ? n : returnedNote))//now modifying the data of the node that has been changed
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const noteObject = {
      important: Math.random() < 0.5,
      content: newNote,
      id: notes.length + 1
    }

    noteServices
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote));
      setNewNote('');
    }) 
  }

  useEffect(()=>{
    noteServices
      .getAll()
      .then((initialdata)=>{
        setNotes(initialdata);
      })
  },[])

  const notesToShow = showAll ? notes : notes.filter((note) => note.important === true);

  const handleChange = (e) => setNewNote(e.target.value);

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={ errorMessage } />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
          {notesToShow.map(note => 
            <Note key={note.id} toggleImportance={() => toggleImportanceOf(note.id)} note={note} />
          )}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} value={newNote} />
        <button type='submit'>submit</button>
      </form>

      <Footer />
    </div>
  )
}

export default App