---
layout: default
title: Contact me
---

# Contact me
#### Leave a message below. Only logged-in users can post.
#### If there's anything wrong, please tell me.
#### Currently this webpage is having problems. 

<div class="message-box">
  <!-- AUTH SECTION -->
  <div id="auth-ui" style="margin-bottom: 20px; padding: 15px; background: rgba(20, 20, 20, 0.6); border-radius: 8px; border: 1px solid #00f0ff;">
    <button id="loginBtn" class="submit-btn" style="display:none;">Login with GitHub to Post</button>
    
    <div id="user-info" style="display:none; align-items: center; gap: 12px;">
      <img id="user-avatar" src="" style="width:35px; border-radius:50%; border: 1px solid #ffd700;">
      <div>
        <span id="user-name" style="font-weight:bold; display:block; color: #ffd700;"></span>
        <button id="logoutBtn" style="background:none; border:none; color:#ff4500; cursor:pointer; text-decoration:underline; padding:0; font-size: 0.8em;">Logout</button>
      </div>
    </div>
  </div>

  <!-- MESSAGE FORM -->
  <form id="messageForm" style="display:none; margin-bottom: 30px;">
    <div class="form-group">
      <textarea id="userMessage" rows="4" required placeholder="Type your message..." style="width:100%; padding:10px; border-radius:4px; border:2px solid #00f0ff; background: rgba(20, 20, 20, 0.8); color: #ffd700; font-family: 'Cormorant Garamond', serif;"></textarea>
    </div>
    <button type="submit" id="submitBtn" class="submit-btn" style="margin-top:10px;">Post Message</button>
  </form>
  
  <div id="messagesDisplay" class="messages-display">
    <h3>Live Messages:</h3>
    <div id="messagesList" style="display: flex; flex-direction: column; gap: 15px;">Loading messages...</div>
  </div>
</div>

<script src="https://jsdelivr.net"></script>

<script>
  // Initialization
  const _supabase = supabase.createClient('https://supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2Jjcm1qZHVsYWVmaXloZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzU3NjksImV4cCI6MjA5MzAxMTc2OX0.zQDAVn4ZhW7QSC_WajxinnBHvg5Ry09xOZjxHOVMK2A');

  const messageForm = document.getElementById('messageForm');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const userInfo = document.getElementById('user-info');
  const messagesList = document.getElementById('messagesList');
  let currentSession = null;

  // UI Toggle Logic
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

  // Fetch Messages
  async function loadMessages() {
    const { data, error } = await _supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      messagesList.innerHTML = "Error loading messages. Check RLS settings.";
      console.error(error);
    } else {
      messagesList.innerHTML = data?.length ? '' : '<p style="color:gray;">No messages yet. Be the first!</p>';
      data?.forEach(msg => addMessageToUI(msg));
    }
  }

  function addMessageToUI(msg) {
    const user = currentSession?.user;
    const isAdmin = user?.user_metadata?.user_name === 'Aeonovyli';
    const isOwner = user?.id === msg.user_id;

    const div = document.createElement('div');
    div.className = 'message-item';
    div.style = "position:relative; padding: 15px; border-bottom: 1px solid #333;";
    
    const deleteBtn = (isOwner || isAdmin) 
      ? `<button onclick="deleteMsg('${msg.id}')" style="position:absolute; top:10px; right:10px; color:#ff4500; border:none; background:none; cursor:pointer;">Delete</button>` 
      : '';

    div.innerHTML = `
      ${deleteBtn}
      <strong style="color:#ff944d;">${msg.username || 'Anonymous'}</strong> 
      <small style="margin-left:8px; opacity: 0.6;">${new Date(msg.created_at).toLocaleString()}</small>
      <p style="margin: 10px 0 0 0; color:#ffd700;">${msg.content}</p>
    `;
    messagesList.appendChild(div);
  }

  // Actions
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
    else document.getElementById('userMessage').value = '';
    
    btn.disabled = false;
  };

  async function deleteMsg(id) {
    if (confirm("Delete this message?")) {
      const { error } = await _supabase.from('messages').delete().eq('id', id);
      if (error) alert("Delete failed: " + error.message);
    }
  }

  loginBtn.onclick = () => {
    _supabase.auth.signInWithOAuth({ 
      provider: 'github',
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
  };

  logoutBtn.onclick = () => {
    _supabase.auth.signOut().then(() => window.location.reload());
  };

  // Real-time listener
  _supabase.channel('messages-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, loadMessages)
    .subscribe();

  // Initial check
  updateUI();
</script>

<nav class="nav">
<a href="/">Home</a>
<a href="/page1">Interests</a>
<a href="/page3">Profiles</a>
<a href="/page4">Eiriaoloth</a>
</nav>
