# Contact me
Leave a message below. Only logged-in users can use this feature.

<div class="message-box">
  <div id="auth-ui" style="margin-bottom: 20px; padding: 15px; background: rgba(20, 20, 20, 0.6); border-radius: 8px; border: 1px solid #00f0ff; text-align: center;">
    <div id="login-options">
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <a href="/page12" class="submit-btn" style="display: inline-block; background: #28a745; color: #fff; border: 1px solid #28a745; padding: 8px 16px; text-decoration: none; border-radius: 4px; cursor: pointer;">Sign Up</a>
        <a href="/page13" class="submit-btn" style="display: inline-block; background: #28a745; color: #fff; border: 1px solid #28a745; padding: 8px 16px; text-decoration: none; border-radius: 4px; cursor: pointer;">Sign In</a>
      </div>
    </div>
    <div id="user-info" style="display:none; align-items: center; gap: 12px; justify-content: center;">
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
  const supabaseUrl = 'https://flwbcrmjdulaefiyhdkh.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2Jjcm1qZHVsYWVmaXloZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzU3NjksImV4cCI6MjA5MzAxMTc2OX0.zQDAVn4ZhW7QSC_WajxinnBHvg5Ry09xOZjxHOVMK2A';
  const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

  const messageForm = document.getElementById('messageForm');
  const loginOptions = document.getElementById('login-options');
  const userInfo = document.getElementById('user-info');
  const messagesList = document.getElementById('messagesList');
  let currentSession = null;

  async function recordUserLogin(user) {
    const userId = user.id;
    const username = user.user_metadata.user_name || user.user_metadata.login || user.email || 'Unknown User';
    const fullName = user.user_metadata.full_name || user.email || username;
    const avatar = user.user_metadata.avatar_url || user.user_metadata.picture;

    await _supabase.from('user_visits').upsert([{
      github_user_id: userId,
      github_username: username,
      full_name: fullName,
      avatar_url: avatar,
      last_login: new Date().toISOString()
    }], { onConflict: 'github_user_id' });
  }

  async function checkUser() {
    const { data: { session } } = await _supabase.auth.getSession();
    currentSession = session;

    if (session) {
      await recordUserLogin(session.user);
      loginOptions.style.display = 'none';
      userInfo.style.display = 'flex';
      messageForm.style.display = 'block';
      
      const name = session.user.user_metadata.full_name || session.user.user_metadata.user_name || session.user.email || "User";
      const avatar = session.user.user_metadata.avatar_url || session.user.user_metadata.picture;
      
      document.getElementById('user-name').innerText = name;
      if(avatar) document.getElementById('user-avatar').src = avatar;
    } else {
      loginOptions.style.display = 'block';
      userInfo.style.display = 'none';
      messageForm.style.display = 'none';
    }
    loadMessages();
  }

  async function loadMessages() {
    const { data, error } = await _supabase.from('messages').select('*').order('created_at', { ascending: false });

    if (error) {
      messagesList.innerHTML = "Error loading messages.";
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
    const nameCheck = userMeta?.full_name || userMeta?.user_name || user?.email;
    const isAdmin = nameCheck === 'Aeonovyli' || userMeta?.user_name === 'Aeonovyli';
    const isOwner = user?.id === msg.user_id;

    const div = document.createElement('div');
    div.className = 'message-item';
    div.id = `msg-${msg.id}`;
    div.style = "position:relative;";

    const editBtn = (isOwner || isAdmin) ? `<button onclick="toggleEdit('${msg.id}')" style="position:absolute; top:10px; right:75px; color:#ffd700; border:none; background:none; cursor:pointer; font-weight:bold;">Edit</button>` : '';
    const deleteBtn = (isOwner || isAdmin) ? `<button onclick="deleteMsg('${msg.id}')" style="position:absolute; top:10px; right:10px; color:#ff4500; border:none; background:none; cursor:pointer; font-weight:bold;">Delete</button>` : '';

    div.innerHTML = `
      ${editBtn}
      ${deleteBtn}
      <strong style="color:#ff944d;">${msg.username || 'Anonymous'}</strong> 
      <small class="timestamp" style="margin-left:8px;">${new Date(msg.created_at).toLocaleString()}</small>
      <p style="margin: 10px 0 0 0; color:#ffd700; line-height:1.5;"><span id="text-${msg.id}">${msg.content}</span></p>
    `;
    messagesList.appendChild(div);
  }

  messageForm.onsubmit = async (e) => {
    e.preventDefault();
    if (!currentSession) return alert("Please log in first!");

    const btn = document.getElementById('submitBtn');
    const content = document.getElementById('userMessage').value;
    const user = currentSession.user;
    const username = user.user_metadata.full_name || user.user_metadata.user_name || user.email || "Anonymous";

    btn.disabled = true;
    btn.innerText = "Posting...";

    const { error } = await _supabase.from('messages').insert([{ content: content, username: username, user_id: user.id }]);

    if (error) {
      alert("Error posting: " + error.message);
    } else {
      document.getElementById('userMessage').value = '';
      loadMessages();
    }
    btn.disabled = false;
    btn.innerText = "Post Message";
  };

  async function deleteMsg(id) {
    if (confirm("Delete this message?")) {
      const { error } = await _supabase.from('messages').delete().eq('id', id);
      if (error) alert("Delete failed: " + error.message);
      else loadMessages();
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
    const { error } = await _supabase.from('messages').update({ content: newContent }).eq('id', id);
    if (error) alert("Update failed: " + error.message);
    else loadMessages();
  }

  function logout() {
    _supabase.auth.signOut().then(() => location.reload());
  }

  _supabase.channel('public:messages').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => { loadMessages(); }).subscribe();
  checkUser();
</script>
