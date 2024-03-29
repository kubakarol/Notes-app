const app = Vue.createApp({
  data() {
    return {
      title: "",
      text: "",
      notes: [],
    };
  },
  methods: {
    fetchNotes() {
      fetch("http://localhost:5500/notes")
        .then((response) => response.json())
        .then((data) => {
          this.notes = data;
        })
        .catch((error) => {
          console.error("Error fetching notes:", error);
        });
    },
    addNote() {
      const newNote = {
        title: this.title,
        text: this.text,
      };

      this.notes.push(newNote);

      this.title = "";
      this.text = "";

      fetch("http://localhost:5500/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Note added to database:", data);
        })
        .catch((error) => {
          console.error("Error adding note:", error);
        });
    },
    deleteNote(index) {
      const idToDelete = this.notes[index]._id; // Pobierz identyfikator notatki do usunięcia
      this.notes.splice(index, 1); // Usuń notatkę z lokalnej listy

      // Wyślij żądanie DELETE do serwera, aby usunąć notatkę z bazy danych
      fetch(`http://localhost:5500/notes/${idToDelete}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Note deleted from database:", data);
        })
        .catch((error) => {
          console.error("Error deleting note:", error);
        });
    },
  },
  mounted() {
    this.fetchNotes();
  },
}).mount("#app");
