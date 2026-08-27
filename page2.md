---
layout: default
title: Contact me | Aeonovyli's personal website
---

# Contact me
Leave a message below. Only logged-in users can use this feature.

<div class="message-box">
  <div id="auth-ui" style="margin-bottom: 20px; padding: 15px; background: rgba(20, 20, 20, 0.6); border-radius: 8px; border: 1px solid #00f0ff;">
    <div id="login-options" style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 15px;">
      <a href="/page13" style="display: inline-block; background: transparent; color: #ffd700; border: 1px solid #ffd700; padding: 5px 12px; text-decoration: none; border-radius: 4px; font-family: 'Cormorant Garamond', serif; font-weight: bold; font-size: 0.95em; transition: all 0.3s ease;">Sign In</a>
      <a href="/page12" style="display: inline-block; background: transparent; color: #ffd700; border: 1px solid #ffd700; padding: 5px 12px; text-decoration: none; border-radius: 4px; font-family: 'Cormorant Garamond', serif; font-weight: bold; font-size: 0.95em; transition: all 0.3s ease;">Sign Up</a>
    </div>
    <div id="user-info" style="display: none; align-items: flex-start; gap: 12px; margin-bottom: 15px;">
      <img id="user-avatar" src="" style="width:35px; border-radius:50%; border: 1px solid #ffd700;">
      <div style="display: flex; flex-direction: column; align-items: flex-start;">
        <span id="user-name" style="font-weight:bold; display:block; color: #ffd700; font-family: 'Cormorant Garamond', serif;"></span>
        <button onclick="logout()" style="background:none; border:none; color:#ff4500; cursor:pointer; text-decoration:underline; padding:0; font-size: 0.8em; font-family: 'Cormorant Garamond', serif;">Logout</button>
      </div>
    </div>
  </div>
  <form id="messageForm" style="display:none; margin-bottom: 30px;">
    <div class="form-group">
      <textarea id="userMessage" rows="4" required placeholder="Type your message..." style="width:100%; padding:10px; border-radius:4px; border:2px solid #00f0ff; background: rgba(20, 20, 20, 0.8); color: #ffd700; font-family: 'Cormorant Garamond', serif;"></textarea>
    </div>
    <button type="submit" id="submitBtn" style="margin-top:10px; background: transparent; color: #ffd700; border: 1px solid #ffd700; padding: 8px 20px; cursor: pointer; border-radius: 4px; font-family: 'Cormorant Garamond', serif; font-weight: bold; font-size: 1em;">Post Message</button>
  </form>
  <div id="messagesDisplay" class="messages-display">
    <h3 style="color: #ffd700; font-family: 'Cormorant Garamond', serif;">Live Messages:</h3>
    <div id="messagesList" style="display: flex; flex-direction: column; gap: 15px;">Messages loading...</div>
  </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const _supabase = supabase.createClient('https://flwbcrmjdulaefiyhdkh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2Jjcm1qZHVsYWVmaXloZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzU3NjksImV4cCI6MjA5MzAxMTc2OX0.zQDAVn4ZhW7QSC_WajxinnBHvg5Ry09xOZjxHOVMK2A');
  const messageForm = document.getElementById('messageForm');
  const loginOptions = document.getElementById('login-options');
  const userInfo = document.getElementById('user-info');
  const messagesList = document.getElementById('messagesList');
  let currentSession = null;

  async function recordUserLogin(user) {
    const metadata = user.user_metadata || {};
    const uniqueId = user.id;
    const username = metadata.full_name || metadata.user_name || metadata.login || metadata.email || 'Anonymous';
    const avatarUrl = metadata.avatar_url || metadata.picture || 'https://via.placeholder.com/35';
    const userEmail = metadata.email || null;
    const { error } = await _supabase.from('user_visits').upsert([{
      github_user_id: uniqueId,
      github_username: username,
      full_name: metadata.full_name || username,
      avatar_url: avatarUrl,
      email: userEmail,
      updated_at: new Date().toISOString() 
    }], { onConflict: 'github_user_id' });
    if (error) console.error('Error recording login:', error);
  }
  
  async function checkUser() {
    const { data: { session } } = await _supabase.auth.getSession();
    currentSession = session;
    if (session) {
      const user = session.user;
      await recordUserLogin(user);
      loginOptions.style.display = 'none';
      userInfo.style.display = 'flex';
      messageForm.style.display = 'block';
      const name = user.user_metadata.full_name || user.user_metadata.user_name || user.user_metadata.email || "User";
      document.getElementById('user-name').innerText = name;
      document.getElementById('user-avatar').src = user.user_metadata.avatar_url || user.user_metadata.picture || 'https://via.placeholder.com/35';
    } else {
      loginOptions.style.display = 'flex';
      userInfo.style.display = 'none';
      messageForm.style.display = 'none';
    }
    loadMessages();
  }

  async function loadMessages() {
    const { data, error } = await _supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) {
      messagesList.innerHTML = "Error loading messages. Please check your Supabase RLS settings.";
      console.error(error);
    } else {
      messagesList.innerHTML = '';
      if (data.length === 0) {
        messagesList.innerHTML = '<p style="color:gray; font-family: \'Cormorant Garamond\', serif;">No messages yet.</p>';
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
    const editBtn = canEdit ? `<button onclick="toggleEdit('${msg.id}')" style="position:absolute; top:10px; right:75px; color:#ffd700; border:none; background:none; cursor:pointer; font-weight:bold; font-family: 'Cormorant Garamond', serif;">Edit</button>` : '';
    const deleteBtn = (isOwner || isAdmin) ? `<button onclick="deleteMsg('${msg.id}')" style="position:absolute; top:10px; right:10px; color:#ff4500; border:none; background:none; cursor:pointer; font-weight:bold; font-family: 'Cormorant Garamond', serif;">Delete</button>` : '';
    div.innerHTML = `${editBtn}${deleteBtn}<strong style="color:#ff944d; font-family: 'Cormorant Garamond', serif;">${msg.username || 'Anonymous'}</strong> <small class="timestamp" style="margin-left:8px; font-family: 'Cormorant Garamond', serif;">${new Date(msg.created_at).toLocaleString()}</small><p style="margin: 10px 0 0 0; color:#ffd700; line-height:1.5; font-family: 'Cormorant Garamond', serif;"><span id="text-${msg.id}">${msg.content}</span></p>`;
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
    const username = user.user_metadata.full_name || user.user_metadata.user_name || user.user_metadata.email || 'Anonymous';
    const { error } = await _supabase.from('messages').insert([{ content: content, username: username, user_id: user.id }]);
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
    textSpan.parentElement.innerHTML = `<textarea id="edit-input-${id}" style="width:100%; margin-top:10px; background:rgba(20,20,20,0.8); color:#ffd700; border:1px solid #00f0ff; padding:8px; font-family: 'Cormorant Garamond', serif;">${currentContent}</textarea><div style="margin-top:5px;"><button onclick="saveEdit('${id}')" style="color:#00f0ff; background:none; border:1px solid #00f0ff; cursor:pointer; padding:2px 10px; border-radius:4px; font-family: 'Cormorant Garamond', serif;">Save</button><button onclick="loadMessages()" style="color:ff4500; background:none; border:none; cursor:pointer; margin-left:10px; font-family: 'Cormorant Garamond', serif;">Cancel</button></div>`;
  }

  async function saveEdit(id) {
    const newContent = document.getElementById(`edit-input-${id}`).value;
    const { error } = await _supabase.from('messages').update({ content: newContent }).eq('id', id);
    if (error) {
      alert("Update failed: " + error.message);
    } else {
      loadMessages();
    }
  }

  function logout() {
    _supabase.auth.signOut().then(() => location.reload());
  }

  _supabase.channel('public:messages').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => { loadMessages(); }).subscribe();
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
    cursor: pointer; font-size: 0.7em; border-radius: 3px; padding: 2px 5px; font-family: 'Cormorant Garamond', serif;
  }
  .ban-btn:active { animation: banClickGlow 0.6s ease-in-out 1; }
  a:hover, button:hover {
    background: rgba(255, 215, 0, 0.1);
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  }
</style>
<div id="profile-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 10000; font-family: 'Cormorant Garamond', serif;">
  <button id="profileBtn" onclick="toggleProfiles()" style="background: rgba(20, 20, 20, 0.9); color: #ffd700; border: 1px solid #00f0ff; padding: 10px 18px; border-radius: 4px; cursor: pointer; font-weight: bold; box-shadow: 0 0 10px rgba(0,240,255,0.3);">
    Profiles' History
  </button>
  <div id="profileList" style="display: none; background: rgba(10, 10, 10, 0.95); border: 1px solid #00f0ff; border-radius: 4px; width: 280px; max-height: 400px; overflow-y: auto; position: absolute; bottom: 50px; right: 0; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
    <div style="padding: 10px; border-bottom: 1px solid #00f0ff; background: rgba(0, 240, 255, 0.1); color: #ffd700; font-size: 0.9em; font-weight: bold; position: sticky; top: 0;">All Time User Directory</div>
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
  }  async function fetchAllVisitors() {
    const container = document.getElementById('profiles-container');
    const { data: { session } } = await _supabase.auth.getSession();
    const userMeta = session?.user?.user_metadata;
    const currentUsername = userMeta?.full_name || userMeta?.user_name || userMeta?.email || 'Anonymous';
    const isAdmin = userMeta?.full_name === 'Aeonovyli' || userMeta?.user_name === 'Aeonovyli' || userMeta?.nickname === 'Aeonovyli';
    const visitsResponse = await _supabase.from('user_visits').select('github_user_id, github_username, full_name, avatar_url, email, updated_at');
    const profilesResponse = await _supabase.from('profiles').select('user_id, username, avatar_url, email, updated_at');
    const visitsData = visitsResponse.data || [];
    const profilesData = profilesResponse.data || [];
    if (visitsResponse.error) {
      console.error('Error loading visits:', visitsResponse.error);
      container.innerHTML = '<p style="color:red; text-align:center; padding:10px;">Error loading visitors. Check console.</p>';
      return;
    }
    if (profilesResponse.error) console.error('Error loading profiles:', profilesResponse.error);
    const userMap = new Map();
    profilesData.forEach(profile => {
      if (profile.username) {
        userMap.set(profile.username.toLowerCase(), {
          username: profile.username,
          avatar_url: profile.avatar_url,
          email: profile.email,
          source: 'profiles'
        });
      }
    });
    visitsData.forEach(visitor => {
      const displayUsername = visitor.github_username || visitor.full_name || 'Unknown';
      if (displayUsername) {
        userMap.set(displayUsername.toLowerCase(), {
          username: displayUsername,
          avatar_url: visitor.avatar_url,
          email: visitor.email,
          source: 'user_visits'
        });
      }
    });
    const uniqueVisitors = Array.from(userMap.values()).sort((a, b) => a.username.localeCompare(b.username));
    if (uniqueVisitors.length === 0) {
      container.innerHTML = '<p style="color:#888; text-align:center; padding:10px; font-family: \'Cormorant Garamond\', serif;">No visitors yet.</p>';
      return;
    }
    container.innerHTML = uniqueVisitors.map(visitor => {
      const visitorUsername = visitor.username;
      const githubProfileUrl = `https://github.com/${visitor.username}`;
      const canBanUser = isAdmin && visitorUsername !== currentUsername;
      return `<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid rgba(0, 240, 255, 0.1); gap: 8px;"><div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">${visitor.avatar_url ? `<img src="${visitor.avatar_url}" alt="${visitorUsername}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #ffd700;">` : ''}<a href="${githubProfileUrl}" target="_blank" style="color: #00f0ff; text-decoration: none; font-size: 0.85em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${visitorUsername}">${visitorUsername}</a></div>${canBanUser ? `<button class="ban-btn" onclick="banUser('${visitorUsername.replace(/'/g, "\\'")}')">BAN</button>` : ''}</div>`;
    }).join('');
  }
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
</nav>
