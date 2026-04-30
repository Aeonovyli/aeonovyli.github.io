---
layout: default
title: Contact me
---

# Contact me
#### Leave a message below. Only logged-in users can post.

<div class="message-box">
  <div id="auth-ui" style="margin-bottom: 20px; padding: 20px; background: #111; border: 2px solid #00f0ff; text-align: center;">
    <button id="loginBtn" style="display:none; padding: 12px 24px; background-color: #00f0ff !important; color: #000 !important; border: none; font-weight: bold; cursor: pointer;">
      LOGIN WITH GITHUB
    </button>
    <div id="user-info" style="display:none; align-items: center; justify-content: center; gap: 12px;">
      <img id="user-avatar" src="" style="width:40px; border-radius:50%;">
      <span id="user-name" style="color: #ffd700;"></span>
      <button id="logoutBtn" style="color:#ff4500; background:none; border:none; cursor:pointer; text-decoration:underline;">Logout</button>
    </div>
  </div>

  <form id="messageForm" style="display:none;">
    <textarea id="userMessage" rows="4" style="width:100%; background: #222; color: #ffd700; border: 1px solid #00f0ff; padding: 10px;"></textarea>
    <button type="submit" id="submitBtn" class="submit-btn" style="margin-top:10px;">Post Message</button>
  </form>
  
  <div id="messagesDisplay" class="messages-display">
    <h3 style="color: #00f0ff;">Live Messages:</h3>
    <div id="messagesList">Loading...</div>
  </div>
</div>

<script src="https://jsdelivr.net"></script>
<script>
  // PASTE YOUR PROJECT URL AND ANON KEY IN THE QUOTES BELOW
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
      loginBtn.style.display = 'none';
      userInfo.style.display = 'flex';
      messageForm.style.display = 'block';
      const user = session.user;
      document.getElementById('user-name').innerText = user.user_metadata.full_name || user.user_metadata.user_name || "User";
      document.getElementById('user-avatar').src = user.user_metadata.avatar_url;
    } else {
      loginBtn.style.display = 'block';
      userInfo.style.display = 'none';
      messageForm.style.display = 'none';
    }
    loadMessages();
  }

  async function loadMessages() {
    const { data, error } = await _supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) { messagesList.innerHTML = "Error loading."; console.error(error); }
    else {
      messagesList.innerHTML = data?.length ? '' : 'No messages yet.';
      data?.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message-item';
        div.innerHTML = `<strong>${msg.username}</strong><p>${msg.content}</p>`;
        messagesList.appendChild(div);
      });
    }
  }

  messageForm.onsubmit = async (e) => {
    e.preventDefault();
    const content = document.getElementById('userMessage').value;
    const { error } = await _supabase.from('messages').insert([{ 
      content: content, 
      username: currentSession.user.user_metadata.user_name,
      user_id: currentSession.user.id 
    }]);
    if (!error) { document.getElementById('userMessage').value = ''; updateUI(); }
  };

  loginBtn.onclick = () => {
    _supabase.auth.signInWithOAuth({ 
      provider: 'github',
      options: { redirectTo: window.location.href }
    });
  };

  logoutBtn.onclick = () => { _supabase.auth.signOut().then(() => window.location.reload()); };

  updateUI();
</script>
