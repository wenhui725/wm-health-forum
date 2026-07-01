const headerEl = document.querySelector("#siteHeader");

/* =========================
   Header glass effect
   ========================= */

const updateHeaderGlass = () => {
    const isScrolled = window.scrollY > 20;

    headerEl?.classList.toggle("bg-paper", !isScrolled);
    headerEl?.classList.toggle("bg-paper/70", isScrolled);
    headerEl?.classList.toggle("backdrop-blur-2xl", isScrolled);
    headerEl?.classList.toggle("shadow-quiet", isScrolled);
};

window.addEventListener("scroll", updateHeaderGlass, { passive: true });
updateHeaderGlass();

/* =========================
   Ticket option
   若目前頁面沒有 ticket-option，也不會報錯
   ========================= */

const ticketCopy = {
    standard: "一般席｜價格、開放時間與名額待官方公告。建議文案語氣：保留席次、完成資料登錄、收到確認通知。",
    partner: "夥伴席｜適合團隊邀約與合作夥伴。可補充團體席次規則、窗口資訊與會後交流安排。",
    manager: "新經理席｜連動第 06 章節，強調培訓與健康教育素材，不以折扣作為唯一誘因。"
};

document.querySelectorAll(".ticket-option").forEach((button) => {
    button.addEventListener("click", () => {
        const ticketNote = document.querySelector("#ticketNote");
        const ticketType = button.dataset.ticket;

        document.querySelectorAll(".ticket-option").forEach((item) => {
            item.setAttribute("aria-pressed", "false");
        });

        button.setAttribute("aria-pressed", "true");

        if (ticketNote && ticketCopy[ticketType]) {
            ticketNote.textContent = ticketCopy[ticketType];
        }
    });
});


/* =========================
   Story tabs
   若目前頁面沒有 story-tab，也不會報錯
   ========================= */

const storyCopy = {
    sleep: {
        title: "為什麼睡了還是累？",
        meta: "30 秒開場｜醫師一句話 + 日常場景",
        body: "以清晨醒來仍疲憊的畫面切入，連結壓力、睡眠品質與身體修復節律。影片語氣保持溫柔，不以恐懼刺激轉換。"
    },
    mood: {
        title: "情緒不是意志力問題。",
        meta: "45 秒訪談｜壓力反應 + 身體覺察",
        body: "用工作日常與家庭情境說明情緒起伏背後的壓力軸線，讓觀眾先被理解，再進入醫學觀點。"
    },
    cycle: {
        title: "身體節律正在提醒你。",
        meta: "30 秒動畫｜週期、代謝、睡眠",
        body: "以抽象但清楚的圖像呈現內分泌節律，避免過度醫療化畫面，保留企業官網的質感與可信度。"
    }
};

document.querySelectorAll(".story-tab").forEach((button) => {
    button.addEventListener("click", () => {
        const current = storyCopy[button.dataset.story];
        const storyTitle = document.querySelector("#storyTitle");
        const storyMeta = document.querySelector("#storyMeta");
        const storyBody = document.querySelector("#storyBody");

        if (!current || !storyTitle || !storyMeta || !storyBody) return;

        document.querySelectorAll(".story-tab").forEach((item) => {
            item.setAttribute("aria-selected", "false");
        });

        button.setAttribute("aria-selected", "true");

        storyTitle.textContent = current.title;
        storyMeta.textContent = current.meta;
        storyBody.textContent = current.body;
    });
});


/* =========================
   Speaker toggle
   醫師講題摘要展開
   ========================= */

document.querySelectorAll(".speaker-toggle").forEach((button) => {
    button.addEventListener("click", () => {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        const detail = button.querySelector(".speaker-detail");

        /*
          優先抓 speaker-icon。
          如果 HTML 還沒加 speaker-icon，就退而求其次抓最後一個 font-mono。
        */
        const icon =
            button.querySelector(".speaker-icon") ||
            button.querySelector(".font-mono");

        button.setAttribute("aria-expanded", String(!isOpen));

        detail?.classList.toggle("hidden", isOpen);

        if (icon) {
            icon.textContent = isOpen ? "＋" : "－";
        }
    });
});


/* =========================
   Reveal animation
   ========================= */

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
        }
    });
}, {
    threshold: 0.18
});

document.querySelectorAll(".reveal").forEach((item) => {
    revealObserver.observe(item);
});

/* =========================
   Nav active 鎖定效果
   ========================= */

const navLinks = [...document.querySelectorAll(".nav-link")];

const navSections = navLinks
    .map((link) => {
        const id = link.getAttribute("href")?.replace("#", "");
        return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

/*
  避免桌機 nav + 手機 nav 重複抓到同一個 section，
  這裡做去重處理。
*/
const uniqueNavSections = [...new Map(
    navSections.map((section) => [section.id, section])
).values()];

let currentActiveId = "";

const setNavActive = (sectionId) => {
    navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${sectionId}`;
        link.classList.toggle("is-active", isCurrent);
    });
};

const getHeaderOffset = () => {
    return headerEl?.offsetHeight || 112;
};

/*
  只控制手機橫向 nav 自動滑動
*/
const scrollMobileNavTo = (sectionId, inlinePosition = "center") => {
    const mobileNav = document.querySelector("#mobileSectionNav");

    if (!mobileNav) return;

    const targetLink = mobileNav.querySelector(`.nav-link[href="#${sectionId}"]`);

    targetLink?.scrollIntoView({
        behavior: "smooth",
        inline: inlinePosition,
        block: "nearest"
    });
};

/*
  滾動時更新 active
  同時讓手機 nav 自動滑到目前章節
*/
const updateNavActive = () => {
    const scrollPosition = window.scrollY + getHeaderOffset() + 36;
    let activeId = uniqueNavSections[0]?.id || "";

    uniqueNavSections.forEach((section) => {
        if (scrollPosition >= section.offsetTop) {
            activeId = section.id;
        }
    });

    if (!activeId) return;

    setNavActive(activeId);

    if (activeId !== currentActiveId) {
        currentActiveId = activeId;
        scrollMobileNavTo(activeId);
    }
};

/*
  點擊 nav 時：
  1. 切換 active
  2. 手機橫向 nav 自動滑到該按鈕
*/
navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const targetId = link.getAttribute("href")?.replace("#", "");

        if (!targetId) return;

        currentActiveId = targetId;
        setNavActive(targetId);
        scrollMobileNavTo(targetId);
    });
});

/*
  點擊 Logo 時：
  1. 回到 Hero
  2. 01 主題變 active
  3. 手機 nav 滑回最前面
*/
const siteLogo = document.querySelector(".site-logo");

siteLogo?.addEventListener("click", () => {
    currentActiveId = "theme";
    setNavActive("theme");
    scrollMobileNavTo("theme", "start");
});

window.addEventListener("scroll", updateNavActive, { passive: true });
window.addEventListener("resize", updateNavActive);

updateNavActive();

/* =========================
   Lineup filter
   活動陣容分類篩選
   ========================= */

const lineupFilters = document.querySelectorAll(".lineup-filter");
const lineupCards = document.querySelectorAll(".lineup-card");

lineupFilters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
        const selectedRole = filterButton.dataset.lineupFilter;

        /*
          先把所有按鈕恢復成未選取：白底黑字
        */
        lineupFilters.forEach((button) => {
            button.setAttribute("aria-pressed", "false");

            button.classList.remove(
                "border-black",
                "bg-black",
                "text-white"
            );

            button.classList.add(
                "border-black/10",
                "bg-white",
                "text-black"
            );
        });

        /*
          再把目前點擊的按鈕改成選取中：黑底白字
        */
        filterButton.setAttribute("aria-pressed", "true");

        filterButton.classList.remove(
            "border-black/10",
            "bg-white",
            "text-black"
        );

        filterButton.classList.add(
            "border-black",
            "bg-black",
            "text-white"
        );

        /*
          篩選卡片
        */
        lineupCards.forEach((card) => {
            const cardRole = card.dataset.lineupRole;
            const shouldShow = selectedRole === "all" || selectedRole === cardRole;

            card.classList.toggle("hidden", !shouldShow);
            card.classList.toggle("grid", shouldShow);
        });
    });
});

/* =========================
   Events
   ========================= */

window.addEventListener("scroll", updateNavActive, { passive: true });
window.addEventListener("resize", updateNavActive);

updateNavActive();