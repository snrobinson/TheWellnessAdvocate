/* ============================================================================
   The Wellness Advocate — js/main.js
   Minimal vanilla JS. No dependencies, no trackers, no cookies.

   ONE-LINE SETUP FOR BOOKING + PORTAL LINKS:
   Every "Book a visit" button and "Patient Portal" link on the site carries
   the class js-booking-link or js-portal-link. Paste the real URLs into the
   two constants below and every link site-wide updates automatically.
   Until then, those links fall back to the contact page's booking section.
   ========================================================================== */

/* EDIT: paste the real OptiMantra URLs between the quotes below. */
var BOOKING_URL = "[TBD-CLIENT: OptiMantra booking URL]";
var PORTAL_URL = "[TBD-CLIENT: OptiMantra patient portal URL]";

/* Flag that JS is running (CSS uses this for the mobile nav + scroll reveals). */
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  /* ----- Booking + portal links (leave fallback until URLs are real) ----- */
  if (BOOKING_URL.indexOf("TBD-CLIENT") === -1) {
    document.querySelectorAll(".js-booking-link").forEach(function (link) {
      link.href = BOOKING_URL;
    });
  }
  if (PORTAL_URL.indexOf("TBD-CLIENT") === -1) {
    document.querySelectorAll(".js-portal-link").forEach(function (link) {
      link.href = PORTAL_URL;
    });
  }

  /* ----- Mobile nav toggle ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ----- Header: soft shadow once the page scrolls ----- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----- Mark the current page in the nav (aria-current) -----
     Done in JS so the header markup can stay identical on every page. */
  var here = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    var target = link.getAttribute("href").split("#")[0];
    if (target === here && !link.classList.contains("nav-cta") &&
        !link.classList.contains("nav-portal")) {
      link.setAttribute("aria-current", "page");
    }
  });

  /* ----- Scroll reveals -----
     .reveal elements fade-and-rise into view. A container with
     data-stagger reveals its direct children one after another.
     Skipped entirely when the visitor prefers reduced motion. */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.classList.add("reveal");
      child.style.setProperty("--reveal-delay", (i * 90) + "ms");
    });
  });

  var revealables = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window && revealables.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealables.forEach(function (el) { observer.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ----- Footer copyright year ----- */
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
