function renderHomeUI() {
    const container = document.getElementById("tabs-container");
    container.style.overflow = "hidden"; // Prevent parent scroll — inner flex handles it
    container.innerHTML = `
        <style>
            .home-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                max-height: 100%;
                overflow: hidden;
                padding: 12px 0;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .home-header { margin-bottom: 20px; flex-shrink: 0; }
            .home-title { font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px; color: var(--text-color); letter-spacing: -0.5px; margin: 0 0 6px 0; }
            .home-subtitle { margin: 0; font-size: 13px; color: var(--text-color); opacity: 0.6; line-height: 1.4; font-weight: 400; }
            
            .workspace-card {
                background: rgba(255,255,255,0.03); 
                border: 1px solid var(--border-light); 
                border-radius: 16px; 
                padding: 20px; 
                margin-bottom: 24px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            #prompt-box.dark-mode .workspace-card {
                background: var(--card-dark); 
                border-color: var(--border-dark);
            }

            .action-btn { 
                width: 100%; padding: 18px 12px; border-radius: 16px; font-size: 15px; font-weight: 600; cursor: pointer; 
                transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); border: none; 
                display: flex; justify-content: center; align-items: center; gap: 12px;
                letter-spacing: -0.2px;
            }
            #grammar-btn { 
                background: transparent; 
                color: #34C759; 
                border: 1px solid #34C759;
                box-shadow: 0 0 12px rgba(52, 199, 89, 0.15); 
                margin-bottom: 16px;
            }
            #grammar-btn:hover { transform: translateY(-2px); box-shadow: 0 0 24px rgba(52, 199, 89, 0.3); background: rgba(52, 199, 89, 0.08); }
            
            #enhance-btn { 
                background: transparent; 
                color: #3B82F6; 
                border: 1px solid #3B82F6;
                box-shadow: 0 0 12px rgba(59, 130, 246, 0.15); 
                margin-bottom: 16px;
            }
            #enhance-btn:hover { transform: translateY(-2px); box-shadow: 0 0 24px rgba(59, 130, 246, 0.3); background: rgba(59, 130, 246, 0.08); }

            .action-btn svg { opacity: 0.9; }

            .score-card-theme {
                background: rgba(255,255,255,0.03) !important;
                border: 1px solid var(--border-light) !important;
                border-radius: 16px;
                padding: 12px 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
                margin-bottom: 24px;
                display: flex;
                flex-direction: column;
                gap: 20px;
                background-image: radial-gradient(circle at top right, rgba(138, 90, 236, 0.08), transparent 60%);
                position: relative; overflow: hidden;
            }
            #prompt-box.dark-mode .score-card-theme {
                background: var(--card-dark) !important;
                border-color: var(--border-dark) !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            }
            .score-card-theme::before {
                content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
                background: linear-gradient(90deg, transparent, rgba(138, 90, 236, 0.2), transparent);
            }

            .score-display-wrapper {
                display: flex; align-items: center; gap: 16px; z-index: 1; position: relative;
            }
            .score-divider {
                width: 1px;
                height: 40px;
                background: rgba(0,0,0,0.12);
                flex-shrink: 0;
            }
            #prompt-box.dark-mode .score-divider {
                background: rgba(255,255,255,0.08);
            }
            
            .gauge-wrapper {
                position: relative; width: 64px; height: 64px; flex-shrink: 0;
            }
            .gauge-text {
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                font-weight: 800; font-size: 19px; color: var(--text-color); opacity: 0.9;
                transition: color 0.5s;
            }
            .score-card-theme #score-label { color: var(--text-color) !important; }
            .score-card-theme #score-desc { color: var(--text-color) !important; opacity: 0.6; }

            .score-accordion {
                margin-top: 4px; z-index: 1; position: relative;
            }
            .score-accordion summary {
                font-size: 12px; color: var(--text-color); opacity: 0.7; cursor: pointer; user-select: none;
                list-style: none; display: flex; align-items: center; gap: 6px; transition: color 0.2s, opacity 0.2s;
            }
            .score-accordion summary:hover { opacity: 1; }
            .score-accordion summary::-webkit-details-marker { display: none; }
            .score-accordion summary::after { content: '▾'; transition: transform 0.2s; }
            .score-accordion[open] summary::after { transform: rotate(180deg); }

            .score-checklist {
                display: flex; flex-direction: column; gap: 10px;
                border-left: 2px solid rgba(138, 90, 236, 0.15); padding-left: 12px;
                margin-top: 12px; margin-bottom: 4px;
            }
            .check-item {
                font-size: 13px; color: var(--text-color); opacity: 0.7; display: flex; align-items: center; gap: 10px;
                transition: color 0.3s, opacity 0.3s;
            }
            .check-item.pass { color: #34C759; }
            .check-item svg { width: 16px; height: 16px; transition: stroke 0.3s; }
            .check-item .icon-fail { stroke: rgba(255, 59, 48, 0.8); }
            .check-item.pass .icon-fail { display: none; }
            .check-item .icon-pass { display: none; stroke: #34C759; }
            .check-item.pass .icon-pass { display: block; }
            
            .recent-section-title { font-size: 15px; font-weight: 600; color: var(--text-color); margin: 0; padding: 0 20px 12px 20px; display: flex; align-items: center; gap: 6px; }
            .recent-list { display: flex; flex-direction: column; gap: 12px; padding: 0; }
            .recent-item {
                padding: 12px 16px; 
                background: var(--card-light, #fff); 
                border: 1px solid var(--border-light, #e0e0e0); 
                border-radius: 12px;
                cursor: pointer; 
                transition: transform 0.2s, box-shadow 0.2s; 
                display: flex; 
                flex-direction: column; 
                gap: 8px;
                width: 100%;
                box-sizing: border-box;
            }
            #prompt-box.dark-mode .recent-item {
                background: var(--card-dark, #222);
                border-color: var(--border-dark, #3a3a3a);
            }
            .recent-item:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
            .recent-title { font-size: 15px; font-weight: 700; color: var(--text-color); display: flex; align-items: center; gap: 6px; }
            .recent-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                background: rgba(10, 132, 255, 0.15);
                color: #0A84FF;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 600;
                width: fit-content;
            }
            .recent-preview { font-size: 13px; color: var(--text-color); opacity: 0.6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }

            .home-top-section {
                flex-shrink: 0;
            }
            .recent-prompts-section {
                flex: 1;
                min-height: 0;
                overflow-y: auto;
                padding-bottom: 20px;
                /* Zero padding right and left so items stretch edge-to-edge */
            }
            .recent-prompts-section::-webkit-scrollbar {
                width: 6px;
            }
            .recent-prompts-section::-webkit-scrollbar-thumb {
                background: rgba(138, 90, 236, 0.4);
                border-radius: 4px;
            }
        </style>

        <div class="home-container">

            <div class="home-top-section">
                <div class="score-cards-container">
                <style>
                    .score-cards-container {
                        position: relative;
                        z-index: 10;
                    }
                    .eval-params-card {
                        position: absolute;
                        top: calc(100% - 8px);
                        left: 0;
                        right: 0;
                        z-index: 10;
                        opacity: 0;
                        visibility: hidden;
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                        transform: translateY(-10px);
                        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                        box-sizing: border-box;
                    }
                    .score-cards-container:hover .eval-params-card {
                        opacity: 1;
                        visibility: visible;
                        padding-top: 16px !important;
                        padding-bottom: 16px !important;
                        transform: translateY(0);
                    }
                </style>
                <div class="score-card-theme" style="margin-bottom: 8px; padding: 12px 16px;">
                    <div class="score-display-wrapper" style="margin-top: 0;">
                        <div class="gauge-wrapper">
                            <svg width="64" height="64" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(128,128,128,0.3)" stroke-width="10"></circle>
                                <circle id="gauge-fill" cx="50" cy="50" r="44" fill="none" stroke="rgba(128,128,128,0.2)" stroke-width="10" stroke-dasharray="276.46" stroke-dashoffset="276.46" stroke-linecap="round" transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 1.5s cubic-bezier(0.2, 0.8, 0.2, 1), stroke 0.5s;"></circle>
                            </svg>
                            <div id="score-circle" class="gauge-text">0</div>
                        </div>
                        <div class="score-divider"></div>
                        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                            <div id="score-label" style="font-size: 16px; font-weight: 600;">Prompt Score</div>
                            <div style="font-size: 11px; opacity: 0.4; font-weight: 400; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px;">Quality & Precision</div>
                        </div>
                    </div>
                </div>

            <div class="score-card-theme eval-params-card" style="padding: 16px 20px;">
                <details class="score-accordion" open>
                    <summary style="pointer-events: none;">View Evaluation Parameters</summary>
                    <div class="score-checklist">
                        <div class="check-item" id="chk-len">
                            <svg class="icon-fail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            <svg class="icon-pass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            Sufficient Detail (> 15 words)
                        </div>
                        <div class="check-item" id="chk-action">
                            <svg class="icon-fail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            <svg class="icon-pass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            Action Directive (Create, Detail, etc.)
                        </div>
                        <div class="check-item" id="chk-format">
                            <svg class="icon-fail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            <svg class="icon-pass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            Formatting Constraint (List, Table, etc.)
                        </div>
                        <div class="check-item" id="chk-bounds">
                            <svg class="icon-fail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            <svg class="icon-pass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            Bounding Logic (Only, Exactly, Do not)
                        </div>
                    </div>
                </details>
            </div>
            </div>

            <button id="grammar-btn" class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                <span>Correct Grammar</span>
            </button>

            <button id="enhance-btn" class="action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>Enhance Prompt</span>
            </button>

                <h3 class="recent-section-title" style="margin-top: 16px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Recent Prompts
                </h3>
            </div>

            <div class="recent-prompts-section">
                <div id="recent-list" class="recent-list">
                    <div style="font-size: 12px; opacity: 0.6; text-align: center; padding: 20px;">No recent prompts yet.</div>
                </div>
            </div>
        </div>
    `;

    const grammarBtn = container.querySelector("#grammar-btn");
    const enhanceBtn = container.querySelector("#enhance-btn");

    const pullCurrentPromptText = async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) return "";
            const response = await chrome.tabs.sendMessage(tab.id, { type: "GET_HOST_TEXT" });
            const result = response?.text || "";
            if (result && result.trim().length > 0) return result.trim();
        } catch(err) {
            console.log("Pull Error:", err);
        }
        return "";
    };

    const pushToPage = async (text) => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) { navigator.clipboard.writeText(text); return false; }
            const response = await chrome.tabs.sendMessage(tab.id, { type: "SET_HOST_TEXT", text: text });
            if (!response?.success) { navigator.clipboard.writeText(text); return false; }
            return true;
        } catch(err) {
            console.log("Push Error:", err);
            navigator.clipboard.writeText(text);
            return false;
        }
    };
    const scoreCircle = container.querySelector("#score-circle");
    const scoreLabel = container.querySelector("#score-label");
    
    const chkLen = container.querySelector("#chk-len");
    const chkAction = container.querySelector("#chk-action");
    const chkFormat = container.querySelector("#chk-format");
    const chkBounds = container.querySelector("#chk-bounds");
    const recentList = container.querySelector("#recent-list");

    const renderRecentPrompts = (rawCards) => {
        const distinct = [];
        const seen = new Set();
        for (let c of rawCards) {
            const content = (c.content || "").trim();
            if (!content) continue;
            if (!seen.has(content)) {
                seen.add(content);
                distinct.push(c);
            }
            if (distinct.length >= 7) break; 
        }

        if (distinct.length > 0) {
            recentList.innerHTML = distinct.map(card => {
                const title = (card.title || "").toLowerCase();
                const isGemini = title.includes("gemini");
                const isChatGPT = title.includes("chatgpt");
                const isClaude = title.includes("claude");

                let icon = "";
                if (isGemini) {
                    icon = `
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0; margin-left: -2px;">
                            <path d="M12 2C12 2 12.5 7.5 18 8C12.5 8.5 12 14 12 14C12 14 11.5 8.5 6 8C11.5 7.5 12 2 12 2Z" fill="#4E8AFF"/>
                            <path d="M19 14C19 14 19.3 16.7 22 17C19.3 17.3 19 20 19 20C19 20 18.7 17.3 16 17C18.7 16.7 19 14 19 14Z" fill="#8E75FF"/>
                        </svg>
                    `;
                } else if (isChatGPT) {
                    icon = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #10a37f; flex-shrink: 0;">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            <circle cx="12" cy="12" r="2" fill="currentColor"/>
                        </svg>
                    `;
                } else if (isClaude) {
                    icon = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #D97757; flex-shrink: 0;">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                        </svg>
                    `;
                } else {
                    icon = `
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-color); opacity: 0.5; flex-shrink: 0;">
                            <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
                        </svg>
                    `;
                }

                return `
                    <div class="recent-item" data-text="${encodeURIComponent(card.content)}">
                        <span class="recent-title">${icon}${card.title || 'Untitled Prompt'}</span>
                        <span class="recent-preview">${card.content}</span>
                    </div>
                `;
            }).join('');

            // Add click listeners
            recentList.querySelectorAll('.recent-item').forEach(el => {
                el.addEventListener('click', () => {
                    const decoded = decodeURIComponent(el.getAttribute('data-text'));
                    pushToPage(decoded);
                });
            });
        }
    };

    // Load initially
    chrome.storage.local.get(['goprompts_recent_cards'], (result) => {
        renderRecentPrompts(result.goprompts_recent_cards || []);
    });

    // Listen for live updates
    const storageListener = (changes, namespace) => {
        if (!document.body.contains(recentList)) {
            chrome.storage.onChanged.removeListener(storageListener);
            return;
        }
        if (namespace === 'local' && changes.goprompts_recent_cards) {
            renderRecentPrompts(changes.goprompts_recent_cards.newValue || []);
        }
    };
    chrome.storage.onChanged.addListener(storageListener);

    const setScoreDisplay = (score, hasAction, hasFormat) => {
        scoreCircle.innerText = score;
        const gaugeFill = container.querySelector("#gauge-fill");
        if (gaugeFill) {
            const offset = 276.46 - (276.46 * score) / 100;
            gaugeFill.style.strokeDashoffset = offset;
            gaugeFill.style.opacity = score === 0 ? '0' : '1';
        }
        
        let label = "Prompt Score";
        let color = "#FF3B30"; // Red
        
        if (score === 0) {
            color = "#aaa"; 
        } else if (score >= 80) {
            color = "#34C759"; // Green
        } else if (score >= 50) {
            color = "#ffd60a"; // Yellow
        }

        if (gaugeFill) gaugeFill.style.stroke = color;
        scoreCircle.style.color = color;
        scoreLabel.innerText = label;
        scoreLabel.style.color = score === 0 ? "" : color;
    };

    const processLiveHeuristics = (text) => {
        if (!text || text.trim() === "") {
            chkLen.classList.remove('pass'); chkAction.classList.remove('pass');
            chkFormat.classList.remove('pass'); chkBounds.classList.remove('pass');
            setScoreDisplay(0, false, false);
            return;
        }
        
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (words === 0) {
            chkLen.classList.remove('pass'); chkAction.classList.remove('pass');
            chkFormat.classList.remove('pass'); chkBounds.classList.remove('pass');
            setScoreDisplay(0, false, false);
            return;
        }

        const lowerText = text.toLowerCase();
        
        // 1. Length parameter (Max 30 points)
        const hasLen = words >= 15;
        hasLen ? chkLen.classList.add('pass') : chkLen.classList.remove('pass');
        const lenScore = Math.min((words / 15) * 30, 30);

        // 2. Action Verbs (20 points)
        const actKeywords = ['create', 'write', 'analyze', 'summarize', 'explain', 'generate', 'translate', 'solve', 'develop', 'design', 'outline', 'build', 'detail'];
        const hasAction = actKeywords.some(k => lowerText.includes(k));
        hasAction ? chkAction.classList.add('pass') : chkAction.classList.remove('pass');

        // 3. Formatting (30 points)
        const fmtKeywords = ['table', 'json', 'markdown', 'list', 'step-by-step', 'format', 'code', 'bullet', 'structure', 'csv', 'yaml', 'xml'];
        const hasFormat = fmtKeywords.some(k => lowerText.includes(k));
        hasFormat ? chkFormat.classList.add('pass') : chkFormat.classList.remove('pass');

        // 4. Bounding Logic (20 points)
        const boundsKeywords = ['limit', 'max', 'only', 'do not', 'must', 'strictly', 'exactly', 'prevent', 'never'];
        const hasBounds = boundsKeywords.some(k => lowerText.includes(k));
        hasBounds ? chkBounds.classList.add('pass') : chkBounds.classList.remove('pass');

        let rawScore = lenScore + (hasAction ? 20 : 0) + (hasFormat ? 30 : 0) + (hasBounds ? 20 : 0);
        let finalScore = Math.min(100, Math.round(rawScore));
        
        setScoreDisplay(finalScore, hasAction, hasFormat);
    };

    if (window.__homePollingInterval) clearInterval(window.__homePollingInterval);
    let lastPolledText = null;
    
    window.__homePollingInterval = setInterval(async () => {
        if (!document.body.contains(container)) {
            clearInterval(window.__homePollingInterval);
            return;
        }
        
        const text = await pullCurrentPromptText();
        if (text !== lastPolledText) {
            lastPolledText = text;
            processLiveHeuristics(text || "");
        }
    }, 800);

    grammarBtn.addEventListener('click', async () => {
        const text = await pullCurrentPromptText();
        if (!text) {
            alert("Please type a prompt in the active page's text box to correct it.");
            return;
        }

        grammarBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="gp-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <span>Correcting...</span>
        `;
        grammarBtn.style.opacity = '0.7';
        grammarBtn.disabled = true;

        chrome.runtime.sendMessage({
            type: "OLLAMA_GRAMMAR_REQUEST",
            draft: text
        }, (res) => {
            grammarBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>Corrected</span>
            `;
            setTimeout(() => {
                grammarBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                    <span>Correct Grammar</span>
                `;
                grammarBtn.style.opacity = '1';
                grammarBtn.disabled = false;
            }, 2000);

            if (res && res.success) {
                pushToPage(res.output.trim());
            } else {
                alert("Grammar correction failed: " + (res?.error || 'Unknown error'));
            }
        });
    });

    enhanceBtn.addEventListener('click', async () => {
        const text = await pullCurrentPromptText();
        if (!text) {
            alert("Please type a prompt in the active page's text box to enhance it.");
            return;
        }

        enhanceBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="gp-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            <span>Enhancing...</span>
        `;
        enhanceBtn.style.opacity = '0.7';
        enhanceBtn.disabled = true;

        chrome.runtime.sendMessage({
            type: "OLLAMA_HOME_ENHANCE_REQUEST",
            draft: text
        }, (res) => {
            enhanceBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <span>Enhanced</span>
            `;
            setTimeout(() => {
                enhanceBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    <span>Enhance Prompt</span>
                `;
                enhanceBtn.style.opacity = '1';
                enhanceBtn.disabled = false;
            }, 2000);

            if (res && res.success) {
                pushToPage(res.output.trim());
            } else {
                alert("Enhancement failed: " + (res?.error || 'Unknown error'));
            }
        });
    });



}
