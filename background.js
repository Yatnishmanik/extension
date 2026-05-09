if (chrome.sidePanel) {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.type === "OLLAMA_REQUEST") {
    
    // Natively fetch routing rules from secure offline storage
    chrome.storage.local.get(['goprompts_ai_provider', 'goprompts_api_key', 'goprompts_ai_model'], (settings) => {
        const provider = settings.goprompts_ai_provider || 'ollama';
        const model = settings.goprompts_ai_model || (provider === 'xai' ? 'grok-4-1-fast-non-reasoning' : 'llama3');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20-second hard timeout
        
        if (provider === 'xai') {
            const apiKey = settings.goprompts_api_key || '';
            if (!apiKey) {
                clearTimeout(timeoutId);
                sendResponse({ success: false, error: "Missing xAI API Key! Please configure it in the Settings tab." });
                return;
            }

            fetch("https://api.x.ai/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + apiKey
              },
              signal: controller.signal,
              body: JSON.stringify({
                model: model,
                messages: (req.history && req.history.length > 0) ? req.history : [{ role: "user", content: req.prompt }],
                stream: false
              })
            })
            .then(async res => {
                clearTimeout(timeoutId);
                const isJson = res.headers.get('content-type')?.includes('application/json');
                const data = isJson ? await res.json() : null;

                if (res.ok && data) {
                    if (data.choices && data.choices.length > 0) {
                        sendResponse({ success: true, output: data.choices[0].message.content, content: data.choices[0].message.content });
                    } else {
                        sendResponse({ success: false, error: "Cloud API returned an empty response." });
                    }
                } else {
                    const errorMsg = data?.error?.message || `Server Error ${res.status}: ${res.statusText}`;
                    sendResponse({ success: false, error: errorMsg });
                }
            })
            .catch(err => {
              clearTimeout(timeoutId);
              if (err.name === 'AbortError') {
                  sendResponse({ success: false, error: "Request timed out after 20 seconds. The Cloud API took too long to respond." });
              } else {
                  sendResponse({ success: false, error: "Network Error: " + err.message });
              }
            });

        } else {
            // Default Ollama local route bypasses CORS organically
            fetch("http://localhost:11434/api/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              signal: controller.signal,
              body: JSON.stringify({
                model: model,
                prompt: req.history ? req.history.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join("\n") + "\nAssistant:" : req.prompt,
                stream: false
              })
            })
            .then(async res => {
                clearTimeout(timeoutId);
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Server Error ${res.status}: ${text || res.statusText}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.response) {
                    sendResponse({ success: true, output: data.response, content: data.response });
                } else {
                    sendResponse({ success: false, error: "Ollama returned an empty response." });
                }
            })
            .catch(err => {
              clearTimeout(timeoutId);
              if (err.name === 'AbortError') {
                  sendResponse({ success: false, error: "Request timed out after 20 seconds. Is the local Ollama instance hung processing a heavy prompt?" });
              } else {
                  sendResponse({ success: false, error: "Ollama Connection Issue: " + err.message + ". Please verify Ollama is running at localhost:11434" });
              }
            });
        }
    });

    } else if (req.type === "OLLAMA_ENHANCE_REQUEST") {
        
        chrome.storage.local.get(['goprompts_ai_provider', 'goprompts_api_key', 'goprompts_ai_model'], (settings) => {
            const provider = settings.goprompts_ai_provider || 'ollama';
            const model = settings.goprompts_ai_model || (provider === 'xai' ? 'grok-4-1-fast-non-reasoning' : 'llama3');
            
            const styleIntention = req.style || 'Professional';
            const personaRole = req.personaInstruction ? req.personaInstruction : (req.persona ? `Act as: ${req.persona}.` : 'Act as an Expert Prompt Engineer.');
            const sizeInstr = req.size ? `The final response MUST be ${req.size} in length.` : '';
            const expertiseInstr = req.expertise ? `Write with the sophistication and depth of a ${req.expertise}.` : '';
            
            const systemPrompt = `You are an expert prompt engineer. Your task is to transform a simple user input into a highly effective AI prompt.
Follow these rules strictly:
1. ${personaRole}
2. Use the R.I.C.E.S. structure: Role, Intent, Context, Expectation, Style.
3. ${sizeInstr}
4. ${expertiseInstr}
5. If [PAGE CONTEXT] is provided, analyze it deeply to ground the prompt in the current user environment.
6. OUTPUT ONLY THE FINAL PROMPT. NO INTRODUCTIONS. NO MARKDOWN BLOCKS \`\`\`. Start immediately with the prompt.
7. The tone/style expectation is: ${styleIntention}.`;

            let finalInput = `[USER DRAFT]\n${req.draft}`;
            if (req.context) {
                finalInput += `\n\n[PAGE CONTEXT]\n${req.context}`;
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);

            if (provider === 'xai') {
                const apiKey = settings.goprompts_api_key || '';
                if (!apiKey) {
                    clearTimeout(timeoutId);
                    sendResponse({ success: false, error: "Missing API Key." });
                    return;
                }

                fetch("https://api.x.ai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
                    signal: controller.signal,
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: finalInput }
                        ],
                        stream: false
                    })
                })
                .then(async res => {
                    const data = await res.json().catch(() => ({}));
                    if (res.ok) {
                        clearTimeout(timeoutId);
                        if (data.choices && data.choices.length > 0) {
                            sendResponse({ success: true, output: data.choices[0].message.content });
                        } else {
                            sendResponse({ success: false, error: "Cloud API: Empty response." });
                        }
                    } else {
                        clearTimeout(timeoutId);
                        const errorMsg = data?.error?.message || data?.message || `Server Error ${res.status}`;
                        sendResponse({ success: false, error: errorMsg });
                    }
                }).catch(err => {
                    clearTimeout(timeoutId);
                    sendResponse({ success: false, error: err.name === 'AbortError' ? "Request Timeout" : "Network Error: " + err.message });
                });

            } else {
                fetch("http://localhost:11434/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    signal: controller.signal,
                    body: JSON.stringify({
                        model: model,
                        system: systemPrompt,
                        prompt: finalInput,
                        stream: false
                    })
                })
                .then(async res => {
                    clearTimeout(timeoutId);
                    if (!res.ok) {
                        const text = await res.text();
                        throw new Error(`Server Error ${res.status}: ${text || res.statusText}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.response) {
                        sendResponse({ success: true, output: data.response });
                    } else {
                        sendResponse({ success: false, error: "Empty response." });
                    }
                }).catch(err => {
                    clearTimeout(timeoutId);
                    sendResponse({ success: false, error: err.name === 'AbortError' ? "Timeout" : "Connection Issue: " + err.message });
                });
            }
        });

        return true;
    } else if (req.type === "OLLAMA_GRAMMAR_REQUEST") {
        
        chrome.storage.local.get(['goprompts_ai_provider', 'goprompts_api_key', 'goprompts_ai_model'], (settings) => {
            const provider = settings.goprompts_ai_provider || 'ollama';
            const model = settings.goprompts_ai_model || (provider === 'xai' ? 'grok-4-1-fast-non-reasoning' : 'llama3');
            
            const systemPrompt = `You are an expert copyeditor. Your ONLY task is to perfectly correct the grammar, spelling, and punctuation of the user's text.
Follow these rules strictly:
1. Do NOT change the original meaning or tone.
2. Do NOT summarize or add any new information.
3. Do NOT add conversational intros or outros (e.g., "Here is the corrected text:").
4. OUTPUT ONLY THE CORRECTED TEXT. NO MARKDOWN BLOCKS \`\`\`. Start immediately with the corrected text.`;

            let finalInput = `[USER TEXT]\n${req.draft}`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);

            if (provider === 'xai') {
                const apiKey = settings.goprompts_api_key || '';
                if (!apiKey) {
                    clearTimeout(timeoutId);
                    sendResponse({ success: false, error: "Missing API Key." });
                    return;
                }

                fetch("https://api.x.ai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
                    signal: controller.signal,
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: finalInput }
                        ],
                        stream: false
                    })
                })
                .then(async res => {
                    const data = await res.json().catch(() => ({}));
                    if (res.ok) {
                        clearTimeout(timeoutId);
                        if (data.choices && data.choices.length > 0) {
                            sendResponse({ success: true, output: data.choices[0].message.content });
                        } else {
                            sendResponse({ success: false, error: "Cloud API: Empty response." });
                        }
                    } else {
                        clearTimeout(timeoutId);
                        const errorMsg = data?.error?.message || data?.message || `Server Error ${res.status}`;
                        sendResponse({ success: false, error: errorMsg });
                    }
                }).catch(err => {
                    clearTimeout(timeoutId);
                    sendResponse({ success: false, error: err.name === 'AbortError' ? "Request Timeout" : "Network Error: " + err.message });
                });

            } else {
                fetch("http://localhost:11434/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    signal: controller.signal,
                    body: JSON.stringify({
                        model: model,
                        system: systemPrompt,
                        prompt: finalInput,
                        stream: false
                    })
                })
                .then(async res => {
                    clearTimeout(timeoutId);
                    if (!res.ok) {
                        const text = await res.text();
                        throw new Error(`Server Error ${res.status}: ${text || res.statusText}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.response) {
                        sendResponse({ success: true, output: data.response });
                    } else {
                        sendResponse({ success: false, error: "Empty response." });
                    }
                }).catch(err => {
                    clearTimeout(timeoutId);
                    sendResponse({ success: false, error: err.name === 'AbortError' ? "Timeout" : "Connection Issue: " + err.message });
                });
            }
        });

        return true;
    } else if (req.type === "OLLAMA_HOME_ENHANCE_REQUEST") {
        
        chrome.storage.local.get(['goprompts_ai_provider', 'goprompts_api_key', 'goprompts_ai_model'], (settings) => {
            const provider = settings.goprompts_ai_provider || 'ollama';
            const model = settings.goprompts_ai_model || (provider === 'xai' ? 'grok-4-1-fast-non-reasoning' : 'llama3');
            
            const systemPrompt = `You are an expert prompt engineer. Your task is to enhance the user's prompt to make it clear, highly effective, and professional.
Follow these rules strictly:
1. Enhance the prompt in a normal, straightforward way. Do NOT overcomplicate.
2. The enhanced prompt MUST BE STRICTLY LESS THAN 100 WORDS.
3. Keep the user's original intent intact.
4. Do NOT add conversational intros, outros, or explanations (e.g., "Here is the enhanced prompt:").
5. OUTPUT ONLY THE ENHANCED PROMPT TEXT. NO MARKDOWN BLOCKS \`\`\`. Start immediately with the enhanced prompt.`;

            let finalInput = `[USER DRAFT]\n${req.draft}`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);

            if (provider === 'xai') {
                const apiKey = settings.goprompts_api_key || '';
                if (!apiKey) {
                    clearTimeout(timeoutId);
                    sendResponse({ success: false, error: "Missing API Key." });
                    return;
                }

                fetch("https://api.x.ai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
                    signal: controller.signal,
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: finalInput }
                        ],
                        stream: false
                    })
                })
                .then(async res => {
                    const data = await res.json().catch(() => ({}));
                    if (res.ok) {
                        clearTimeout(timeoutId);
                        if (data.choices && data.choices.length > 0) {
                            sendResponse({ success: true, output: data.choices[0].message.content });
                        } else {
                            sendResponse({ success: false, error: "Cloud API: Empty response." });
                        }
                    } else {
                        clearTimeout(timeoutId);
                        const errorMsg = data?.error?.message || data?.message || `Server Error ${res.status}`;
                        sendResponse({ success: false, error: errorMsg });
                    }
                }).catch(err => {
                    clearTimeout(timeoutId);
                    sendResponse({ success: false, error: err.name === 'AbortError' ? "Request Timeout" : "Network Error: " + err.message });
                });

            } else {
                fetch("http://localhost:11434/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    signal: controller.signal,
                    body: JSON.stringify({
                        model: model,
                        system: systemPrompt,
                        prompt: finalInput,
                        stream: false
                    })
                })
                .then(async res => {
                    clearTimeout(timeoutId);
                    if (!res.ok) {
                        const text = await res.text();
                        throw new Error(`Server Error ${res.status}: ${text || res.statusText}`);
                    }
                    return res.json();
                })
                .then(data => {
                    if (data.response) {
                        sendResponse({ success: true, output: data.response });
                    } else {
                        sendResponse({ success: false, error: "Empty response." });
                    }
                }).catch(err => {
                    clearTimeout(timeoutId);
                    sendResponse({ success: false, error: err.name === 'AbortError' ? "Timeout" : "Connection Issue: " + err.message });
                });
            }
        });

        return true;
    } else if (req.type === "PING_PROVIDER") {
        const checkSettings = (settings) => {
            const provider = settings.goprompts_ai_provider || 'ollama';
            const model = settings.goprompts_ai_model || 'llama3';
            const apiKey = settings.goprompts_api_key || '';

            if (provider === 'ollama') {
                fetch("http://localhost:11434/api/tags")
                    .then(res => {
                        if (res.ok) sendResponse({ success: true, message: "Ollama is Online" });
                        else sendResponse({ success: false, error: "Ollama Server Error" });
                    })
                    .catch(() => sendResponse({ success: false, error: "Ollama Offline" }));
            } else {
                if (!apiKey) return sendResponse({ success: false, error: "Missing API Key" });
                fetch("https://api.x.ai/v1/chat/completions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
                    body: JSON.stringify({ model: model, messages: [{role: "user", content: "hi"}], max_tokens: 1 })
                })
                .then(async res => {
                    if (res.ok) sendResponse({ success: true, message: "xAI API Online" });
                    else {
                        const errData = await res.json().catch(() => ({}));
                        sendResponse({ success: false, error: errData.error?.message || "Invalid API Key or Model" });
                    }
                })
                .catch(() => sendResponse({ success: false, error: "xAI Unreachable" }));
            }
        };

        if (req.settings) {
            checkSettings(req.settings);
        } else {
            chrome.storage.local.get(['goprompts_ai_provider', 'goprompts_api_key', 'goprompts_ai_model'], (settings) => {
                checkSettings(settings);
            });
        }
        return true;
    }

    return true; // Keep message port open for async
});
