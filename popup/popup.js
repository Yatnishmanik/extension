// Create UI first
createPanel();
updateApiStatus();

window.initPromptimityTabs = async function(forceSync = false) {
    try {
        // Show skeleton loader immediately while fetching data
        const sidebarScroll = document.getElementById("sidebar-scroll");
        const tabsContainer = document.getElementById("tabs-container");
        
        if (sidebarScroll && tabsContainer) {
            sidebarScroll.innerHTML = `
                <div style="padding: 15px; display: flex; flex-direction: column; gap: 12px; opacity: 0.5;">
                    <div style="height: 30px; background: var(--border-light, #e0e0e0); border-radius: 8px; animation: gp-pulse 1.5s infinite;"></div>
                    <div style="height: 30px; background: var(--border-light, #e0e0e0); border-radius: 8px; animation: gp-pulse 1.5s infinite; animation-delay: 0.2s;"></div>
                    <div style="height: 30px; background: var(--border-light, #e0e0e0); border-radius: 8px; animation: gp-pulse 1.5s infinite; animation-delay: 0.4s;"></div>
                </div>
            `;
            tabsContainer.innerHTML = `
                <div style="padding: 20px; display: flex; flex-direction: column; gap: 20px; opacity: 0.5;">
                    <div style="height: 100px; background: var(--border-light, #e0e0e0); border-radius: 12px; animation: gp-pulse 1.5s infinite;"></div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div style="height: 150px; background: var(--border-light, #e0e0e0); border-radius: 12px; animation: gp-pulse 1.5s infinite; animation-delay: 0.2s;"></div>
                        <div style="height: 150px; background: var(--border-light, #e0e0e0); border-radius: 12px; animation: gp-pulse 1.5s infinite; animation-delay: 0.4s;"></div>
                    </div>
                </div>
                <style>
                    @keyframes gp-pulse { 0% { opacity: 0.6; } 50% { opacity: 0.2; } 100% { opacity: 0.6; } }
                    .dark-mode #sidebar-scroll div > div, .dark-mode #tabs-container div > div { background: var(--border-dark, #333) !important; }
                </style>
            `;
        }

        const tabsData = await loadTabs(forceSync);

        // --- TAB ORCHESTRATION ---
        // Initialize Sidebar and Default View
        const { promptimity_user } = await chrome.storage.local.get(['promptimity_user']);
        renderSidebar(tabsData, async (tabId, name) => {
            const tabsContainer = document.getElementById("tabs-container");
            if (tabsContainer) {
                tabsContainer.style.overflow = ""; // Restore scroll when leaving home view
            }
            if (tabId === 'settings') {
                renderSettingsUI(name);
            } else if (tabId === 'promptlab') {
                renderPromptLabUI();
            } else if (tabId === 'home') {
                renderHomeUI();
            } else if (tabId === 'template') {
                renderTemplateUI();
            } else {
                const data = await loadCards(tabId, false); // No need to force sync on every click, SWR is fine
                renderCards(data.cards, tabId, name);
            }
        }, promptimity_user);

        // Set initial state
        if (tabsData.tabs && tabsData.tabs.length > 0) {
            const tabsContainer = document.getElementById("tabs-container");
            if (tabsContainer) {
                tabsContainer.style.overflow = ""; // Reset overflow on load
            }
            const firstTab = tabsData.tabs[0];
            if (firstTab.id === 'settings') {
                renderSettingsUI(firstTab.name);
            } else if (firstTab.id === 'promptlab') {
                renderPromptLabUI();
            } else if (firstTab.id === 'home') {
                renderHomeUI();
            } else if (firstTab.id === 'template') {
                renderTemplateUI();
            } else {
                const data = await loadCards(firstTab.id, forceSync); // force sync the initial tab as well!
                renderCards(data.cards, firstTab.id, firstTab.name);
            }
        }

    } catch (e) {
        console.error("ERROR:", e);
    }
};

// Init app — health check gate
(async function () {
    if (typeof bootWithHealthCheck === 'function') {
        bootWithHealthCheck();
    } else {
        // Fallback if health.js failed to load
        const { promptimity_is_logged_in } = await chrome.storage.local.get(['promptimity_is_logged_in']);
        if (!promptimity_is_logged_in) {
            showAuthView();
        } else {
            showAppView();
            if (typeof loadUserSettings === 'function') loadUserSettings();
            window.initPromptimityTabs();
        }
    }
})();

// Listen for card clicks to tell the active tab to inject prompts
document.addEventListener("click", async function (e) {
    const copyBtn = e.target.closest(".copy-install-btn");
    if (copyBtn) {
        e.stopPropagation();
        e.preventDefault();
        const cmd = copyBtn.getAttribute("data-cmd");
        if (cmd) {
            navigator.clipboard.writeText(cmd);
            
            // Create a floating 'Copied!' message below the button
            const msg = document.createElement("div");
            msg.innerText = "Copied!";
            msg.style.cssText = "position: absolute; top: calc(100% + 6px); right: -4px; background: rgba(30, 30, 30, 0.95); color: #34C759; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 12px rgba(0,0,0,0.3); z-index: 100000; pointer-events: none; white-space: nowrap;";
            
            copyBtn.style.position = "relative";
            copyBtn.appendChild(msg);

            setTimeout(() => {
                if (msg.parentNode) msg.remove();
            }, 1500);
        }
        return;
    }

    const card = e.target.closest(".card");
    const isActionButton = e.target.closest('.edit-btn') || e.target.closest('.delete-btn') || e.target.closest('.context-menu-item') || e.target.closest('.library-add-system') || e.target.closest('a') || e.target.closest('.copy-install-btn');
    
    if (card && !isActionButton) {
        const tabId = card.getAttribute("data-tab");
        if (tabId === 'ai') {
            return;
        }

        const text = (card.querySelector('.hidden-raw-content') || card.querySelector('.card-content'))?.textContent;
        const titleEl = card.querySelector('.card-title');
        
        let titleText = "Untitled";
        if (titleEl) {
            const clone = titleEl.cloneNode(true);
            const badges = clone.querySelectorAll('.badge');
            badges.forEach(b => b.remove());
            titleText = clone.textContent.trim() || 'Untitled';
        }

        if (!text) return;

        try {
            chrome.storage.local.get(['goprompts_recent_cards'], (res) => {
                let recents = res.goprompts_recent_cards || [];
                recents = recents.filter(c => c.content !== text);
                recents.unshift({ title: titleText, content: text });
                if (recents.length > 20) recents = recents.slice(0, 20);
                chrome.storage.local.set({ goprompts_recent_cards: recents });
            });
        } catch(err) { console.error("Error logging recent card", err); }
        
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab) {
                chrome.tabs.sendMessage(tab.id, { type: "INJECT_PROMPT", text: text }).catch(() => {
                    console.log("Could not contact inject.js on the active tab.");
                });
            }
        } catch (err) {
            console.error("SidePanel: Could not send message to tab", err);
        }
    }
});