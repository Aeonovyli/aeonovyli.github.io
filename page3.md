---
layout: default
title: Profiles
---

<div id="book-wrapper">
  <div id="my-book" style="visibility: hidden;">
    <div class="page" data-density="hard">
      <div class="page-content center">
        <h1 class="gold-title">Digital Codex</h1>
        <div class="decorative-line"></div>
        <p class="flavor-text">A bridge across the digital breach.</p>
        <p class="signature">Aeonovyli</p>
        <div class="instruction">Drag a corner to begin</div>
      </div>
    </div>
    <div class="page">
      <div class="page-content">
        <h3 class="gold-subtitle">Primary Nodes</h3>
        <div class="profile-item">
          <span class="label">GitHub: <a href="https://github.com">TheSilverStone</a></span>
          <p class="desc">The central forge. My primary hub for source code, digital architecture, and active project development.</p>
        </div>
        <div class="profile-item">
          <span class="label">Wikipedia: <a href="https://wikipedia.org">Aeonovyli</a></span>
          <p class="desc">The global record. A seat dedicated to preserving accuracy and expanding the sum of collective human knowledge.</p>
        </div>
        <div class="profile-item">
          <span class="label">Reddit: <a href="https://reddit.com">knaTZB</a></span>
          <p class="desc">The common square. Frequently utilized for community engagement and deep-diving into technical discussions.</p>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="page-content">
        <h3 class="gold-subtitle">Creative & Gaming</h3>
        <div class="profile-item">
          <span class="label">BZFlag: <a href="https://bzflag.org">red rider</a></span>
          <p class="desc">A veteran signature within the open-source tank battle arena; a long-standing presence in competitive play.</p>
        </div>
        <div class="profile-item">
          <span class="label">Luanti: <a href="https://luanti.org">red rider</a></span>
          <p class="desc">Forum engagement for the voxel-based engine formerly known as Minetest—a space for technical discussion.</p>
        </div>
        <div class="profile-item">
          <span class="label">ContentDB: <a href="https://luanti.org">Aeonovyli</a></span>
          <p class="desc">The workshop. Hosting various modifications, technical tweaks, and creative experiments for the Luanti ecosystem.</p>
        </div>
      </div>
    </div>
    <div class="page">
      <div class="page-content">
        <h3 class="gold-subtitle">Logic & Strategy</h3>
        <div class="profile-item">
          <span class="label">Scratch: <a href="https://mit.edu">knaTZB</a></span>
          <p class="desc">Early logic experiments. An archive of initial creative coding projects and algorithmic problem-solving.</p>
        </div>
        <div class="profile-item">
          <span class="label">Chess.com: <a href="https://chess.com">knaTZB</a></span>
          <p class="desc">The tactical arena. Dedicated to strategic match-play, pattern recognition, and endgame theory.</p>
        </div>
        <div class="closing-note">
          <p>I am transitioning all identifiers to <strong>Aeonovyli</strong>—a unique sigil for my digital presence across the web.</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="footer-nav">
  <nav class="nav">
    <a href="/">Home</a>
    <a href="/page1">Interests</a>
    <a href="/page2">Contact me</a>
    <a href="/page4">Eiriaoloth</a>
    <a href="/page5">Games</a>
  </nav>
</div>

<style>
  #book-wrapper { 
    display: flex; 
    justify-content: center; 
    padding: 40px 0; 
    min-height: 620px; 
    z-index: 2; 
    position: relative;
    touch-action: pan-y;
  }
  #my-book { 
    margin: 0 auto; 
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
  }
  .page {
    background-color: #0d0d0d; 
    border: 2px solid #ffd700;
    padding: 30px;
    box-sizing: border-box;
    overflow: hidden;
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
  }
  .page-content { color: #ffd700; font-family: 'Cormorant Garamond', serif; font-style: italic; height: 100%; }
  .gold-title { font-family: 'Cinzel', serif; font-size: 2.2rem; text-align: center; margin: 0; }
  .gold-subtitle { font-family: 'Cinzel', serif; border-bottom: 1px solid rgba(255, 215, 0, 0.4); margin-bottom: 20px; font-size: 1.3rem; }
  .decorative-line { height: 1px; width: 80%; background: #ffd700; margin: 15px auto; }
  .profile-item { margin-bottom: 15px; }
  .label { font-weight: bold; font-size: 1.1rem; display: block; }
  .desc { font-size: 0.9rem; color: rgba(255, 215, 0, 0.75); line-height: 1.3; margin: 0; }
  .page-content a { color: #ffd700; text-decoration: underline; }
  .center { display: flex; flex-direction: column; justify-content: center; text-align: center; height: 100%; }
  .signature { font-family: 'Cinzel', serif; font-size: 1.1rem; margin-top: 15px; letter-spacing: 3px; }
  .instruction { font-size: 0.7rem; opacity: 0.4; margin-top: 30px; text-transform: uppercase; }
  .closing-note { margin-top: auto; border-top: 1px solid rgba(255, 215, 0, 0.2); padding-top: 10px; font-size: 0.9rem; }
  
  .footer-nav {
    text-align: center;
    margin-top: 40px;
    padding-bottom: 40px;
    position: relative;
    z-index: 3;
  }
  .nav a {
    color: #ffd700;
    margin: 0 10px;
    text-decoration: none;
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
  }
</style>

<script src="https://jsdelivr.net"></script>
<script>
  window.addEventListener('load', function() {
    const bookContainer = document.getElementById("my-book");
    const pageFlip = new St.PageFlip(bookContainer, {
      width: 400, 
      height: 550,
      size: "fixed",
      showCover: true,
      drawShadow: false,
      flippingTime: 1000,
      usePortrait: true,
      mobileScrollSupport: false,
      clickEventForward: false
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));
    bookContainer.style.visibility = "visible";
  });
</script>
