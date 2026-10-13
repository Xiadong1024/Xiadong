document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Ambient Particles Canvas ---
    const canvas = document.getElementById('ambient-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = 45;
        const colors = [
            'rgba(56, 189, 248, ',  // Cyan
            'rgba(99, 102, 241, ',  // Indigo
            'rgba(192, 132, 252, ', // Purple
            'rgba(240, 249, 255, '  // Milk white
        ];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 0.8,
                colorBase: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.6 + 0.2,
                speedY: -(Math.random() * 0.4 + 0.15),
                speedX: (Math.random() - 0.5) * 0.3,
                pulse: Math.random() * Math.PI
            });
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.pulse += 0.02;

                if (p.y < -10) {
                    p.y = height + 10;
                    p.x = Math.random() * width;
                }
                if (p.x < -10) p.x = width + 10;
                if (p.x > width + 10) p.x = -10;

                const dynamicAlpha = p.alpha + Math.sin(p.pulse) * 0.2;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.colorBase + Math.max(0.1, Math.min(1, dynamicAlpha)) + ')';
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.colorBase + '0.8)';
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }
        animate();
    }

    // --- 2. Quote Generator ---
    const quotes = [
        "全部都是謊言喔~ 呵呵呵……",
        "真實總是那麼無趣又苦澀，不如沉醉在甜蜜的謊言之中吧？",
        "歡迎來到我的木偶劇院！這場戲的主角……就是你喔！",
        "嘻嘻嘻……絲線已經綁好了，接下來就隨我起舞吧！",
        "你看到的是真相，還是我為你編織的幻影呢？",
        "只有沉迷在謊言中的靈魂，才能品嚐到最純粹的美夢。",
        "演出即將開幕……準備好迎接盛大的謝幕了嗎？",
        "純真啊……你以為你的光芒，真的能穿透無盡的黑影嗎？"
    ];

    const quoteText = document.getElementById('quote-text');
    const refreshBtn = document.getElementById('refresh-quote-btn');
    let currentQuoteIndex = 0;

    if (refreshBtn && quoteText) {
        refreshBtn.addEventListener('click', () => {
            playMysticChime();
            quoteText.style.opacity = '0';
            setTimeout(() => {
                let nextIndex;
                do {
                    nextIndex = Math.floor(Math.random() * quotes.length);
                } while (nextIndex === currentQuoteIndex && quotes.length > 1);
                currentQuoteIndex = nextIndex;
                quoteText.textContent = `「${quotes[currentQuoteIndex]}」`;
                quoteText.style.opacity = '1';
            }, 250);
        });
    }

    // --- 3. Character Image Switcher ---
    const mainImg = document.getElementById('main-character-img');
    const tabPortrait = document.getElementById('tab-portrait');
    const tabCg = document.getElementById('tab-cg');

    if (mainImg && tabPortrait && tabCg) {
        tabPortrait.addEventListener('click', () => {
            tabPortrait.classList.add('active');
            tabCg.classList.remove('active');
            switchImage('./images/default.png', '黑影牛奶 - 立繪肖像');
            playMysticChime();
        });

        tabCg.addEventListener('click', () => {
            tabCg.classList.add('active');
            tabPortrait.classList.remove('active');
            switchImage('./images/40.png', '黑影牛奶 - 全景CG劇目');
            playMysticChime();
        });
    }

    function switchImage(src, alt) {
        if (!mainImg) return;
        mainImg.style.opacity = '0.2';
        mainImg.style.transform = 'scale(0.96)';
        setTimeout(() => {
            mainImg.src = src;
            mainImg.alt = alt;
            mainImg.style.opacity = '1';
            mainImg.style.transform = 'scale(1)';
        }, 200);
    }

    // --- 4. Lightbox Modal ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        playMysticChime();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mainImg) {
        mainImg.addEventListener('click', () => {
            openLightbox(mainImg.src);
        });
    }

    document.querySelectorAll('.open-lightbox').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const src = el.getAttribute('data-img');
            if (src) openLightbox(src);
        });
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // --- 5. Interactive Sound Engine (Web Audio API) ---
    let audioCtx = null;
    let soundEnabled = true;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playMysticChime() {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;

            const now = audioCtx.currentTime;
            const freqs = [587.33, 880, 1174.66]; // D5, A5, D6 mystic chord

            freqs.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.05);

                gain.gain.setValueAtTime(0.04, now + idx * 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.6);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start(now + idx * 0.05);
                osc.stop(now + idx * 0.05 + 0.65);
            });
        } catch (e) {
            // Audio policy fallback
        }
    }

    const soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            soundBtn.innerHTML = soundEnabled 
                ? '<span>🔔</span> <span>音效: 開啟</span>' 
                : '<span>🔕</span> <span>音效: 靜音</span>';
            if (soundEnabled) playMysticChime();
        });
    }
});