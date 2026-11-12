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
var ENROLL_URL = "[TBD-CLIENT: OptiMantra enrollment URL]";   /* "Enroll online" on new-patients.html */
var INTAKE_URL = "[TBD-CLIENT: OptiMantra intake forms URL]"; /* "Open intake forms" on new-patients.html */

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
  wire(".js-enroll-link", ENROLL_URL);
  wire(".js-intake-link", INTAKE_URL);

  /* ----- Mobile menu ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    onScroll(); /* hide the floating buttons while the menu is open */
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

  /* ----- Services dropdown (desktop) -----
     Hover and keyboard focus open it without JavaScript; the small arrow
     button also opens it for touch screens. Escape or a click elsewhere closes it. */
  document.querySelectorAll(".has-sub").forEach(function (item) {
    var button = item.querySelector(".sub-toggle");
    if (!button) return;
    function setSub(open) {
      item.classList.toggle("is-open", open);
      item.classList.remove("is-dismissed");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    }
    button.addEventListener("click", function () {
      setSub(!item.classList.contains("is-open"));
    });
    item.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      setSub(false);
      item.classList.add("is-dismissed"); /* stays shut until focus or the pointer leaves */
      button.focus();
    });
    item.addEventListener("mouseleave", function () { item.classList.remove("is-dismissed"); });
    item.addEventListener("focusout", function (event) {
      if (!item.contains(event.relatedTarget)) item.classList.remove("is-dismissed");
    });
    document.addEventListener("click", function (event) {
      if (!item.contains(event.target)) setSub(false);
    });
  });

  /* ----- Scrolling: header hairline, header that steps aside, floating buttons -----
     The header slides away while reading down and returns on any scroll up
     (the CSS limits this to phones and tablets). After one screen of scrolling,
     a "Back to top" button appears, its ring filling as the page is read; on
     phones a "Book a visit" button joins it unless a booking button is already
     on screen. */
  var header = document.querySelector(".site-header");
  var toTop = document.querySelector(".to-top");
  var floatBook = document.querySelector(".float-book");
  var ring = document.querySelector(".to-top-progress");
  var calmMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var lastY = window.scrollY;
  var bookingInView = 0;
  var ticking = false;

  function update() {
    ticking = false;
    var y = window.scrollY;
    var screen = window.innerHeight;
    var menuOpen = !!(nav && nav.classList.contains("is-open"));
    if (header) {
      header.classList.toggle("is-scrolled", y > 4);
      var dy = y - lastY;
      if (Math.abs(dy) > 8) {
        var busy = !!header.querySelector(":focus-visible"); /* a keyboard user is in the header */
        header.classList.toggle("is-hidden", dy > 0 && y > header.offsetHeight * 2 && !menuOpen && !busy);
        lastY = y;
      }
      if (y <= 0) header.classList.remove("is-hidden");
    }
    var past = y > screen * 0.9 && !menuOpen;
    if (toTop) toTop.classList.toggle("is-visible", past);
    if (floatBook) floatBook.classList.toggle("is-visible", past && bookingInView === 0);
    if (ring) {
      var room = document.documentElement.scrollHeight - screen;
      var read = room > 0 ? Math.min(1, Math.max(0, y / room)) : 0;
      ring.setAttribute("stroke-dashoffset", (100 - read * 100).toFixed(1));
    }
  }
  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  if (header) {
    /* keyboard users tabbing back into the header always see it */
    header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });
  }
  update();

  /* hide the floating "Book a visit" while another booking button or the footer is visible */
  if (floatBook && "IntersectionObserver" in window) {
    var bookingSpots = document.querySelectorAll("main .button.js-booking-link, .closing, .site-footer");
    var watch = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var was = entry.target.dataset.inView === "1";
        if (entry.isIntersecting && !was) { bookingInView++; entry.target.dataset.inView = "1"; }
        if (!entry.isIntersecting && was) { bookingInView--; entry.target.dataset.inView = "0"; }
      });
      update();
    });
    bookingSpots.forEach(function (el) { watch.observe(el); });
  }

  /* back to top: scroll up, then put keyboard focus at the start of the page */
  if (toTop) {
    toTop.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: calmMotion.matches ? "auto" : "smooth" });
      var start = document.querySelector(".brand");
      if (start && event.detail === 0) start.focus({ preventScroll: true }); /* keyboard only */
    });
  }

  /* ----- Section navigator -----
     On pages with three or more sections, a small index follows the reader:
     desktop gets a slim rail on the right edge (one tick per section; the
     current one grows in rose gold and its name slides out briefly; hover or
     keyboard focus shows every name). Phones get a slim bar at the top that
     names the current section and opens the full list on tap; it appears
     while the header is tucked away and steps aside when the header returns.
     Labels come from each section's small eyebrow line; a section can set its
     own short label with data-nav-label="...". */
  var mainEl = document.getElementById("main");
  var sections = mainEl ? Array.prototype.filter.call(mainEl.children, function (el) {
    return el.tagName === "SECTION";
  }) : [];
  if (sections.length >= 3) {
    var labelFor = function (sec, i) {
      if (sec.dataset.navLabel) return sec.dataset.navLabel;
      if (i === 0 && (sec.classList.contains("hero") || sec.classList.contains("page-hero"))) return "Overview";
      var eyebrow = sec.querySelector(".eyebrow");
      var heading = sec.querySelector("h1, h2");
      return ((eyebrow || heading).textContent || "").trim();
    };
    var slug = function (text) { return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); };
    var entries = sections.map(function (sec, i) {
      var label = labelFor(sec, i);
      if (!sec.id) sec.id = i === 0 ? "overview" : slug(label);
      return { sec: sec, label: label };
    });

    var makeList = function (className, itemHtml) {
      var list = document.createElement("ol");
      list.className = className;
      entries.forEach(function (entry) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + entry.sec.id;
        a.innerHTML = itemHtml;
        a.querySelector("[data-label]").textContent = entry.label;
        li.appendChild(a);
        list.appendChild(li);
        entry[className] = a;
      });
      return list;
    };

    /* desktop rail */
    var rail = document.createElement("nav");
    rail.className = "section-rail";
    rail.setAttribute("aria-label", "Sections on this page");
    rail.appendChild(makeList("rail-list", '<span class="rail-label" data-label></span><span class="rail-tick" aria-hidden="true"></span>'));

    /* phone bar */
    var bar = document.createElement("nav");
    bar.className = "section-bar";
    bar.setAttribute("aria-label", "Sections on this page");
    bar.innerHTML = '<button class="section-bar-toggle" type="button" aria-expanded="false" aria-controls="section-bar-list">' +
      '<span class="section-bar-count" aria-hidden="true"></span><span class="section-bar-current"></span>' +
      '<span class="section-bar-chevron" aria-hidden="true"></span></button>' +
      '<span class="section-bar-progress" aria-hidden="true"></span>';
    var barList = makeList("bar-list", '<span data-label></span>');
    barList.id = "section-bar-list";
    bar.appendChild(barList);

    mainEl.appendChild(rail);
    mainEl.appendChild(bar);

    var barToggle = bar.querySelector(".section-bar-toggle");
    var barCurrent = bar.querySelector(".section-bar-current");
    var barCount = bar.querySelector(".section-bar-count");
    var barProgress = bar.querySelector(".section-bar-progress");
    var setBarOpen = function (open) {
      bar.classList.toggle("is-open", open);
      barToggle.setAttribute("aria-expanded", open ? "true" : "false");
    };
    barToggle.addEventListener("click", function () { setBarOpen(!bar.classList.contains("is-open")); });
    barList.addEventListener("click", function (event) { if (event.target.closest("a")) setBarOpen(false); });
    document.addEventListener("click", function (event) { if (!bar.contains(event.target)) setBarOpen(false); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && bar.classList.contains("is-open")) { setBarOpen(false); barToggle.focus(); }
    });

    var footerEl = document.querySelector(".closing") || document.querySelector(".site-footer");
    var current = -1;
    var flashTimer = null;
    var navTick = false;
    var updateSections = function () {
      navTick = false;
      var probe = window.innerHeight * 0.35;
      var index = 0;
      entries.forEach(function (entry, i) {
        if (entry.sec.getBoundingClientRect().top <= probe) index = i;
      });
      var heroBottom = entries[0].sec.getBoundingClientRect().bottom;
      var footerTop = footerEl ? footerEl.getBoundingClientRect().top : Infinity;
      var show = heroBottom < window.innerHeight * 0.4 && footerTop > window.innerHeight * 0.55;
      rail.classList.toggle("is-visible", show);
      if (!show) setBarOpen(false);
      /* the phone bar takes the header's place while the header is tucked away,
         and steps aside when the header comes back, so the two never stack */
      var headerShowing = !!header && !header.classList.contains("is-hidden");
      bar.classList.toggle("is-visible", show && !headerShowing);

      var room = document.documentElement.scrollHeight - window.innerHeight;
      barProgress.style.setProperty("--read", room > 0 ? Math.min(1, window.scrollY / room).toFixed(3) : "0");

      if (index !== current) {
        entries.forEach(function (entry, i) {
          [entry["rail-list"], entry["bar-list"]].forEach(function (a) {
            if (i === index) a.setAttribute("aria-current", "location");
            else a.removeAttribute("aria-current");
          });
        });
        barCurrent.textContent = entries[index].label;
        barCount.textContent = (index + 1) + " / " + entries.length;
        if (current !== -1 && show) {
          /* slide the new section's name out for a moment */
          rail.classList.add("is-announcing");
          clearTimeout(flashTimer);
          flashTimer = setTimeout(function () { rail.classList.remove("is-announcing"); }, 1800);
        }
        current = index;
      }
    };
    var onSectionScroll = function () {
      if (!navTick) { navTick = true; window.requestAnimationFrame(updateSections); }
    };
    window.addEventListener("scroll", onSectionScroll, { passive: true });
    window.addEventListener("resize", onSectionScroll);
    updateSections();
  }

  /* ----- Mark the current page in the menu -----
     Done here so the header markup can stay identical on every page. */
  var here = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".site-nav a").forEach(function (link) {
    var target = (link.getAttribute("href") || "").split("#")[0];
    var isAction = link.classList.contains("nav-cta") || link.classList.contains("nav-portal");
    if (target === here && !isAction) {
      link.setAttribute("aria-current", "page");
      /* on a service page, underline the "Services" parent too */
      var parent = link.closest(".has-sub");
      if (parent) parent.classList.add("is-current");
    }
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
