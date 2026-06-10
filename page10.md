---
layout: default
title: Newsletter
---

# Subscribe to My Newsletter

Join my mailing list to receive updates and interesting content directly in your inbox!

<form id="newsletterForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="newsletter-form">
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

<p style="margin-top: 20px; font-size: 14px; color: #666;">
  <strong>Setup Instructions:</strong><br>
  1. Go to <a href="https://formspree.io" target="_blank">formspree.io</a><br>
  2. Sign up (free)<br>
  3. Create a new form<br>
  4. Copy your form ID (looks like: abc123)<br>
  5. Replace "YOUR_FORM_ID" in the form action above with your actual ID<br>
  6. Done! Your newsletter form is now active.
</p>

<style>
.newsletter-form {
  max-width: 500px;
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.form-group input {
  padding: 10px;
  border: 1px solid #bbb;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
}

.submit-btn {
  padding: 12px 30px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #45a049;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>

---

<nav class="nav">
<a href="/">Home</a>
<a href="/page2">Contact me</a>
<a href="/page3">Profiles</a>
<a href="/page4">Eiriaoloth</a>
<a href="/page5">Games</a>
<a href="/page6">Flash</a>
<a href="/page7">BZFlag</a>
<a href="/page8">Chess</a>
<a href="/page9">Sudoku</a>
<a href="/page10">Newsletter</a>
</nav>
