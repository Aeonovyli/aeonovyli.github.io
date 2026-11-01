---
layout: default
title: Settings | Aeonovyli's personal website
---

<div class="settings-page">
  <div class="settings-panel">
    <h1>Website Settings</h1>
    <p class="settings-description">Choose how this site should look. The choice is saved in this browser.</p>
    <form id="site-style-form">
      <label class="setting-option">
        <input type="radio" name="site-style" value="none" checked>
        <span>No stars / background.png</span>
      </label>
      <label class="setting-option">
        <input type="radio" name="site-style" value="current">
        <span>Current style</span>
      </label>
      <label class="setting-option">
        <input type="radio" name="site-style" value="old">
        <span>Old style</span>
      </label>
    </form>
    <div class="settings-actions">
      <button id="save-site-style" type="button">Save style</button>
      <button id="reset-site-style" class="secondary" type="button">Reset</button>
    </div>
    <p id="site-style-status" aria-live="polite"></p>
  </div>
</div>
<script>
  (function () {
    const STORAGE_KEY = "aeonovyli-website-style";
    const form = document.getElementById("site-style-form");
    const status = document.getElementById("site-style-status");
    const saveButton = document.getElementById("save-site-style");
    const resetButton = document.getElementById("reset-site-style");
    function getDefaultValue() { 
      return "none";
    }
    function setSelection(value) {
      const radios = form.querySelectorAll('input[name="site-style"]');
      radios.forEach((radio) => {
        radio.checked = radio.value === value;
      });
    }
    function loadSelection() {
      let value = getDefaultValue();
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "current" || saved === "old" || saved === "none") {
          value = saved;
        }
      } catch (error) {
        value = getDefaultValue();
      }
      setSelection(value);
      return value;
    }
    function saveSelection(value) {
      try {
        localStorage.setItem(STORAGE_KEY, value);
      } catch (error) {
      }
      if (window.applySavedSiteStyle) {
        window.applySavedSiteStyle(value);
      }
      status.textContent = "Style saved.";
    }
    loadSelection();
    saveButton.addEventListener("click", function () {
      const selected = form.querySelector('input[name="site-style"]:checked');
      const value = selected ? selected.value : getDefaultValue();
      saveSelection(value);
    });
    resetButton.addEventListener("click", function () {
      const defaultValue = getDefaultValue();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
      }
      setSelection(defaultValue);
      if (window.applySavedSiteStyle) {
        window.applySavedSiteStyle(defaultValue);
      }
      status.textContent = "Style reset to the default background.";
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
  #site-style-form {
    display: grid;
    gap: 16px;
    margin-bottom: 28px;
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
  }
  .setting-option input {
    accent-color: #ffd700;
    width: 18px;
    height: 18px;
    margin: 0;
  }
  .settings-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .settings-actions button {
    background: transparent;
    color: #ffd700;
    border: 1px solid #ffd700;
    border-radius: 6px;
    padding: 10px 18px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s ease, box-shadow 0.2s ease;
  }
  .settings-actions button:hover {
    background: rgba(255, 215, 0, 0.08);
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.25);
  }
  .settings-actions .secondary {
    border-color: #00f0ff;
    color: #00f0ff;
  }
  #site-style-status {
    min-height: 24px;
    margin: 16px 0 0;
    color: #9ce5ff;
  }
</style>
