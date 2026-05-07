---
layout: default
title: Contact me
---

# Contact me
#### Leave a message below. Only logged-in users can post.
#### This page is currently broken.

<div class="message-box">
  <div id="auth-ui" style="margin-bottom: 20px; padding: 15px; background: rgba(20, 20, 20, 0.6); border-radius: 8px; border: 1px solid #00f0ff;">
    <button id="loginBtn" class="submit-btn" style="display:none;">Login with GitHub to Post</button>
    <div id="user-info" style="display:none; align-items: center; gap: 12px;">
      <img id="user-avatar" src="" style="width:35px; border-radius:50%; border: 1px solid #ffd700;">
      <div>
        <span id="user-name" style="font-weight:bold; display:block; color: #ffd700;"></span>
        <button onclick="logout()" style="background:none; border:none; color:#ff4500; cursor:pointer; text-decoration:underline; padding:0; font-size: 0.8em;">Logout</button>
      </div>
    </div>
  </div>

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
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  const _supabase = supabase.createClient('https://flwbcrmjdulaefiyhdkh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2Jjcm1qZHVsYWVmaXloZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzU3NjksImV4cCI6MjA5MzAxMTc2OX0.zQDAVn4ZhW7QSC_WajxinnBHvg5Ry09xOZjxHOVMK2A');

  const messageForm = document.getElementById('messageForm');
  const loginBtn = document.getElementById('loginBtn');
  const userInfo = document.getElementById('user-info');
  const messagesList = document.getElementById('messagesList');
  let currentSession = null;

  async function checkUser() {
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
      messagesList.innerHTML = "Error loading messages. Please check your Supabase RLS settings.";
      console.error(error);
    } else {
      messagesList.innerHTML = '';
      if (data.length === 0) {
        messagesList.innerHTML = '<p style="color:gray;">No messages yet. Be the first!</p>';
      } else {
        data.forEach(msg => addMessageToUI(msg));
      }
    }
  }

  function addMessageToUI(msg) {
    const user = currentSession?.user;
    const userMeta = user?.user_metadata;
    
    const isAdmin = userMeta?.full_name === 'TheSilverStone' || userMeta?.user_name === 'TheSilverStone' || userMeta?.nickname === 'TheSilverStone';
    const isOwner = user?.id === msg.user_id;

    const div = document.createElement('div');
    div.className = 'message-item';
    div.id = `msg-${msg.id}`;
    div.style = "position:relative;";
    
    const deleteBtn = (isOwner || isAdmin) 
      ? `<button onclick="deleteMsg('${msg.id}')" style="position:absolute; top:10px; right:10px; color:#ff4500; border:none; background:none; cursor:pointer; font-weight:bold;">&times; Delete</button>` 
      : '';

    div.innerHTML = `
      ${deleteBtn}
      <strong style="color:#ff944d;">${msg.username || 'Anonymous'}</strong> 
      <small class="timestamp" style="margin-left:8px;">${new Date(msg.created_at).toLocaleString()}</small>
      <p style="margin: 10px 0 0 0; color:#ffd700; line-height:1.5;">${msg.content}</p>
    `;
    messagesList.appendChild(div);
  }

  messageForm.onsubmit = async (e) => {
    e.preventDefault();
    if (!currentSession) return alert("Please log in first!");

    const btn = document.getElementById('submitBtn');
    const content = document.getElementById('userMessage').value;
    const user = currentSession.user;

    btn.disabled = true;
    btn.innerText = "Posting...";

    const { error } = await _supabase.from('messages').insert([{ 
      content: content, 
      username: user.user_metadata.full_name || user.user_metadata.user_name,
      user_id: user.id 
    }]);

    if (error) {
      alert("Error posting: " + error.message);
    } else {
      document.getElementById('userMessage').value = '';
    }
    btn.disabled = false;
    btn.innerText = "Post Message";
  };

  async function deleteMsg(id) {
    if (confirm("Are you sure you want to delete this message?")) {
      const { error } = await _supabase.from('messages').delete().eq('id', id);
      if (error) alert("Delete failed: " + error.message);
    }
  }
  
  loginBtn.onclick = () => {
    _supabase.auth.signInWithOAuth({ 
      provider: 'github',
      options: { 
        redirectTo: window.location.origin + window.location.pathname 
     }
    });
  };

  function logout() {
    _supabase.auth.signOut().then(() => location.reload());
  }

  _supabase.channel('public:messages')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
      loadMessages();
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
