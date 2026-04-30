---
layout: default
title: Contact me
---

# Contact me
#### Leave a message below. Messages are stored in real-time using Supabase.

<!-- Login Status -->
<div id="user-status" style="margin-bottom: 20px;"></div>

<div class="message-box">
  <form id="messageForm">
    <div class="form-group">
      <label for="userMessage">Your Message:</label>
      <textarea id="userMessage" name="userMessage" rows="5" required placeholder="Leave a message..."></textarea>
    </div>
    
    <button type="submit" id="submitBtn" class="submit-btn">
      Submit Message
    </button>
  </form>
  
  <div id="messagesDisplay" class="messages-display">
    <h3>Messages:</h3>
    <div id="messagesList">Loading messages...</div>
  </div>
</div>

<!-- Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const messageForm = document.getElementById('messageForm');
const messagesList = document.getElementById('messagesList');


// =======================
// AUTH (GitHub)
// =======================

// Login
async function loginWithGitHub() {
  await supabase.auth.signInWithOAuth({
    provider: 'github'
  });
}

// Logout
async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

// Update login UI
async function updateUI() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const status = document.getElementById("user-status");

  if (user) {
    status.innerHTML = `
      Logged in as <strong>${user.user_metadata.user_name}</strong><br>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    status.innerHTML = `
      <button onclick="loginWithGitHub()">Login with GitHub</button>
    `;
  }
}


// =======================
// LOAD MESSAGES
// =======================

async function loadMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    messagesList.innerHTML = "Error loading messages.";
    console.error(error);
    return;
  }

  messagesList.innerHTML = '';
  data.forEach(msg => addMessageToUI(msg, false));
}


// =======================
// DISPLAY MESSAGE
// =======================

function addMessageToUI(msg, isNew = true) {
  const div = document.createElement('div');
  div.className = 'message-item';

  div.innerHTML = `
    <strong>${msg.username || 'Unknown'}</strong>
    <span class="timestamp">${new Date(msg.created_at).toLocaleString()}</span>
    <p>${msg.content}</p>
  `;

  if (isNew) {
    messagesList.prepend(div);
  } else {
    messagesList.appendChild(div);
  }
}


// =======================
// SUBMIT MESSAGE
// =======================

messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    alert("Please log in with GitHub first.");
    return;
  }

  const btn = document.getElementById('submitBtn');
  const content = document.getElementById('userMessage').value;

  btn.disabled = true;
  btn.innerText = "Sending...";

  const { error } = await supabase
    .from('messages')
    .insert([{
      content: content,
      user_id: user.id,
      username: user.user_metadata.user_name
    }]);

  if (error) {
    alert("Error: " + error.message);
  } else {
    messageForm.reset();
  }

  btn.disabled = false;
  btn.innerText = "Submit Message";
});


// =======================
// REALTIME UPDATES
// =======================

supabase
  .channel('public:messages')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'messages' },
    payload => {
      addMessageToUI(payload.new, true);
    }
  )
  .subscribe();


// =======================
// INIT
// =======================

updateUI();
loadMessages();
</script>


<nav class="nav">
  <a href="/">Home</a>
  <a href="/page1">Interests</a>
  <a href="/page3">Profiles</a>
  <a href="/page4">Eiriaoloth</a>
</nav>
