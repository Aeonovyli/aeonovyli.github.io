---
layout: default
title: Newsletter
---

# Subscribe to My Newsletter

Join my mailing list to receive updates and interesting content directly in your inbox!

<form id="newsletterForm" class="newsletter-form">
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
    <label for="name">Name (Optional):</label>
    <input 
      type="text" 
      id="name" 
      name="name" 
      placeholder="Your Name"
    >
  </div>
  
  <button type="submit" class="submit-btn">Subscribe</button>
  <p id="formMessage" class="form-message"></p>
</form>

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

.form-message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
  display: none;
}

.form-message.success {
  display: block;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.form-message.error {
  display: block;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>

<script>
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value || 'Subscriber';
  const messageEl = document.getElementById('formMessage');
  
  // Store email data (you'll need to set up backend processing)
  const subscriptionData = {
    email: email,
    name: name,
    subscribedAt: new Date().toISOString()
  };
  
  // Log to console (replace with actual backend call)
  console.log('Newsletter Subscription:', subscriptionData);
  
  // Show success message
  messageEl.textContent = `Thank you for subscribing, ${name}! Check your email to confirm.`;
  messageEl.classList.remove('error');
  messageEl.classList.add('success');
  
  // Reset form
  this.reset();
  
  // Clear message after 5 seconds
  setTimeout(() => {
    messageEl.classList.remove('success');
  }, 5000);
});
</script>

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
</nav>
