const Note = ({ note,toggleImportance }) => {
  const label = note.importance ? 'make not important' : 'make important'
    return (
      <>
        <li className="note">{note.content}</li>
        <button onClick={toggleImportance}>{label}</button>
      </>
    )
  }
  
  export default Note