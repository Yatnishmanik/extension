// ============================================================
// health.js — Backend Health Check & Error Boundary System
// ============================================================

const BACKEND_URL = "http://localhost:5000";
const HEALTH_ENDPOINT = `${BACKEND_URL}/health`;
const HEALTH_CHECK_TIMEOUT = 8000;   // 8s timeout for health check
const API_REQUEST_TIMEOUT = 15000;   // 15s timeout for normal API calls
const AUTO_RETRY_INTERVAL = 10000;   // 10s auto-retry polling

// --- Global State ---
window._healthState = {
    isServerDown: false,
    retryTimer: null,
    retryCountdown: null,
    countdownValue: 10
};

// ============================================================
// 1. HEALTH CHECK — Called before loading the app
// ============================================================

async function checkBackendHealth() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);

        const res = await fetch(HEALTH_ENDPOINT, {
            method: "GET",
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.status === 503) {
            return { ok: false, reason: "Database disconnected — server returned 503." };
        }
        if (res.status === 500) {
            return { ok: false, reason: "Internal server error (500)." };
        }
        if (!res.ok) {
            return { ok: false, reason: `Server responded with HTTP ${res.status}.` };
        }

        // Validate JSON
        try {
            const data = await res.json();
            if (data.status === 'ok') {
                return { ok: true };
            }
            return { ok: false, reason: data.message || "Unexpected health response." };
        } catch (jsonErr) {
            return { ok: false, reason: "Server returned invalid JSON." };
        }

    } catch (err) {
        if (err.name === 'AbortError') {
            return { ok: false, reason: "Connection timed out — server took too long to respond." };
        }
        if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
            return { ok: false, reason: "Network error — server is offline or unreachable." };
        }
        return { ok: false, reason: err.message || "Unknown connection error." };
    }
}


// ============================================================
// 2. SERVER DOWN PAGE — Full-page error screen
// ============================================================

function showServerDownPage(reason = "Backend server is currently down or unreachable.") {
    window._healthState.isServerDown = true;

    const panel = document.getElementById("prompt-box");
    if (!panel) return;

    // Hide app & auth containers
    const appContainer = document.getElementById("app-container");
    const authContainer = document.getElementById("auth-container");
    if (appContainer) appContainer.style.display = "none";
    if (authContainer) authContainer.style.display = "none";

    // Remove existing error screen if present
    const existing = document.getElementById("server-down-container");
    if (existing) existing.remove();

    const errorScreen = document.createElement("div");
    errorScreen.id = "server-down-container";
    errorScreen.innerHTML = `
        <div class="server-down-page">
            <div class="server-down-card">
                <!-- Animated Disconnected Illustration -->
                <div class="server-down-illustration">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Server Box -->
                        <rect x="25" y="30" width="70" height="50" rx="8" stroke="currentColor" stroke-width="2.5" class="server-box"/>
                        <!-- Server Lines -->
                        <line x1="40" y1="45" x2="65" y2="45" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
                        <line x1="40" y1="55" x2="55" y2="55" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
                        <line x1="40" y1="65" x2="60" y2="65" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
                        <!-- Status LED (red/pulsing) -->
                        <circle cx="80" cy="45" r="4" class="server-led"/>
                        <!-- Disconnected Cable -->
                        <path d="M60 80 L60 92 Q60 96 56 96 L44 96" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="cable-left" opacity="0.6"/>
                        <path d="M76 96 L88 96 Q92 96 92 92 L92 80" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="cable-right" opacity="0.6" stroke-dasharray="4 3"/>
                        <!-- X Mark -->
                        <g class="error-x" transform="translate(60, 96)">
                            <circle r="10" fill="none" stroke="#FF453A" stroke-width="2"/>
                            <line x1="-4" y1="-4" x2="4" y2="4" stroke="#FF453A" stroke-width="2.5" stroke-linecap="round"/>
                            <line x1="4" y1="-4" x2="-4" y2="4" stroke="#FF453A" stroke-width="2.5" stroke-linecap="round"/>
                        </g>
                        <!-- Pulse rings around server -->
                        <circle cx="60" cy="55" r="42" stroke="#FF453A" stroke-width="1" fill="none" class="pulse-ring-1"/>
                        <circle cx="60" cy="55" r="50" stroke="#FF453A" stroke-width="0.5" fill="none" class="pulse-ring-2"/>
                    </svg>
                </div>

                <h1 class="server-down-title">Server Unavailable</h1>
                <p class="server-down-message">${reason}</p>
                
                <button class="server-down-retry-btn" id="health-retry-btn" onclick="retryHealthCheck()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="retry-icon">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                    <span>Retry Connection</span>
                </button>

                <div class="server-down-auto-retry" id="health-auto-retry">
                    Auto-retrying in <span id="health-countdown">10</span>s
                </div>

                <div class="server-down-footer">
                    <div class="server-down-status-dot"></div>
                    Disconnected from backend
                </div>
            </div>
        </div>
    `;

    panel.appendChild(errorScreen);

    // Start auto-retry countdown
    startAutoRetry();
}


// ============================================================
// 3. LOADING STATE — Shown while checking server
// ============================================================

function showHealthCheckLoading() {
    const panel = document.getElementById("prompt-box");
    if (!panel) return;

    // Hide app & auth
    const appContainer = document.getElementById("app-container");
    const authContainer = document.getElementById("auth-container");
    if (appContainer) appContainer.style.display = "none";
    if (authContainer) authContainer.style.display = "none";

    const existing = document.getElementById("health-loading-container");
    if (existing) existing.remove();

    const loader = document.createElement("div");
    loader.id = "health-loading-container";
    loader.innerHTML = `
        <div class="health-loading-page">
            <div class="health-loading-spinner">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="3" opacity="0.15"/>
                    <path d="M24 4 a20 20 0 0 1 20 20" stroke="var(--accent, #007aff)" stroke-width="3" stroke-linecap="round" class="spinner-arc"/>
                </svg>
            </div>
            <p class="health-loading-text">Connecting to server<span class="loading-dots"></span></p>
        </div>
    `;

    panel.appendChild(loader);
}

function removeHealthCheckLoading() {
    const loader = document.getElementById("health-loading-container");
    if (loader) loader.remove();
}


// ============================================================
// 4. AUTO-RETRY — Every 10 seconds
// ============================================================

function startAutoRetry() {
    stopAutoRetry(); // Clear any existing timers

    window._healthState.countdownValue = 10;
    updateCountdownDisplay();

    window._healthState.retryCountdown = setInterval(() => {
        window._healthState.countdownValue--;
        updateCountdownDisplay();
        
        if (window._healthState.countdownValue <= 0) {
            retryHealthCheck();
        }
    }, 1000);
}

function stopAutoRetry() {
    if (window._healthState.retryCountdown) {
        clearInterval(window._healthState.retryCountdown);
        window._healthState.retryCountdown = null;
    }
    if (window._healthState.retryTimer) {
        clearTimeout(window._healthState.retryTimer);
        window._healthState.retryTimer = null;
    }
}

function updateCountdownDisplay() {
    const el = document.getElementById("health-countdown");
    if (el) el.textContent = window._healthState.countdownValue;
}


// ============================================================
// 5. RETRY — Manual or Auto
// ============================================================

async function retryHealthCheck() {
    stopAutoRetry();

    const btn = document.getElementById("health-retry-btn");
    const autoRetryEl = document.getElementById("health-auto-retry");
    
    if (btn) {
        btn.disabled = true;
        btn.classList.add("spinning");
        btn.querySelector("span").textContent = "Checking...";
    }
    if (autoRetryEl) autoRetryEl.style.opacity = "0.3";

    const result = await checkBackendHealth();

    if (result.ok) {
        // Server is back! Reload the app.
        window._healthState.isServerDown = false;
        
        const errorScreen = document.getElementById("server-down-container");
        if (errorScreen) errorScreen.remove();

        // Reload the extension app
        reloadApp();
    } else {
        // Still down — reset UI and restart countdown
        if (btn) {
            btn.disabled = false;
            btn.classList.remove("spinning");
            btn.querySelector("span").textContent = "Retry Connection";
        }
        if (autoRetryEl) autoRetryEl.style.opacity = "1";

        // Update the reason message
        const msgEl = document.querySelector(".server-down-message");
        if (msgEl) msgEl.textContent = result.reason;

        startAutoRetry();
    }
}


// ============================================================
// 6. RELOAD APP — When connection restores
// ============================================================

async function reloadApp() {
    removeHealthCheckLoading();

    const { promptimity_is_logged_in } = await chrome.storage.local.get(['promptimity_is_logged_in']);

    if (!promptimity_is_logged_in) {
        showAuthView();
    } else {
        showAppView();
        if (typeof loadUserSettings === 'function') loadUserSettings();
        if (typeof window.initPromptimityTabs === 'function') window.initPromptimityTabs();
    }

    if (typeof window.showToast === 'function') window.showToast("Server connection restored");
}


// ============================================================
// 7. fetchWithHealthCheck — Reusable API Wrapper
// ============================================================

async function fetchWithHealthCheck(url, options = {}) {
    const controller = new AbortController();
    const timeout = options.timeout || API_REQUEST_TIMEOUT;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Merge abort signal
    const fetchOptions = {
        ...options,
        signal: controller.signal
    };
    // Remove custom timeout key
    delete fetchOptions.timeout;

    try {
        const res = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        // Global status code interception
        if (res.status === 401) {
            handleUnauthorized();
            throw new ApiError("Session expired — please log in again.", 401);
        }
        if (res.status === 503) {
            handleServiceUnavailable();
            throw new ApiError("Server is currently unavailable.", 503);
        }
        if (res.status === 500) {
            handleInternalError();
            throw new ApiError("Internal server error.", 500);
        }

        return res;

    } catch (err) {
        clearTimeout(timeoutId);

        // Already handled ApiError — re-throw
        if (err instanceof ApiError) throw err;

        if (err.name === 'AbortError') {
            if (typeof window.showToast === 'function') window.showToast("Request timed out");
            throw new ApiError("Request timed out.", 408);
        }

        // Network error — server likely crashed or internet is down
        if (typeof window.showToast === 'function') window.showToast("Could not connect to server");
        throw new ApiError(err.message || "Network error.", 0);
    }
}

// Custom error class for API errors
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
    }
}


// ============================================================
// 8. GLOBAL INTERCEPTORS — 401, 503, 500 handlers
// ============================================================

function handleUnauthorized() {
    // 401 → Force logout
    chrome.storage.local.clear(() => {
        if (typeof showAuthView === 'function') showAuthView();
        if (typeof window.showToast === 'function') window.showToast("Session expired — please log in again");
    });
}

function handleServiceUnavailable() {
    // 503 → Show server down page
    if (!window._healthState.isServerDown) {
        showServerDownPage("Backend service is temporarily unavailable (503).");
    }
}

function handleInternalError() {
    // 500 → Show error toast
    if (typeof window.showToast === 'function') window.showToast("Internal server error — please try again");
}


// ============================================================
// 9. NETWORK STATUS MONITOR — Detects online/offline
// ============================================================

function initNetworkStatusMonitor() {
    window.addEventListener("offline", () => {
        if (!window._healthState.isServerDown) {
            showServerDownPage("Your internet connection appears to be disconnected.");
        }
    });

    window.addEventListener("online", async () => {
        // Internet is back — check if backend is also reachable
        const result = await checkBackendHealth();
        if (result.ok && window._healthState.isServerDown) {
            window._healthState.isServerDown = false;
            const errorScreen = document.getElementById("server-down-container");
            if (errorScreen) errorScreen.remove();
            reloadApp();
        }
    });
}


// ============================================================
// 10. BOOT SEQUENCE — Run health check before loading app
// ============================================================

async function bootWithHealthCheck() {
    showHealthCheckLoading();
    initNetworkStatusMonitor();

    const result = await checkBackendHealth();

    removeHealthCheckLoading();

    if (result.ok) {
        // Server healthy — proceed normally
        const { promptimity_is_logged_in } = await chrome.storage.local.get(['promptimity_is_logged_in']);

        if (!promptimity_is_logged_in) {
            showAuthView();
        } else {
            showAppView();
            if (typeof loadUserSettings === 'function') loadUserSettings();
            if (typeof window.initPromptimityTabs === 'function') window.initPromptimityTabs();
        }
    } else {
        // Server down — show error page
        showServerDownPage(result.reason);
    }
}
