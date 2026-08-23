---
layout: default
title: Contact me | Aeonovyli's personal website
---

# Contact me
Leave a message below. Only logged-in github users can use this feature.

<div class="message-box">
  <div id="auth-ui" style="margin-bottom: 20px; padding: 15px; background: rgba(20, 20, 20, 0.6); border-radius: 8px; border: 1px solid #00f0ff;">
    <button id="loginBtn" class="submit-btn" style="display:none;">Login with GitHub</button>
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
    <div id="messagesList" style="display: flex; flex-direction: column; gap: 15px;">Messages loading...</div>
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
        messagesList.innerHTML = '<p style="color:gray;">No messages yet.</p>';
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
    const editBtn = canEdit ? `<button onclick="toggleEdit('${msg.id}')" style="position:absolute; top:10px; right:75px; color:#ffd700; border:none; background:none; cursor:pointer; font-weight:bold;">Edit</button>` : '';
    
    const deleteBtn = (isOwner || isAdmin) 
      ? `<button onclick="deleteMsg('${msg.id}')" style="position:absolute; top:10px; right:10px; color:#ff4500; border:none; background:none; cursor:pointer; font-weight:bold;">Delete</button>` 
      : '';

        div.innerHTML = `
      ${editBtn}
      ${deleteBtn}
      <strong style="color:#ff944d;">${msg.username || 'Anonymous'}</strong> 
      <small class="timestamp" style="margin-left:8px;">${new Date(msg.created_at).toLocaleString()}</small>
      <p style="margin: 10px 0 0 0; color:#ffd700; line-height:1.5;">
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
      <textarea id="edit-input-${id}" style="width:100%; margin-top:10px; background:rgba(20,20,20,0.8); color:#ffd700; border:1px solid #00f0ff; padding:8px; font-family:inherit;">${currentContent}</textarea>
      <div style="margin-top:5px;">
        <button onclick="saveEdit('${id}')" style="color:#00f0ff; background:none; border:1px solid #00f0ff; cursor:pointer; padding:2px 10px; border-radius:4px;">Save</button>
        <button onclick="loadMessages()" style="color:ff4500; background:none; border:none; cursor:pointer; margin-left:10px;">Cancel</button>
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

<style>
  @keyframes banClickGlow {
    0% { text-shadow: 1px 1px 4px #ff0000, 0 0 8px #ff4500; }
    50% { text-shadow: 1px 1px 15px #ff0000, 0 0 25px #ff0000; }
    100% { text-shadow: 1px 1px 4px #ff0000, 0 0 8px #ff4500; }
  }
  .ban-btn {
    background: none; border: 1px solid #ff4500; color: #ff4500; 
    cursor: pointer; font-size: 0.7em; border-radius: 3px; padding: 2px 5px;
  }
  .ban-btn:active { animation: banClickGlow 0.6s ease-in-out 1; }
</style>

<div id="profile-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: 'Cormorant Garamond', serif;">
  <button id="profileBtn" onclick="toggleProfiles()" style="background: rgba(20, 20, 20, 0.9); color: #ffd700; border: 1px solid #00f0ff; padding: 10px 18px; border-radius: 4px; cursor: pointer; font-weight: bold; box-shadow: 0 0 10px rgba(0,240,255,0.3);">
    Profiles' History
  </button>

  <div id="profileList" style="display: none; background: rgba(10, 10, 10, 0.95); border: 1px solid #00f0ff; border-radius: 4px; width: 280px; max-height: 400px; overflow-y: auto; position: absolute; bottom: 50px; right: 0; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
    <div style="padding: 10px; border-bottom: 1px solid #00f0ff; background: rgba(0, 240, 255, 0.1); color: #ffd700; font-size: 0.9em; font-weight: bold; position: sticky; top: 0;">User Directory (All-Time)</div>
    <div id="profiles-container" style="padding: 5px 0;">
       <p style="color: #888; text-align: center; font-size: 0.8em; padding: 10px;">Loading...</p>
    </div>
  </div>
</div>

<script>
  async function banUser(username) {
    const confirmBan = confirm(`Are you sure you want to ban "${username}"? This will cast "${username}" into the fiery void of dipleasure.`);
    if (!confirmBan) return;

    const { error: banError } = await _supabase.from('blacklist').insert([{ username: username }]);
    if (banError) return alert("Error blacklisting: " + banError.message);

    await _supabase.from('messages').delete().eq('username', username);
    alert(username + " has been cast into the void.");
    fetchAllVisitors();
  }

  async function fetchAllVisitors() {
    const container = document.getElementById('profiles-container');
    const { data: { session } } = await _supabase.auth.getSession();
    
    const userMeta = session?.user?.user_metadata;
    const currentUsername = userMeta?.user_name || userMeta?.full_name;
    const isAdmin = userMeta?.user_name === 'Aeonovyli' || userMeta?.full_name === 'Aeonovyli' || userMeta?.nickname === 'Aeonovyli';

    const { data: visitors, error } = await _supabase
      .from('user_visits')
      .select('github_user_id, github_username, full_name, avatar_url')
      .order('github_username', { ascending: true });
    
    if (error) {
      container.innerHTML = '<p style="color:red; text-align:center; padding:10px;">Error loading visitors</p>';
      console.error(error);
      return;
    }

    const uniqueVisitors = [];
    const seenIds = new Set();
    
    visitors?.forEach(visitor => {
      if (!seenIds.has(visitor.github_user_id)) {
        uniqueVisitors.push(visitor);
        seenIds.add(visitor.github_user_id);
      }
    });

    if (uniqueVisitors.length === 0) {
      container.innerHTML = '<p style="color:#888; text-align:center; padding:10px;">No visitors yet.</p>';
      return;
    }

    container.innerHTML = uniqueVisitors.map(visitor => {
      const visitorUsername = visitor.github_username || visitor.full_name || 'Unknown User';
      const githubProfileUrl = `https://github.com/${visitor.github_username}`;
      const canBanUser = isAdmin && visitorUsername !== currentUsername;
      
      return `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid rgba(0, 240, 255, 0.1); gap: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
            ${visitor.avatar_url ? `<img src="${visitor.avatar_url}" alt="${visitorUsername}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #ffd700;">` : ''}
            <a href="${githubProfileUrl}" target="_blank" style="color: #00f0ff; text-decoration: none; font-size: 0.85em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${visitorUsername}">
              ${visitorUsername}
            </a>
          </div>
          ${canBanUser ? `<button class="ban-btn" onclick="banUser('${visitorUsername}')">BAN</button>` : ''}
        </div>
      `;
    }).join('');
  }

  function toggleProfiles() {
    const list = document.getElementById('profileList');
    list.style.display = list.style.display === 'none' ? 'block' : 'none';
    if (list.style.display === 'block') fetchAllVisitors();
  }

  _supabase.channel('public:user_visits')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'user_visits' }, () => {
      const list = document.getElementById('profileList');
      if (list.style.display === 'block') fetchAllVisitors();
    })
    .subscribe();

  const originalOnSubmit = messageForm.onsubmit;
  messageForm.onsubmit = async (e) => {
    e.preventDefault();
    const user = currentSession?.user;
    const username = user?.user_metadata?.full_name || user?.user_metadata?.user_name;

    const { data: isBanned } = await _supabase.from('blacklist').select('username').eq('username', username).single();
    if (isBanned) return alert("Your access has been revoked by Aeonovyli. If you feel that you should not have been banned, start an issue on the github repository.");
    
    await originalOnSubmit(e);
  };
</script>

<nav class="nav">
<a href="/">Home</a>
<a href="/page1">Interests</a>
<a href="/page3">Profiles</a>
<a href="/page4">Eiriaoloth</a>
<a href="https://bz-next.github.io/mapviewer6/mapviewer.html">BZFlag map editor</a>
<a href="/page6">Flash</a>
<a href="/page7">BZFlag</a>
<a href="/page8">Chess</a>
<a href="/page9">Sudoku</a>
<a href="/page10">Newsletter</a>
<a href="/page11">Keep Android Open</a>
<a href="/page12">Keep android open</a>
</nav>
