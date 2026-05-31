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
        }
    };
    
    window.nextSlide = function() {
        if (currentSlideIndex < totalSlides - 1) {
            currentSlideIndex++;
            updateSlides();
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
    });
    
    // Click on nav items to navigate to first slide of that unit
    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            const slideStart = parseInt(item.getAttribute("data-slide"));
            currentSlideIndex = slideStart;
            updateSlides();
            sideNav.classList.remove("open");
            menuToggle.textContent = "☰ 課程地圖";
        });
    });
    
    // --- FLIP CARDS CONTROLLERS ---
    const flipCards = document.querySelectorAll(".flip-card");
    flipCards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("flipped");
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
    
    updateSlides();
});
