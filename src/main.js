const headerEl = document.querySelector("#siteHeader");

const updateHeaderGlass = () => {
    const isScrolled = window.scrollY > 20;

    headerEl?.classList.toggle("bg-paper", !isScrolled);
    headerEl?.classList.toggle("bg-paper/70", isScrolled);
    headerEl?.classList.toggle("backdrop-blur-2xl", isScrolled);
    headerEl?.classList.toggle("shadow-quiet", isScrolled);
};

window.addEventListener("scroll", updateHeaderGlass);
updateHeaderGlass();
const menuButton = document.querySelector("#menuButton");
const mobileMenu = document.querySelector("#mobileMenu");

menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("hidden", isOpen);
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        mobileMenu.classList.add("hidden");
    });
});

const ticketCopy = {
    standard: "一般席｜價格、開放時間與名額待官方公告。建議文案語氣：保留席次、完成資料登錄、收到確認通知。",
    partner: "夥伴席｜適合團隊邀約與合作夥伴。可補充團體席次規則、窗口資訊與會後交流安排。",
    manager: "新經理席｜連動第 06 章節，強調培訓與健康教育素材，不以折扣作為唯一誘因。"
};

document.querySelectorAll(".ticket-option").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".ticket-option").forEach((item) => item.setAttribute("aria-pressed", "false"));
        button.setAttribute("aria-pressed", "true");
        document.querySelector("#ticketNote").textContent = ticketCopy[button.dataset.ticket];
    });
});

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
        document.querySelectorAll(".story-tab").forEach((item) => item.setAttribute("aria-selected", "false"));
        button.setAttribute("aria-selected", "true");
        document.querySelector("#storyTitle").textContent = current.title;
        document.querySelector("#storyMeta").textContent = current.meta;
        document.querySelector("#storyBody").textContent = current.body;
    });
});

document.querySelectorAll(".speaker-toggle").forEach((button) => {
    button.addEventListener("click", () => {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
        button.querySelector(".speaker-detail").classList.toggle("hidden", isOpen);
        button.querySelector(".mono").textContent = isOpen ? "＋" : "－";
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
}, { threshold: 0.18 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

sections.forEach((section) => navObserver.observe(section));