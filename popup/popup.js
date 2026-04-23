// Create UI first
createPanel();
updateApiStatus();

window.initPromptimityTabs = async function() {
    try {
        const tabsData = await loadTabs();

        // --- TAB ORCHESTRATION ---
        // Initialize Sidebar and Default View
        renderSidebar(tabsData, async (tabId, name) => {
            if (tabId === 'settings') {
                renderSettingsUI(name);
            } else if (tabId === 'promptlab') {
                renderPromptLabUI();
            } else if (tabId === 'home') {
                renderHomeUI();
            } else if (tabId === 'template') {
                renderTemplateUI();
            } else {
                const data = await loadCards(tabId);
                renderCards(data.cards, tabId, name);
            }
        });

        // Set initial state
        if (tabsData.tabs && tabsData.tabs.length > 0) {
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
                const data = await loadCards(firstTab.id);
                renderCards(data.cards, firstTab.id, firstTab.name);
            }
        }

    } catch (e) {
        console.error("ERROR:", e);
    }
};

// Init app
(async function () {
    const { promptimity_is_logged_in } = await chrome.storage.local.get(['promptimity_is_logged_in']);
    
    if (!promptimity_is_logged_in) {
        showAuthView();
    } else {
        showAppView();
        window.initPromptimityTabs();
    }
})();

// Listen for card clicks to tell the active tab to inject prompts
document.addEventListener("click", async function (e) {
    const card = e.target.closest(".card");
    const isActionButton = e.target.closest('.edit-btn') || e.target.closest('.delete-btn') || e.target.closest('.context-menu-item') || e.target.closest('.library-add-system');
    
    if (card && !isActionButton) {
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