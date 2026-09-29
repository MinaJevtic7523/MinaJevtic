(function () {
  "use strict";

  // Mobile menu
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  });

  // Scroll progress bar and active menu link
  var progress = document.getElementById("progress");
  var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";

    var current = sections[0];
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= 120) current = s;
    });
    links.forEach(function (a) {
      a.classList.toggle("active", current && a.getAttribute("href") === "#" + current.id);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  // Contact form: validate, then open the visitor's email app with the message filled in
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  var TO = "jevticm319@gmail.com";

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fields = ["firstname", "lastname", "email", "message"].map(function (id) {
      return document.getElementById(id);
    });
    var ok = true;
    fields.forEach(function (f) {
      var valid = f.value.trim() !== "" && (f.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
      f.classList.toggle("invalid", !valid);
      f.setAttribute("aria-invalid", String(!valid));
      if (!valid) ok = false;
    });

    if (!ok) {
      status.className = "form-status full error";
      status.textContent = "Please fill in all fields with a valid email address.";
      return;
    }

    var name = fields[0].value.trim() + " " + fields[1].value.trim();
    var subject = "Portfolio message from " + name;
    var body = fields[3].value.trim() + "\n\n" + name + "\n" + fields[2].value.trim();
    window.location.href =
      "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

    status.className = "form-status full ok";
    status.textContent = "Your email app should open with the message ready to send.";
  });
})();
