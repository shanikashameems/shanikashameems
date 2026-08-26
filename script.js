/* ==========================================================================
   PREMIUM PORTFOLIO INTERACTION ENGINE (GSAP & ScrollTrigger Edition)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // Select DOM Elements
    const loader = document.getElementById("loader");
    const loaderBar = document.getElementById("loader-bar");
    const loaderPercent = document.getElementById("loader-percent");
    const loaderStatus = document.getElementById("loader-status");
    
    const navHeader = document.getElementById("nav-header");
    const mainContent = document.getElementById("main-content");
    const heroSection = document.getElementById("hero");
    
    // Scroll canvas elements removed
    
    const cursor = document.getElementById("custom-cursor");
    const cursorDot = document.getElementById("custom-cursor-dot");
    const ambientGlow = document.getElementById("ambient-glow");
    
    // Project Cards & Timeline Items
    const projectCards = document.querySelectorAll(".project-card");
    const timelineItems = document.querySelectorAll(".timeline-item");
    const certCards = document.querySelectorAll(".cert-card-3d");

    // Preloader status messages
    const statusMessages = [
        "Initializing core neural networks...",
        "Configuring generative matrices...",
        "Pre-rendering graphic buffers...",
        "Loading weight vectors...",
        "Optimizing interface pipeline...",
        "System ready."
    ];

    // Begin Preloading with smooth simulation timer
    function preloadAssets() {
        let progress = 0;
        const duration = 1200; // 1.2s total duration
        const intervalTime = 30; // Update every 30ms
        const steps = duration / intervalTime;
        const increment = 100 / steps;
        
        const progressInterval = setInterval(() => {
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                if (loaderBar) loaderBar.style.width = "100%";
                if (loaderPercent) loaderPercent.textContent = "100%";
                if (loaderStatus) loaderStatus.textContent = "System ready.";
                
                setTimeout(completeLoading, 400);
            } else {
                const displayProgress = Math.floor(progress);
                if (loaderBar) loaderBar.style.width = `${displayProgress}%`;
                if (loaderPercent) loaderPercent.textContent = `${displayProgress}%`;
                if (loaderStatus) {
                    const messageIndex = Math.min(Math.floor((displayProgress / 100) * statusMessages.length), statusMessages.length - 1);
                    loaderStatus.textContent = statusMessages[messageIndex];
                }
            }
        }, intervalTime);
    }

    function completeLoading() {
        if (loader) {
            loader.style.transform = "translateY(-100%)";
            loader.style.opacity = "0";
        }
        
        if (navHeader) navHeader.classList.remove("hidden");
        if (mainContent) mainContent.classList.remove("hidden");
        
        // Refresh ScrollTrigger positions after showing main content (fixes immediate trigger bug)
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
        
        setTimeout(() => {
            if (heroSection) heroSection.classList.add("loaded");
            if (loader) loader.style.display = "none";
            
            // Activate background wire pulse glow
            const wireWrapper = document.querySelector(".wire-container-wrapper");
            if (wireWrapper) wireWrapper.classList.add("active-transmission");
            
            if (ambientGlow) ambientGlow.style.opacity = "1";
            
            // Fade custom cursors in smoothly
            if (cursor && cursorDot) {
                gsap.to([cursor, cursorDot], { opacity: 1, duration: 0.5 });
            }
            
            // Start the 3D Vertical Stripes Entrance Flip
            playHeroEntrance();
            
            initAboutMeScrollTrigger();
            initGSAPScrollTrigger();
            initTaglineChanger();
            initHeroLetter3DParallax();
            initPremiumCardMechanics();
            ScrollTrigger.refresh();
        }, 1200); // 1.2s to match the CSS transition duration
    }

    // 3D Vertical Stripes Entrance Flip (S-H-A-N-I-K-A)
    function playHeroEntrance() {
        const stripes = document.querySelectorAll(".hero-stripe-inner");
        
        const tl = gsap.timeline({
            onComplete: () => {
                handleNavbarScroll();
            }
        });

        // 1. Instantly make the wire container elements visible for scrolling
        gsap.set([".bg-wire-container", "#experience", "#skills", "#education", "#connect"], { opacity: 1 });

        // 2. Animate stripes flip vertically in 3D (X-axis rotation) from center outward
        tl.to(stripes, {
            rotateX: 180,
            duration: 1.4,
            ease: "back.out(1.2)", // Z-axis bounce look via back ease
            stagger: {
                from: "center",
                amount: 0.6
            }
        }, 0);

        // Add 3D depth effect (Z depth scale)
        tl.fromTo(stripes, 
            { z: 0 },
            {
                z: -150,
                duration: 0.7,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut",
                stagger: {
                    from: "center",
                    amount: 0.6
                }
            }, 
            0
        );

        // 3. Simultaneously transition theme variables to ivory
        tl.to("html", {
            "--bg-primary": "#faf8f4",
            "--bg-secondary": "#f0ede6",
            "--bg-tertiary": "#e5e2da",
            "--text-primary": "#0a0a0c",
            "--text-secondary": "rgba(10, 10, 12, 0.75)",
            "--text-muted": "rgba(10, 10, 12, 0.45)",
            duration: 1.0,
            ease: "power2.out"
        }, 0.2);

        // 4. Force body background to ivory to avoid visual black flash when scrolling
        tl.to("body", {
            backgroundColor: "#faf8f4",
            duration: 1.0,
            ease: "power2.out"
        }, 0.2);

        // 5. Initialize navbar styling dynamically after preloader ends
        tl.add(() => {
            if (navHeader) {
                navHeader.classList.remove("transparent-nav");
                handleNavbarScroll();
            }
        }, 1.2);

        // 6. Fade up Hero title, desc, and scroll indicators
        const heroFadeElements = document.querySelectorAll("#hero .fade-up-init");
        tl.to(heroFadeElements, {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power3.out",
            stagger: 0.15
        }, 0.6);
    }

    // ==========================================================================
    // INTERACTIVE 3D POP-OUT & TILT ANIMATION FOR HERO LETTERS
    // ==========================================================================
    function initHeroLetter3DParallax() {
        // Disable on touch screens/mobile devices to prevent cards getting stuck on tap events
        if (window.matchMedia("(max-width: 900px)").matches || ('ontouchstart' in window)) return;

        const stripes = document.querySelectorAll(".hero-stripe");
        
        stripes.forEach(stripe => {
            const inner = stripe.querySelector(".hero-stripe-inner");
            const letter = stripe.querySelector(".hero-stripe-letter");
            if (!inner || !letter) return;
            
            stripe.addEventListener("mousemove", (e) => {
                const rect = stripe.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                
                // Normalize offsets between -1 and 1
                const nx = (x - xc) / xc;
                const ny = (yc - y) / yc;
                
                // 1. Intense Tilt and pop of the outer card block (accounting for base rotateX: 180)
                gsap.to(inner, {
                    z: 75,
                    rotateX: 180 + ny * 25, // More tilt
                    rotateY: -nx * 25, // More tilt
                    rotateZ: -nx * 4, // Subtle roll rotation for extra 3D sway
                    scale: 1.04,
                    boxShadow: "0 25px 55px rgba(0, 0, 0, 0.2)", // Deeper shadow
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                // 2. High-elevation pop-out and tilt of the letter (exaggerated 3D float)
                gsap.to(letter, {
                    z: 140, // Floating very high
                    rotateX: ny * 35, // Strong tilt
                    rotateY: nx * 35, // Strong tilt
                    rotateZ: nx * 8, // Noticeable letter sway
                    scale: 1.25, // Scaled larger
                    textShadow: `${-nx * 25}px ${ny * 25}px 30px rgba(0, 0, 0, 0.45)`, // Extended sharp shadow
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
            
            stripe.addEventListener("mouseleave", () => {
                // Smoothly return block back to its normal flipped state
                gsap.to(inner, {
                    z: 0,
                    rotateX: 180,
                    rotateY: 0,
                    rotateZ: 0,
                    scale: 1,
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.02)",
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: "auto"
                });

                // Smoothly return letter back to its normal flat state
                gsap.to(letter, {
                    z: 0,
                    rotateY: 0,
                    rotateX: 0,
                    rotateZ: 0,
                    scale: 1,
                    textShadow: "0px 0px 0px rgba(0,0,0,0)",
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: "auto"
                });
            });
        });
    }

    // ==========================================================================
    // UNIFIED INTERACTIVE 3D MOUSE TILT AND HOVER FLIP MECHANICS
    // ==========================================================================
    function initPremiumCardMechanics() {
        const cards = document.querySelectorAll(
            ".project-card, .experience-card-3d, .skill-card-3d, .education-card-3d, .cert-card-3d"
        );

        cards.forEach(card => {
            const inner = card.querySelector(
                ".project-card-inner, .experience-card-inner, .skill-card-inner, .education-card-inner, .cert-card-inner"
            );
            if (!inner) return;

            let hoverTimeout;
            let isClicked = false;

            // Mouse Hover Flip (1-second delay)
            card.addEventListener("mouseenter", () => {
                clearTimeout(hoverTimeout);
                if (isClicked) return;

                hoverTimeout = setTimeout(() => {
                    inner.classList.add("flipped");
                    card.classList.add("flipped-parent");
                }, 1000);
            });

            // Real-time 3D Mouse Tilt & Holo Glare tracking
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Set CSS variables for holo-glare tracking
                card.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
                card.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
                
                const xc = x / rect.width - 0.5;
                const yc = y / rect.height - 0.5;
                
                const maxTilt = 10; // Subtler premium tilt

                // Calculate tilt angles based on flip state
                let rotateX = -yc * maxTilt;
                let rotateY = xc * maxTilt;

                if (inner.classList.contains("flipped")) {
                    // When flipped, Y rotation starts at 180 degrees
                    rotateY = 180 - (xc * maxTilt);
                }

                gsap.to(inner, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    ease: "power2.out",
                    duration: 0.35,
                    overwrite: "auto"
                });
            });

            card.addEventListener("mouseleave", () => {
                clearTimeout(hoverTimeout);
                if (isClicked) return;

                inner.classList.remove("flipped");
                card.classList.remove("flipped-parent");

                // Reset card rotation smoothly to flat
                gsap.to(inner, {
                    rotateX: 0,
                    rotateY: 0,
                    transformPerspective: 1000,
                    ease: "power2.out",
                    duration: 0.5,
                    overwrite: "auto"
                });
            });

            // Click Flip (Toggle)
            card.addEventListener("click", (e) => {
                if (e.target.closest("a, button, input, textarea")) return;

                clearTimeout(hoverTimeout);
                isClicked = !isClicked;

                if (isClicked) {
                    inner.classList.add("flipped");
                    card.classList.add("flipped-parent");
                    // Settle flipped state with tilt reset
                    gsap.to(inner, { rotateX: 0, rotateY: 180, transformPerspective: 1000, duration: 0.5 });
                } else {
                    inner.classList.remove("flipped");
                    card.classList.remove("flipped-parent");
                    // Reset back to normal flat
                    gsap.to(inner, { rotateX: 0, rotateY: 0, transformPerspective: 1000, duration: 0.5 });
                }
            });

            // Touch Support for Mobile (1-second delay & tap-toggle fallback)
            let touchStartX = 0;
            let touchStartY = 0;
            let isScrolling = false;

            card.addEventListener("touchstart", (e) => {
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                isScrolling = false;

                clearTimeout(hoverTimeout);
                if (isClicked) return;

                hoverTimeout = setTimeout(() => {
                    if (!isScrolling) {
                        inner.classList.add("flipped");
                        card.classList.add("flipped-parent");
                    }
                }, 1000);
            }, { passive: true });

            card.addEventListener("touchmove", (e) => {
                const touch = e.touches[0];
                const dx = touch.clientX - touchStartX;
                const dy = touch.clientY - touchStartY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Cancel flip if the user is scrolling the page
                if (dist > 10) {
                    isScrolling = true;
                    clearTimeout(hoverTimeout);
                }
            }, { passive: true });

            card.addEventListener("touchend", () => {
                clearTimeout(hoverTimeout);
                if (isClicked) return;

                inner.classList.remove("flipped");
                card.classList.remove("flipped-parent");
                gsap.to(inner, { rotateX: 0, rotateY: 0, transformPerspective: 1000, duration: 0.5 });
            });
        });

        // 3D Tilt for Static Certificate Cards
        const staticCerts = document.querySelectorAll(".cert-card-static");
        staticCerts.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xc = x / rect.width - 0.5;
                const yc = y / rect.height - 0.5;
                
                const maxTilt = 10;

                gsap.to(card, {
                    rotateX: -yc * maxTilt,
                    rotateY: xc * maxTilt,
                    transformPerspective: 1000,
                    z: 10,
                    ease: "power2.out",
                    duration: 0.35,
                    overwrite: "auto"
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    transformPerspective: 1000,
                    z: 0,
                    ease: "power2.out",
                    duration: 0.5,
                    overwrite: "auto"
                });
            });
        });
    }

    // ==========================================================================
    function initGSAPScrollTrigger() {
        gsap.registerPlugin(ScrollTrigger);

        // ==========================================================================
        // SPEED-REACTIVE GLOWING BLUE BACKGROUND WIRE (Sleek thin wire)
        // ==========================================================================
        const wirePath = document.getElementById("blue-wire-path");
        if (wirePath) {
            const pathLength = 100; // Normalized using pathLength="100" in HTML
            
            // Set dash attributes to start completely un-drawn
            wirePath.style.strokeDasharray = pathLength;
            wirePath.style.strokeDashoffset = pathLength;
            
            // Draw path along the scroll through the wrapper sections
            gsap.to(wirePath, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: ".wire-container-wrapper",
                    start: "top 80%",
                    end: "bottom 80%",
                    scrub: 0.2,
                    onUpdate: (self) => {
                        // Animation 2: Scroll-Velocity Dilation
                        const velocity = Math.abs(self.getVelocity());
                        const extraWidth = Math.min(velocity / 200, 4.0); // max 4px extra thickness
                        gsap.to(wirePath, {
                            strokeWidth: (8.0 + extraWidth) + "px",
                            duration: 0.3,
                            overwrite: "auto"
                        });
                    }
                }
            });

            // Animation 3: Interactive Card-Hover Glow Transmission
            const interactiveCards = document.querySelectorAll(
                ".project-card, .experience-card-3d, .skill-card-3d, .cert-card-static"
            );
            interactiveCards.forEach(card => {
                card.addEventListener("mouseenter", () => {
                    wirePath.classList.add("active-glow");
                });
                card.addEventListener("mouseleave", () => {
                    wirePath.classList.remove("active-glow");
                });
            });
        }

        // ==========================================================================
        // SECTION TITLES: PREMIUM 3D FOLD-IN SCROLL ENTRANCES
        // ==========================================================================
        const sectionTitles = document.querySelectorAll(
            ".projects-header, " +
            "#experience .section-title, #experience .section-desc, " +
            "#skills .section-title, #skills .section-desc, " +
            "#education .section-title, #education .section-desc, " +
            "#connect .section-title, #connect .section-desc, " +
            "#contact .projects-section-title, #contact .section-desc, #contact .contact-text"
        );

        sectionTitles.forEach(title => {
            // Remove reveal-on-scroll to avoid conflict with GSAP opacity settings
            title.classList.remove("reveal-on-scroll");

            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                opacity: 0,
                y: 35,
                z: -50,
                rotateX: -25,
                transformPerspective: 1000,
                duration: 0.85,
                ease: "power3.out"
            });
        });

        // 3D Stagger Reveal for Project Cards inside the Projects grid (Individual Triggers)
        const projectCardsList = document.querySelectorAll(".projects-grid .project-card");
        projectCardsList.forEach((card, index) => {
            gsap.fromTo(card, 
                {
                    opacity: 0,
                    y: 60,
                    z: -80,
                    rotateX: -12,
                    rotateY: 6
                },
                {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 95%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 1,
                    y: 0,
                    z: 0,
                    rotateX: 0,
                    rotateY: 0,
                    transformPerspective: 1500,
                    duration: 1.0,
                    delay: (index % 3) * 0.1, // Stagger elements in the same row
                    ease: "power3.out"
                }
            );
        });

        // Safety fallback: Ensure cards are visible after 2.5 seconds even if ScrollTrigger fails or is blocked
        setTimeout(() => {
            projectCardsList.forEach(card => {
                if (parseFloat(window.getComputedStyle(card).opacity) === 0) {
                    gsap.to(card, {
                        opacity: 1,
                        y: 0,
                        z: 0,
                        rotateX: 0,
                        rotateY: 0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });
        }, 2500);

        // 3D Stagger Entrance for Contact Box & Form Groups (Split-Slide Animation Style)
        const contactBox = document.querySelector(".contact-box");
        if (contactBox) {
            // 1. Scale and fade in the contact container card
            gsap.from(contactBox, {
                scrollTrigger: {
                    trigger: contactBox,
                    start: "top 90%",
                    toggleActions: "play none none reverse"
                },
                opacity: 0,
                scale: 0.95,
                duration: 1.2,
                ease: "power3.out"
            });

            // 2. Slide left side content from left
            const contactLeft = contactBox.querySelector(".contact-left");
            if (contactLeft) {
                gsap.from(contactLeft, {
                    scrollTrigger: {
                        trigger: contactBox,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 0,
                    x: -60,
                    duration: 1.0,
                    ease: "power3.out"
                });
            }

            // 3. Slide right side content from right
            const contactRight = contactBox.querySelector(".contact-right");
            if (contactRight) {
                gsap.from(contactRight, {
                    scrollTrigger: {
                        trigger: contactBox,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 0,
                    x: 60,
                    duration: 1.0,
                    ease: "power3.out"
                });
            }

            // 4. Stagger fade & scale form fields inside the right column
            const rightFormElements = contactBox.querySelectorAll(".contact-right .form-group, .contact-right .btn-submit");
            if (rightFormElements.length > 0) {
                gsap.from(rightFormElements, {
                    scrollTrigger: {
                        trigger: contactBox,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    opacity: 0,
                    scale: 0.92,
                    z: -20,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power2.out"
                });
            }
        }
    }

    // ==========================================================================
    // CINEMATIC DEPTH SYSTEM FOR NON-HERO SECTIONS
    // ==========================================================================
    // ==========================================================================
    // ABOUT ME SECTION: 3D PORTRAIT & SCROLL SEQUENCE REVEAL
    function initAboutMeScrollTrigger() {
        if (!document.getElementById("about")) return;

        ScrollTrigger.matchMedia({
            // Desktop Layout (pin and animate portrait touching bottom, left bio/titles, right flowy badges)
            "(min-width: 1001px)": function() {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: "#about",
                        start: "top top",
                        end: "+=160%",
                        pin: true,
                        scrub: 1.5,
                        anticipatePin: 1
                    }
                });

                // Set initial states - keep image anchored at bottom (y: 0)
                gsap.set(".about-portrait-wrapper", {
                    y: 0,
                    scale: 0.95,
                    opacity: 0
                });

                // 1. Portrait fades and scales to 1.0 at bottom center
                tl.fromTo(".about-portrait-wrapper",
                    { scale: 0.95, opacity: 0 },
                    { scale: 1.0, opacity: 1, duration: 1.0, ease: "power2.out" },
                    0
                );

                // 2. Left column bio content slide-in
                tl.fromTo("#about .about-content .fade-up-init",
                    { opacity: 0, x: -60, rotateY: 10, transformOrigin: "left center" },
                    { opacity: 1, x: 0, rotateY: 0, duration: 0.8, ease: "power2.out", stagger: 0.1 },
                    0.2
                );

                // 3. Right column flowy badges reveal
                const flowyBadges = document.querySelectorAll("#about .flowy-badge");
                tl.fromTo(flowyBadges,
                    { opacity: 0, x: 40 },
                    { opacity: 0.3, x: 0, duration: 0.8, ease: "power2.out", stagger: 0.08 },
                    0.3
                );
            },
            
            // Mobile/Tablet Layout (standard scroll fade-up reveal, no pinning)
            "(max-width: 1000px)": function() {
                gsap.set(".about-portrait-wrapper", {
                    y: 0,
                    scale: 1,
                    opacity: 1
                });

                gsap.fromTo("#about .fade-up-init, #about .flowy-badge",
                    { opacity: 0, y: 25 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out",
                        stagger: 0.05,
                        scrollTrigger: {
                            trigger: "#about",
                            start: "top 80%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            }
        });
    }

    // ==========================================================================
    // TAGLINE ROLLING CHANGER TIMER
    // ==========================================================================
    function initTaglineChanger() {
        const changer = document.querySelector(".tagline-changer");
        if (!changer) return;
        const words = changer.querySelectorAll(".changer-word");
        if (words.length <= 1) return;

        // Store original text for each word to prevent glyph mutation
        const originalTexts = Array.from(words).map(w => w.textContent);

        let currentIndex = 0;

        // Scramble animation with random characters resolving back to final text
        function scramble(element, targetText, duration = 400) {
            if (element.scrambleFrameId) {
                cancelAnimationFrame(element.scrambleFrameId);
            }
            const glyphs = "01010101_#*<>[]{}+-=%$@!X#$";
            const length = targetText.length;
            const queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = element.textContent[i] || '';
                const to = targetText[i];
                const start = Math.floor(Math.random() * 15);
                const end = start + Math.floor(Math.random() * 15);
                queue.push({ from, to, start, end });
            }
            
            const startTime = performance.now();
            
            function update(time) {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                let output = '';
                let complete = 0;
                
                for (let i = 0; i < queue.length; i++) {
                    const { from, to, start, end } = queue[i];
                    const currentProgress = (progress * 100);
                    
                    if (currentProgress < start) {
                        output += from;
                    } else if (currentProgress > end) {
                        output += to;
                        complete++;
                    } else {
                        output += glyphs[Math.floor(Math.random() * glyphs.length)];
                    }
                }
                
                element.textContent = output;
                
                if (complete < queue.length) {
                    element.scrambleFrameId = requestAnimationFrame(update);
                } else {
                    element.scrambleFrameId = null;
                }
            }
            
            element.scrambleFrameId = requestAnimationFrame(update);
        }

        // Initialize first word styling
        gsap.set(words, { opacity: 0 });
        gsap.set(words[0], { opacity: 1, y: 0 });

        function rotateTagline() {
            const currentWord = words[currentIndex];
            const currentOriginalText = originalTexts[currentIndex];
            
            currentIndex = (currentIndex + 1) % words.length;
            const nextWord = words[currentIndex];
            const nextTargetText = originalTexts[currentIndex];

            // 1. Animate current word OUT (slide up and fade out)
            gsap.to(currentWord, {
                opacity: 0,
                y: -15,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    currentWord.textContent = currentOriginalText;
                    gsap.set(currentWord, { opacity: 0, y: 0 });
                }
            });

            // 2. Animate next word IN (slide up from below and fade in)
            gsap.set(nextWord, {
                opacity: 0,
                y: 15
            });

            gsap.to(nextWord, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto"
            });

            // Trigger scramble in parallel
            nextWord.textContent = "";
            scramble(nextWord, nextTargetText, 500);

            // Schedule next tagline rotation
            gsap.delayedCall(1.0, rotateTagline);
        }

        // Start delayed loop
        gsap.delayedCall(1.0, rotateTagline);
    }

    // ==========================================================================
    // APPLE NAVBAR SCROLL CONTROLLER
    // ==========================================================================
    function handleNavbarScroll() {
        if (!navHeader) return;
        
        // 1. General scrolled/at-top layout classes
        if (window.scrollY > 50) {
            navHeader.classList.remove("at-top");
            navHeader.classList.add("scrolled");
        } else {
            navHeader.classList.remove("scrolled");
            navHeader.classList.add("at-top");
        }

        // 2. Bounding boxes collision detection for logo, toggle button and tabs
        const logo = document.querySelector(".logo");
        const mobileToggle = document.getElementById("mobile-nav-toggle");
        const navPillButtons = document.querySelectorAll(".nav-pill-btn");
        
        // Query all elements with dark backgrounds that might scroll under the navbar
        const darkElements = document.querySelectorAll(
            ".project-card-front, .project-card-back, " +
            ".experience-card-front, .experience-card-back, " +
            ".skill-card-front, .skill-card-back, " +
            ".education-card-front, .education-card-back, " +
            ".cert-card-front, .cert-card-back, " +
            ".contact-box, .contact-section"
        );
        
        // Helper function to check if two rects overlap
        function isOverlapping(rect1, rect2) {
            return !(
                rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom
            );
        }
        
        const isMenuOpen = navHeader.classList.contains("nav-open");
        const isSandboxOpen = document.getElementById("sandbox-modal")?.classList.contains("open");
        const isBypassActive = isMenuOpen || isSandboxOpen;
        
        // Determine theme for Logo
        if (logo) {
            let logoOverlapsDark = false;
            if (!isBypassActive) {
                const logoRect = logo.getBoundingClientRect();
                darkElements.forEach(el => {
                    const elRect = el.getBoundingClientRect();
                    if (elRect.width > 0 && elRect.height > 0 && isOverlapping(logoRect, elRect)) {
                        logoOverlapsDark = true;
                    }
                });
            }
            
            if (logoOverlapsDark) {
                logo.style.setProperty("color", "#ffffff", "important");
            } else {
                logo.style.setProperty("color", "#0a0a0c", "important");
            }
        }
        
        // Determine theme for Mobile Toggle Button
        if (mobileToggle) {
            let toggleOverlapsDark = false;
            if (!isBypassActive) {
                const toggleRect = mobileToggle.getBoundingClientRect();
                darkElements.forEach(el => {
                    const elRect = el.getBoundingClientRect();
                    if (elRect.width > 0 && elRect.height > 0 && isOverlapping(toggleRect, elRect)) {
                        toggleOverlapsDark = true;
                    }
                });
            }
            
            if (toggleOverlapsDark) {
                mobileToggle.style.setProperty("color", "#ffffff", "important");
            } else {
                mobileToggle.style.setProperty("color", "#0a0a0c", "important");
            }
        }
        
        // Determine theme for each Nav Pill
        navPillButtons.forEach(btn => {
            let btnOverlapsDark = false;
            if (!isBypassActive) {
                const btnRect = btn.getBoundingClientRect();
                darkElements.forEach(el => {
                    const elRect = el.getBoundingClientRect();
                    if (elRect.width > 0 && elRect.height > 0 && isOverlapping(btnRect, elRect)) {
                        btnOverlapsDark = true;
                    }
                });
            }
            
            const isActive = btn.classList.contains("active");
            const isDarkPill = btn.classList.contains("dark-pill");
            
            if (isDarkPill) {
                // "LET'S TALK" button (always black background with white text or vice versa)
                if (btnOverlapsDark) {
                    btn.style.setProperty("background", "#ffffff", "important");
                    btn.style.setProperty("color", "#000000", "important");
                    btn.style.setProperty("border-color", "rgba(255, 255, 255, 0.3)", "important");
                } else {
                    btn.style.setProperty("background", "#000000", "important");
                    btn.style.setProperty("color", "#ffffff", "important");
                    btn.style.setProperty("border-color", "rgba(10, 10, 12, 0.15)", "important");
                }
            } else {
                // Normal glass pills
                if (btnOverlapsDark) {
                    if (isActive) {
                        btn.style.setProperty("background", "rgba(56, 123, 246, 0.3)", "important");
                        btn.style.setProperty("border-color", "rgba(56, 123, 246, 0.5)", "important");
                        btn.style.setProperty("color", "#ffffff", "important");
                    } else {
                        btn.style.setProperty("background", "rgba(255, 255, 255, 0.08)", "important");
                        btn.style.setProperty("border-color", "rgba(255, 255, 255, 0.2)", "important");
                        btn.style.setProperty("color", "#ffffff", "important");
                    }
                } else {
                    if (isActive) {
                        btn.style.setProperty("background", "rgba(56, 123, 246, 0.15)", "important");
                        btn.style.setProperty("border-color", "rgba(56, 123, 246, 0.4)", "important");
                        btn.style.setProperty("color", "#003ccb", "important");
                    } else {
                        btn.style.setProperty("background", "rgba(10, 10, 12, 0.04)", "important");
                        btn.style.setProperty("border-color", "rgba(10, 10, 12, 0.15)", "important");
                        btn.style.setProperty("color", "#0a0a0c", "important");
                    }
                }
            }
        });
    }

    window.addEventListener("scroll", handleNavbarScroll, { passive: true });

    // Mobile Hamburger Toggle and Drawer Handler
    const mobileToggle = document.getElementById("mobile-nav-toggle");
    if (mobileToggle && navHeader) {
        mobileToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            navHeader.classList.toggle("nav-open");
            mobileToggle.classList.toggle("open");
            handleNavbarScroll(); // Refresh layout colors immediately
        });
        
        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll(".nav-pill-btn");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navHeader.classList.remove("nav-open");
                mobileToggle.classList.remove("open");
                handleNavbarScroll();
            });
        });
        
        // Close menu when clicking outside the drawer
        document.addEventListener("click", (e) => {
            const navPills = document.getElementById("nav-pills");
            if (navHeader.classList.contains("nav-open") && navPills && !navPills.contains(e.target) && !mobileToggle.contains(e.target)) {
                navHeader.classList.remove("nav-open");
                mobileToggle.classList.remove("open");
                handleNavbarScroll();
            }
        });
    }

    // Active Section Link Highlighting
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-pill-btn");

    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.scrollY;
            if (window.scrollY >= sectionTop - window.innerHeight / 3) {
                currentSectionId = section.getAttribute("id");
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === `#about` && currentSectionId === `about`) {
                link.classList.add("active");
            } else if (href === `#projects` && currentSectionId === `projects`) {
                link.classList.add("active");
            } else if (href === `#experience` && ['experience', 'skills', 'education', 'connect'].includes(currentSectionId)) {
                link.classList.add("active");
            } else if (href === `#contact` && currentSectionId === `contact`) {
                link.classList.add("active");
            }
        });
    }, { passive: true });

    // ==========================================================================
    // AWWWARDS CUSTOM CURSOR, MAGNETIC EFFECT, & SPOTLIGHT GLOW
    // ==========================================================================
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let glowX = 0;
    let glowY = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    function updateCursorLoop() {
        const cursorSpeed = 0.12; // slightly more lag for smooth spring effect
        cursorX += (mouseX - cursorX) * cursorSpeed;
        cursorY += (mouseY - cursorY) * cursorSpeed;
        
        // Calculate velocity/speed of mouse
        const vx = mouseX - cursorX;
        const vy = mouseY - cursorY;
        const speed = Math.min(Math.sqrt(vx * vx + vy * vy), 100);
        
        // Calculate angle of movement
        const angle = Math.atan2(vy, vx) * 180 / Math.PI;
        
        // Dynamic squeeze ratio (fluid squash and stretch)
        const squeeze = Math.min(speed * 0.008, 0.45);
        const scaleX = 1 + squeeze;
        const scaleY = 1 - squeeze;
        
        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            cursor.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
        }

        const glowSpeed = 0.05;
        glowX += (mouseX - glowX) * glowSpeed;
        glowY += (mouseY - glowY) * glowSpeed;
        
        if (ambientGlow) {
            ambientGlow.style.left = `${glowX}px`;
            ambientGlow.style.top = `${glowY}px`;
        }
        
        requestAnimationFrame(updateCursorLoop);
    }
    
    updateCursorLoop();

    // Mouse Parallax on Hero Stripes Background (Smooth GSAP Scale & Translation)
    const stripesContainer = document.querySelector(".hero-stripes-container");
    if (heroSection && stripesContainer) {
        heroSection.addEventListener("mousemove", (e) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            const offsetX = (e.clientX / width) - 0.5;
            const offsetY = (e.clientY / height) - 0.5;
            
            const shiftAmount = 25; // subtle shift for 3D depth
            
            gsap.to(stripesContainer, {
                scale: 1.05,
                x: offsetX * shiftAmount,
                y: offsetY * shiftAmount,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
        
        heroSection.addEventListener("mouseleave", () => {
            gsap.to(stripesContainer, {
                scale: 1,
                x: 0,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    }

    // Magnetic Buttons & Hovers
    const magneticElements = document.querySelectorAll(".magnetic");

    magneticElements.forEach(elem => {
        elem.addEventListener("mousemove", (e) => {
            const rect = elem.getBoundingClientRect();
            const elemCenterX = rect.left + rect.width / 2;
            const elemCenterY = rect.top + rect.height / 2;
            
            const distanceX = e.clientX - elemCenterX;
            const distanceY = e.clientY - elemCenterY;
            
            const pullFactor = 0.35;
            elem.style.transform = `translate(${distanceX * pullFactor}px, ${distanceY * pullFactor}px)`;
            elem.style.boxShadow = `0 15px 35px rgba(0, 80, 255, 0.45)`;
        });
        
        elem.addEventListener("mouseleave", () => {
            elem.style.transform = "translate(0px, 0px)";
            elem.style.boxShadow = "";
        });
        
        elem.addEventListener("mouseenter", () => {
            if (cursor) cursor.classList.add("hovered");
            if (cursorDot) cursorDot.classList.add("hovered");
        });
        
        elem.addEventListener("mouseleave", () => {
            if (cursor) cursor.classList.remove("hovered");
            if (cursorDot) cursorDot.classList.remove("hovered");
        });
    });

    // Hover effect for links
    const simpleLinks = document.querySelectorAll(".nav-pill-btn, .logo, .footer-link, .contact-value, .project-link");
    simpleLinks.forEach(link => {
        link.addEventListener("mouseenter", () => {
            if (cursor) cursor.classList.add("hovered");
            if (cursorDot) cursorDot.classList.add("hovered");
        });
        
        link.addEventListener("mouseleave", () => {
            if (cursor) cursor.classList.remove("hovered");
            if (cursorDot) cursorDot.classList.remove("hovered");
        });
    });

    // Logo scroll to top action
    const logoEl = document.querySelector(".logo");
    if (logoEl) {
        logoEl.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            history.pushState(null, null, "#hero");
        });
    }

    // Observer for fade-ins
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });
    
    revealElements.forEach(elem => {
        revealObserver.observe(elem);
    });

    // Sleek Page Scroll Progress Indicator
    const progressContainer = document.createElement("div");
    progressContainer.className = "scroll-progress-container";
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress-bar";
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);

    window.addEventListener("scroll", () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }, { passive: true });

    // Sleek Scramble effect on Nav Links on hover
    const navButtons = document.querySelectorAll(".nav-pill-btn");
    navButtons.forEach(btn => {
        const originalText = btn.textContent;
        let isScrambling = false;
        
        btn.addEventListener("mouseenter", () => {
            if (isScrambling) return;
            isScrambling = true;
            
            const glyphs = "01_#*<>[]{}+-=%$@!X#$";
            const duration = 250;
            const startTime = performance.now();
            
            function updateScramble(time) {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                let output = '';
                for (let i = 0; i < originalText.length; i++) {
                    const char = originalText[i];
                    if (char === " " || char === "•") {
                        output += char;
                    } else if (Math.random() < progress) {
                        output += char;
                    } else {
                        output += glyphs[Math.floor(Math.random() * glyphs.length)];
                    }
                }
                
                btn.textContent = output;
                
                if (progress < 1) {
                    requestAnimationFrame(updateScramble);
                } else {
                    btn.textContent = originalText;
                    isScrambling = false;
                }
            }
            requestAnimationFrame(updateScramble);
        });
    });

    // Contact form submit logic - AJAX Fetch submission to Formspree
    window.handleContactSubmit = function(event) {
        event.preventDefault();
        const contactForm = document.getElementById("contact-form");
        if (!contactForm) return;
        
        const submitBtn = contactForm.querySelector(".btn-submit");
        const submitText = document.getElementById("submit-text");
        const originalText = submitText ? submitText.textContent : "Send Transmission";
        
        // Set loading state
        if (submitText) submitText.textContent = "Transmitting...";
        if (submitBtn) submitBtn.style.pointerEvents = "none";
        
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                contactForm.reset();
                showTransmissionSuccessModal();
            } else {
                alert("Transmission failed. Please verify your entries and try again.");
            }
        })
        .catch(error => {
            console.error("Transmission error:", error);
            alert("Transmission failed. Please check your internet connection.");
        })
        .finally(() => {
            // Restore submit button state
            if (submitText) submitText.textContent = originalText;
            if (submitBtn) submitBtn.style.pointerEvents = "auto";
        });
    };

    // 3D Transmission Success Modal Trigger
    window.showTransmissionSuccessModal = function() {
        const modal = document.getElementById("success-modal");
        const card = modal.querySelector(".modal-card");
        if (!modal || !card) return;
        
        modal.classList.add("visible");
        
        // GSAP animate backdrop fade-in
        gsap.to(modal, {
            opacity: 1,
            pointerEvents: "auto",
            duration: 0.45,
            ease: "power2.out"
        });
        
        // GSAP animate 3D card entry (spinning & popping forward from 3D space)
        gsap.fromTo(card,
            { rotateX: -60, rotateY: 15, z: -300, y: 80, opacity: 0 },
            { rotateX: 0, rotateY: 0, z: 0, y: 0, opacity: 1, duration: 0.85, ease: "back.out(1.4)", transformPerspective: 1200 }
        );
        
        // Add interactive 3D mouse tilt tracking while the modal is open
        const onMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = x / rect.width - 0.5;
            const yc = y / rect.height - 0.5;
            const maxTilt = 15;
            
            gsap.to(card, {
                rotateX: -yc * maxTilt,
                rotateY: xc * maxTilt,
                transformPerspective: 1200,
                ease: "power2.out",
                duration: 0.3,
                overwrite: "auto"
            });
        };
        
        modal.addEventListener("mousemove", onMouseMove);
        modal._onMouseMove = onMouseMove; // save ref for removal
    };
    
    window.hideTransmissionSuccessModal = function() {
        const modal = document.getElementById("success-modal");
        const card = modal.querySelector(".modal-card");
        if (!modal || !card) return;
        
        // Remove mousemove tracking listener
        if (modal._onMouseMove) {
            modal.removeEventListener("mousemove", modal._onMouseMove);
            modal._onMouseMove = null;
        }
        
        // GSAP animate 3D card exit (spinning away into depth)
        gsap.to(card, {
            rotateX: 45,
            rotateY: -10,
            z: -200,
            y: -60,
            opacity: 0,
            duration: 0.45,
            ease: "power2.in"
        });
        
        gsap.to(modal, {
            opacity: 0,
            pointerEvents: "none",
            duration: 0.45,
            ease: "power2.in",
            onComplete: () => {
                modal.classList.remove("visible");
                // Clear inline style properties on card
                gsap.set(card, { clearProps: "all" });
            }
        });
    };

    // ==========================================================================
    // 3D DIARY BUTTON TILT ENGINE
    // ==========================================================================
    function init3DDiaryButton() {
        const diaryBtn = document.querySelector(".diary-3d-btn");
        if (!diaryBtn) return;
        
        diaryBtn.addEventListener("mousemove", (e) => {
            const rect = diaryBtn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = x / rect.width - 0.5;
            const yc = y / rect.height - 0.5;
            
            const maxTilt = 15;
            const rotateX = -yc * maxTilt;
            const rotateY = xc * maxTilt;
            
            const base = diaryBtn.querySelector(".btn-base");
            const glow = diaryBtn.querySelector(".btn-glow");
            const shadow = diaryBtn.querySelector(".btn-shadow");
            const text = diaryBtn.querySelector(".diary-btn-text");
            
            gsap.to(base, { rotateX, rotateY, transformPerspective: 1000, duration: 0.3, ease: "power2.out" });
            gsap.to(glow, { rotateX: rotateX * 0.8, rotateY: rotateY * 0.8, transformPerspective: 1000, x: xc * 8, y: yc * 8, duration: 0.3, ease: "power2.out" });
            gsap.to(shadow, { rotateX: rotateX * 0.5, rotateY: rotateY * 0.5, transformPerspective: 1000, x: -xc * 12, y: -yc * 12, duration: 0.3, ease: "power2.out" });
            gsap.to(text, { x: xc * 6, y: yc * 6, z: 20, duration: 0.3, ease: "power2.out" });
        });
        
        diaryBtn.addEventListener("mouseleave", () => {
            const base = diaryBtn.querySelector(".btn-base");
            const glow = diaryBtn.querySelector(".btn-glow");
            const shadow = diaryBtn.querySelector(".btn-shadow");
            const text = diaryBtn.querySelector(".diary-btn-text");
            
            gsap.to([base, glow, shadow], { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.5, ease: "power2.out" });
            gsap.to(text, { x: 0, y: 0, z: 0, duration: 0.5, ease: "power2.out" });
        });
    }

    // ==========================================================================
    // INTERACTIVE LAB PLAYGROUND CONTROLLER
    // ==========================================================================
    function initInteractiveLab() {
        const previewCard = document.getElementById("lab-preview-card");
        const sliderPersp = document.getElementById("slider-persp");
        const sliderTilt = document.getElementById("slider-tilt");
        const sliderGlow = document.getElementById("slider-glow");
        const selectTheme = document.getElementById("select-theme");
        const consoleBody = document.getElementById("console-body");
        
        if (!previewCard) return;
        
        let customPerspective = 1000;
        let customMaxTilt = 15;
        let customGlowOpacity = 0.4;
        let consoleTheme = "cyber-blue";
        
        // Console logging utility
        function addConsoleLine(text, colorClass = "text-gray") {
            const line = document.createElement("div");
            line.className = `console-line ${colorClass}`;
            line.innerText = `[${new Date().toLocaleTimeString()}] ${text}`;
            consoleBody.appendChild(line);
            consoleBody.scrollTop = consoleBody.scrollHeight;
            
            // Keep buffer small (max 20 lines)
            while (consoleBody.children.length > 20) {
                consoleBody.removeChild(consoleBody.firstChild);
            }
        }
        
        let isSpinning = false;
        let sliderTimeout = null;
        const gridBackdrop = document.getElementById("lab-grid-backdrop");
        
        // Tilt preview card programmatically during slider drags to make changes clearly visible!
        function triggerSliderTilt() {
            if (isSpinning) return;
            
            gsap.to(previewCard, {
                rotateX: -12,
                rotateY: 18,
                transformPerspective: customPerspective,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            });
            
            if (gridBackdrop) {
                gsap.to(gridBackdrop, {
                    rotateX: 60 - (-0.16 * 15),
                    rotateY: 0.18 * 15,
                    translateZ: -100 + (-0.16 * 10),
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
            
            if (sliderTimeout) clearTimeout(sliderTimeout);
            sliderTimeout = setTimeout(() => {
                if (previewCard.matches(':hover')) return; // keep tilt intact if hover is active
                gsap.to(previewCard, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
                if (gridBackdrop) {
                    gsap.to(gridBackdrop, {
                        rotateX: 60,
                        rotateY: 0,
                        translateZ: -100,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                }
            }, 1200);
        }
        
        // Set initial parent perspective
        const previewPanel = document.querySelector(".lab-preview-panel");
        if (previewPanel) previewPanel.style.perspective = `${customPerspective}px`;
        
        // Input events updating variables & values
        sliderPersp.addEventListener("input", (e) => {
            customPerspective = e.target.value;
            document.getElementById("label-persp").innerText = `${customPerspective}px`;
            document.getElementById("lab-val-persp").innerText = `${customPerspective}px`;
            
            if (previewPanel) previewPanel.style.perspective = `${customPerspective}px`;
            
            addConsoleLine(`Updated css perspective: ${customPerspective}px;`, "text-cyan");
            triggerSliderTilt();
        });
        
        sliderTilt.addEventListener("input", (e) => {
            customMaxTilt = e.target.value;
            document.getElementById("label-tilt").innerText = `${customMaxTilt}deg`;
            document.getElementById("lab-val-tilt").innerText = `${customMaxTilt}deg`;
            addConsoleLine(`Updated max tilt boundary: ${customMaxTilt}deg;`, "text-cyan");
            triggerSliderTilt();
        });
        
        sliderGlow.addEventListener("input", (e) => {
            customGlowOpacity = e.target.value;
            document.getElementById("label-glow").innerText = customGlowOpacity;
            document.getElementById("lab-val-glow").innerText = parseFloat(customGlowOpacity).toFixed(2);
            previewCard.style.setProperty("--glow-opacity", customGlowOpacity);
            addConsoleLine(`Set vector ambient glow opacity: ${customGlowOpacity};`, "text-cyan");
            triggerSliderTilt();
        });
        
        // Custom Theme Dropdown Handlers
        const trigger = document.getElementById("select-theme-trigger");
        const triggerText = trigger.querySelector(".trigger-text");
        const triggerDot = trigger.querySelector(".theme-dot");
        const dropdownMenu = document.getElementById("select-theme-menu");
        const dropdownWrapper = document.getElementById("select-theme-dropdown");
        const items = dropdownMenu.querySelectorAll(".dropdown-item");
        const hiddenInput = document.getElementById("select-theme");
        
        if (trigger && dropdownWrapper && items) {
            trigger.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdownWrapper.classList.toggle("open");
            });
            
            document.addEventListener("click", () => {
                dropdownWrapper.classList.remove("open");
            });
            
            function updateTheme(val) {
                consoleTheme = val;
                let glowColor = "#387bf6";
                let colorClass = "text-cyan";
                if (consoleTheme === "acid-green") {
                    glowColor = "#00ff66";
                    colorClass = "text-green";
                } else if (consoleTheme === "neon-violet") {
                    glowColor = "#d000ff";
                    colorClass = "text-magenta";
                }
                
                previewCard.style.setProperty("--glow-color", glowColor);
                
                const cardTitle = previewCard.querySelector(".lab-card-title");
                if (cardTitle) {
                    cardTitle.style.setProperty("text-shadow", `0 0 12px ${glowColor}59`);
                }
                
                addConsoleLine(`Reloaded theme schema: ${consoleTheme.toUpperCase()} (${glowColor});`, colorClass);
                
                // Trigger espectacular 3D flip spin card transition
                isSpinning = true;
                gsap.fromTo(previewCard, 
                    { rotateY: 0, rotateX: 0 },
                    { 
                        rotateY: 360, 
                        duration: 0.8, 
                        ease: "power2.inOut",
                        onComplete: () => {
                            isSpinning = false;
                            gsap.set(previewCard, { rotateY: 0, rotateX: 0 });
                        }
                    }
                );
            }

            items.forEach(item => {
                item.addEventListener("click", (e) => {
                    e.stopPropagation();
                    
                    items.forEach(i => i.classList.remove("active"));
                    item.classList.add("active");
                    
                    const val = item.getAttribute("data-value");
                    const text = item.textContent.trim();
                    
                    triggerText.textContent = text;
                    triggerDot.className = `theme-dot ${val}`;
                    if (hiddenInput) hiddenInput.value = val;
                    
                    dropdownWrapper.classList.remove("open");
                    updateTheme(val);
                });
            });
        }
        
        const telemetryPointer = document.getElementById("lab-telemetry-pointer");
        
        // Real-time card mousemove tilt & coordinate matrix tracking
        previewCard.addEventListener("mousemove", (e) => {
            if (isSpinning) return;
            const rect = previewCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = (x / rect.width - 0.5).toFixed(3);
            const yc = (y / rect.height - 0.5).toFixed(3);
            
            const rotateX = (-yc * customMaxTilt).toFixed(2);
            const rotateY = (xc * customMaxTilt).toFixed(2);
            
            // Set values in card metadata
            document.getElementById("lab-val-coords").innerText = `X: ${xc}, Y: ${yc}`;
            
            // Update Card transform styles
            gsap.to(previewCard, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: customPerspective,
                duration: 0.2,
                ease: "power2.out",
                overwrite: "auto"
            });
            
            // Premium 3D Perspective Warp Backdrop Grid
            if (gridBackdrop) {
                gsap.to(gridBackdrop, {
                    rotateX: 60 - yc * 15,
                    rotateY: xc * 15,
                    translateZ: -100 + yc * 10,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
            
            // Telemetry Laser Tracker Crosshair
            if (telemetryPointer) {
                gsap.to(telemetryPointer, {
                    left: `${x}px`,
                    top: `${y}px`,
                    opacity: 1,
                    duration: 0.1,
                    overwrite: "auto"
                });
            }
            
            // Log calculations in terminal console
            const cosX = Math.cos(rotateX * Math.PI / 180).toFixed(4);
            const sinX = Math.sin(rotateX * Math.PI / 180).toFixed(4);
            const cosY = Math.cos(rotateY * Math.PI / 180).toFixed(4);
            const sinY = Math.sin(rotateY * Math.PI / 180).toFixed(4);
            
            let colorClass = "text-gray";
            if (consoleTheme === "acid-green") colorClass = "text-green";
            if (consoleTheme === "neon-violet") colorClass = "text-magenta";
            
            addConsoleLine(`matrix3d(${cosY}, 0, ${-sinY}, 0, ${sinX*sinY}, ${cosX}, ${-sinX*cosY}, 0, ...)`, colorClass);
            
            // Update glare overlay center coordinate position
            const pctX = (x / rect.width * 100).toFixed(1);
            const pctY = (y / rect.height * 100).toFixed(1);
            previewCard.style.setProperty("--glare-x", `${pctX}%`);
            previewCard.style.setProperty("--glare-y", `${pctY}%`);
        });
        
        previewCard.addEventListener("mouseleave", () => {
            document.getElementById("lab-val-coords").innerText = `X: 0.00, Y: 0.00`;
            gsap.to(previewCard, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto"
            });
            if (gridBackdrop) {
                gsap.to(gridBackdrop, {
                    rotateX: 60,
                    rotateY: 0,
                    translateZ: -100,
                    duration: 0.6,
                    ease: "power2.out"
                });
            }
            if (telemetryPointer) {
                gsap.to(telemetryPointer, {
                    opacity: 0,
                    duration: 0.3
                });
            }
            addConsoleLine(`System idle. Telemetry calculations suspended.`, "text-cyan");
        });
    }

    // ==========================================================================
    // SANDBOX DRAWER & DYNAMIC PLAYGROUNDS WIDGETS
    // ==========================================================================
    function initSandboxDrawer() {
        const modal = document.getElementById("sandbox-modal");
        const closeBtn = document.getElementById("sandbox-close-btn");
        const viewport = document.getElementById("sandbox-viewport");
        const sandboxTitle = document.getElementById("sandbox-modal-title");
        const sandboxBtns = document.querySelectorAll(".project-sandbox-btn");
        
        if (!modal || !viewport) return;
        
        // Define simulated templates for each project sandbox playground
        const templates = {
            0: {
                title: "Sentinel AI Chat Simulator",
                html: `
                    <div class="sandbox-chat-container">
                        <div class="sandbox-chat-header">
                            <span>SESSION LINK // SECURE</span>
                            <span class="chat-lock-status">🔒 SHA-256 E2EE</span>
                        </div>
                        <div class="sandbox-chat-log" id="chat-log">
                            <div class="chat-system-line">Channel established. Key handshake complete.</div>
                            <div class="chat-bubble received">Establish target connection. Type a signal payload below to test.</div>
                        </div>
                        <div class="sandbox-chat-input-row">
                            <input type="text" class="sandbox-chat-input" id="chat-input" placeholder="Type encrypted transmission...">
                            <button class="sandbox-chat-send" id="chat-send">➔</button>
                        </div>
                    </div>
                `,
                script: () => {
                    const sendBtn = document.getElementById("chat-send");
                    const input = document.getElementById("chat-input");
                    const log = document.getElementById("chat-log");
                    if (!sendBtn || !input || !log) return;
                    
                    function sendMessage() {
                        const text = input.value.trim();
                        if (!text) return;
                        
                        // Append sent bubble
                        const sentBubble = document.createElement("div");
                        sentBubble.className = "chat-bubble sent";
                        sentBubble.innerText = text;
                        log.appendChild(sentBubble);
                        input.value = "";
                        log.scrollTop = log.scrollHeight;
                        
                        // Simulate network handshakes
                        setTimeout(() => {
                            const sysLine = document.createElement("div");
                            sysLine.className = "chat-system-line";
                            sysLine.innerText = `[SOCKET_IO] Packet: ENCRYPT_AES_GCM(${text.length * 8} bits) transmitted.`;
                            log.appendChild(sysLine);
                            log.scrollTop = log.scrollHeight;
                        }, 500);
                        
                        // Simulate agent response
                        setTimeout(() => {
                            const repBubble = document.createElement("div");
                            repBubble.className = "chat-bubble received";
                            repBubble.innerText = `[System Node-Replica]: Signal received. Action verified. Screenshot-blocking protocols remain active.`;
                            log.appendChild(repBubble);
                            log.scrollTop = log.scrollHeight;
                        }, 1200);
                    }
                    
                    sendBtn.addEventListener("click", sendMessage);
                    input.addEventListener("keydown", (e) => {
                        if (e.key === "Enter") sendMessage();
                    });
                }
            },
            1: {
                title: "LinkedIn Post Prompt Generator",
                html: `
                    <div class="writer-sandbox">
                        <div class="writer-input-box">
                            <label>Choose Writing Template:</label>
                            <div class="custom-dropdown" id="writer-dropdown">
                                <div class="custom-dropdown-trigger">
                                    <span class="dropdown-trigger-text">Product/Project Launch Announcement</span>
                                    <svg class="dropdown-trigger-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                                <div class="custom-dropdown-options">
                                    <div class="custom-dropdown-option active" data-value="tech-launch">Product/Project Launch Announcement</div>
                                    <div class="custom-dropdown-option" data-value="career-advice">Key Engineering Trade-off Reflection</div>
                                    <div class="custom-dropdown-option" data-value="ai-trend">Generative AI agents trend forecast</div>
                                </div>
                            </div>
                            <input type="hidden" id="prompt-select" value="tech-launch">
                        </div>
                        <div class="writer-input-box">
                            <label for="prompt-raw">Topic Keywords (e.g., "Sentinel AI, Expo, privacy"):</label>
                            <textarea id="prompt-raw" class="writer-textarea" placeholder="Enter keywords or simple concept description..."></textarea>
                        </div>
                        <button class="writer-btn" id="writer-generate">Generate AI LinkedIn Post</button>
                        <div class="writer-input-box">
                            <label>Draft Output Workspace:</label>
                            <div class="writer-output-box" id="writer-output">Your generated agentic post draft will render here...</div>
                        </div>
                        <div class="sandbox-sample-notice"><span class="notice-status-dot"></span>[ SAMPLE PREVIEW: GENERATES MOCKED DRAFT CAPTIONS ]</div>
                    </div>
                `,
                script: () => {
                    const genBtn = document.getElementById("writer-generate");
                    const hiddenInput = document.getElementById("prompt-select");
                    const textarea = document.getElementById("prompt-raw");
                    const output = document.getElementById("writer-output");
                    
                    const dropdown = document.getElementById("writer-dropdown");
                    const trigger = dropdown ? dropdown.querySelector(".custom-dropdown-trigger") : null;
                    const triggerText = dropdown ? dropdown.querySelector(".dropdown-trigger-text") : null;
                    const optionsList = dropdown ? dropdown.querySelector(".custom-dropdown-options") : null;
                    const options = dropdown ? dropdown.querySelectorAll(".custom-dropdown-option") : [];
                    
                    if (!genBtn || !hiddenInput || !textarea || !output || !dropdown || !trigger || !triggerText || !optionsList) return;
                    
                    // Toggle dropdown open state
                    trigger.addEventListener("click", (e) => {
                        e.stopPropagation();
                        dropdown.classList.toggle("open");
                    });
                    
                    // Close dropdown when clicking outside
                    document.addEventListener("click", () => {
                        dropdown.classList.remove("open");
                    });
                    
                    // Handle option selection
                    options.forEach(opt => {
                        opt.addEventListener("click", (e) => {
                            e.stopPropagation();
                            const val = opt.getAttribute("data-value");
                            const labelText = opt.innerText;
                            
                            // Update values
                            hiddenInput.value = val;
                            triggerText.innerText = labelText;
                            
                            // Active styling toggle
                            options.forEach(o => o.classList.remove("active"));
                            opt.classList.add("active");
                            
                            // Close dropdown
                            dropdown.classList.remove("open");
                        });
                    });
                    
                    genBtn.addEventListener("click", () => {
                        const val = hiddenInput.value;
                        const keywords = textarea.value.trim() || "Gen AI Developer projects";
                        output.innerText = "Connecting agent nodes...\nInvoking LangChain retriever indices...\nRunning agent writer...";
                        
                        setTimeout(() => {
                            let post = "";
                            if (val === "tech-launch") {
                                post = `🚀 Excited to announce the launch of my new project: ${keywords}! \n\nI built this to address complex challenges in latency and scalability. Incorporating high-performance routing protocols and a custom state dashboard, the engineering design prioritizes throughput with minimal CPU footprint. \n\nCheck out the GitHub repo and share your thoughts! 👇 \n\n#SoftwareEngineering #WebDevelopment #Coding #AI`;
                            } else if (val === "career-advice") {
                                post = `💡 Let's talk about technical debt vs speed in ${keywords}. \n\nDuring development, we faced a major bottleneck in state execution. The challenge: balance memory usage against instant delivery. \n\nInstead of database caching, we opted for localized transient memory. The lesson: trade-offs are the true work of an architect. What's your approach? \n\n#Programming #CleanCode #Architecture #TechLeadership`;
                            } else {
                                post = `🤖 Generative AI and the future of ${keywords} is evolving faster than ever. \n\nWe are shifting from static models to autonomous, multi-agent frameworks that orchestrate entire development lifecycles. Building tools in this domain requires thinking about context limits and asynchronous pipelines from day one. \n\nHow is agentic execution reshaping your roadmap? \n\n#ArtificialIntelligence #MachineLearning #LLM`;
                            }
                            
                            // Elevate output with typewriter printing effect animation
                            output.innerText = "";
                            let i = 0;
                            function typeWriter() {
                                if (i < post.length) {
                                    output.innerText += post.charAt(i);
                                    i++;
                                    setTimeout(typeWriter, 4); // Quick typewriter speed
                                }
                            }
                            typeWriter();
                        }, 1000);
                    });
                }
            },
            2: {
                title: "AI BG Remover swipe-comparison",
                html: `
                    <div class="remover-sandbox">
                        <div class="remover-canvas-wrapper" id="canvas-wrapper">
                            <!-- Background Image (original) -->
                            <img src="assets/project_bgremover.png" alt="Original" class="remover-bg">
                            <!-- Foreground Image (Subject-Only) -->
                            <img src="assets/project_bgremover.png" alt="Clean Foreground" class="remover-foreground" id="remover-fg" style="filter: grayscale(100%) contrast(150%);">
                            <div class="remover-swipe-bar" id="remover-bar"></div>
                            <div class="remover-swipe-thumb" id="remover-thumb">⬎⬏</div>
                        </div>
                        <div class="remover-controls-row">
                            <div class="remover-slider-row">
                                <label for="remover-swipe-slider">Swipe Comparison slider: <span id="swipe-pct">50%</span></label>
                                <input type="range" id="remover-swipe-slider" min="0" max="100" value="50" class="lab-slider">
                            </div>
                            <div class="remover-btn-row">
                                <button class="remover-sample-btn active" data-img="sam">SAM Model</button>
                                <button class="remover-sample-btn" data-img="sam2">SAM2 Beta</button>
                            </div>
                        </div>
                        <div class="sandbox-sample-notice"><span class="notice-status-dot"></span>[ SAMPLE PREVIEW: ORIGINAL MODEL HANDLES FULL-RESOLUTION IMAGES ]</div>
                    </div>
                `,
                script: () => {
                    const wrapper = document.getElementById("canvas-wrapper");
                    const slider = document.getElementById("remover-swipe-slider");
                    const fg = document.getElementById("remover-fg");
                    const bar = document.getElementById("remover-bar");
                    const thumb = document.getElementById("remover-thumb");
                    const sampleBtns = document.querySelectorAll(".remover-sample-btn");
                    
                    if (!wrapper || !fg || !bar || !thumb) return;
                    
                    let isDragging = false;
                    
                    function updateClip(val) {
                        val = Math.max(0, Math.min(100, parseFloat(val)));
                        fg.style.clipPath = `inset(0 0 0 ${val}%)`;
                        bar.style.left = `${val}%`;
                        thumb.style.left = `${val}%`;
                        if (slider) slider.value = val;
                        document.getElementById("swipe-pct").innerText = `${Math.round(val)}%`;
                    }
                    
                    function handleMove(e) {
                        const rect = wrapper.getBoundingClientRect();
                        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                        const x = clientX - rect.left;
                        const pct = ((x / rect.width) * 100).toFixed(1);
                        updateClip(pct);
                    }
                    
                    wrapper.addEventListener("mousedown", (e) => {
                        isDragging = true;
                        handleMove(e);
                        wrapper.style.cursor = "ew-resize";
                    });
                    
                    window.addEventListener("mousemove", (e) => {
                        if (!isDragging) return;
                        handleMove(e);
                    });
                    
                    window.addEventListener("mouseup", () => {
                        isDragging = false;
                        wrapper.style.cursor = "";
                    });
                    
                    wrapper.addEventListener("touchstart", (e) => {
                        isDragging = true;
                        handleMove(e);
                    });
                    
                    window.addEventListener("touchmove", (e) => {
                        if (!isDragging) return;
                        handleMove(e);
                    });
                    
                    window.addEventListener("touchend", () => {
                        isDragging = false;
                    });
                    
                    if (slider) {
                        slider.addEventListener("input", (e) => {
                            updateClip(e.target.value);
                        });
                    }
                    
                    sampleBtns.forEach(btn => {
                        btn.addEventListener("click", (e) => {
                            sampleBtns.forEach(b => b.classList.remove("active"));
                            btn.classList.add("active");
                            const mode = btn.getAttribute("data-img");
                            if (mode === "sam") {
                                fg.style.filter = "grayscale(100%) contrast(150%) brightness(1.1)";
                            } else {
                                fg.style.filter = "drop-shadow(0 0 8px #387bf6) hue-rotate(90deg)";
                            }
                        });
                    });
                }
            },
            3: {
                title: "QR Studio Inline Generator",
                html: `
                    <div class="qr-sandbox">
                        <div class="qr-input-row">
                            <label for="qr-url">Input Target Web Address:</label>
                            <input type="text" id="qr-url" class="qr-text-input" value="https://shanikashameems.vercel.app/">
                        </div>
                        <div class="qr-output-canvas-box" id="qr-canvas-box" style="display: flex; justify-content: center; align-items: center; background: white; padding: 15px; border-radius: 12px; border: 1px solid rgba(10, 10, 12, 0.08); width: 160px; height: 160px; margin: 10px auto;">
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fshanikashameems.vercel.app%2F" alt="QR Code" id="qr-image-obj" style="width: 140px; height: 140px; object-fit: contain;">
                        </div>
                        <button class="qr-download-btn" id="qr-download-trigger" style="width: 100%;">Download QR Code Image</button>
                        <div class="sandbox-sample-notice"><span class="notice-status-dot"></span>[ SAMPLE PREVIEW: GENERATES LIVE READABLE QR CODES ]</div>
                    </div>
                `,
                script: () => {
                    const input = document.getElementById("qr-url");
                    const downloadBtn = document.getElementById("qr-download-trigger");
                    const qrImg = document.getElementById("qr-image-obj");
                    if (!input || !downloadBtn || !qrImg) return;
                    
                    input.addEventListener("input", (e) => {
                        const val = encodeURIComponent(e.target.value.trim() || "https://shanikashameems.vercel.app/");
                        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${val}`;
                    });
                    
                    downloadBtn.addEventListener("click", () => {
                        const val = encodeURIComponent(input.value.trim() || "https://shanikashameems.vercel.app/");
                        const downloadUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${val}`;
                        
                        downloadBtn.innerText = "Downloading Code...";
                        downloadBtn.disabled = true;
                        
                        fetch(downloadUrl)
                            .then(response => response.blob())
                            .then(blob => {
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "qr-code.png";
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                window.URL.revokeObjectURL(url);
                                
                                downloadBtn.innerText = "Download QR Code Image";
                                downloadBtn.disabled = false;
                            })
                            .catch(err => {
                                console.error("Error downloading QR:", err);
                                window.open(downloadUrl, "_blank");
                                downloadBtn.innerText = "Download QR Code Image";
                                downloadBtn.disabled = false;
                            });
                    });
                }
            }
        };
        
        // Open Modal click handler
        sandboxBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const idx = btn.getAttribute("data-project-index");
                const template = templates[idx];
                if (!template) return;
                
                // Set drawer content
                sandboxTitle.innerText = template.title;
                viewport.innerHTML = template.html;
                
                // Show modal overlay and drawer
                modal.classList.add("open");
                document.body.style.overflow = "hidden"; // lock scroll
                
                // Run template script
                template.script();
                
                // Trigger navbar refresh to ensure menu Open state is processed
                handleNavbarScroll();
            });
        });
        
        // Close Modal handler
        function closeModal() {
            modal.classList.remove("open");
            document.body.style.overflow = ""; // restore scroll
            viewport.innerHTML = "";
            handleNavbarScroll();
        }
        
        closeBtn.addEventListener("click", closeModal);
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // ==========================================================================
    // CINEMATIC HUD DECRYPT TOGGLE
    // ==========================================================================
    function initHudToggle() {
        const hudBtn = document.getElementById("hud-toggle-btn");
        const hudText = hudBtn ? hudBtn.querySelector(".hud-btn-text") : null;
        
        if (!hudBtn || !hudText) return;
        
        const consoleBody = document.getElementById("console-body");
        function addLabConsoleLine(text, colorClass = "text-cyan") {
            if (!consoleBody) return;
            const line = document.createElement("div");
            line.className = `console-line ${colorClass}`;
            line.innerText = `[${new Date().toLocaleTimeString()}] ${text}`;
            consoleBody.appendChild(line);
            consoleBody.scrollTop = consoleBody.scrollHeight;
            while (consoleBody.children.length > 20) {
                consoleBody.removeChild(consoleBody.firstChild);
            }
        }
        
        hudBtn.addEventListener("click", () => {
            const isEnabled = document.body.classList.toggle("hud-enabled");
            if (isEnabled) {
                hudText.innerText = "HUD DECRYPT: ON";
                addLabConsoleLine("System override. Decrypt mode active. Matrix visual overlays enabled.", "text-cyan");
            } else {
                hudText.innerText = "HUD DECRYPT: OFF";
                addLabConsoleLine("Override disabled. System secure. Standard themes restored.", "text-cyan");
            }
        });
    }

    // ==========================================================================
    // 3D TILT MECHANICS FOR CONTACT BOX (Cinematic canvas tilt)
    // ==========================================================================
    function initContactBox3DTilt() {
        // Disable on touch screens/mobile devices to prevent focus blocking on tap events
        if (window.matchMedia("(max-width: 900px)").matches || ('ontouchstart' in window)) return;

        const contactBox = document.querySelector(".contact-box");
        const contactForm = document.getElementById("contact-form");
        if (!contactBox) return;

        let isFormActive = false;

        if (contactForm) {
            contactForm.addEventListener("focusin", () => {
                isFormActive = true;
                gsap.to(contactBox, {
                    rotateX: 0,
                    rotateY: 0,
                    ease: "power2.out",
                    duration: 0.25,
                    overwrite: "auto"
                });
            });

            contactForm.addEventListener("focusout", () => {
                requestAnimationFrame(() => {
                    isFormActive = contactForm.contains(document.activeElement);
                });
            });
        }

        contactBox.addEventListener("mousemove", (e) => {
            if (isFormActive || e.target.closest("input, textarea, button, label")) return;

            const rect = contactBox.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = x / rect.width - 0.5;
            const yc = y / rect.height - 0.5;
            
            const maxTilt = 4; // Gentle tilt suited for larger card component bounds

            gsap.to(contactBox, {
                rotateX: -yc * maxTilt,
                rotateY: xc * maxTilt,
                transformPerspective: 1200,
                ease: "power2.out",
                duration: 0.45,
                overwrite: "auto"
            });
        });

        contactBox.addEventListener("mouseleave", () => {
            gsap.to(contactBox, {
                rotateX: 0,
                rotateY: 0,
                ease: "power3.out",
                duration: 0.6,
                overwrite: "auto"
            });
        });
    }

    init3DDiaryButton();
    initInteractiveLab();
    initSandboxDrawer();
    initHudToggle();
    initContactBox3DTilt();
    preloadAssets();
});

window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});

