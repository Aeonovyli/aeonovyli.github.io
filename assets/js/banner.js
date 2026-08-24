(function () {
  "use strict";

  var COUNTDOWN_DATE = new Date("Jan 1, 2027 00:00:00").getTime();
  var MESSAGE = "Android will become a locked-down platform in";
  var LINK_URL = "https://keepandroidopen.org";

  var style = document.createElement("style");
  style.textContent = 
    ".kao-custom-banner {" +
      "position: fixed;" +
      "top: 0;" +
      "left: 0;" +
      "width: 100%;" +
      "z-index: 9999;" +
      "background: rgba(5, 5, 20, 0.95);" +
      "border-bottom: 2px solid #ffd700;" +
      "color: #ffd700;" +
      "font-family: 'Cinzel', 'Arial Black', sans-serif;" +
      "font-weight: 700;" +
      "text-align: center;" +
      "padding: 12px 20px;" +
      "box-shadow: 0 4px 15px rgba(0,0,0,0.5);" +
      "font-size: 16px;" +
      "letter-spacing: 0.5px;" +
      "display: flex;" +
      "justify-content: center;" +
      "align-items: center;" +
      "gap: 10px;" +
    "}" +
    ".kao-custom-banner a {" +
      "color: #ffd700;" +
      "text-decoration: none;" +
      "border-bottom: 1px solid transparent;" +
      "transition: border-color 0.3s;" +
    "}" +
    ".kao-custom-banner a:hover {" +
      "border-bottom-color: #ffd700;" +
    "}" +
    ".kao-countdown {" +
      "color: #00f3ff;" +
      "font-weight: 900;" +
      "text-shadow: 0 0 8px rgba(0, 243, 255, 0.4);" +
    "}";
  document.head.appendChild(style);

  var banner = document.createElement("div");
  banner.className = "kao-custom-banner";

  var textSpan = document.createElement("span");
  textSpan.textContent = MESSAGE;

  var link = document.createElement("a");
  link.href = LINK_URL;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.appendChild(textSpan);
  banner.appendChild(link);

  var countdownSpan = document.createElement("span");
  countdownSpan.className = "kao-countdown";
  banner.appendChild(countdownSpan);

  document.body.insertBefore(banner, document.body.firstChild);

  var unitFormatters = {
    day: new Intl.NumberFormat("en", { style: "unit", unit: "day", unitDisplay: "short" }),
    hour: new Intl.NumberFormat("en", { style: "unit", unit: "hour", unitDisplay: "short" }),
    minute: new Intl.NumberFormat("en", { style: "unit", unit: "minute", unitDisplay: "short" }),
    second: new Intl.NumberFormat("en", { style: "unit", unit: "second", unitDisplay: "short" })
  };

  function formatUnit(value, unit) {
    return unitFormatters[unit].format(value);
  }

  function updateBanner() {
    var now = new Date().getTime();
    var distance = COUNTDOWN_DATE - now;

    if (distance < 0) {
      countdownSpan.textContent = "THE DATE HAS PASSED";
      return;
    }

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    var parts = [];
    if (days > 0) parts.push(formatUnit(days, "day"));
    if (days > 0 || hours > 0) parts.push(formatUnit(hours, "hour"));
    if (days > 0 || hours > 0 || minutes > 0) parts.push(formatUnit(minutes, "minute"));
    parts.push(formatUnit(seconds, "second"));

    countdownSpan.textContent = parts.join(" ");
  }

  setInterval(updateBanner, 1000);
  updateBanner();
})();
