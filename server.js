const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5500;

app.use(bodyParser.json());
app.use(cors());

const mongoURI = 'mongodb+srv://admin:admin@cluster0.yntaf1q.mongodb.net/notesdb?retryWrites=true&w=majority';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const noteSchema = new mongoose.Schema({
  title: String,
  text: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Note = mongoose.model('Note', noteSchema);

app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Błąd pobierania notatek' });
  }
});

app.post('/notes', async (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ message: 'Title and text are required' });
  }

  const newNote = new Note({
    title,
    text,
  });

  try {
    const savedNote = await newNote.save();
    res.json(savedNote);
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ message: 'Error adding note' });
  }
});

app.delete('/notes/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: id });
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully', deletedNote });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

app.put('/notes/:id', async (req, res) => {
  const id = req.params.id;
  const { title, text } = req.body;
  try {
    const updatedNote = await Note.findByIdAndUpdate(id, { title, text }, { new: true });
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note updated successfully', updatedNote });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Error updating note' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
