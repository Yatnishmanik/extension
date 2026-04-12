// Create UI first
createPanel();
updateApiStatus();

// Init app
(async function () {
    try {
        const tabsData = await loadTabs();

        // --- TAB ORCHESTRATION ---
        // Initialize Sidebar and Default View
        renderSidebar(tabsData, async (tabId, name) => {
            if (tabId === 'settings') {
                renderSettingsUI(name);
            } else if (tabId === 'promptlab') {
                renderPromptLabUI();
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
            } else {
                const data = await loadCards(firstTab.id);
                renderCards(data.cards, firstTab.id, firstTab.name);
            }
        }

    } catch (e) {
        console.error("ERROR:", e);
    }
})();

// Listen for card clicks to tell the active tab to inject prompts
document.addEventListener("click", async function (e) {
    const card = e.target.closest(".card");
    const isActionButton = e.target.closest('.edit-btn') || e.target.closest('.delete-btn');
    
    if (card && !isActionButton) {
        const text = (card.querySelector('.hidden-raw-content') || card.querySelector('.card-content'))?.textContent;
        if (!text) return;
        
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