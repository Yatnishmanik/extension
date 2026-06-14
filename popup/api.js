async function loadTabs(forceSync = false) {
    return new Promise(async resolve => {
        // --- 1. SWR: Load from local storage immediately for fast UI ---
        chrome.storage.local.get(['goprompts_tabs', 'promptimity_token', 'promptimity_is_logged_in'], async (result) => {
            let cachedTabs = result.goprompts_tabs;
            const { promptimity_token, promptimity_is_logged_in } = result;
            
            // If nothing in cache, get defaults
            if (!cachedTabs) {
                try {
                    const url = chrome.runtime.getURL("data/tabs.json");
                    const data = await fetch(url).then(res => res.json());
                    cachedTabs = data;
                } catch (e) {
                    cachedTabs = { tabs: [] };
                }
            }
            
            // Ensure required tabs exist
            if (cachedTabs && cachedTabs.tabs) {
                const hasSettings = cachedTabs.tabs.some(t => t.id === 'settings');
                const hasPromptLab = cachedTabs.tabs.some(t => t.id === 'promptlab');
                if (!hasSettings) cachedTabs.tabs.push({ id: 'settings', name: 'Settings', icon: '⚙️' });
                if (!hasPromptLab) cachedTabs.tabs.splice(1, 0, { id: 'promptlab', name: 'Prompt Lab', icon: '🔬' });
                cachedTabs.tabs = cachedTabs.tabs.filter(t => t.id !== 'research' && t.name !== 'Ideation').map(t => {
                    if (t.id === 'template') {
                        return { ...t, name: 'Skills', icon: 'star' };
                    }
                    return t;
                });
            }
            
            // Resolve immediately for snappy UI unless forceSync is requested
            if (!forceSync) {
                resolve(cachedTabs);
            }
            
            // --- 2. SWR: Fetch in background and sync ---
            try {
                if (promptimity_is_logged_in && promptimity_token) {
                    const res = await fetch("http://localhost:5000/api/tabs", {
                        method: "GET",
                        headers: { "x-auth-token": promptimity_token }
                    });

                    if (res.ok) {
                        const apiTabs = await res.json();
                        let defaultTabs = [];
                        try {
                            const url = chrome.runtime.getURL("data/tabs.json");
                            const data = await fetch(url).then(res => res.json());
                            defaultTabs = data.tabs || [];
                        } catch (e) {}

                        const userTabs = apiTabs.map(t => ({ id: t._id, name: t.name, icon: t.icon || 'home', description: t.description || '' }));
                        const defaultIds = defaultTabs.map(t => t.id);
                        const customUserTabs = userTabs.filter(t => !defaultIds.includes(t.id) && !defaultIds.includes(t.name.toLowerCase()));

                        const mergedTabs = { tabs: [...defaultTabs, ...customUserTabs] };
                        if (!mergedTabs.tabs.some(t => t.id === 'settings')) mergedTabs.tabs.push({ id: 'settings', name: 'Settings', icon: '⚙️' });
                        if (!mergedTabs.tabs.some(t => t.id === 'promptlab')) mergedTabs.tabs.splice(1, 0, { id: 'promptlab', name: 'Prompt Lab', icon: '🔬' });
                        mergedTabs.tabs = mergedTabs.tabs.filter(t => t.id !== 'research' && t.name !== 'Ideation').map(t => {
                            if (t.id === 'template') {
                                return { ...t, name: 'Skills', icon: 'star' };
                            }
                            return t;
                        });

                        await chrome.storage.local.set({ 'goprompts_tabs': mergedTabs });
                        
                        if (forceSync) {
                            resolve(mergedTabs);
                            return;
                        } else {
                            window.dispatchEvent(new CustomEvent('tabsSynced', { detail: mergedTabs }));
                        }
                    }
                }
            } catch(e) {
                console.error("API error syncing tabs", e);
            }
            
            if (forceSync) {
                resolve(cachedTabs);
            }
        });
    });
}

async function loadCards(tabId, forceSync = false) {
    return new Promise(async resolve => {
        if (tabId === 'home') {
            chrome.storage.local.get(['goprompts_recent_cards'], async (result) => {
                if (result.goprompts_recent_cards && result.goprompts_recent_cards.length > 0) {
                    resolve({ cards: result.goprompts_recent_cards });
                } else {
                    try {
                        const url = chrome.runtime.getURL(`data/home.json`);
                        const data = await fetch(url).then(res => res.json());
                        chrome.storage.local.set({ 'goprompts_recent_cards': data.cards });
                        resolve(data);
                    } catch (e) {
                         resolve({ cards: [] });
                    }
                }
            });
            return;
        }

        if (tabId === 'ai') {
            try {
                const url = chrome.runtime.getURL(`data/ai.json`);
                const data = await fetch(url).then(res => res.json());
                let finalData = { cards: [] };
                if (Array.isArray(data)) {
                    finalData.cards = data.map(item => ({
                        id: item.name,
                        title: item.name || item.title || "Untitled",
                        content: `${item.description || ''}<br><br><small><strong>Creator:</strong> ${item.creator || 'Unknown'}</small><br>` +
                                 `${item.youtube_url ? `<a href="${item.youtube_url}" target="_blank" style="color:#0A84FF; text-decoration:none;">▶ Watch on YouTube</a>` : ''}` +
                                 `${item.youtube_url && item.template_url ? ' | ' : ''}` +
                                 `${item.template_url ? `<a href="${item.template_url}" target="_blank" style="color:#0A84FF; text-decoration:none;">📄 Get Template</a>` : ''}`
                    }));
                } else if (typeof data === 'object' && data !== null && !data.cards) {
                    finalData.cards = Object.keys(data).map(key => {
                        const item = data[key];
                        return {
                            id: key,
                            title: key,
                            content: `<div style="margin-bottom: 12px; color: var(--text-color); opacity: 0.9;">${item.description || ''}</div><div style="background: rgba(0,0,0,0.15); padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border-light, rgba(255,255,255,0.1)); font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 13px; position: relative; display: flex; align-items: center; justify-content: space-between; gap: 8px;"><div class="thin-x-scrollbar" style="color: #4CAF50; overflow-x: auto; white-space: nowrap; user-select: all; flex: 1; min-width: 0; padding-bottom: 4px; margin-bottom: -4px;"><span style="opacity:0.6; margin-right:6px;">$</span>${item.install || ''}</div><button class="copy-install-btn" data-cmd="${item.install || ''}" style="background: transparent; border: none; cursor: pointer; padding: 6px; display: flex; align-items: center; justify-content: center; color: var(--text-color); opacity: 0.6; transition: all 0.2s; border-radius: 6px; flex-shrink: 0;" onmouseover="this.style.opacity='1'; this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.opacity='0.6'; this.style.background='transparent'" title="Copy command"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button></div>`
                        };
                    });
                } else if (data.cards) {
                    finalData = data;
                }
                return resolve(finalData);
            } catch (e) {
                console.error("Failed to load AI cards", e);
                return resolve({ cards: [] });
            }
        }

        const key = `goprompts_cards_${tabId}`;
        chrome.storage.local.get([key, 'promptimity_token', 'promptimity_is_logged_in'], async (result) => {
            let cachedData = result[key];
            const { promptimity_token, promptimity_is_logged_in } = result;
            
            if (!cachedData || !cachedData.cards || cachedData.cards.length === 0) {
                try {
                    const url = chrome.runtime.getURL(`data/${tabId}.json`);
                    cachedData = await fetch(url).then(res => res.json());
                    if (!cachedData.cards) cachedData = { cards: [] };
                    chrome.storage.local.set({ [key]: cachedData });
                } catch (e) {
                    cachedData = { cards: [] };
                }
            }
            
            const isCacheEmpty = !cachedData || !cachedData.cards || cachedData.cards.length === 0;
            const shouldForceSync = forceSync || (isCacheEmpty && promptimity_is_logged_in && promptimity_token);
            
            // Resolve immediately for fast UI unless we need to wait for a sync
            if (!shouldForceSync) {
                resolve(cachedData);
            }

            // Fetch in background to sync
            try {
                if (promptimity_is_logged_in && promptimity_token) {
                    const res = await fetch("http://localhost:5000/api/prompts", {
                        method: "GET",
                        headers: { "x-auth-token": promptimity_token }
                    });

                    if (res.ok) {
                        const apiPrompts = await res.json();
                        const tabPrompts = apiPrompts.filter(p => p.tabId === tabId).map(p => ({
                            id: p._id,
                            title: p.title,
                            content: p.content,
                            tags: p.tags || []
                        }));
                        
                        let localCards = [];
                        try {
                            const url = chrome.runtime.getURL(`data/${tabId}.json`);
                            const data = await fetch(url).then(res => res.json());
                            localCards = data.cards || [];
                        } catch (e) {}

                        const apiPromptContents = tabPrompts.map(p => p.content);
                        const filteredLocalCards = localCards.filter(c => !apiPromptContents.includes(c.content));
                        const mergedCards = [...filteredLocalCards, ...tabPrompts];
                        
                        await chrome.storage.local.set({ [key]: { cards: mergedCards } });
                        
                        if (shouldForceSync) {
                            resolve({ cards: mergedCards });
                            return;
                        } else {
                            window.dispatchEvent(new CustomEvent('cardsSynced', { detail: { tabId, cards: mergedCards } }));
                        }
                    }
                }
            } catch(e) {
                console.error("API Error loading prompts", e);
            }
            
            if (shouldForceSync) {
                resolve(cachedData);
            }
        });
    });
}

function saveCards(tabId, data) {
    if (tabId === 'home') {
        return new Promise(resolve => {
            chrome.storage.local.set({ 'goprompts_recent_cards': data.cards }, () => resolve());
        });
    }

    const key = `goprompts_cards_${tabId}`;
    return new Promise(resolve => {
        chrome.storage.local.set({ [key]: data }, () => {
            resolve();
        });
    });
}

async function loadUserSettings() {
    try {
        const { promptimity_token, promptimity_is_logged_in } = await chrome.storage.local.get(['promptimity_token', 'promptimity_is_logged_in']);
        
        if (promptimity_is_logged_in && promptimity_token) {
            const res = await fetch("http://localhost:5000/api/settings", {
                method: "GET",
                headers: { "x-auth-token": promptimity_token }
            });

            if (res.ok) {
                const settings = await res.json();
                
                // Map API response to local storage keys
                const updates = {
                    goprompts_ai_provider: 'xai' // Hardcoded to Cloud: xAI API (Premium)
                };

                // Only overwrite if non-empty to preserve valid local configurations
                if (settings.networkAuthKey) updates.goprompts_api_key = settings.networkAuthKey;
                if (settings.targetModelId) updates.goprompts_ai_model = settings.targetModelId;

                await chrome.storage.local.set(updates);
                console.log("User settings synced from API (Source: Backend)");
            }
        }
    } catch (e) {
        console.error("API error loading user settings", e);
    }
}

async function saveUserSettings(settings) {
    try {
        const { promptimity_token, promptimity_is_logged_in, promptimity_user } = await chrome.storage.local.get(['promptimity_token', 'promptimity_is_logged_in', 'promptimity_user']);
        
        if (promptimity_is_logged_in && promptimity_token) {
            const payload = {
                userId: promptimity_user?._id || promptimity_user?.id,
                aiProvider: settings.goprompts_ai_provider,
                apiKey: settings.goprompts_api_key,
                aiModel: settings.goprompts_ai_model,
                networkAuthKey: settings.goprompts_api_key,
                targetModelId: settings.goprompts_ai_model
            };

            const res = await fetch("http://localhost:5000/api/settings", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "x-auth-token": promptimity_token 
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Backend sync failed with status:", res.status, errorText);
            }

            return res.ok;
        }
    } catch (e) {
        console.error("API error saving user settings", e);
    }
    return false;
}