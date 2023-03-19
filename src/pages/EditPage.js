import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as notesStore from '../notesStore.js';
import BrailleCanvas from '../Braille/BrailleCanvas.js';

const audio =  new Audio('./393064__sbaneat__golpecito.wav');

export default function UserPage() {
  const { id } = useParams();
  const [note, setNote] = useState({});
  const [mode, setMode] = useState(''); //edit, rename, none?
  const [text, setText] = useState(''); // text being edited
  useEffect(() => {
    const n = notesStore.getNote(+id);
    console.log(n);
    setNote(n);
  }, [id]);

  function rename() {
   console.log("todo rename"); 
  }

  function edit() {
    setMode('edit');
    setText(note.text);
  }

  function onChange(newtext, braillekey) {
    if (newtext) {
      if(newtext === 'CLOSE') {
        setMode('');
      } else {
        note.text = `${text}${newtext}`;
      }
    } else {
      //for debugging
      note.text = `${text}${braillekey}`;
    }
    setText(note.text);
    notesStore.saveNotes();
    audio.play(); 
  }

return (
  <>
  <h1>Note: {note.title}
  <button type="button" onClick={rename}>Rename</button>
  <button type="button" onClick={edit}>Edit</button>
  { mode === 'edit' &&
    <BrailleCanvas onChange={onChange} />
  }
  </h1>
  <div>{text}</div>
</>
);
}
