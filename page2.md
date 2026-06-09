---
layout: default
title: Contact me
---

<h1>Contact me</h1>
<p style="text-align: center; max-width: 100%;">Leave a message below. Only logged-in GitHub users can use this feature.</p>

<div class="message-box">
  <div id="auth-ui" class="message-item">
    <button id="loginBtn" class="submit-btn" style="display:none; margin: 0 auto;">Login with GitHub</button>
    <div id="user-info" style="display:none; align-items: center; gap: 12px; width: 100%;">
      <img id="user-avatar" src="" style="width:36px; height:36px; border-radius:50%; border: 1px solid #334155;">
      <div>
        <span id="user-name" class="name-input" style="display:block;"></span>
        <button onclick="logout()" class="cancel-btn" style="margin-left: 0; font-size: 0.8rem; color: #f85149;">Logout</button>
      </div>
    </div>
  </div>

  <form id="messageForm" style="display:none; margin-bottom: 24px;">
    <div class="form-group">
      <textarea id="userMessage" rows="4" required placeholder="Type your message..."></textarea>
    </div>
    <button type="submit" id="submitBtn" class="submit-btn" style="margin-top:8px;">Post Message</button>
  </form>
  
  <div id="messagesDisplay" class="messages-display">
    <h3 style="font-size: 1.1rem; margin-bottom: 12px; text-shadow: none;">Live Messages</h3>
    <div id="messagesList" style="display: flex; flex-direction: column; gap: 12px;">Messages loading...</div>
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

  async function recordUserLogin(user) {
    const { error } = await _supabase.from('user_visits').upsert([{
      github_user_id: user.id,
      github_username: user.user_metadata.user_name || user.user_metadata.login,
      full_name: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url,
      last_login: new Date().toISOString()
    }], { onConflict: 'github_user_id' });
    
    if (error) console.error('Error recording login:', error);
  }

  async function checkUser() {
    const { data: { session } } = await _supabase.auth.getSession();
    currentSession = session;

    if (session) {
      const user = session.user;
      await recordUserLogin(user);
      
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
        messagesList.innerHTML = '<p style="color:#64748b; font-size: 0.9rem;">No messages yet.</p>';
      } else {
        data.forEach(msg => addMessageToUI(msg));
      }
    }
  }

  function addMessageToUI(msg) {
    const user = currentSession?.user;
    const userMeta = user?.user_metadata;
    
    const isAdmin = userMeta?.full_name === 'Aeonovyli' || userMeta?.user_name === 'Aeonovyli' || userMeta?.nickname === 'Aeonovyli' || userMeta?.name === 'Aeonovyli';
    const isOwner = user?.id === msg.user_id;

    const div = document.createElement('div');
    div.className = 'message-item';
    div.id = `msg-${msg.id}`;
    div.style = "position:relative;";

    const canEdit = isOwner || isAdmin;
    const editBtn = canEdit ? `<button onclick="toggleEdit('${msg.id}')" style="position:absolute; top:12px; right:64px; color:#38bdf8; border:none; background:none; cursor:pointer; font-size: 0.8rem;">Edit</button>` : '';
    
    const deleteBtn = (isOwner || isAdmin) 
      ? `<button onclick="deleteMsg('${msg.id}')" style="position:absolute; top:12px; right:12px; color:#f85149; border:none; background:none; cursor:pointer; font-size: 0.8rem;">Delete</button>` 
      : '';

    div.innerHTML = `
      ${editBtn}
      ${deleteBtn}
      <strong class="name-input" style="font-size: 0.9rem;">${msg.username || 'Anonymous'}</strong> 
      <small class="timestamp" style="margin-left:8px;">${new Date(msg.created_at).toLocaleString()}</small>
      <p style="margin: 8px 0 0 0; color:#e2e8f0; font-size: 0.95rem; line-height:1.5;">
        <span id="text-${msg.id}">${msg.content}</span>
      </p>
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

  function toggleEdit(id) {
    const textSpan = document.getElementById(`text-${id}`); 
    const currentContent = textSpan.innerText;

    textSpan.parentElement.innerHTML = `
      <textarea id="edit-input-${id}" class="edit-textarea" rows="3">${currentContent}</textarea>
      <div style="margin-top:6px; display:flex; gap:10px; align-items:center;">
        <button onclick="saveEdit('${id}')" class="save-btn">Save</button>
        <button onclick="loadMessages()" class="cancel-btn" style="margin-left:0; font-size:0.85rem; color:#f85149;">Cancel</button>
      </div>
    `;
  }

  async function saveEdit(id) {
    const newContent = document.getElementById(`edit-input-${id}`).value;
    const { error } = await _supabase
      .from('messages')
      .update({ content: newContent })
      .eq('id', id);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      loadMessages();
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
