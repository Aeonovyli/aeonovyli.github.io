---
layout: default
title: Settings | Aeonovyli's personal website
---

<div class="settings-page">
  <div class="settings-panel">
    <h1>Website Settings</h1>
    <p class="settings-description">Choose how this site should look. The choice is saved in this browser.</p>
    <form id="site-style-form" class="settings-form">
      <label class="setting-option">
        <input type="radio" name="site-style" value="none" checked>
        <span>Default</span>
      </label>
      <label class="setting-option">
        <input type="radio" name="site-style" value="current">
        <span>Stars</span>
      </label>
      <label class="setting-option">
        <input type="radio" name="site-style" value="old">
        <span>Old style</span>
      </label>
    </form>
  </div>
</div>

<script>
  (function () {
    const STORAGE_KEY = "aeonovyli-website-style";
    const form = document.getElementById("site-style-form");
    const selectedStyle = function () {
      const selected = form.querySelector('input[name="site-style"]:checked');
      return selected ? selected.value : "none";
    };

    function readSavedStyle() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "current" || saved === "old" || saved === "none") {
          return saved;
        }
      } catch (error) {
        return "none";
      }
      return "none";
    }

    function setCurrentRadio(value) {
      const radios = form.querySelectorAll('input[name="site-style"]');
      radios.forEach((radio) => {
        radio.checked = radio.value === value;
      });
    }

    function applyTheme(value) {
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch (error) {
        // ignore restricted browser storage issues
      }

      if (window.applySavedSiteStyle) {
        window.applySavedSiteStyle(value);
      }

      if (window.location.pathname === "/settings") {
        document.body.classList.toggle("background-png-mode", value === "none");
        document.body.style.color = value === "none" ? "#ffffff" : "#ffd700";
      }
    }

    setCurrentRadio(readSavedStyle());

    form.addEventListener("change", function () {
      const value = selectedStyle();
      applyTheme(value);
      window.location.reload();
    });
  })();
</script>

<style>
  .settings-page {
    max-width: 700px;
    margin: 64px auto;
    padding: 0 20px;
  }

  .settings-panel {
    background: rgba(20, 20, 20, 0.9);
    border: 1px solid #00f0ff;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
    padding: 30px;
    color: #ffd700;
  }

  .settings-panel h1 {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: clamp(2rem, 4vw, 2.8rem);
  }

  .settings-description {
    margin-bottom: 28px;
    color: #d8d8d8;
  }

  .settings-form {
    display: grid;
    gap: 16px;
  }

  .setting-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid rgba(0, 240, 255, 0.6);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.02);
    cursor: pointer;
    color: inherit;
  }

  .setting-option input {
    accent-color: #ffd700;
    width: 18px;
    height: 18px;
    margin: 0;
  }

  body.background-png-mode .settings-panel,
  body.background-png-mode .setting-option {
    border-color: #ffffff;
    color: #ffffff !important;
  }
</style>
