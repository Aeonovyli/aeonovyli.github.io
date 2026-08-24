(function() {
  "use strict";

  var COUNTDOWN_DATE = new Date("Jan 1, 2027 00:00:00").getTime();
  var MESSAGE = "Android will become a locked-down platform in";
  var LINK_URL = "https://keepandroidopen.org";

  var style = document.createElement("style");
  style.textContent = 
    ".kao-custom-banner {" +
      "position: fixed !important;" +
      "top: 0 !important;" +
      "left: 0 !important;" +
      "width: 100% !important;" +
      "z-index: 99999 !important;" +
      "background: linear-gradient(180deg, #d32f2f 0%, #b71c1c 100%) !important;" +
      "border-bottom: 4px solid #801313 !important;" +
      "color: #ffffff !important;" +
      "font-family: 'Arial Black', sans-serif !important;" +
      "font-weight: 900 !important;" +
      "text-transform: uppercase !important;" +
      "letter-spacing: 2px !important;" +
      "font-size: 1.5rem !important;" +
      "text-align: center !important;" +
      "text-shadow: 0px 1px 0px #9e1a1a, 0px 2px 0px #8a1515, 0px 3px 0px #751111, 0px 4px 0px #5e0d0d, 0px 6px 10px rgba(0,0,0,0.5) !important;" +
      "padding: 0.5rem 2.5rem !important;" +
      "line-height: 1.6 !important;" +
      "box-sizing: border-box !important;" +
      "display: flex !important;" +
      "justify-content: center !important;" +
      "align-items: center !important;" +
      "gap: 10px !important;" +
      "min-height: 60px !important;" +
    "}" +
    ".kao-custom-banner a {" +
      "color: #ffffff !important;" +
      "text-decoration: none !important;" +
    "}" +
    ".kao-custom-banner a:hover {" +
      "text-decoration: underline !important;" +
    "}" +
    ".kao-countdown {" +
      "color: #ffffff !important;" +
      "font-weight: 900 !important;" +
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
    day: new Intl.NumberFormat("en", { style: "unit", unit: "day", unitDisplay: "narrow" }),
    hour: new Intl.NumberFormat("en", { style: "unit", unit: "hour", unitDisplay: "narrow" }),
    minute: new Intl.NumberFormat("en", { style: "unit", unit: "minute", unitDisplay: "narrow" }),
    second: new Intl.NumberFormat("en", { style: "unit", unit: "second", unitDisplay: "narrow" })
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
