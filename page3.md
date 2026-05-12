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
    transition: transform 1s ease-in-out;
  }

  /* Shift book right when a page is flipped to keep it centered */
  .book-container.shifted {
    transform: translateX(175px); 
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
    /* Hide all pages by default to prevent bleed-through */
    visibility: hidden;
  }

  /* Logic: Only the top-most un-flipped page and the last flipped page are visible */
  .book-page.active-page,
  .book-page.flipped {
    visibility: visible;
  }

  /* Reset visibility for pages deep in the "flipped" stack */
  .book-page.flipped.buried {
    visibility: hidden;
  }

  .book-page.flipped {
    transform: rotateY(-180deg);
  }

  .page-face {
    position: absolute;
    width: 100%; height: 100%;
    backface-visibility: hidden;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.4);
    padding: 30px;
    box-sizing: border-box;
  }

  .page-back { transform: rotateY(180deg); }

  .profile-link, .desc-area { 
    color: #fff; 
    text-shadow: 1px 1px 3px rgba(0,0,0,0.9);
  }
</style>

<div class="book-container" id="container">
  <div class="book">
    <!-- PAGE 1 -->
    <div class="book-page active-page p1" onclick="flip(this)">
      <div class="page-face page-front">
        <a class="profile-link" href="https://bzflag.org">BZFlag: red rider</a>
        <p class="desc-area">Click to flip. The book will move right to show both sides clearly.</p>
      </div>
      <div class="page-face page-back">
        <p class="desc-area">Back side of BZFlag profile description.</p>
      </div>
    </div>
    <!-- PAGE 2 -->
    <div class="book-page p2" onclick="flip(this)">
      <div class="page-face page-front">
        <a class="profile-link" href="https://github.com">GitHub: TheSilverStone</a>
        <p class="desc-area">The text below this was hidden until you flipped the first page.</p>
      </div>
      <div class="page-face page-back"></div>
    </div>
    <!-- PAGE 3 -->
    <div class="book-page p3" onclick="flip(this)">
      <div class="page-face page-front">
        <a class="profile-link" href="https://wikipedia.org">Wikipedia: Aeonovyli</a>
        <p class="desc-area">No more jumbled text or overlapping words.</p>
      </div>
      <div class="page-face page-back"></div>
    </div>

  </div>
</div>

<script>
function flip(el) {
  const container = document.getElementById('container');
  const pages = Array.from(document.querySelectorAll('.book-page'));
  const index = pages.indexOf(el);

  // Toggle the flip
  el.classList.toggle('flipped');

  // Shift container right if any page is flipped
  const anyFlipped = pages.some(p => p.classList.contains('flipped'));
  container.classList.toggle('shifted', anyFlipped);

  // Visibility Logic: 
  // 1. Find the next page to show
  pages.forEach((p, i) => {
    p.classList.remove('active-page', 'buried');
    
    // Hide flipped pages that are covered by the current flipped page
    if (p.classList.contains('flipped') && i < index) {
      p.classList.add('buried');
    }
  });

  // Show the next page in the stack
  const nextP = pages.find(p => !p.classList.contains('flipped'));
  if (nextP) nextP.classList.add('active-page');
}
</script>
