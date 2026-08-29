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

/* Flag that JS is running (CSS uses this to collapse the mobile nav). */
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

  /* ----- Footer copyright year ----- */
  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
