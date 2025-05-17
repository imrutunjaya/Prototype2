let notesData = {};
let currentSubject = "";
let filteredTopics = [];

// Fetch notes data from JSON file
fetch('data/notes.json')
  .then(res => res.json())
  .then(data => {
    notesData = data;
    loadSubject('Maths'); // Load default subject on initial load
  })
  .catch(err => {
    console.error('Error loading notes:', err);
    document.getElementById('note-content').textContent = 'Failed to load notes.';
  });

// Load selected subject and render topics
function loadSubject(subject) {
  currentSubject = subject;
  const title = document.getElementById('subject-title');
  const container = document.getElementById('topic-container');
  const noteContent = document.getElementById('note-content');
  const searchBox = document.getElementById('search-box');

  // Reset and show
  title.textContent = subject;
  document.getElementById('back-button').classList.add('hidden');
  noteContent.classList.add('hidden');
  container.innerHTML = '';
  searchBox.classList.remove('hidden');
  document.getElementById('bottom-nav').classList.remove('hidden');

  // Highlight selected button
  document.querySelectorAll('#bottom-nav button').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  const activeButton = document.getElementById(`btn-${subject}`);
  activeButton.classList.add('active');
  activeButton.setAttribute('aria-pressed', 'true');

  filteredTopics = notesData[subject] || [];
  renderTopics();
}

// Render topics in the topic container
function renderTopics() {
  const container = document.getElementById('topic-container');
  container.innerHTML = '';

  filteredTopics.forEach(topic => {
    const div = document.createElement('div');
    div.className = 'topic-item';
    div.textContent = topic.title;
    div.tabIndex = 0; // Make it focusable for accessibility
    div.onclick = () => displayNoteContent(topic);
    div.onkeypress = (e) => {
      if (e.key === 'Enter') {
        displayNoteContent(topic);
      }
    };
    container.appendChild(div);
  });

  if (filteredTopics.length === 0) {
    container.innerHTML = "<p>No topics found.</p>";
  }
}

// Display the selected note content
function displayNoteContent(topic) {
  const container = document.getElementById('topic-container');
  const noteContent = document.getElementById('note-content');
  const searchBox = document.getElementById('search-box');
  const backButton = document.getElementById('back-button');
  const title = document.getElementById('subject-title');

  container.innerHTML = '';
  noteContent.classList.remove('hidden');
  noteContent.textContent = topic.content;
  searchBox.classList.add('hidden');
  document.getElementById('bottom-nav').classList.add('hidden');
  backButton.classList.remove('hidden');
  title.textContent = `${currentSubject} > ${topic.title}`;
}

// Filter topics based on search input
function filterTopics() {
  const input = document.getElementById('search-input').value.toLowerCase();
  const allTopics = notesData[currentSubject] || [];
  filteredTopics = allTopics.filter(topic =>
    topic.title.toLowerCase().includes(input)
  );
  renderTopics();
}

// Go back to the subject view
function goBack() {
  loadSubject(currentSubject);
}
