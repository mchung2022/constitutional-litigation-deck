// app.js - Constitutional Litigation Slide Deck Logic
document.addEventListener("DOMContentLoaded", () => {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;
    
    const progressFill = document.querySelector(".progress-fill-bar");
    const slideNumDisplay = document.querySelector(".slide-number-display");
    const unitTitleDisplay = document.querySelector(".unit-title-display");
    
    // Side navigation Menu
    const menuToggle = document.querySelector(".menu-toggle-btn");
    const sideNav = document.getElementById("side-nav-overlay");
    const navItems = document.querySelectorAll(".units-navigation-list li");

    // --- SYNTHESIZE SOUND DYNAMICALLY WITH WEB AUDIO API ---
    let soundEnabled = true;
    const soundToggle = document.getElementById("sound-toggle-btn");
    
    soundToggle.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
        playSynthSound(600, "sine", 0.05);
    });

    function playSynthSound(frequency, type = "sine", duration = 0.1) {
        if (!soundEnabled) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(frequency, ctx.currentTime);
            
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.log("Audio block active");
        }
    }

    // --- THEME SWITCHER LOGIC ---
    const themeToggle = document.getElementById("theme-toggle-btn");
    themeToggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("light-theme");
        playSynthSound(440, "triangle", 0.08);
    });

    // --- MOBILE TOUCH SWIPE SUPPORT ---
    let touchStartX = 0;
    let touchEndX = 0;
    const viewport = document.getElementById("slides-viewport");
    
    viewport.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    viewport.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });
    
    function handleSwipeGesture() {
        const threshold = 60;
        if (touchEndX < touchStartX - threshold) {
            nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
            prevSlide();
        }
    }

    // --- SCOREBOARD VARIABLES ---
    let totalQuestionsAnswered = 0;
    let correctAnswersCount = 0;
    const answeredQuizzes = new Set();
    
    // Update Slide Viewport
    function updateSlides() {
        slides.forEach((slide, idx) => {
            slide.classList.remove("active", "prev", "next");
            if (idx === currentSlideIndex) {
                slide.classList.add("active");
            } else if (idx < currentSlideIndex) {
                slide.classList.add("prev");
            } else {
                slide.classList.add("next");
            }
        });
        
        // Update Footer and Header UI
        const percent = ((currentSlideIndex + 1) / totalSlides) * 100;
        progressFill.style.width = `${percent}%`;
        slideNumDisplay.textContent = `${currentSlideIndex + 1} / ${totalSlides}`;
        
        // Find current unit header info
        const activeSlide = slides[currentSlideIndex];
        const slideTag = activeSlide.querySelector(".slide-tag");
        if (slideTag) {
            unitTitleDisplay.textContent = slideTag.textContent;
        }
        
        // Highlight active side menu section based on current slide range
        let unitIdx = 0;
        if (currentSlideIndex >= 48) unitIdx = 7; // Certificate/summary
        else if (currentSlideIndex >= 40) unitIdx = 6; // Mock Cases
        else if (currentSlideIndex >= 32) unitIdx = 5; // Quorums/Effect
        else if (currentSlideIndex >= 24) unitIdx = 4; // Proceedings
        else if (currentSlideIndex >= 16) unitIdx = 3; // Judgement review
        else if (currentSlideIndex >= 8) unitIdx = 2;  // Petitions
        else if (currentSlideIndex >= 2) unitIdx = 1;  // Grand Justices Meetings
        
        navItems.forEach((item, idx) => {
            item.classList.remove("active");
            if (idx === unitIdx) {
                item.classList.add("active");
            }
        });
    }
    
    // Navigation Buttons Toggles
    window.prevSlide = function() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlides();
            playSynthSound(280, "triangle", 0.08);
        }
    };
    
    window.nextSlide = function() {
        if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            updateSlides();
            playSynthSound(320, "triangle", 0.08);
        }
    };
    
    // Keyboard listener
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "Space") {
            // Prevent scrolling on space
            if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                e.preventDefault();
                nextSlide();
            }
        } else if (e.key === "ArrowLeft") {
            prevSlide();
        }
    });
    
    // Side nav toggle listener
    menuToggle.addEventListener("click", () => {
        sideNav.classList.toggle("open");
        menuToggle.textContent = sideNav.classList.contains("open") ? "✕ 關閉目錄" : "☰ 課程地圖";
        playSynthSound(400, "sine", 0.05);
    });
    
    // Click on nav items to navigate to first slide of that unit
    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            const slideStart = parseInt(item.getAttribute("data-slide"));
            currentSlideIndex = slideStart;
            updateSlides();
            sideNav.classList.remove("open");
            menuToggle.textContent = "☰ 課程地圖";
            playSynthSound(350, "sine", 0.06);
        });
    });
    
    // --- FLIP CARDS CONTROLLERS ---
    const flipCards = document.querySelectorAll(".flip-card");
    flipCards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("flipped");
            playSynthSound(520, "sine", 0.08);
        });
    });
    
    // --- QUIZ INTERACTIVE LOGIC ---
    window.checkQuiz = function(btn, isCorrect, feedbackId, explanation) {
        const parent = btn.parentElement;
        const buttons = parent.querySelectorAll(".quiz-option-btn");
        const feedback = document.getElementById(feedbackId);
        
        buttons.forEach(b => {
            b.disabled = true;
            if (b === btn) {
                if (isCorrect) {
                    b.classList.add("correct");
                    b.innerHTML = "✓ " + b.innerHTML;
                    feedback.style.color = "#28b463";
                    feedback.textContent = "✓ 恭喜答對！" + explanation;
                } else {
                    b.classList.add("wrong");
                    b.innerHTML = "✗ " + b.innerHTML;
                    feedback.style.color = "#f15bb5";
                    feedback.textContent = "✗ 答錯了！" + explanation;
                }
            } else {
                b.style.opacity = "0.5";
            }
        });

        // Gamified Scoreboard updates and custom feedback audio
        if (!answeredQuizzes.has(feedbackId)) {
            answeredQuizzes.add(feedbackId);
            totalQuestionsAnswered++;
            if (isCorrect) {
                correctAnswersCount++;
                playSynthSound(880, "sine", 0.12);
                setTimeout(() => playSynthSound(1109.73, "sine", 0.18), 100); // 880Hz -> 1109Hz chime chord
            } else {
                playSynthSound(150, "sawtooth", 0.3); // low flat buzz
            }
            const scoreDisplay = document.getElementById("score-count");
            if (scoreDisplay) {
                scoreDisplay.textContent = `${correctAnswersCount} / ${totalQuestionsAnswered}`;
            }
        }
    };
    
    // --- JUSTICES VOTE SIMULATION LOGIC ---
    window.voteCase = function(caseKey, voteValue) {
        const conBtn = document.getElementById(`${caseKey}-btn-con`);
        const unconBtn = document.getElementById(`${caseKey}-btn-uncon`);
        const conBar = document.getElementById(`${caseKey}-bar-con`);
        const unconBar = document.getElementById(`${caseKey}-bar-uncon`);
        const conPct = document.getElementById(`${caseKey}-pct-con`);
        const unconPct = document.getElementById(`${caseKey}-pct-uncon`);
        const verdict = document.getElementById(`${caseKey}-verdict`);
        
        conBtn.classList.remove("active");
        unconBtn.classList.remove("active");
        
        let constitutionalVotes = 7;
        let unconstitutionalVotes = 8;
        
        if (voteValue === 'constitutional') {
            conBtn.classList.add("active");
            constitutionalVotes = 9;
            unconstitutionalVotes = 6;
        } else {
            unconBtn.classList.add("active");
            constitutionalVotes = 5;
            unconstitutionalVotes = 10;
        }
        
        // Play thematic twice-hitting "Gavel" sound effect
        playSynthSound(220, "sawtooth", 0.08);
        setTimeout(() => playSynthSound(180, "sawtooth", 0.12), 120);
        
        const totalVotes = 15;
        const conPercent = Math.round((constitutionalVotes / totalVotes) * 100);
        const unconPercent = 100 - conPercent;
        
        conBar.style.width = `${conPercent}%`;
        unconBar.style.width = `${unconPercent}%`;
        conPct.textContent = `${conPercent}% (${constitutionalVotes} 票)`;
        unconPct.textContent = `${unconPercent}% (${unconstitutionalVotes} 票)`;
        
        // Quorum rule: 1/2 of 15 is 8 votes.
        if (unconstitutionalVotes >= 8) {
            verdict.className = "quorum-verdict fail";
            verdict.innerHTML = `⚖️ 判決宣告：違憲！(違憲票 ${unconstitutionalVotes} 票，達 1/2 門檻，宣告該標的違憲失效！)`;
        } else {
            verdict.className = "quorum-verdict pass";
            verdict.innerHTML = `⚖️ 判決宣告：合憲！(違憲票 ${unconstitutionalVotes} 票，未達 1/2 門檻，宣告合憲保障！)`;
        }
    };
    
    // --- CANVAS SIGNATURE PAD & CERTIFICATE GENERATION ---
    const sigCanvas = document.getElementById("sig-canvas");
    const sigCtx = sigCanvas.getContext("2d");
    let drawing = false;
    
    sigCtx.strokeStyle = "#48cae4";
    sigCtx.lineWidth = 3;
    sigCtx.lineCap = "round";
    
    function getMousePos(canvasDom, touchOrMouseEvent) {
        const rect = canvasDom.getBoundingClientRect();
        const clientX = touchOrMouseEvent.clientX || touchOrMouseEvent.touches[0].clientX;
        const clientY = touchOrMouseEvent.clientY || touchOrMouseEvent.touches[0].clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }
    
    sigCanvas.addEventListener("mousedown", (e) => {
        drawing = true;
        const pos = getMousePos(sigCanvas, e);
        sigCtx.beginPath();
        sigCtx.moveTo(pos.x, pos.y);
    });
    
    sigCanvas.addEventListener("mousemove", (e) => {
        if (!drawing) return;
        const pos = getMousePos(sigCanvas, e);
        sigCtx.lineTo(pos.x, pos.y);
        sigCtx.stroke();
    });
    
    document.addEventListener("mouseup", () => {
        drawing = false;
    });
    
    sigCanvas.addEventListener("touchstart", (e) => {
        drawing = true;
        const pos = getMousePos(sigCanvas, e);
        sigCtx.beginPath();
        sigCtx.moveTo(pos.x, pos.y);
        e.preventDefault();
    });
    
    sigCanvas.addEventListener("touchmove", (e) => {
        if (!drawing) return;
        const pos = getMousePos(sigCanvas, e);
        sigCtx.lineTo(pos.x, pos.y);
        sigCtx.stroke();
        e.preventDefault();
    });
    
    window.clearSignature = function() {
        sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    };
    
    window.generateCertificate = function() {
        const nameInput = document.getElementById("student-name-input").value.trim() || "優秀憲法學習公民";
        const certCanvas = document.getElementById("cert-canvas");
        const ctx = certCanvas.getContext("2d");
        
        ctx.fillStyle = "#0b132b";
        ctx.fillRect(0, 0, certCanvas.width, certCanvas.height);
        
        ctx.strokeStyle = "#ffb703";
        ctx.lineWidth = 15;
        ctx.strokeRect(20, 20, certCanvas.width - 40, certCanvas.height - 40);
        
        ctx.strokeStyle = "#48cae4";
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 30, certCanvas.width - 60, certCanvas.height - 60);
        
        ctx.fillStyle = "#ffb703";
        ctx.font = "bold 32px 'Noto Sans TC'";
        ctx.textAlign = "center";
        ctx.fillText("中華民國憲法訴訟法大師認證書", certCanvas.width / 2, 85);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "20px 'Noto Sans TC'";
        ctx.fillText("本證書特此頒發給優秀公民：", certCanvas.width / 2, 140);
        
        ctx.fillStyle = "#48cae4";
        ctx.font = "bold 28px 'Noto Sans TC'";
        ctx.fillText(nameInput, certCanvas.width / 2, 190);
        
        ctx.fillStyle = "#b0c4de";
        ctx.font = "16px 'Noto Sans TC'";
        ctx.fillText("恭喜您成功修畢憲法訴訟法 50 頁核心素養課程！", certCanvas.width / 2, 235);
        ctx.fillText("並在模擬憲法法庭中完成三項指標性人權爭議案件之合憲性審查表決，", certCanvas.width / 2, 260);
        ctx.fillText("特頒此證，肯定您追求憲法正義、自由民主與司法救濟基本權利之卓越公民素養。", certCanvas.width / 2, 285);
        
        const today = new Date();
        const dateStr = `發證日期：中華民國 ${today.getFullYear() - 1911} 年 ${today.getMonth() + 1} 月 ${today.getDate()} 日`;
        ctx.fillStyle = "#b0c4de";
        ctx.font = "14px 'Noto Sans TC'";
        ctx.fillText(dateStr, certCanvas.width / 2 - 120, 350);
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px 'Noto Sans TC'";
        ctx.fillText("學習公民親筆簽名：", certCanvas.width / 2 + 150, 325);
        
        ctx.drawImage(sigCanvas, certCanvas.width / 2 + 80, 335, 140, 50);
        
        setTimeout(() => {
            const dataUrl = certCanvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `${nameInput}_Constitutional_Litigation_Master_Certificate.png`;
            link.href = dataUrl;
            link.click();
        }, 300);
    };

    // --- INTERACTIVE WORD CLOUD CONTROLLER ---
    window.addNewWord = function() {
        const wordInput = document.getElementById("word-input");
        if (!wordInput) return;
        const wordText = wordInput.value.trim();
        if (!wordText) return;
        
        const container = document.getElementById("word-cloud-container");
        if (!container) return;
        
        const newWordSpan = document.createElement("span");
        
        // Curated set of neon highlight colors for modern aesthetic
        const colors = ["var(--primary)", "var(--secondary)", "var(--accent)", "var(--forest-green)", "#e2eafc", "#b5e2fa", "#ffc6ff", "#bdb2ff"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomFontSize = (0.9 + Math.random() * 0.8).toFixed(2) + "rem";
        
        // Boundary aware random float positions
        const randomTop = Math.floor(12 + Math.random() * 72) + "%";
        const randomLeft = Math.floor(6 + Math.random() * 75) + "%";
        
        newWordSpan.className = "cloud-word";
        newWordSpan.style.color = randomColor;
        newWordSpan.style.fontSize = randomFontSize;
        newWordSpan.style.top = randomTop;
        newWordSpan.style.left = randomLeft;
        newWordSpan.style.animationDelay = (Math.random() * 3.5).toFixed(2) + "s";
        newWordSpan.textContent = wordText;
        
        container.appendChild(newWordSpan);
        wordInput.value = "";
        
        // Synthesis a soft popping bubble sound
        playSynthSound(680, "sine", 0.07);
    };

    // Event listener for pressing Enter inside the input box
    setTimeout(() => {
        const wordInput = document.getElementById("word-input");
        if (wordInput) {
            wordInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    addNewWord();
                }
            });
        }
    }, 500);
    
    updateSlides();
});
