---
layout: default
title: Newsletter
---

# Subscribe to My Newsletter

Join my mailing list to receive updates and interesting content directly in your inbox!

<form action="https://formspree.io/f/xgobzdnk" method="POST" class="newsletter-form">
  <div class="form-group">
    <label for="email">Email Address:</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      placeholder="your@email.com" 
      required
    >
  </div>
  
  <div class="form-group">
    <label for="name">First Name (Optional):</label>
    <input 
      type="text" 
      id="name" 
      name="name" 
      placeholder="Your Name"
    >
  </div>
  
  <button type="submit" class="submit-btn">Subscribe</button>
</form>

<p style="margin-top: 20px; font-size: 14px; color: #ffd700;">
  <strong>Newsletter Schedule:</strong> Sent weekly on Mondays
</p>

<div id="admin-section" style="display:none; margin-top: 40px; padding: 20px; background: rgba(255, 215, 0, 0.1); border: 2px solid #ffd700; border-radius: 8px;">
  <h3 style="color: #ffd700; margin-top: 0;">Newsletter Admin Panel</h3>
  <p style="color: #888; font-size: 0.9em;">Logged in as: <span id="admin-name" style="color: #ffd700; font-weight: bold;"></span></p>
  <button onclick="sendNewsletter()" class="submit-btn" style="background-color: #ffd700; color: #000; font-weight: bold;">Send Weekly Newsletter</button>
</div>

<style>
.newsletter-form {
  max-width: 500px;
  margin: 30px 0;
  padding: 24px;
  border: 1px solid #00ffff;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: bold;
  color: #ffd700;
}

.form-group input {
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  border: 1px solid #00ffff;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-family: inherit;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #ffd700;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

.form-group input::placeholder {
  color: #555555;
}

.submit-btn {
  width: auto;
  padding: 10px 20px;
  background-color: transparent;
  color: #ffd700;
  border: 2px solid #ffd700;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover {
  background-color: #ffd700;
  color: #000000;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.4);
}

.submit-btn:disabled {
  border-color: #444444;
  color: #444444;
  cursor: not-allowed;
}

.admin-btn {
  padding: 10px 20px;
  background-color: #ffd700;
  color: #000000;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s ease, box-shadow 0.2s ease;
}

.admin-btn:hover {
  opacity: 0.9;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
</style>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
  const _supabase = supabase.createClient('https://flwbcrmjdulaefiyhdkh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsd2Jjcm1qZHVsYWVmaXloZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MzU3NjksImV4cCI6MjA5MzAxMTc2OX0.zQDAVn4ZhW7QSC_WajxinnBHvg5Ry09xOZjxHOVMK2A');

  async function checkAdminUser() {
    const { data: { session } } = await _supabase.auth.getSession();

    if (session) {
      const user = session.user;
      const userMeta = user.user_metadata;
      const username = userMeta?.user_name || userMeta?.full_name || userMeta?.nickname;

      if (username === 'TheSilverStone' || username === 'Aeonovyli') {
        document.getElementById('admin-section').style.display = 'block';
        document.getElementById('admin-name').innerText = userMeta?.full_name || username;
      }
    }
  }

  function sendNewsletter() {
    const subscribersEmail = prompt('Paste subscriber emails (comma-separated):\n\nOr paste the list from your Formspree submissions.');
    
    if (!subscribersEmail) return;

    const subject = encodeURIComponent('Weekly Newsletter from TheSilverStone');
    const body = encodeURIComponent(`Hi Subscribers,

Here's this week's newsletter content:

---
Sent weekly on Mondays
Manage your subscription: https://thesilverstone.github.io/page10

Best regards,
TheSilverStone`);

    const mailtoLink = `mailto:?bcc=${encodeURIComponent(subscribersEmail)}&subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  }

  checkAdminUser();
</script>

---

<nav class="nav">
<a href="/">Home</a>
<a href="/page2">Contact me</a>
<a href="/page3">Profiles</a>
<a href="/page4">Eiriaoloth</a>
<a href="/page5">BZFlag Map Editor</a>
<a href="/page6">Flash</a>
<a href="/page7">BZFlag</a>
<a href="/page8">Chess</a>
<a href="/page9">Sudoku</a>
</nav>
