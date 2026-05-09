function createPanel() {


    // 2. Create the main panel
    const panel = document.createElement("div");
    panel.id = "prompt-box";

    panel.innerHTML = `
      <div class="header" style="display: none;">
        <div class="header-title" style="pointer-events: none; display: flex; align-items: center; gap: 6px;">
            Promptimity
        </div>
        <!-- Native Chrome Side Panel has its own header, hiding this -->
      </div>

      <div id="auth-container" class="auth-container" style="display: none;"></div>

      <div class="app-container" id="app-container" style="display: none;">
        <div id="sidebar" class="browser-sidebar">
          <div id="sidebar-scroll"></div>
          <div id="sidebar-footer"></div>
        </div>
        <div style="display: flex; flex-direction: column; flex: 1; overflow: hidden; background: transparent;">
            <div id="tabs-container"></div>
            <div style="border-top: 1px solid var(--border-dark, #333); padding: 10px 0; text-align: center; font-size: 11px; color: #777; flex-shrink: 0; user-select: none;">
                © 2026 Promptimity · All rights reserved Developed by Yatnish & Piyush
            </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // Initialize Theme (Default to Dark Mode)
    const savedTheme = localStorage.getItem('goprompts-theme');
    if (savedTheme !== 'light') {
        panel.classList.add('dark-mode');
    }

    // 7. Sliding logic for tabs and prompts
    function makeScrollable(ele) {
        if (!ele) return;
        let isDown = false;
        let startY;
        let scrollTop;
        let hasDragged = false;

        ele.addEventListener('mousedown', (e) => {
            if (['button', 'input', 'textarea'].includes(e.target.tagName.toLowerCase())) return;
            if (e.target.closest('.card-header')) return;
            
            isDown = true;
            hasDragged = false;
            ele.style.cursor = 'grabbing';
            startY = e.pageY - ele.offsetTop;
            scrollTop = ele.scrollTop;
        });

        ele.addEventListener('mouseleave', () => {
            isDown = false;
            ele.style.cursor = '';
        });

        ele.addEventListener('mouseup', () => {
            isDown = false;
            ele.style.cursor = '';
        });

        ele.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const y = e.pageY - ele.offsetTop;
            const walk = (y - startY);
            if (Math.abs(walk) > 3) hasDragged = true;
            ele.scrollTop = scrollTop - walk;
        });
        
        ele.addEventListener('click', (e) => {
            if (hasDragged) {
                e.stopPropagation();
                e.preventDefault();
                hasDragged = false;
            }
        }, true);
    }
    
    makeScrollable(panel.querySelector('#sidebar-scroll'));
    makeScrollable(panel.querySelector('#tabs-container'));
}

function updateApiStatus() {
    const dot = document.getElementById("api-status-dot");
    if (!dot) return;
    
    // Set to "checking" state initially
    dot.style.color = "#ffd60a"; // Yellow
    dot.style.filter = "drop-shadow(0 0 6px rgba(255, 214, 10, 0.4))";
    dot.title = "Verifying Connection...";

    chrome.runtime.sendMessage({ type: "PING_PROVIDER" }, (res) => {
        if (res && res.success) {
            dot.style.color = "#34C759"; // Green
            dot.style.filter = "drop-shadow(0 0 8px rgba(52, 199, 89, 0.6))";
            dot.title = res.message || "Pipeline: Online";
        } else {
            dot.style.color = "#FF3B30"; // Red
            dot.style.filter = "drop-shadow(0 0 8px rgba(255, 59, 48, 0.4))";
            dot.title = res?.error || "Pipeline: Offline";
        }
    });
}

// Listen for storage changes to update dot
chrome.storage.onChanged.addListener((changes) => {
    if (changes.goprompts_api_key || changes.goprompts_ai_provider) {
        updateApiStatus();
    }
});

window.showToast = function(message) {
    let toast = document.getElementById('gp-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'gp-toast';
        const parent = document.getElementById('prompt-box') || document.body;
        parent.appendChild(toast);
    }
    
    toast.innerHTML = `
        <div style="display:flex; align-items:center; width:100%;">
            <svg style="margin-right:10px; color:#2E7D32;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span style="flex:1; text-align:left;">${message}</span>
            <svg id="gp-toast-close" style="cursor:pointer; color:#1e4620; margin-left:10px; opacity: 0.6;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
    `;
    
    document.getElementById('gp-toast-close').onclick = () => {
        toast.className = toast.className.replace('show', '').trim();
    };

    toast.className = 'gp-toast show';
    
    if (window.gpToastTimeout) clearTimeout(window.gpToastTimeout);
    window.gpToastTimeout = setTimeout(() => {
        toast.className = toast.className.replace('show', '').trim();
    }, 3000);
}

// --- Auth UI Methods ---
function showAuthView() {
    document.getElementById('auth-container').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
    renderLoginUI();
}

function showAppView() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app-container').style.display = 'flex';
}

function renderLoginUI() {
    const authContainer = document.getElementById("auth-container");
    authContainer.innerHTML = `
        <div class="auth-box">
            <div class="auth-logo">
                <img src="../icons/icon128.png" alt="Logo" onerror="this.style.display='none'" />
                <h2 style="font-family: 'Pacifico', cursive; margin:0;">Promptimity</h2>
            </div>
            
            <h1 class="auth-title">Welcome</h1>
            <p class="auth-subtitle">Log in to Promptimity to continue.</p>

            <div class="auth-form">
                <div class="auth-input-group">
                    <span class="auth-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span>
                    <input type="text" placeholder="Username" class="auth-input" id="auth-username">
                </div>
                
                <div class="auth-input-group">
                    <span class="auth-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>
                    <input type="password" placeholder="Password" class="auth-input" id="auth-password">
                    <span class="auth-icon pointer" style="margin-left:auto"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></span>
                </div>

                <div class="auth-links">
                    <a href="http://localhost:3000/forgot-password" target="_blank" class="auth-link">Forgot password?</a>
                </div>

                <button class="auth-btn auth-primary-btn" id="login-submit-btn">Continue</button>

                <div class="auth-switch" style="font-size: 12px; margin-top: 20px;">
                    If you do not have an account
                    <button id="go-to-signup" class="auth-btn auth-social-btn" style="margin-top: 10px; padding: 8px;">Create account</button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("go-to-signup").addEventListener("click", () => {
        window.open("http://localhost:3000/signup", "_blank");
    });

    document.getElementById("login-submit-btn").addEventListener("click", mockLogin);
}

function renderSignupUI() {
    const authContainer = document.getElementById("auth-container");
    authContainer.innerHTML = `
        <div class="auth-box">
            <div class="auth-logo">
                <img src="../icons/icon128.png" alt="Logo" onerror="this.style.display='none'" />
                <h2 style="font-family: 'Pacifico', cursive; margin:0;">Promptimity</h2>
            </div>
            
            <h1 class="auth-title">Create Profile</h1>
            <p class="auth-subtitle">Sign up to get started.</p>

            <div class="auth-form">
                <div class="auth-input-group">
                    <span class="auth-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></span>
                    <input type="text" placeholder="Full Name" class="auth-input" id="auth-name">
                </div>
                
                <div class="auth-input-group">
                    <span class="auth-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></span>
                    <input type="email" placeholder="Email address" class="auth-input" id="auth-email-signup">
                </div>
                
                <div class="auth-input-group">
                    <span class="auth-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></span>
                    <input type="password" placeholder="Password" class="auth-input" id="auth-password-signup">
                </div>

                <button class="auth-btn auth-primary-btn" id="signup-submit-btn" style="margin-top: 10px;">Create Profile</button>
                
                <div class="auth-separator">
                    <span>OR</span>
                </div>
                
                <button class="auth-btn auth-social-btn">
                    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                    Sign up with Google
                </button>

                <div class="auth-switch">
                    Already have an account? <span class="auth-link pointer" id="go-to-login">Log in</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById("go-to-login").addEventListener("click", () => {
        renderLoginUI();
    });

    document.getElementById("signup-submit-btn").addEventListener("click", mockLogin);
}

async function mockLogin() {
    const usernameInput = document.getElementById("auth-username");
    const passwordInput = document.getElementById("auth-password");
    
    const username = usernameInput ? usernameInput.value : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!username || !password) {
        if (typeof window.showToast === 'function') window.showToast("Please enter username and password");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            await chrome.storage.local.set({ 
                'promptimity_is_logged_in': true,
                'promptimity_token': data.token,
                'promptimity_user': data.user
            });
            // Reload UI
            showAppView();
            // Fetch user settings from API
            if (typeof loadUserSettings === 'function') {
                await loadUserSettings();
            }
            // In case popup.js needs to init tabs
            if (typeof window.initPromptimityTabs === 'function') {
                window.initPromptimityTabs(true);
            }
            if (typeof window.showToast === 'function') window.showToast("Successfully logged in");
        } else {
            if (typeof window.showToast === 'function') window.showToast(data.msg || "Login failed");
        }
    } catch (error) {
        console.error("Login error:", error);
        if (typeof window.showToast === 'function') window.showToast("Error connecting to server");
    }
}