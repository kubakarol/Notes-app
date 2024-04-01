const app = Vue.createApp({
  data() {
    return {
      title: '',
      text: '',
      notes: [],
      editingIndex: null, // Index of the note currently being edited
    };
  },
  methods: {
    fetchNotes() {
      fetch('http://localhost:5500/notes')
        .then((response) => response.json())
        .then((data) => {
          this.notes = data;
        })
        .catch((error) => {
          console.error('Error fetching notes:', error);
        });
    },
    submitNote() {
      if (this.editingIndex === null) {
        // Add new note
        const newNote = {
          title: this.title,
          text: this.text,
        };

        this.notes.push(newNote);
        this.saveNoteToDatabase(newNote); // Save note to the database
      } else {
        // Update existing note
        const editedNote = this.notes[this.editingIndex];
        editedNote.title = this.title;
        editedNote.text = this.text;
        this.updateNoteInDatabase(editedNote); // Update note

        this.editingIndex = null;
      }

      this.title = '';
      this.text = '';
    },
    saveNoteToDatabase(note) {
      fetch('http://localhost:5500/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Note added to database:', data);
          this.fetchNotes(); // Fetch updated notes after adding new note
        })
        .catch((error) => {
          console.error('Error adding note:', error);
        });
    },
    deleteNote(index) {
      const idToDelete = this.notes[index]._id;
      this.notes.splice(index, 1);
      this.deleteNoteFromDatabase(idToDelete);
    },
    deleteNoteFromDatabase(id) {
      fetch(`http://localhost:5500/notes/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Note deleted from database:', data);
          this.fetchNotes(); // Fetch updated notes after deleting a note
        })
        .catch((error) => {
          console.error('Error deleting note:', error);
        });
    },
    editNote(index) {
      // Set editingIndex to the index of the note being edited
      this.editingIndex = index;
      const note = this.notes[index];
      this.title = note.title;
      this.text = note.text;
    },
    updateNoteInDatabase(note) {
      fetch(`http://localhost:5500/notes/${note._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: note.title, text: note.text }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Note updated in database:', data);
          this.fetchNotes(); // Fetch updated notes after updating a note
        })
        .catch((error) => {
          console.error('Error updating note:', error);
        });
    },
  },
  mounted() {
    this.fetchNotes(); // Fetch notes when the app is mounted
  },
}).mount('#app');
