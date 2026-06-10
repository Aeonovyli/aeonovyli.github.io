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
    <label for="name">First Name (Optional):</label>
    <input 
      type="text" 
      id="name" 
      name="name" 
      placeholder="Your Name"
    >
  </div>
  
  <button type="submit" class="submit-btn" id="submitBtn">Subscribe</button>
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

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
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
// Configuration - REPLACE THESE WITH YOUR MAILCHIMP DETAILS
const MAILCHIMP_SERVER = "us1"; // e.g., us1, us2, us5, etc. - check your Mailchimp account
const MAILCHIMP_LIST_ID = "YOUR_MAILCHIMP_LIST_ID"; // Get this from Mailchimp > Audience > Settings > Audience name and defaults
const MAILCHIMP_USER_ID = "YOUR_MAILCHIMP_USER_ID"; // Get this from your Mailchimp API key (the part after the dash)

document.getElementById('newsletterForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value || '';
  const messageEl = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');
  
  // Disable submit button during request
  submitBtn.disabled = true;
  submitBtn.textContent = 'Subscribing...';
  messageEl.classList.remove('success', 'error');
  messageEl.textContent = '';
  
  // Mailchimp API endpoint for JSONP callback
  const mailchimpUrl = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/`;
  
  // Prepare the data
  const data = {
    email_address: email,
    status: 'pending', // Sets to pending (requires email confirmation) - use 'subscribed' for automatic subscription
    merge_fields: {
      FNAME: name
    }
  };
  
  // Use the JSONP method (available without authentication for limited operations)
  const jsonpCallback = `callback_${Date.now()}`;
  
  window[jsonpCallback] = function(response) {
    if (response.status === 'pending' || response.status === 'subscribed') {
      messageEl.textContent = `Thank you for subscribing${name ? ', ' + name : ''}! Check your email to confirm your subscription.`;
      messageEl.classList.add('success');
      document.getElementById('newsletterForm').reset();
      
      // Re-enable button after 5 seconds
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe';
      }, 5000);
    } else {
      messageEl.textContent = 'An error occurred. Please try again.';
      messageEl.classList.add('error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Subscribe';
    }
  };
  
  // Create and send the JSONP request
  const script = document.createElement('script');
  script.src = mailchimpUrl + '?email_address=' + encodeURIComponent(email) + '&status=pending&merge_fields_FNAME=' + encodeURIComponent(name) + '&c=' + jsonpCallback;
  
  script.onerror = function() {
    messageEl.textContent = 'Error connecting to mailing list. Please check your configuration.';
    messageEl.classList.add('error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Subscribe';
  };
  
  document.head.appendChild(script);
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
<a href="/page10">Newsletter</a>
</nav>
