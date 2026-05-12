---
layout: default
title: Profiles
---

<style>
  .book-container {
    perspective: 2000px;
    display: flex;
    justify-content: center;
    padding: 80px 0;
  }

  .book {
    position: relative;
    width: 350px;
    height: 500px;
    transform-style: preserve-3d;
  }

  .book-page {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-origin: left center;
    transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1);
    transform-style: preserve-3d;
    cursor: pointer;
  }

  /* Spreading effect: pages shifted along Z-axis based on position */
  .p1 { transform: translateZ(20px); z-index: 5; }
  .p2 { transform: translateZ(15px); z-index: 4; }
  .p3 { transform: translateZ(10px); z-index: 3; }
  .p4 { transform: translateZ(5px); z-index: 2; }
  .p5 { transform: translateZ(0px); z-index: 1; }

  /* Jump/Flip action on click */
  .book-page.flipped {
    transform: rotateY(-170deg) translateZ(0px) !important;
    z-index: 1 !important;
  }

  /* Hover "curl" hint */
  .book-page:not(.flipped):hover::after {
    content: "";
    position: absolute;
    top: 0; right: 0;
    width: 50px; height: 50px;
    background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.2) 100%);
    pointer-events: none;
  }

  .page-face {
    position: absolute;
    width: 100%; height: 100%;
    backface-visibility: hidden;
    background: rgba(255,255,255,0.01); /* Nearly invisible */
    border: 2px solid #333;
    padding: 30px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .page-back { transform: rotateY(180deg); border-style: dotted; }
  .profile-link { font-weight: bold; margin-bottom: 12px; display: block; }
  .desc-area { font-size: 0.95em; line-height: 1.5; color: #444; }
</style>

<div class="book-container">
  <div class="book" id="myBook">
    <!-- Pages with manual Z-offset for "spread" -->
    <div class="book-page p1" onclick="this.classList.toggle('flipped')">
      <div class="page-face page-front">
        <a class="profile-link" href="https://bzflag.org">BZFlag: red rider</a>
        <p class="desc-area">Click this page to flip. Notice how the stack has "depth" like a real spine.</p>
      </div>
      <div class="page-face page-back"><p class="desc-area">Back of BZFlag...</p></div>
    </div>
    <div class="book-page p2" onclick="this.classList.toggle('flipped')">
      <div class="page-face page-front">
        <a class="profile-link" href="https://github.com">GitHub: TheSilverStone</a>
        <p class="desc-area">The pages are stacked with translateZ to prevent flat-looking layers.</p>
      </div>
      <div class="page-face page-back"><p class="desc-area">Back of GitHub...</p></div>
    </div>
    <!-- Additional pages follow same pattern -->
    <div class="book-page p3" onclick="this.classList.toggle('flipped')">
      <div class="page-face page-front">
        <a class="profile-link" href="https://wikipedia.org">Wikipedia: Aeonovyli</a>
        <p class="desc-area">If a description gets too long, manually move the extra words to the back face.</p>
      </div>
      <div class="page-face page-back"></div>
    </div>
    <div class="book-page p4" onclick="this.classList.toggle('flipped')">
      <div class="page-face page-front">
        <a class="profile-link" href="https://reddit.com">Reddit: knaTZB</a>
        <p class="desc-area">A real book holds its place; this one will too.</p>
      </div>
      <div class="page-face page-back"></div>
    </div>
  </div>
</div>

<nav class="nav">
  <a href="/">Home</a>
  <a href="/page1">Interests</a>
  <a href="/page2">Contact me</a>
</nav>
