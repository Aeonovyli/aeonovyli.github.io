---
layout: default
title: Contact me
---

# Contact me
#### Leave a message below. These are stored in real-time using Supabase.

<div class="message-box">
  <form id="messageForm">
    <div class="form-group">
      <label for="userName">Your Name:</label>
      <input type="text" id="userName" name="userName" required placeholder="Enter your name">
    </div>
    
    <div class="form-group">
      <label for="userMessage">Your Message:</label>
      <textarea id="userMessage" name="userMessage" rows="5" required placeholder="Leave a message..."></textarea>
    </div>
    
    <button type="submit" id="submitBtn" class="submit-btn">Submit Message</button>
  </form>
  
  <div id="messagesDisplay" class="messages-display">
    <h3>Messages:</h3>
    <div id="messagesList">Loading messages...</div>
  </div>
</div>

<!-- 1. Load Supabase Library -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  // 2. Initialize Supabase
  // REPLACE THESE with your actual keys from Supabase Settings -> API
  const SUPABASE_URL = 'https://flwbcrmjdulaefiyhdkh.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2Jjcm1qZHVsYWVmaXloZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzU3NjksImV4cCI6MjA5MzAxMTc2OX0.zQDAVn4ZhW7QSC_WajxinnBHvg5Ry09xOZjxHOVMK2A';
  const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const messageForm = document.getElementById('messageForm');
  const messagesList = document.getElementById('messagesList');

  // 3. Load existing messages
  async function loadMessages() {
    const { data, error } = await _supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      messagesList.innerHTML = "Error loading messages. Check RLS settings.";
      console.error(error);
    } else {
      messagesList.innerHTML = '';
      data.forEach(msg => addMessageToUI(msg, false));
    }
  }

  // 4. Add message to the UI
  function addMessageToUI(msg, isNew = true) {
    const div = document.createElement('div');
    div.className = 'message-item';
    div.innerHTML = `
      <strong>${msg.username || 'Anonymous'}</strong> 
      <span class="timestamp">${new Date(msg.created_at).toLocaleString()}</span>
      <p>${msg.content}</p>
    `;
    
    if (isNew) {
      messagesList.prepend(div); // Add new messages to top
    } else {
      messagesList.appendChild(div); // Add old messages to bottom
    }
  }

  // 5. Handle Form Submission
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const username = document.getElementById('userName').value;
    const content = document.getElementById('userMessage').value;

    btn.disabled = true;
    btn.innerText = "Sending...";

    const { error } = await _supabase
      .from('messages')
      .insert([{ username, content }]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      messageForm.reset();
    }
    btn.disabled = false;
    btn.innerText = "Submit Message";
  });

  // 6. Real-time Listener (Listen for new rows)
  _supabase
    .channel('public:messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
      addMessageToUI(payload.new, true);
    })
    .subscribe();

  loadMessages();
</script>

<nav class="nav">
<a href="/">Home</a>
<a href="/page1">Interests</a>
<a href="/page3">Profiles</a>
<a href="/page4">Eiriaoloth</a>
</nav>
