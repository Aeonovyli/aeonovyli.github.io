# Contact me
Leave a message below. Only logged-in users can use this feature.

<div class="message-box">
  <div id="auth-ui" style="margin-bottom: 20px; padding: 15px; background: rgba(20, 20, 20, 0.6); border-radius: 8px; border: 1px solid #00f0ff; text-align: center;">
    <div id="login-options">
      <p style="color: #ffd700; margin-bottom: 10px; font-size: 0.9em;">Select a provider to sign in:</p>
      <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        <button onclick="loginWith('github')" class="submit-btn" style="background: #333; color: #fff; border: 1px solid #ffd700; padding: 8px 16px; cursor: pointer; border-radius: 4px;">GitHub</button>
        <button onclick="loginWith('email')" class="submit-btn" style="background: #28a745; color: #fff; border: 1px solid #28a745; padding: 8px 16px; cursor: pointer; border-radius: 4px;">Email</button>
        <button onclick="loginWith('apple')" class="submit-btn" style="background: #000; color: #fff; border: 1px solid #fff; padding: 8px 16px; cursor: pointer; border-radius: 4px;">Apple</button>
        <button onclick="loginWith('microsoft')" class="submit-btn" style="background: #00A4EF; color: #fff; border: 1px solid #00A4EF; padding: 8px 16px; cursor: pointer; border-radius: 4px;">Outlook</button>
      </div>
    </div>
    <div id="email-form" style="display:none; margin: 15px 0;">
      <input type="email" id="emailInput" placeholder="Enter your email" style="padding: 8px; border-radius: 4px; border: 1px solid #00f0ff; background: rgba(20, 20, 20, 0.8); color: #ffd700; width: 100%; max-width: 300px; margin-bottom: 10px;">
      <button onclick="sendEmailLogin()" class="submit-btn" style="background: #28a745; color: #fff; border: 1px solid #28a745; padding: 8px 16px; cursor: pointer; border-radius: 4px;">Send Magic Link</button>
      <button onclick="cancelEmailLogin()" style="background: none; border: none; color: #ff4500; cursor: pointer; margin: 10px 0;">Cancel</button>
    </div>
    <div id="user-info" style="display:none; align-items: center; gap: 12px; justify-content: center;">
      <img id="user-avatar" src="" style="width:35px; border-radius:50%; border: 1px solid #ffd700;">
      <div>
        <span id="user-name" style="font-weight:bold; display:block; color: #ffd700;"></span>
        <button onclick="logout()" style="background:none; border:none; color:#ff4500; cursor:pointer; text-decoration:underline; padding:0; font-size: 0.8em;">Logout</button>
      </div>
    </div>
  </div>
  <!-- Rest of your form remains the same -->
</div>
