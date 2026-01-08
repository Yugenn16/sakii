const envelopesContainer = document.getElementById("envelopesContainer");
const addLetterBtn = document.getElementById("addLetterBtn");
const addForm = document.getElementById("addForm");
const newTitle = document.getElementById("newTitle");
const newContent = document.getElementById("newContent");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const editForm = document.getElementById("editForm");
const editTitle = document.getElementById("editTitle");
const editContent = document.getElementById("editContent");
const updateBtn = document.getElementById("updateBtn");
const editCancelBtn = document.getElementById("editCancelBtn");

const bgMusic = document.getElementById("bgMusic");

let editingLetterId = null;

let letters = [];

// Check if admin mode
const isAdmin = new URLSearchParams(window.location.search).has('admin');
if (!isAdmin) {
  addLetterBtn.style.display = 'none';
}

// Load all letters from backend
async function loadLetters() {
  try {
    const response = await fetch('/api/letters');
    if (response.ok) {
      letters = await response.json();
      renderEnvelopes();
    } else {
      envelopesContainer.innerHTML = '<p>Error loading letters.</p>';
    }
  } catch (error) {
    console.error('Error loading letters:', error);
    envelopesContainer.innerHTML = '<p>Error loading letters.</p>';
  }
}

function renderEnvelopes() {
  envelopesContainer.innerHTML = '';
  letters.forEach((letter, index) => {
    const envelopeContainer = document.createElement('div');
    envelopeContainer.className = 'envelope-container';

    envelopeContainer.innerHTML = `
      <div class="envelope" data-index="${index}">
        <div class="flap">
          <div class="seal"></div>
        </div>
        <div class="letter">
          <button class="close-btn">×</button>
          ${isAdmin ? `
            <div class="admin-controls">
              <button class="edit-btn" data-id="${letter.id}">✏️</button>
              <button class="delete-btn" data-id="${letter.id}">🗑️</button>
            </div>
          ` : ''}
          <h1>${letter.title}</h1>
          <p>${letter.content.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `;

    envelopesContainer.appendChild(envelopeContainer);

    // Add event listeners
    const envelope = envelopeContainer.querySelector('.envelope');
    const closeBtn = envelopeContainer.querySelector('.close-btn');

    envelope.addEventListener("click", () => {
      if (!envelope.classList.contains('open')) {
        // Close all other envelopes first
        document.querySelectorAll('.envelope.open').forEach(openEnvelope => {
          openEnvelope.classList.remove('open');
        });
        // Open this envelope
        envelope.classList.add("open");
        bgMusic.play();
      }
    });

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      envelope.classList.remove("open");
      bgMusic.pause();
    });

    // Admin controls
    if (isAdmin) {
      const editBtn = envelopeContainer.querySelector('.edit-btn');
      const deleteBtn = envelopeContainer.querySelector('.delete-btn');

      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openEditForm(letter);
        });
      }

      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteLetter(letter.id);
        });
      }
    }
  });
}

function openEditForm(letter) {
  editingLetterId = letter.id;
  editTitle.value = letter.title;
  editContent.value = letter.content;
  editForm.style.display = "block";
}

async function deleteLetter(id) {
  if (confirm('Are you sure you want to delete this letter?')) {
    try {
      const response = await fetch(`/api/letters/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        await loadLetters(); // Reload letters
      } else {
        alert('Error deleting letter');
      }
    } catch (error) {
      console.error('Error deleting letter:', error);
      alert('Error deleting letter');
    }
  }
}



// Add letter form
addLetterBtn.addEventListener("click", () => {
  addForm.style.display = "block";
});

cancelBtn.addEventListener("click", () => {
  addForm.style.display = "none";
  newTitle.value = "";
  newContent.value = "";
});

submitBtn.addEventListener("click", async () => {
  const title = newTitle.value.trim();
  const content = newContent.value.trim();
  if (title && content) {
    try {
      const response = await fetch('/api/letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      });
      if (response.ok) {
        addForm.style.display = "none";
        newTitle.value = "";
        newContent.value = "";
        await loadLetters(); // Reload letters
      } else {
        alert('Error adding letter');
      }
    } catch (error) {
      console.error('Error adding letter:', error);
      alert('Error adding letter');
    }
  } else {
    alert('Please fill in both title and content');
  }
});

// Edit form handlers
editCancelBtn.addEventListener("click", () => {
  editForm.style.display = "none";
  editingLetterId = null;
  editTitle.value = "";
  editContent.value = "";
});

updateBtn.addEventListener("click", async () => {
  const title = editTitle.value.trim();
  const content = editContent.value.trim();
  if (title && content && editingLetterId) {
    try {
      const response = await fetch(`/api/letters/${editingLetterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
      });
      if (response.ok) {
        editForm.style.display = "none";
        editingLetterId = null;
        editTitle.value = "";
        editContent.value = "";
        await loadLetters(); // Reload letters
      } else {
        alert('Error updating letter');
      }
    } catch (error) {
      console.error('Error updating letter:', error);
      alert('Error updating letter');
    }
  } else {
    alert('Please fill in both title and content');
  }
});

// Load letters on page load
loadLetters();
