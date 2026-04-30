---
layout: default
title: Contact me
---

# Contact me
#### Leave a message below. Only logged-in users can post.
#### Please tell me if anything isn't working. I can't fix it otherwise.

<div class="message-box">
  <div id="auth-ui" style="margin-bottom: 20px; padding: 15px; background: #f4f4f4; border-radius: 8px;">
    <button id="loginBtn" class="submit-btn" style="display:none;">Login with GitHub to Post</button>
    <div id="user-info" style="display:none; align-items: center; gap: 12px;">
      <img id="user-avatar" src="" style="width:35px; border-radius:50%;">
      <div>
        <span id="user-name" style="font-weight:bold; display:block;"></span>
        <button onclick="logout()" style="background:none; border:none; color:red; cursor:pointer; text-decoration:underline; padding:0; font-size: 0.8em;">Logout</button>
      </div>
    </div>
  </div>

  <form id="messageForm" style="display:none; margin-bottom: 30px;">
    <textarea id="userMessage" rows="4" required placeholder="Type your message..." style="width:100%; padding:10px; border-radius:4px; border:1px solid #ccc;"></textarea>
    <button type="submit" id="submitBtn" class="submit-btn" style="margin-top:10px;">Post Message</button>
  </form>
  
  <div id="messagesDisplay">
    <h3>Live Messages:</h3>
    <div id="messagesList" style="display: flex; flex-direction: column; gap: 15px;">Loading...</div>
  </div>
</div>

<script src="https://jsdelivr.net"></script>
<script>
  const _supabase = supabase.createClient('https://supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2Jjcm1qZHVsYWVmaXloZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzU3NjksImV4cCI6MjA5MzAxMTc2OX0.zQDAVn4ZhW7QSC_WajxinnBHvg5Ry09xOZjxHOVMK2A');

  const messagesList = document.getElementById('messagesList');
  let currentSession = null;

  async function checkUser() {
    const { data: { session } } = await _supabase.auth.getSession();
    currentSession = session;
    if (session) {
      document.getElementById('loginBtn').style.display = 'none';
      document.getElementById('user-info').style.display = 'flex';
      document.getElementById('messageForm').style.display = 'block';
      document.getElementById('user-name').innerText = session.user.user_metadata.full_name || session.user.user_metadata.user_name;
      document.getElementById('user-avatar').src = session.user.user_metadata.avatar_url;
    } else {
      document.getElementById('loginBtn').style.display = 'block';
    }
    loadMessages();
  }

  async function loadMessages() {
    const { data, error } = await _supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (!error) {
      messagesList.innerHTML = '';
      data.forEach(msg => addMessageToUI(msg));
    }
  }

  function addMessageToUI(msg) {
    const user = currentSession?.user;
    const isAdmin = user?.user_metadata.full_name === 'Aeonovyli' || user?.user_metadata.user_name === 'Aeonovyli';
    const isOwner = user?.id === msg.user_id;

    const div = document.createElement('div');
    div.id = `msg-${msg.id}`;
    div.style = "padding:15px; border:1px solid #ddd; border-radius:8px; position:relative; background:#fff;";
    
    const deleteBtn = (isOwner || isAdmin) ? `<button onclick="deleteMsg('${msg.id}')" style="position:absolute; top:10px; right:10px; color:red; border:none; background:none; cursor:pointer;">Delete</button>` : '';

    div.innerHTML = `
      ${deleteBtn}
      <strong>${msg.username}</strong> <small style="color:gray;">${new Date(msg.created_at).toLocaleString()}</small>
      <p style="margin-top:10px;">${msg.content}</p>
    `;
    messagesList.appendChild(div);
  }

  async function deleteMsg(id) {
    if(confirm("Delete this?")) await _supabase.from('messages').delete().eq('id', id);
  }

  document.getElementById('messageForm').onsubmit = async (e) => {
    e.preventDefault();
    const content = document.getElementById('userMessage').value;
    await _supabase.from('messages').insert([{ 
      content, 
      username: currentSession.user.user_metadata.full_name || currentSession.user.user_metadata.user_name,
      user_id: currentSession.user.id 
    }]);
    document.getElementById('messageForm').reset();
  };

  document.getElementById('loginBtn').onclick = () => _supabase.auth.signInWithOAuth({ provider: 'github' });
  function logout() { _supabase.auth.signOut(); location.reload(); }

  _supabase.channel('any').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => loadMessages()).subscribe();
  checkUser();
</script>
