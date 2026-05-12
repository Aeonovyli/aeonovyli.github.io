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
    visibility: hidden;
  }

  .book-page.active-page,
  .book-page.flipped {
    visibility: visible;
  }

  .book-page.buried {
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
    <div class="book-page active-page p1" onclick="flip(this)">
      <div class="page-face page-front">
        <a class="profile-link" href="https://bzflag.org">BZFlag: red rider</a>
      </div>
      <div class="page-face page-back">
        <p class="desc-area">Back side of BZFlag profile description.</p>
      </div>
    </div>
    <div class="book-page p2" onclick="flip(this)">
      <div class="page-face page-front">
        <a class="profile-link" href="https://github.com">GitHub: TheSilverStone</a>
      </div>
      <div class="page-face page-back"></div>
    </div>
    <div class="book-page p3" onclick="flip(this)">
      <div class="page-face page-front">
        <a class="profile-link" href="https://wikipedia.org">Wikipedia: Aeonovyli</a>
      </div>
      <div class="page-face page-back"></div>
    </div>
  </div>
</div>

<script>
function flip(el) {
  const container = document.getElementById('container');
  const pages = Array.from(document.querySelectorAll('.book-page'));
  
  el.classList.toggle('flipped');

  const flippedPages = pages.filter(p => p.classList.contains('flipped'));
  const lastFlippedIndex = flippedPages.length > 0 ? pages.indexOf(flippedPages[flippedPages.length - 1]) : -1;
  const firstUnflippedIndex = pages.findIndex(p => !p.classList.contains('flipped'));

  container.classList.toggle('shifted', flippedPages.length > 0);

  pages.forEach((p, i) => {
    p.classList.remove('active-page', 'buried');
    
    if (i === lastFlippedIndex || i === firstUnflippedIndex) {
      p.classList.add('active-page');
    } else if (p.classList.contains('flipped') && i < lastFlippedIndex) {
      p.classList.add('buried');
    } else if (!p.classList.contains('flipped') && i > firstUnflippedIndex) {
      p.style.visibility = 'hidden';
    } else {
      p.style.visibility = '';
    }
  });
}
</script>
