---
layout: default
title: Profiles
---

<div id="book-wrapper">
  <div id="my-book">
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
    background-color: #0d0d0d; /* Matches your site background exactly */
    border: 2px solid #ffd700;
    padding: 40px;
    box-sizing: border-box;
    overflow: hidden;
    backface-visibility: hidden !important;
  }

  /* We keep content visible by default to prevent "blank boxes" if JS is slow */
  .page-content { 
    color: #ffd700; 
    font-family: 'Cormorant Garamond', serif; 
    font-style: italic; 
    height: 100%; 
    opacity: 1; 
  }

  /* During the flip animation, we hide it to prevent "backward text" ghosting */
  .flipping .page-content { opacity: 0; }

  .gold-title { font-family: 'Cinzel', serif; font-size: 2.6rem; text-align: center; margin: 0; }
  .gold-subtitle { font-family: 'Cinzel', serif; border-bottom: 1px solid rgba(255, 215, 0, 0.4); margin-bottom: 25px; font-size: 1.5rem; letter-spacing: 2px; }
  .decorative-line { height: 1px; width: 80%; background: #ffd700; margin: 20px auto; }
  .profile-item { margin-bottom: 22px; }
  .label { font-weight: bold; font-size: 1.2rem; display: block; margin-bottom: 4px; }
  .desc { font-size: 0.95rem; color: rgba(255, 215, 0, 0.75); line-height: 1.4; margin: 0; }
  .page-content a { color: #ffd700; text-decoration: underline; text-underline-offset: 3px; }
  .center { display: flex; flex-direction: column; justify-content: center; text-align: center; height: 100%; }
  .signature { font-family: 'Cinzel', serif; font-size: 1.2rem; margin-top: 20px; letter-spacing: 4px; }
  .instruction { font-size: 0.8rem; opacity: 0.4; margin-top: 40px; text-transform: uppercase; letter-spacing: 1px; }
  .closing-note { margin-top: auto; border-top: 1px solid rgba(255, 215, 0, 0.2); padding-top: 15px; font-size: 0.95rem; }
</style>

<script src="https://cdn.jsdelivr.net/npm/page-flip@2.0.7/dist/js/page-flip.browser.min.js"></script>
<script>
  window.addEventListener('load', function() {
    const pageFlip = new St.PageFlip(document.getElementById("my-book"), {
      width: 450, 
      height: 600,
      showCover: true,
      drawShadow: false, 
      flippingTime: 1000,
      usePortrait: true,
      mobileScrollSupport: true
    });

    const pages = document.querySelectorAll(".page");
    pageFlip.loadFromHTML(pages);

    // Hide text during the flip action to keep the "invisible" look perfect
    pageFlip.on('flip', (e) => {
        document.getElementById("my-book").classList.add("flipping");
        setTimeout(() => {
            document.getElementById("my-book").classList.remove("flipping");
        }, 1000); // Matches flippingTime
    });
  });
</script>
