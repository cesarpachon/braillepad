export function getNotes() {
  let db = localStorage.getItem("notes");
  if (!db) {
    db = "[]";
  }
  let notes = [];
  try {
    notes = JSON.parse(db);
  } catch(err) {
    console.error(err);
  }
  return notes;
}

export function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes));
}

export function saveNote(note) {
  const notes = getNotes();
  const index = notes.findIndex((n) => n.id === note.id);
  if(index > -1) {
    notes[index] = note;
  }
  saveNotes(notes);
}

export function addNote(title){
  const notes = getNotes();
  notes.push({
    id: Date.now(),
    title,
    text: '',
  });
  saveNotes(notes);
}

export function getNote(noteid) {
  const notes = getNotes();
  return notes.find(n => n.id === noteid);
}
