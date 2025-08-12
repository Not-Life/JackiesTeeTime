/* Blog functionality for the MedAssist Tees site */

// Sample blog posts. Feel free to edit or extend this array.
const SAMPLE_POSTS = [
  {
    id: 'scope-of-practice',
    title: 'What’s in a Medical Assistant’s Scope?',
    date: '2025-08-01',
    summary: 'Quick overview of clinical vs. administrative tasks, plus state-by-state nuance.',
    content:
      'Medical assistants (MAs) bridge clinical care and admin ops. Typical clinical tasks include rooming patients, taking vitals, preparing injections (per delegation), and performing EKGs. Administrative tasks span scheduling, insurance verification, and EMR upkeep. Always follow employer policy, your training, and state rules.',
    tags: ['basics', 'scope', 'careers'],
  },
  {
    id: 'bp-tips',
    title: '3 Tips for More Accurate Blood Pressure Readings',
    date: '2025-08-08',
    summary: 'Cuff fit, patient posture, and 5‑minute rest make a surprising difference.',
    content:
      'Use the correct cuff size (mid‑arm circumference matters!), ensure feet are flat with back supported, and ask patients to rest quietly for ~5 minutes before the reading. Avoid conversation during measurement and position the cuff at heart level.',
    tags: ['clinical', 'vitals'],
  },
];

function loadPosts() {
  try {
    const stored = localStorage.getItem('posts');
    if (stored) return JSON.parse(stored);
  } catch (err) {
    console.error('Failed to parse posts from localStorage', err);
  }
  return SAMPLE_POSTS;
}

function savePosts(posts) {
  try {
    localStorage.setItem('posts', JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save posts to localStorage', err);
  }
}

function renderPosts() {
  const posts = loadPosts();
  const list = document.getElementById('postList');
  if (!list) return;
  list.innerHTML = '';
  posts.forEach((post) => {
    const article = document.createElement('article');
    article.className = 'post';
    article.innerHTML = `
      <h3>${post.title}</h3>
      <div class="meta">${new Date(post.date).toLocaleDateString()}</div>
      <div class="tags">
        ${post.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
      </div>
      <details>
        <summary>${post.summary}</summary>
        <p>${post.content}</p>
      </details>
    `;
    list.appendChild(article);
  });
}

function toggleAddPostForm() {
  const form = document.getElementById('addPostForm');
  if (form) {
    form.classList.toggle('hidden');
  }
}

function handleAddPost(event) {
  event.preventDefault();
  const titleInput = document.getElementById('postTitle');
  const dateInput = document.getElementById('postDate');
  const tagsInput = document.getElementById('postTags');
  const summaryInput = document.getElementById('postSummary');
  const contentInput = document.getElementById('postContent');
  const title = titleInput.value.trim();
  if (!title) return;
  const date = dateInput.value || new Date().toISOString().slice(0, 10);
  const tags = tagsInput.value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const summary = summaryInput.value.trim();
  const content = contentInput.value.trim();
  const posts = loadPosts();
  posts.unshift({ id: `${Date.now()}`, title, date, summary, content, tags });
  savePosts(posts);
  // Reset form
  titleInput.value = '';
  dateInput.value = '';
  tagsInput.value = '';
  summaryInput.value = '';
  contentInput.value = '';
  // Hide form and refresh posts
  toggleAddPostForm();
  renderPosts();
}

document.addEventListener('DOMContentLoaded', () => {
  // Render existing posts
  renderPosts();
  // Attach handlers for form toggle and submission
  const toggleBtn = document.getElementById('toggleAddPostBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleAddPostForm);
  }
  const form = document.getElementById('addPostForm');
  if (form) {
    form.addEventListener('submit', handleAddPost);
  }
});