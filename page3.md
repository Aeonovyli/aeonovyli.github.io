---
layout: default
title: Digital Codex | Profiles
---

<div id="book-wrapper">
  <div id="my-book">
    
    <!-- PAGE 1: THE FRONTISPIECE -->
    <div class="page" data-density="hard">
      <div class="page-content center">
        <div class="shimmer-border"></div>
        <h1 class="gold-title">Digital Codex</h1>
        <div class="decorative-line"></div>
        <p class="flavor-text">A bridge across the digital breach.</p>
        <p class="signature">Aeonovyli</p>
        <div class="instruction">Drag a corner to begin</div>
      </div>
    </div>

    <!-- PAGE 2: PRIMARY NETWORK NODES -->
    <div class="page">
      <div class="page-content">
        <h3 class="gold-subtitle">Primary Nodes</h3>
        <div class="profile-item">
          <span class="label">GitHub: <a href="https://github.com">TheSilverStone</a></span>
          <p class="desc">The central forge. Where the source code for my digital architecture is refined and hosted.</p>
        </div>
        <div class="profile-item">
          <span class="label">Wikipedia: <a href="https://wikipedia.org">Aeonovyli</a></span>
          <p class="desc">A global editor’s seat. Dedicated to preserving accuracy and expanding the sum of human knowledge.</p>
        </div>
        <div class="profile-item">
          <span class="label">Reddit: <a href="https://reddit.com">knaTZB</a></span>
          <p class="desc">The common square. Used for deep-diving into niche communities and technical discussions.</p>
        </div>
      </div>
    </div>

    <!-- PAGE 3: GAMING & ENGINE MODS -->
    <div class="page">
      <div class="page-content">
        <h3 class="gold-subtitle">Creative & Gaming</h3>
        <div class="profile-item">
          <span class="label">BZFlag: <a href="https://bzflag.org">red rider</a></span>
          <p class="desc">A veteran signature within the open-source tank battle arena; a long-standing competitive presence.</p>
        </div>
        <div class="profile-item">
          <span class="label">Luanti: <a href="https://luanti.org">red rider</a></span>
          <p class="desc">Forum engagement for the voxel-based engine formerly known as Minetest.</p>
        </div>
        <div class="profile-item">
          <span class="label">ContentDB: <a href="https://luanti.org">Aeonovyli</a></span>
          <p class="desc">The workshop. Hosting modifications and technical tweaks for Luanti’s ecosystem.</p>
        </div>
      </div>
    </div>

    <!-- PAGE 4: LOGIC & ARCHIVE -->
    <div class="page">
      <div class="page-content">
        <h3 class="gold-subtitle">Logic & Strategy</h3>
        <div class="profile-item">
          <span class="label">Scratch: <a href="https://mit.edu">knaTZB</a></span>
          <p class="desc">Early logic experiments. An archive of initial creative coding and algorithmic puzzles.</p>
        </div>
        <div class="profile-item">
          <span class="label">Chess.com: <a href="https://chess.com">knaTZB</a></span>
          <p class="desc">The tactical arena. Engaged in strategic matches and complex pattern recognition.</p>
        </div>
        <div class="closing-note">
          <p>I am transitioning all identifiers to <strong>Aeonovyli</strong>—a unique sigil for my digital presence.</p>
        </div>
      </div>
    </div>

  </div>
</div>

<nav class="nav">
  <a href="/">Home</a>
  <a href="/page1">Interests</a>
  <a href="/page2">Contact me</a>
  <a href="/page4">Eiriaoloth</a>
  <a href="/page5">Games</a>
</nav>

<style>
  #book-wrapper { display: flex; justify-content: center; padding: 60px 0; z-index: 2; position: relative; }
  
  .page {
    background-color: rgba(13, 13, 13, 0.98); /* Near-solid dark to mesh with background */
    border: 2px solid #ffd700;
    padding: 40px;
    box-sizing: border-box;
    overflow: hidden;
    /* Invisible Book Magic: ensures back-side is never rendered */
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
  }

  .page-content { 
    color: #ffd700; 
    font-family: 'Cormorant Garamond', serif; 
    font-style: italic; 
    height: 100%; 
    transition: opacity 0.4s ease;
    opacity: 0; /* Hidden by default */
  }

  /* Logic to show content only when page is settled */
  .stPageFlip--active .page-content { opacity: 1; }
  .page.visible-content .page-content { opacity: 1; }

  /* Detailed Typography */
  .gold-title { font-family: 'Cinzel', serif; font-size: 2.6rem; text-align: center; margin: 0; text-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  .gold-subtitle { font-family: 'Cinzel', serif; border-bottom: 1px solid rgba(255, 215, 0, 0.4); margin-bottom: 25px; font-size: 1.5rem; letter-spacing: 2px; }
  .decorative-line { height: 1px; width: 80%; background: linear-gradient(90deg, transparent, #ffd700, transparent); margin: 20px auto; }
  
  .profile-item { margin-bottom: 22px; }
  .label { font-weight: bold; font-size: 1.2rem; display: block; margin-bottom: 4px; }
  .desc { font-size: 0.95rem; color: rgba(255, 215, 0, 0.75); line-height: 1.4; margin: 0; }
  
  .page-content a { color: #ffd700; text-decoration: none; border-bottom: 1px solid rgba(255, 215, 0, 0.5); transition: 0.3s; }
  .page-content a:hover { border-bottom: 1px solid #ffd700; text-shadow: 0 0 8px #ffd700; }
  
  .center { display: flex; flex-direction: column; justify-content: center; text-align: center; }
  .signature { font-family: 'Cinzel', serif; font-size: 1.2rem; margin-top: 20px; letter-spacing: 4px; }
  .instruction { font-size: 0.8rem; opacity: 0.4; margin-top: 40px; text-transform: uppercase; letter-spacing: 1px; }
</style>

<script src="https://jsdelivr.net"></script>
<script>
  window.addEventListener('load', function() {
    const pageFlip = new St.PageFlip(document.getElementById("my-book"), {
      width: 450, 
      height: 600,
      showCover: true,
      drawShadow: false, 
      flippingTime: 1000,
      usePortrait: true,
      mobileScrollSupport: true,
      swipeDistance: 30
    });

    const pages = document.querySelectorAll(".page");
    pageFlip.loadFromHTML(pages);

    // Dynamic Visibility Logic:
    // This kills the text visibility the millisecond a turn starts.
    pageFlip.on('flip', (e) => {
      pages.forEach(p => p.classList.remove('visible-content'));
      pages[e.data].classList.add('visible-content');
    });

    // Set initial page visibility
    pages[0].classList.add('visible-content');
  });
</script>
