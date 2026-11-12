/* ============================================================================
   The Wellness Advocate — js/main.js
   Small, dependency-free script. No trackers, no cookies.

   ONE-LINE SETUP FOR BOOKING + PORTAL LINKS
   Every "Book a visit" button carries the class js-booking-link and every
   "Patient Portal" link carries js-portal-link. Paste the real OptiMantra
   addresses into the two lines below and every link on every page updates.
   Until then the links fall back to the booking section of the contact page.
   ========================================================================== */

/* EDIT: paste the real OptiMantra URLs between the quotes. */
var BOOKING_URL = "[TBD-CLIENT: OptiMantra booking URL]";
var PORTAL_URL = "[TBD-CLIENT: OptiMantra patient portal URL]";

/* Tell the stylesheet JavaScript is running (enables the mobile menu and motion). */
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  /* ----- Booking and portal links ----- */
  function wire(selector, url) {
    if (url.indexOf("TBD-CLIENT") !== -1) return; /* keep the fallback link */
    document.querySelectorAll(selector).forEach(function (link) {
      link.href = url;
      link.rel = "noopener";
    });
  }
  wire(".js-booking-link", BOOKING_URL);
  wire(".js-portal-link", PORTAL_URL);

  /* ----- Mobile menu ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
  }

  /* ----- Header hairline once the page scrolls ----- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----- Mark the current page in the menu -----
     Done here so the header markup can stay identical on every page. */
  var here = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    var target = (link.getAttribute("href") || "").split("#")[0];
    var isAction = link.classList.contains("nav-cta") || link.classList.contains("nav-portal");
    if (target === here && !isAction) link.setAttribute("aria-current", "page");
  });

  /* ----- Scroll reveals -----
     Elements with class "reveal" fade up as they come into view.
     A container with data-stagger reveals its children one after another. */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.classList.add("reveal");
      child.style.setProperty("--delay", (i * 0.09).toFixed(2) + "s");
    });
  });

  var items = document.querySelectorAll(".reveal");
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (calm || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          seen.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { seen.observe(el); });
  }

  /* ----- Footer year ----- */
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
