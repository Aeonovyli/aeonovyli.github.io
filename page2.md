---
layout: default
title: Contact me
---

# Contact me
#### Leave a message below. Only logged-in users can post.

<div class="message-box">
  <!-- AUTH INTERFACE -->
  <div id="auth-ui" style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
    <button id="loginBtn" class="submit-btn" style="display:none;">Login with GitHub to Post</button>
    <div id="user-info" style="display:none; align-items: center; gap: 12px;">
      <img id="user-avatar" src="" style="width:35px; border-radius:50%; border: 1px solid #ddd;">
      <div>
        <span id="user-name" style="font-weight:bold; display:block;"></span>
        <button onclick="logout()" style="background:none; border:none; color:red; cursor:pointer; text-decoration:underline; padding:0; font-size: 0.8em;">Logout</button>
      </div>
    </div>
  </div>

  <!-- MESSAGE FORM -->
  <form id="messageForm" style="display:none; margin-bottom: 30px;">
    <div class="form-group">
      <label for="userMessage" style="display:block; margin-bottom:5px;">Your Message:</label>
      <textarea id="userMessage" name="userMessage" rows="4" required placeholder="Type your message here..." style="width:100%; border:1px solid #ccc; border-radius:4px; padding:8px;"></textarea>
    </div>
    <button type="submit" id="submitBtn" class="submit-btn" style="margin-top:10px;">Post Message</button>
  </form>
  
  <div id="messagesDisplay" class="messages-display">
    <h3>Live Messages:</h3>
    <div id="messagesList" style="display: flex; flex-direction: column; gap: 15px;">Loading...</div>
  </div>
</div>

<script src="https://jsdelivr.net"></script>

<script>
  const SUPABASE_URL = 'https://supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2Jjcm1qZHVsYWVmaXloZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzU3NjksImV4cCI6MjA5MzAxMTc2OX0.zQDAVn4ZhW7QSC_WajxinnBHvg5Ry09xOZjxHOVMK2A';
  const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const messageForm = document.getElementById('messageForm');
  const loginBtn = document.getElementById('loginBtn');
  const userInfo = document.getElementById('user-info');
  const messagesList = document.getElementById('messagesList');
  let currentSession = null;

  // --- 1. AUTHENTICATION ---
  async function checkUser() {
    const { data: { session } } = await _supabase.auth.getSession();
    currentSession = session;

    if (session) {
      const user = session.user;
      loginBtn.style.display = 'none';
      userInfo.style.display = 'flex';
      messageForm.style.display = 'block';
      document.getElementById('user-name').innerText = user.user_metadata.full_name || user.user_metadata.user_name;
      document.getElementById('user-avatar').src = user.user_metadata.avatar_url;
    } else {
      loginBtn.style.display = 'block';
      userInfo.style.display = 'none';
      messageForm.style.display = 'none';
    }
    loadMessages(); // Load messages after checking auth to determine delete buttons
  }

  loginBtn.addEventListener('click', () => {
    _supabase.auth.signInWithOAuth({ 
      provider: 'github',
      options: { redirectTo: window.location.href }
    });
  });

  async function logout() {
    await _supabase.auth.signOut();
    window.location.reload();
  }

  // --- 2. MESSAGING LOGIC ---
  async function loadMessages() {
    const { data, error } = await _supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      messagesList.innerHTML = "Error loading messages.";
    } else {
      messagesList.innerHTML = '';
      data.forEach(msg => addMessageToUI(msg, false));
    }
  }

  function addMessageToUI(msg, isNew = true) {
    // Check if current user is the owner or is the admin 'Aeonovyli'
    const userId = currentSession?.user?.id;
    const userMeta = currentSession?.user?.user_metadata;
    const isOwner = userId === msg.user_id;
    const isAdmin = userMeta?.full_name === 'Aeonovyli' || userMeta?.user_name === 'Aeonovyli';

    const div = document.createElement('div');
    div.id = `msg-${msg.id}`;
    div.style = "padding:12px; border:1px solid #eee; border-radius:6px; position:relative; background:white;";

    const deleteBtn = (isOwner || isAdmin) 
      ? `<button onclick="deleteMsg('${msg.id}')" style="position:absolute; top:10px; right:10px; color:#ff4d4d; border:none; background:none; cursor:pointer; font-weight:bold;">&times; Delete</button>` 
      : '';

    div.innerHTML = `
      ${deleteBtn}
      <strong style="color:#333;">${msg.username || 'User'}</strong>
      <span style="font-size:0.75em; color:#999; margin-left:8px;">${new Date(msg.created_at).toLocaleString()}</span>
      <p style="margin: 8px 0 0 0; color:#555; line-height:1.4;">${msg.content}</p>
    `;

    if (isNew) messagesList.prepend(div);
    else messagesList.appendChild(div);
  }

  // --- 3. ACTIONS ---
  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentSession) return alert("Sign in first!");

    const btn = document.getElementById('submitBtn');
    const content = document.getElementById('userMessage').value;

    btn.disabled = true;
    const { error } = await _supabase.from('messages').insert([{ 
      username: currentSession.user.user_metadata.full_name || currentSession.user.user_metadata.user_name,
      content: content,
      user_id: currentSession.user.id // Critical for RLS
    }]);

    if (error) alert("Error: " + error.message);
    else messageForm.reset();
    btn.disabled = false;
  });

  async function deleteMsg(id) {
    if (!confirm("Delete this message?")) return;
    const { error } = await _supabase.from('messages').delete().eq('id', id);
    if (error) alert("Delete failed: " + error.message);
  }

  // --- 4. REALTIME UPDATES ---
  _supabase.channel('room1')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, p => addMessageToUI(p.new, true))
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, p => {
      const el = document.getElementById(`msg-${p.old.id}`);
      if (el) el.remove();
    })
    .subscribe();

  checkUser();
</script>

<nav class="nav">
<a href="/">Home</a>
<a href="/page1">Interests</a>
<a href="/page3">Profiles</a>
<a href="/page4">Eiriaoloth</a>
</nav>
