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

      <div class="app-container">
        <div id="sidebar" class="browser-sidebar">
          <div id="sidebar-scroll"></div>
          <div id="sidebar-footer"></div>
        </div>
        <div id="tabs-container"></div>
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