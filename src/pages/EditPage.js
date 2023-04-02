import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as notesStore from '../notesStore.js';
import BrailleCanvas from '../Braille/BrailleCanvas.js';
import { useNavigate } from 'react-router-dom'


const audios = {
  "a": new Audio("./letras/alphabet-a.mp3"),
  "b": new Audio("./letras/alphabet-b.mp3"),
  "c": new Audio("./letras/alphabet-c.mp3"),
  "d": new Audio("./letras/alphabet-d.mp3"),
  "e": new Audio("./letras/alphabet-e.mp3"),
  "f": new Audio("./letras/alphabet-f.mp3"),
  "g": new Audio("./letras/alphabet-g.mp3"),
  "h": new Audio("./letras/alphabet-h.mp3"),
  "i": new Audio("./letras/alphabet-i.mp3"),
  "j": new Audio("./letras/alphabet-j.mp3"),
  "k": new Audio("./letras/alphabet-k.mp3"),
  "l": new Audio("./letras/alphabet-l.mp3"),
  "m": new Audio("./letras/alphabet-m.mp3"),
  "n": new Audio("./letras/alphabet-n.mp3"),
  "o": new Audio("./letras/alphabet-o.mp3"),
  "p": new Audio("./letras/alphabet-p.mp3"),
  "q": new Audio("./letras/alphabet-q.mp3"),
  "r": new Audio("./letras/alphabet-r.mp3"),
  "s": new Audio("./letras/alphabet-s.mp3"),
  "t": new Audio("./letras/alphabet-t.mp3"),
  "u": new Audio("./letras/alphabet-u.mp3"),
  "v": new Audio("./letras/alphabet-v.mp3"),
  "w": new Audio("./letras/alphabet-w.mp3"),
  "x": new Audio("./letras/alphabet-x.mp3"),
  "y": new Audio("./letras/alphabet-y.mp3"),
  "z": new Audio("./letras/alphabet-z.mp3"),
  "ñ": new Audio("./letras/enie.mp3"),
  "DELETE": new Audio("./letras/DELETE.mp3"),
  "ENTER": new Audio("./letras/ENTER.mp3"),
  " ": new Audio("./letras/SPACE.mp3"),
  "-": new Audio("./letras/GUION.mp3"),
  "¡!": new Audio("./letras/ADMIRACION.mp3"),
  ",": new Audio("./letras/COMA.mp3"),
  ".": new Audio("./letras/PUNTO.mp3"),
  "¿?": new Audio("./letras/INTERROGACION.mp3"),
  "CLOSE": new Audio("./letras/CLOSE.mp3"),
  "READ": new Audio("./letras/READ.mp3"),
};


let queue = [];

/**
*/
function play(letter) {
  if(audios[letter]) {
    audios[letter].play();
  } else {
    console.error(`not found sound ${letter}`);
  }
}

/**
*/
function processQueue() {
  if(!queue.length) return;
  const item = queue.shift();
  play(item);
}

Object.keys(audios).forEach((k) => {
  audios[k].addEventListener('ended', processQueue);
});


export default function EditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState({ text: ''});
  const [mode, setMode] = useState(''); //edit, rename, none?
  const [text, setText] = useState(note.text); // text being edited
  useEffect(() => {
    const n = notesStore.getNote(+id);
    console.log(n);
    setNote(n);
    setText(n.text);
  }, [id]);

  function rename() {
   console.log("todo rename"); 
  }

  function edit() {
    setMode('edit');
    setText(note.text);
  }

  /**
  */
  function readLastWord() {
    const words = note.text.split(" ");
    if(!words.length) return;
    const word = words[words.length - 1];
    queue = ['READ', ...word];
    processQueue();
  }

  function onChange(newtext, braillekey) {
    if (newtext) {
      if(newtext === 'CLOSE') {
        setMode('');
      } else if (newtext === 'ENTER') {
        play(newtext);
        note.text = `${text}\n`;
      } else if (newtext === 'READ') {
        readLastWord();
      } else if (newtext === 'DELETE') {
        const lastchar = text[text.length - 1]; 
        queue = ['DELETE', lastchar];
        processQueue();
        note.text = text.substring(0, text.length - 1);
      } else {
        play(newtext);
        note.text = `${text}${newtext}`;
      }
    } else {
      //for debugging
      console.log(`unknown: ${newtext} ${braillekey}`);
    }
    setText(note.text);
    notesStore.saveNote(note);
  }

  function onHome() {
    navigate('/');
  }

return (
  <>
  <h1>Note: {note.title}</h1>
  <div>
  <button type="button" onClick={rename}>Rename</button>
  <button type="button" onClick={edit}>Edit</button>
  { mode === 'edit' &&
    <BrailleCanvas onChange={onChange} />
  }
  <button type="button" onClick={onHome}>Home</button>
  </div>
  <div>{
    text.split('\n').map((line, i) => {
    return <p key={i}>{line}</p>
  })
  }</div>
</>
);
}
