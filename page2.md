---
layout: default
title: Contact me
---

# Contact me
#### Leave a message below. Only logged-in users can post.

<div class="message-box">
  <!-- AUTH SECTION -->
  <div id="auth-ui">
    <button id="loginBtn" class="submit-btn" style="display:none;">Login with GitHub to Post</button>
    
    <div id="user-info" style="display:none;">
      <img id="user-avatar" src="">
      <div class="user-text-info">
        <span id="user-name"></span>
        <button id="logoutBtn">Logout</button>
      </div>
    </div>
  </div>

  <!-- MESSAGE FORM -->
  <form id="messageForm" style="display:none;">
    <div class="form-group">
      <textarea id="userMessage" rows="4" required placeholder="Type your message..."></textarea>
    </div>
    <button type="submit" id="submitBtn" class="submit-btn">Post Message</button>
  </form>
  
  <div id="messagesDisplay" class="messages-display">
    <h3>Live Messages:</h3>
    <div id="messagesList">Loading messages...</div>
  </div>
</div>

<script src="https://jsdelivr.net"></script>

<script>
  // Replace these with your actual credentials
  const _supabase = supabase.createClient('https://flwbcrmjdulaefiyhdkh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2Jjcm1qZHVsYWVmaXloZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzU3NjksImV4cCI6MjA5MzAxMTc2OX0.zQDAVn4ZhW7QSC_WajxinnBHvg5Ry09xOZjxHOVMK2A');

  const messageForm = document.getElementById('messageForm');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userInfo = document.getElementById('user-info');
  const messagesList = document.getElementById('messagesList');
  let currentSession = null;

  async function updateUI() {
    const { data: { session } } = await _supabase.auth.getSession();
    currentSession = session;

    if (session) {
      const user = session.user;
      loginBtn.style.display = 'none';
      userInfo.style.display = 'flex';
      messageForm.style.display = 'block';
      
      const name = user.user_metadata.full_name || user.user_metadata.user_name || "GitHub User";
      document.getElementById('user-name').innerText = name;
      document.getElementById('user-avatar').src = user.user_metadata.avatar_url;
    } else {
      loginBtn.style.display = 'block';
      userInfo.style.display = 'none';
      messageForm.style.display = 'none';
    }
    loadMessages();
  }

  async function loadMessages() {
    const { data, error } = await _supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      messagesList.innerHTML = "Error loading messages. Check Supabase RLS.";
      console.error(error);
    } else {
      messagesList.innerHTML = data?.length ? '' : '<p style="color:gray;">No messages yet.</p>';
      data?.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message-item';
        div.innerHTML = `
          <strong class="msg-user">${msg.username || 'Anonymous'}</strong> 
          <small class="timestamp">${new Date(msg.created_at).toLocaleString()}</small>
          <p class="msg-content">${msg.content}</p>
        `;
        messagesList.appendChild(div);
      });
    }
  }

  messageForm.onsubmit = async (e) => {
    e.preventDefault();
    const content = document.getElementById('userMessage').value.trim();
    if (!content || !currentSession) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;

    const { error } = await _supabase.from('messages').insert([{ 
      content: content, 
      username: currentSession.user.user_metadata.full_name || currentSession.user.user_metadata.user_name,
      user_id: currentSession.user.id 
    }]);

    if (error) alert("Error: " + error.message);
    else {
      document.getElementById('userMessage').value = '';
      loadMessages();
    }
    btn.disabled = false;
  };

  loginBtn.onclick = () => {
    _supabase.auth.signInWithOAuth({ 
      provider: 'github',
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
  };

  logoutBtn.onclick = () => {
    _supabase.auth.signOut().then(() => window.location.reload());
  };

  updateUI();
</script>

<nav class="nav">
<a href="/">Home</a>
<a href="/page1">Interests</a>
<a href="/page3">Profiles</a>
<a href="/page4">Eiriaoloth</a>
</nav>
