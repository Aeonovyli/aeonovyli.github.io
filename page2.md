---
layout: default
title: Contact me
---

# Contact me
#### You can either use one of my profiles, page 3, or you can leave a message for me here. Note that I may not immediately respond, and the messaging logic is still being implmented.

#### Please use the same name as I know you by, and please do not change your name after using it once.

## Leave a Message

<div class="message-box">
  <form id="messageForm">
    <div class="form-group">
      <label for="userName">Your Name:</label>
      <input type="text" id="userName" name="userName" required placeholder="Enter your name">
    </div>
    
    <div class="form-group">
      <label for="userMessage">Your Message:</label>
      <textarea id="userMessage" name="userMessage" rows="5" required placeholder="Leave a message..."></textarea>
    </div>
    
    <button type="submit" class="submit-btn">Submit Message</button>
  </form>
  
  <div id="messagesDisplay" class="messages-display">
    <h3>Messages:</h3>
    <div id="messagesList"></div>
  </div>
</div>

<script>
document.getElementById('messageForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const name = document.getElementById('userName').value;
  const message = document.getElementById('userMessage').value;
  const timestamp = new Date().toLocaleString();
  
  // Get existing messages from localStorage
  let messages = JSON.parse(localStorage.getItem('messages')) || [];
  
  // Add new message
  messages.push({ name, message, timestamp });
  
  // Save to localStorage
  localStorage.setItem('messages', JSON.stringify(messages));
  
  // Clear form
  document.getElementById('messageForm').reset();
  
  // Display messages
  displayMessages();
});

function displayMessages() {
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  const messagesList = document.getElementById('messagesList');
  messagesList.innerHTML = '';
  
  messages.forEach(msg => {
    const msgElement = document.createElement('div');
    msgElement.className = 'message-item';
    msgElement.innerHTML = `
      <strong>${msg.name}</strong> <span class="timestamp">${msg.timestamp}</span>
      <p>${msg.message}</p>
    `;
    messagesList.appendChild(msgElement);
  });
}

// Display messages on page load
displayMessages();
</script>

<nav class="nav">
<a href="/">Home</a>
<a href="/page1">Interests</a>
<a href="/page3">Profiles</a>
<a href="/page4">Eiriaoloth</a>
</nav>