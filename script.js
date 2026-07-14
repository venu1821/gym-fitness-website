/* ===============================
   PULSE Fitness — Interactions
   =============================== */
(function () {
  "use strict";

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header scroll state + progress bar ---------- */
  var header = document.getElementById("header");
  var progress = document.getElementById("scrollProgress");
  var backToTop = document.getElementById("backToTop");

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle("scrolled", y > 40);
    if (backToTop) backToTop.classList.toggle("show", y > 500);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  function closeNav() {
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var open = navMenu.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = el.parentElement
              ? Array.prototype.indexOf.call(el.parentElement.children, el) % 4
              : 0;
            setTimeout(function () {
              el.classList.add("visible");
            }, delay * 90);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll(".stat-num");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var dur = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- Class schedule ---------- */
  var scheduleData = {
    Mon: [
      { t: "06:00", c: "Strength Foundations", k: "Marcus Reed" },
      { t: "09:30", c: "Mobility & Recovery", k: "Elena Cruz" },
      { t: "18:00", c: "HIIT Burn", k: "Elena Cruz" },
      { t: "19:30", c: "Powerlifting", k: "Damien Wolfe" }
    ],
    Tue: [
      { t: "07:00", c: "Spin Rush", k: "Elena Cruz" },
      { t: "12:00", c: "Strength Foundations", k: "Marcus Reed" },
      { t: "18:30", c: "Hypertrophy 101", k: "Damien Wolfe" }
    ],
    Wed: [
      { t: "06:00", c: "HIIT Burn", k: "Elena Cruz" },
      { t: "10:00", c: "Powerlifting", k: "Marcus Reed" },
      { t: "17:30", c: "Mobility & Recovery", k: "Damien Wolfe" },
      { t: "19:00", c: "Spin Rush", k: "Elena Cruz" }
    ],
    Thu: [
      { t: "07:00", c: "Strength Foundations", k: "Marcus Reed" },
      { t: "12:30", c: "HIIT Burn", k: "Elena Cruz" },
      { t: "18:00", c: "Hypertrophy 101", k: "Damien Wolfe" }
    ],
    Fri: [
      { t: "06:30", c: "Powerlifting", k: "Damien Wolfe" },
      { t: "09:00", c: "Spin Rush", k: "Elena Cruz" },
      { t: "18:00", c: "Strength Foundations", k: "Marcus Reed" }
    ],
    Sat: [
      { t: "08:00", c: "Weekend Warrior HIIT", k: "Elena Cruz" },
      { t: "10:00", c: "Open Powerlifting", k: "Marcus Reed" },
      { t: "11:30", c: "Mobility & Recovery", k: "Damien Wolfe" }
    ]
  };

  var scheduleList = document.getElementById("scheduleList");
  var scheduleTabs = document.getElementById("scheduleTabs");

  function renderSchedule(day) {
    if (!scheduleList) return;
    var items = scheduleData[day] || [];
    scheduleList.innerHTML = items
      .map(function (it, idx) {
        return (
          '<div class="schedule-item" style="animation-delay:' + idx * 60 + 'ms">' +
          '<span class="time">' + it.t + "</span>" +
          '<span class="cls">' + it.c + "</span>" +
          '<span class="coach">' + it.k + "</span>" +
          '<a href="#booking" class="btn btn-ghost book-mini">Book</a>' +
          "</div>"
        );
      })
      .join("");
  }

  if (scheduleTabs) {
    scheduleTabs.addEventListener("click", function (e) {
      var btn = e.target.closest(".tab");
      if (!btn) return;
      scheduleTabs.querySelectorAll(".tab").forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      renderSchedule(btn.getAttribute("data-day"));
    });
    renderSchedule("Mon");
  }

  /* ---------- Membership billing toggle ---------- */
  var billingSwitch = document.getElementById("billingSwitch");
  var labelMonthly = document.getElementById("labelMonthly");
  var labelAnnual = document.getElementById("labelAnnual");
  var amounts = document.querySelectorAll(".plan-price .amount");

  if (billingSwitch) {
    billingSwitch.addEventListener("click", function () {
      var annual = billingSwitch.getAttribute("aria-pressed") !== "true";
      billingSwitch.setAttribute("aria-pressed", String(annual));
      labelMonthly.classList.toggle("active", !annual);
      labelAnnual.classList.toggle("active", annual);
      amounts.forEach(function (el) {
        var val = annual ? el.getAttribute("data-annual") : el.getAttribute("data-monthly");
        el.textContent = val;
      });
    });
  }

  /* ---------- BMI Calculator ---------- */
  var unitToggle = document.getElementById("unitToggle");
  var heightUnit = document.getElementById("heightUnit");
  var weightUnit = document.getElementById("weightUnit");
  var bmiForm = document.getElementById("bmiForm");
  var bmiResult = document.getElementById("bmiResult");
  var bmiValue = document.getElementById("bmiValue");
  var bmiCategory = document.getElementById("bmiCategory");
  var bmiPointer = document.getElementById("bmiPointer");
  var bmiNote = document.getElementById("bmiNote");
  var heightInput = document.getElementById("height");
  var weightInput = document.getElementById("weight");
  var currentUnit = "metric";

  if (unitToggle) {
    unitToggle.addEventListener("click", function (e) {
      var btn = e.target.closest(".unit");
      if (!btn) return;
      currentUnit = btn.getAttribute("data-unit");
      unitToggle.querySelectorAll(".unit").forEach(function (u) {
        u.classList.remove("active");
        u.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      if (currentUnit === "metric") {
        heightUnit.textContent = "(cm)";
        weightUnit.textContent = "(kg)";
        heightInput.placeholder = "175";
        weightInput.placeholder = "72";
      } else {
        heightUnit.textContent = "(in)";
        weightUnit.textContent = "(lbs)";
        heightInput.placeholder = "69";
        weightInput.placeholder = "159";
      }
    });
  }

  function bmiCategoryInfo(bmi) {
    if (bmi < 18.5) return { cat: "Underweight", note: "Consider a strength and nutrition plan to build healthy mass. Our coaches can help." };
    if (bmi < 25) return { cat: "Healthy", note: "Great range! Keep training consistently to maintain and build performance." };
    if (bmi < 30) return { cat: "Overweight", note: "A structured conditioning program can move you toward your goals fast." };
    return { cat: "Obese", note: "Let's build a sustainable plan together — start with a free consultation." };
  }

  if (bmiForm) {
    bmiForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var h = parseFloat(heightInput.value);
      var w = parseFloat(weightInput.value);
      if (!h || !w || h <= 0 || w <= 0) {
        bmiResult.hidden = false;
        bmiValue.textContent = "—";
        bmiCategory.textContent = "Invalid input";
        bmiNote.textContent = "Please enter valid height and weight values.";
        return;
      }
      var bmi;
      if (currentUnit === "metric") {
        var m = h / 100;
        bmi = w / (m * m);
      } else {
        bmi = (703 * w) / (h * h);
      }
      bmi = Math.round(bmi * 10) / 10;
      var info = bmiCategoryInfo(bmi);
      bmiResult.hidden = false;
      bmiValue.textContent = bmi.toFixed(1);
      bmiCategory.textContent = info.cat;
      bmiNote.textContent = info.note;
      // Pointer position: map BMI 15..40 to 0..100%
      var pct = ((bmi - 15) / (40 - 15)) * 100;
      pct = Math.max(0, Math.min(100, pct));
      bmiPointer.style.left = pct + "%";
    });
  }

  /* ---------- Booking form ---------- */
  var bookingForm = document.getElementById("bookingForm");
  var bookingMsg = document.getElementById("bookingMsg");
  var bDate = document.getElementById("bDate");
  if (bDate) {
    var today = new Date().toISOString().split("T")[0];
    bDate.min = today;
  }
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!bookingForm.checkValidity()) {
        bookingMsg.textContent = "Please complete all fields.";
        bookingForm.reportValidity();
        return;
      }
      var name = document.getElementById("bName").value.split(" ")[0];
      var cls = document.getElementById("bClass").value;
      bookingMsg.textContent = "See you there, " + name + "! Your " + cls + " spot is reserved.";
      bookingForm.reset();
    });
  }

  /* ---------- Newsletter ---------- */
  var newsForm = document.getElementById("newsForm");
  var newsMsg = document.getElementById("newsMsg");
  if (newsForm) {
    newsForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!newsForm.checkValidity()) {
        newsForm.reportValidity();
        return;
      }
      newsMsg.textContent = "You're in! Check your inbox.";
      newsForm.reset();
    });
  }
})();
