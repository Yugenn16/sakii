const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// In-memory storage for letters (in production, use a database)
let letters = [
  {
    id: 1,
    title: 'Dear JOPAY',
    content: `This letter is for you, ineffortan kopa talaga ne HAHAHAHA eme, gusto kolang magpabibo kaya may ganto
          pang pa website HAHAHA. I just want to say that thankful ako nakilala kita wayback mga highschool pa tayo
          and diko din alam na papansinin mo din ako non HAHAHAHA. And gusto kolang malaman mo na I'm always here para sayo
          pag nalulungkot ka ganon, pwede ka magrant sakin makikinig ako tsaka kahit hindi man ako medjo masalita
          dadamayan padin kita. Tandaan wag mo papabayaan ang sarili, always stay maganda and cute kahit na bitchesa ne HAHAHAHA.
          Im always here for you, road to 2026 na ditak namung kabusitan ika naman kanyan mag graduate HAHAHAHA. Kumbaga reklamo muna
          bago gawa ne HAHAHAHA. Keep always being masayahin din ne, and that's all diko man lahat masabi atleast kahit paano ay
          nagawa koto para sayo. Gobless and PADAYON!!
          Thank you🫶🩵`
  }
];

// API Routes
app.get('/api/letters', (req, res) => {
  res.json(letters);
});

app.get('/api/letters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const letter = letters.find(l => l.id === id);
  if (letter) {
    res.json(letter);
  } else {
    res.status(404).json({ error: 'Letter not found' });
  }
});

app.post('/api/letters', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const maxId = letters.length > 0 ? Math.max(...letters.map(l => l.id)) : 0;
  const newId = maxId + 1;
  const newLetter = {
    id: newId,
    title,
    content
  };
  letters.push(newLetter);
  res.status(201).json(newLetter);
});

app.put('/api/letters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, content } = req.body;
  const letterIndex = letters.findIndex(l => l.id === id);
  
  if (letterIndex === -1) {
    return res.status(404).json({ error: 'Letter not found' });
  }
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  
  letters[letterIndex] = { id, title, content };
  res.json(letters[letterIndex]);
});

app.delete('/api/letters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const letterIndex = letters.findIndex(l => l.id === id);
  
  if (letterIndex === -1) {
    return res.status(404).json({ error: 'Letter not found' });
  }
  
  letters.splice(letterIndex, 1);
  res.status(204).send();
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});