/* ================================================================
   Eventra — main.js
   يحوي: بيانات الفعاليات، الفلترة/البحث، تحقق النموذج،
   زر العودة للأعلى، Dark Mode، localStorage، وتفاصيل الفعالية.
   ================================================================ */

/* -------- (1) مفاتيح التخزين -------- */
const STORE = {
  theme: "eventra:theme",
  lastFilter: "eventra:lastFilter",
};

/* -------- (2) بيانات الفعاليات
   صور JPG محلية في assets/img (مُحمَّلة من Unsplash).
   ملاحظة: صورة التخرج (event-graduation-gala-2026.jpg) مأخوذة من مصدر بديل لأن معرّف صورة Unsplash السابق كان يعيد 404. -------- */
const EVENTS = [
  {
    id: 1,
    title: "قمة الابتكار الرقمي",
    category: "tech",
    date: "2026-05-12",
    location: "قاعة المؤتمرات — المقر الرئيسي، دمشق (المزة غرباً)",
    image: "assets/img/event-summit-digital-innovation.jpg",
    excerpt: "لقاء سنوي حول التحول الرقمي، التعلّم الآلي، وأخلاقيات التقنية في الجامعات.",
    description:
      "تجمع القمة خبراء وباحثين من الجامعة الافتراضية السورية لمناقشة أدوات الذكاء الاصطناعي في التعليم، وأتمتة الخدمات الطلابية، وتحليل البيانات الأكاديمية. البرنامج يشمل جلسات رئيسية وورشتي عمل تطبيقيتين.",
    speakers: ["د. أحمد العلي", "م. لينا حسن", "د. فادي كنج"],
  },
  {
    id: 2,
    title: "معرض الشركات الناشئة",
    category: "business",
    date: "2026-06-03",
    location: "مركز النشاطات الطلابية — فرع حلب، الجامعة الافتراضية السورية",
    image: "assets/img/event-startup-showcase.jpg",
    excerpt: "منصة لعرض مشاريع الطلاب والخريجين أمام مستثمرين ومرشدين.",
    description:
      "يستضيف المعرض فرقاً ناشئة من طلاب وخريجي الجامعة الافتراضية السورية لعرض نماذج أولية، وخطط نمو، وفرص شراكة. تتوفر جلسات إرشاد فردي ولجنة تحكيم لاختيار أفضل ثلاثة عروض.",
    speakers: ["أ. سلمى درويش", "م. طارق مراد"],
  },
  {
    id: 3,
    title: "احتفالية «ألمع» — تخريج 2026",
    category: "social",
    date: "2026-07-20",
    location: "الساحة الأمامية — مقر الجامعة الافتراضية السورية، المزة",
    image: "assets/img/event-graduation-gala-2026.jpg",
    excerpt: "حفل رسمي يكرّم خريجي الدفعة بحضور العائلات والأساتذة.",
    description:
      "أمسية احتفالية تتضمن كلمات ترحيبية، توزيع الشهادات، عروضاً موسيقية خفيفة، وجلسة تصوير جماعي. الدعوة مفتوحة لعائلات الخريجين والأصدقاء بعد التسجيل المسبق.",
    speakers: ["رئيس الجامعة", "رئيس اتحاد الطلاب"],
  },
  {
    id: 4,
    title: "مختبر الويب التفاعلي",
    category: "workshop",
    date: "2026-05-28",
    location: "مختبر الحاسوب — مركز التعليم الإلكتروني، دمشق",
    image: "assets/img/event-interactive-web-lab.jpg",
    excerpt: "ورشة مكثفة: من هيكلة الصفحة إلى تفاعل بسيط باستخدام JavaScript.",
    description:
      "يومان عمليان يمرّان بالأساسيات ثم بناء واجهة صغيرة قابلة للنشر. تشمل الورشة تمارين موجهة، مراجعة كود، وشهادة حضور رقمية.",
    speakers: ["م. رامي خضر"],
  },
  {
    id: 5,
    title: "أسبوع الإبداع البصري",
    category: "arts",
    date: "2026-06-15",
    location: "صالة العرض — مبنى الخدمات الطلابية، دمشق",
    image: "assets/img/event-visual-creativity-week.jpg",
    excerpt: "معارض، عروض حية، وورش في التصميم والخط والتصوير لطلاب كليات متعددة.",
    description:
      "أسبوع يجمع أعمالاً طلابية من ست كليات: معارض تشكيلية، عروض موسيقية قصيرة، وورش مفتوحة للزوار. الدخول مجاني لحاملي بطاقة الطالب.",
    speakers: [],
  },
  {
    id: 6,
    title: "ليلة النجوم والكواكب",
    category: "tech",
    date: "2026-08-09",
    location: "منصة البث التفاعلي — بوابة الجامعة الافتراضية السورية",
    image: "assets/img/event-stars-planets-night.jpg",
    excerpt: "جلسة رصد ليلية مع شرح مبسط لحركة الكواكب والأجرام السماوية.",
    description:
      "جلسة بث مباشر وتطبيق تفاعلي لمحاكاة الرصد الفلكي، مع شرح من أساتذة الجامعة الافتراضية السورية. مناسبة للمبتدئين والعائلات.",
    speakers: ["د. هبة سرور"],
  },
];

const CATEGORY_LABELS = {
  tech: "تقنية",
  business: "أعمال",
  social: "اجتماعية",
  workshop: "ورش",
  arts: "فنون",
};

/* -------- (3) أدوات مساعدة -------- */
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("ar-EG", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch (_) { return iso; }
}
function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}
const CATEGORY_ICONS = {
  tech: "bi-cpu",
  business: "bi-briefcase",
  social: "bi-people",
  workshop: "bi-tools",
  arts: "bi-palette",
};

const CATEGORY_COLORS = {
  tech:     { bg: "rgba(6,182,212,.85)",   border: "rgba(6,182,212,.3)"  },
  business: { bg: "rgba(245,158,11,.85)",  border: "rgba(245,158,11,.3)" },
  social:   { bg: "rgba(99,102,241,.85)",  border: "rgba(99,102,241,.3)" },
  workshop: { bg: "rgba(16,185,129,.85)",  border: "rgba(16,185,129,.3)" },
  arts:     { bg: "rgba(217,70,239,.85)",  border: "rgba(217,70,239,.3)" },
};

/* بطاقة Grid الجديدة */
function evGridCard(ev) {
  const icon  = CATEGORY_ICONS[ev.category] || "bi-tag";
  const col   = CATEGORY_COLORS[ev.category] || { bg: "rgba(100,116,139,.85)", border: "rgba(100,116,139,.3)" };
  const short = ev.location.split("—")[0].trim();
  return `
    <div class="col-md-6 col-lg-4 ev-col">
      <article class="ev-card">
        <div class="ev-card__img-wrap">
          <img src="${ev.image}" alt="${ev.title}" loading="lazy">
          <span class="ev-card__badge" style="background:${col.bg};border-color:${col.border};color:#fff;">
            <i class="bi ${icon}" aria-hidden="true"></i>${CATEGORY_LABELS[ev.category] || ev.category}
          </span>
        </div>
        <div class="ev-card__body">
          <div class="ev-card__date"><i class="bi bi-calendar3" aria-hidden="true"></i>${formatDate(ev.date)}</div>
          <h3 class="ev-card__title">${ev.title}</h3>
          <p class="ev-card__excerpt">${ev.excerpt}</p>
          <div class="ev-card__footer">
            <span class="ev-card__loc"><i class="bi bi-geo-alt" aria-hidden="true"></i>${short}</span>
            <a href="event.html?id=${ev.id}" class="btn btn-primary btn-sm">التفاصيل <i class="bi bi-arrow-left" aria-hidden="true"></i></a>
            <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#bookModal" data-event-id="${ev.id}" title="حجز"><i class="bi bi-ticket-perforated"></i></button>
          </div>
        </div>
      </article>
    </div>`;
}

/* بطاقة List الجديدة */
function evListCard(ev) {
  const icon  = CATEGORY_ICONS[ev.category] || "bi-tag";
  const col   = CATEGORY_COLORS[ev.category] || { bg: "rgba(100,116,139,.85)", border: "rgba(100,116,139,.3)" };
  const short = ev.location.split("—")[0].trim();
  return `
    <div class="col-12 ev-col">
      <article class="ev-list-card">
        <div class="ev-list-card__img">
          <img src="${ev.image}" alt="${ev.title}" loading="lazy">
          <span class="ev-list-card__badge" style="background:${col.bg};border-color:${col.border};color:#fff;">
            <i class="bi ${icon}" aria-hidden="true"></i>${CATEGORY_LABELS[ev.category] || ev.category}
          </span>
        </div>
        <div class="ev-list-card__body">
          <div class="ev-list-card__meta">
            <span><i class="bi bi-calendar3" aria-hidden="true"></i>${formatDate(ev.date)}</span>
            <span><i class="bi bi-geo-alt" aria-hidden="true"></i>${short}</span>
          </div>
          <h3 class="ev-list-card__title">${ev.title}</h3>
          <p class="ev-list-card__excerpt">${ev.excerpt}</p>
          <div class="ev-list-card__footer">
            <a href="event.html?id=${ev.id}" class="btn btn-primary btn-sm">التفاصيل <i class="bi bi-arrow-left" aria-hidden="true"></i></a>
            <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#bookModal" data-event-id="${ev.id}" title="حجز"><i class="bi bi-ticket-perforated"></i></button>
          </div>
        </div>
      </article>
    </div>`;
}

/* بطاقة قديمة للرئيسية */
function cardHTML(ev) {
  const icon = CATEGORY_ICONS[ev.category] || "bi-tag";
  return `
    <article class="e-card h-100">
      <div class="position-relative">
        <img src="${ev.image}" alt="${ev.title}" class="card-img-top" loading="lazy">
        <span class="badge text-bg-light border position-absolute d-inline-flex align-items-center gap-1" style="top:.75rem;inset-inline-start:.75rem;">
          <i class="bi ${icon}" aria-hidden="true"></i>${CATEGORY_LABELS[ev.category] || ev.category}
        </span>
      </div>
      <div class="card-body d-flex flex-column">
        <small class="text-muted mb-1"><i class="bi bi-calendar3 me-1"></i>${formatDate(ev.date)}</small>
        <h3 class="card-title h6">${ev.title}</h3>
        <p class="text-muted small flex-grow-1">${ev.excerpt}</p>
        <div class="d-flex gap-2">
          <a href="event.html?id=${ev.id}" class="btn btn-primary btn-sm flex-grow-1">التفاصيل <i class="bi bi-arrow-left" aria-hidden="true"></i></a>
          <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#bookModal" data-event-id="${ev.id}" title="حجز"><i class="bi bi-ticket-perforated"></i></button>
        </div>
      </div>
    </article>
  `;
}

/* -------- (4) عرض الفعاليات على الرئيسية (تخطيط list) -------- */
function renderHomeFeatured() {
  const el = document.getElementById("featuredGrid");
  if (!el) return;
  el.innerHTML = EVENTS.slice(0, 3).map(evListCard).join("");
}

function renderHomeLatest() {
  const el = document.getElementById("latestGrid");
  if (!el) return;
  const latest = [...EVENTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  el.innerHTML = latest.map(evListCard).join("");
}

/* -------- (5) صفحة events.html: بحث + pill-فلاتر + تبديل عرض + ترتيب -------- */
function setupEventsPage() {
  const grid      = document.getElementById("eventsGrid");
  if (!grid) return;

  const searchEl  = document.getElementById("searchInput");
  const sortEl    = document.getElementById("sortSelect");
  const emptyMsg  = document.getElementById("emptyMsg");
  const countEl   = document.getElementById("resultsCount");
  const catPills  = document.querySelectorAll(".ev-cat-pill");
  const resetBtn  = document.getElementById("resetFilters");

  let currentCat = "";

  /* استرجاع فلترة محفوظة */
  const saved = JSON.parse(localStorage.getItem(STORE.lastFilter) || "{}");
  if (saved.q && searchEl) searchEl.value = saved.q;
  if (saved.cat) {
    currentCat = saved.cat;
    catPills.forEach(p => {
      const active = p.dataset.cat === saved.cat;
      p.classList.toggle("active", active);
      p.setAttribute("aria-pressed", String(active));
    });
  }

  /* قراءة ?cat= من URL */
  const urlCat = new URLSearchParams(location.search).get("cat") || "";
  if (urlCat) {
    currentCat = urlCat;
    catPills.forEach(p => {
      const active = p.dataset.cat === urlCat;
      p.classList.toggle("active", active);
      p.setAttribute("aria-pressed", String(active));
    });
  }

  function sortEvents(list) {
    const s = sortEl?.value || "date-asc";
    return [...list].sort((a, b) => {
      if (s === "date-asc")  return a.date.localeCompare(b.date);
      if (s === "date-desc") return b.date.localeCompare(a.date);
      if (s === "alpha")     return a.title.localeCompare(b.title, "ar");
      return 0;
    });
  }

  function render() {
    const qv = (searchEl?.value || "").trim().toLowerCase();
    const filtered = sortEvents(
      EVENTS.filter(ev => {
        const matchQ = !qv || ev.title.toLowerCase().includes(qv) || ev.excerpt.toLowerCase().includes(qv);
        const matchC = !currentCat || ev.category === currentCat;
        return matchQ && matchC;
      })
    );

    grid.innerHTML = filtered.map(evListCard).join("");

    if (countEl) {
      countEl.textContent = filtered.length
        ? `${filtered.length} فعالية`
        : "";
    }
    if (emptyMsg) emptyMsg.classList.toggle("d-none", filtered.length > 0);
    localStorage.setItem(STORE.lastFilter, JSON.stringify({ q: qv, cat: currentCat }));
  }

  /* أحداث البحث والترتيب */
  searchEl?.addEventListener("input", render);
  sortEl?.addEventListener("change", render);

  /* أحداث التصنيفات */
  catPills.forEach(pill => {
    pill.addEventListener("click", () => {
      currentCat = pill.dataset.cat;
      catPills.forEach(p => {
        p.classList.toggle("active", p === pill);
        p.setAttribute("aria-pressed", String(p === pill));
      });
      render();
    });
  });

  /* إعادة ضبط */
  resetBtn?.addEventListener("click", () => {
    currentCat = "";
    if (searchEl) searchEl.value = "";
    catPills.forEach(p => {
      p.classList.toggle("active", p.dataset.cat === "");
      p.setAttribute("aria-pressed", String(p.dataset.cat === ""));
    });
    render();
  });

  render();
}

/* -------- (6) صفحة event.html: تفاصيل فعالية + مشابهة -------- */
function setupEventDetailsPage() {
  const host = document.getElementById("eventDetails");
  if (!host) return;
  const id = parseInt(getParam("id") || "1", 10);
  const ev = EVENTS.find(e => e.id === id) || EVENTS[0];

  document.title = `${ev.title} — Eventra`;

  host.innerHTML = `
    <header class="mb-4">
      <span class="badge text-bg-primary mb-2">${CATEGORY_LABELS[ev.category]}</span>
      <h1 class="h2">${ev.title}</h1>
      <p class="event-meta mb-0">
        <i class="bi bi-calendar-event me-1"></i><strong>التاريخ:</strong> ${formatDate(ev.date)}
        <span class="mx-2">·</span>
        <i class="bi bi-geo-alt me-1"></i><strong>المكان:</strong> ${ev.location}
      </p>
    </header>
    <img src="${ev.image}" alt="${ev.title}" class="img-fluid rounded-4 mb-4 shadow-sm" style="aspect-ratio:16/7; object-fit:cover; width:100%; border:1px solid var(--e-border);">
    <div class="row g-4">
      <div class="col-lg-8">
        <h2 class="h5"><i class="bi bi-file-text me-2 text-muted"></i>نبذة</h2>
        <p>${ev.description}</p>
        ${ev.speakers?.length ? `<h2 class="h6 mt-4"><i class="bi bi-mic me-2 text-muted"></i>المتحدثون</h2><ul>${ev.speakers.map(s => `<li>${s}</li>`).join("")}</ul>` : ""}
        <h2 class="h6 mt-4"><i class="bi bi-images me-2 text-muted"></i>معرض الصور</h2>
        <div class="row g-3 event-gallery">
          <div class="col-6 col-md-4"><img src="${ev.image}" alt="" loading="lazy"></div>
          <div class="col-6 col-md-4"><img src="${EVENTS[(ev.id)%6].image}" alt="" loading="lazy"></div>
          <div class="col-6 col-md-4"><img src="${EVENTS[(ev.id+1)%6].image}" alt="" loading="lazy"></div>
        </div>
      </div>
      <aside class="col-lg-4">
        <div class="e-card p-3">
          <div class="d-grid gap-2">
            <a class="btn btn-primary" href="#" id="calendarBtn"><i class="bi bi-calendar-plus" aria-hidden="true"></i>إضافة للتقويم</a>
            <button class="btn btn-outline-primary" id="shareBtn"><i class="bi bi-share" aria-hidden="true"></i>مشاركة</button>
            <button class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#bookModal" data-event-id="${ev.id}"><i class="bi bi-ticket-perforated" aria-hidden="true"></i>حجز مقعد</button>
          </div>
        </div>
      </aside>
    </div>
  `;

  // زر التقويم: ينشئ ملف .ics ديناميكياً
  document.getElementById("calendarBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    const dt = ev.date.replace(/-/g, "");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT",
      `SUMMARY:${ev.title}`,
      `DTSTART;VALUE=DATE:${dt}`,
      `DTEND;VALUE=DATE:${dt}`,
      `LOCATION:${ev.location}`,
      `DESCRIPTION:${ev.excerpt}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url; a.download = `eventra-${ev.id}.ics`; a.click();
    URL.revokeObjectURL(url);
  });

  // زر المشاركة
  document.getElementById("shareBtn")?.addEventListener("click", async () => {
    const data = { title: ev.title, text: ev.excerpt, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch(_) {} }
    else {
      try {
        await navigator.clipboard.writeText(location.href);
        showToast("تم نسخ رابط الفعالية");
      } catch(_) {}
    }
  });

  // الفعاليات المشابهة
  const similar = EVENTS.filter(e => e.category === ev.category && e.id !== ev.id).slice(0, 3);
  const similarEl = document.getElementById("similarGrid");
  if (similarEl) {
    similarEl.innerHTML = similar.length
      ? similar.map(e => `<div class="col-md-6 col-lg-4">${cardHTML(e)}</div>`).join("")
      : `<p class="text-muted">لا توجد فعاليات مشابهة حالياً.</p>`;
  }
}

/* -------- (7) تحقق نموذج الاتصال -------- */
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const alertBox = document.getElementById("formAlert");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const msg = form.elements["message"].value.trim();
    const errors = [];

    if (name.length < 3) errors.push("الاسم يجب ألا يقل عن 3 أحرف.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("صيغة البريد الإلكتروني غير صحيحة.");
    if (msg.length < 10) errors.push("الرسالة قصيرة جداً (10 أحرف على الأقل).");

    if (errors.length) {
      alertBox.className = "alert alert-danger";
      alertBox.innerHTML = errors.map(x => `<div>• ${x}</div>`).join("");
      alertBox.classList.remove("d-none");
    } else {
      alertBox.className = "alert alert-success";
      alertBox.textContent = "تم استلام رسالتك بنجاح. سنتواصل معك قريباً.";
      alertBox.classList.remove("d-none");
      form.reset();
    }
  });
}

/* -------- (8) نموذج الحجز (Modal) -------- */
function setupBookModal() {
  const modal = document.getElementById("bookModal");
  if (!modal) return;
  const title = modal.querySelector(".modal-title");
  modal.addEventListener("show.bs.modal", (ev) => {
    const btn = ev.relatedTarget;
    const id = btn?.getAttribute("data-event-id");
    const found = EVENTS.find(e => String(e.id) === String(id));
    if (found && title) title.textContent = `حجز: ${found.title}`;
  });
  modal.querySelector("#bookConfirm")?.addEventListener("click", () => {
    showToast("تم تسجيل حجزك (محلي فقط)");
    bootstrap.Modal.getInstance(modal)?.hide();
  });
}

/* -------- (9) زر العودة للأعلى -------- */
function setupScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 400);
  });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* -------- (10) الوضع الليلي (Bootstrap data-bs-theme + تفضيل النظام) -------- */
function getStoredTheme() {
  return localStorage.getItem(STORE.theme);
}

function prefersDarkMq() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveTheme() {
  const saved = getStoredTheme();
  if (saved === "dark" || saved === "light") return saved;
  return prefersDarkMq() ? "dark" : "light";
}

function applyTheme(mode) {
  const dark = mode === "dark";
  document.documentElement.setAttribute("data-bs-theme", dark ? "dark" : "light");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#0a1211" : "#0d9488");
  const toggle = document.getElementById("darkToggle");
  if (!toggle) return;
  const icon = toggle.querySelector("i");
  if (icon) {
    icon.className = dark ? "bi bi-brightness-high" : "bi bi-moon-stars";
  }
  toggle.title = dark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الليلي";
  toggle.setAttribute("aria-pressed", String(dark));
  toggle.setAttribute("aria-label", toggle.title);
}

function setupDarkMode() {
  applyTheme(resolveTheme());
  document.getElementById("darkToggle")?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORE.theme, next);
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getStoredTheme() === "dark" || getStoredTheme() === "light") return;
    applyTheme(prefersDarkMq() ? "dark" : "light");
  });
}

/* -------- (11) Toast بسيط -------- */
function showToast(msg) {
  let t = document.getElementById("eToast");
  if (!t) {
    t = document.createElement("div");
    t.id = "eToast";
    t.style.cssText = "position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#111827;color:#fff;padding:.6rem 1rem;border-radius:10px;z-index:1080;opacity:0;transition:opacity .2s";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = "1";
  setTimeout(() => (t.style.opacity = "0"), 2200);
}

/* -------- (12) تفعيل الرابط النشط في القائمة -------- */
function highlightActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".e-navbar .nav-link").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
}

/* -------- (13) مزامنة مؤشرات Hero Carousel مع Bootstrap -------- */
function setupHeroCarouselSync() {
  const carouselEl = document.getElementById("heroCarousel");
  if (!carouselEl) return;

  const dots = document.querySelectorAll(".e-hero-dot-indicators button");
  if (!dots.length) return;

  carouselEl.addEventListener("slide.bs.carousel", (e) => {
    dots.forEach((d, i) => d.classList.toggle("active", i === e.to));
  });
}

/* -------- (14) تهيئة عامة عند تحميل الصفحة -------- */
document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNav();
  setupDarkMode();
  setupScrollTop();
  setupBookModal();
  renderHomeFeatured();
  renderHomeLatest();
  setupEventsPage();
  setupEventDetailsPage();
  setupContactForm();
  setupHeroCarouselSync();
});
