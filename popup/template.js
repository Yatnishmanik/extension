function renderTemplateUI() {
    const container = document.getElementById("tabs-container");
    container.innerHTML = `
        <style>
            .template-wrapper {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
            }
            .template-container {
                padding: 0;
                color: var(--text-color);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                overflow-y: auto;
                height: 100%;
                box-sizing: border-box;
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none; /* IE and Edge */
            }
            .template-container::-webkit-scrollbar {
                display: none; /* Chrome, Safari and Opera */
            }
            .template-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--border-light);
                padding: 20px 20px 8px 20px;
                margin-bottom: 16px;
            }
            .template-title {
                font-size: 14px;
                font-weight: 600;
                color: var(--text-light);
            }
            #prompt-box.dark-mode .template-title {
                color: var(--text-dark);
            }
            .search-bar-container {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding: 12px 20px;
                border-bottom: 1px solid var(--border-light);
                flex-shrink: 0;
            }
            .search-input {
                background: transparent;
                border: none;
                color: var(--text-light);
                font-size: 13px;
                outline: none;
                flex: 1;
                margin-right: 8px;
            }
            .search-input::placeholder {
                color: #666;
            }
            .search-icon {
                color: var(--text-light);
                opacity: 0.7;
                cursor: pointer;
            }
            .search-icon:hover {
                opacity: 1;
            }
            .tag-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: flex-start;
                margin-bottom: 8px;
                padding: 0;
            }
            .tag-pill {
                background: var(--card-light, #fff);
                border: 1px solid var(--border-light);
                border-radius: 8px;
                padding: 14px 12px;
                font-size: 13px;
                font-weight: 500;
                font-family: 'Times New Roman', Times, serif;
                color: var(--text-light);
                cursor: pointer;
                transition: background 0.2s, transform 0.1s;
                flex: 1 1 calc(50% - 4px);
                text-align: center;
                min-width: 0;
                max-width: calc(50% - 4px);
                box-sizing: border-box;
            }
            #prompt-box.dark-mode .tag-pill {
                background: #212121;
                border-color: rgba(255, 255, 255, 0.08);
                color: #e0e0e0;
            }
            .tag-pill:hover {
                background: rgba(0,0,0,0.04);
                transform: scale(1.02);
            }
            #prompt-box.dark-mode .tag-pill:hover {
                background: #444;
            }
            .category-divider {
                border-bottom: 1px solid var(--border-light);
                padding: 8px 20px 8px 20px;
                margin-bottom: 16px;
                font-size: 14px;
                font-weight: 500;
                color: var(--text-light);
            }
            #prompt-box.dark-mode .category-divider {
                color: var(--text-dark);
                border-bottom-color: var(--border-dark);
            }
        </style>
        <div class="template-wrapper">
            <div class="search-bar-container">
                <input type="text" id="template-search-input" class="search-input" placeholder="Search tags...">
                <div class="search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
            </div>
            <div class="template-container">
                <!-- Study Section -->
                <div class="template-header">
                    <div class="template-title">📚 Study</div>
                </div>
            <div class="tag-grid">
                <div class="tag-pill">concept</div>
                <div class="tag-pill">notes</div>
                <div class="tag-pill">summary</div>
                <div class="tag-pill">flashcards</div>
            </div>

            <!-- Assignments Section -->
            <div class="category-divider">📝 Assignments</div>
            <div class="tag-grid">
                <div class="tag-pill">homework</div>
                <div class="tag-pill">solutions</div>
                <div class="tag-pill">case-study</div>
                <div class="tag-pill">lab-report</div>
            </div>

            <!-- Exams Section -->
            <div class="category-divider">📊 Exams</div>
            <div class="tag-grid">
                <div class="tag-pill">mock-test</div>
                <div class="tag-pill">important-qs</div>
                <div class="tag-pill">quiz</div>
                <div class="tag-pill">practice</div>
                <div class="tag-pill">cheatsheet</div>
            </div>

            <!-- Writing Section -->
            <div class="category-divider">✍️ Writing</div>
            <div class="tag-grid">
                <div class="tag-pill">essay</div>
                <div class="tag-pill">article</div>
                <div class="tag-pill">email</div>
                <div class="tag-pill">report</div>
                <div class="tag-pill">presentation</div>
            </div>

            <!-- Career Section -->
            <div class="category-divider">🎯 Career</div>
            <div class="tag-grid">
                <div class="tag-pill">resume</div>
                <div class="tag-pill">interview</div>
                <div class="tag-pill">roadmap</div>
                <div class="tag-pill">internship</div>
            </div>
            <!-- DSA / Coding Section -->
            <div class="category-divider">🧠 DSA / Coding</div>
            <div class="tag-grid">
                <div class="tag-pill">dsa</div>
                <div class="tag-pill">problem</div>
                <div class="tag-pill">algorithm</div>
                <div class="tag-pill">pseudocode</div>
                <div class="tag-pill">complexity</div>
            </div>

            <!-- Code Section -->
            <div class="category-divider">💻 Code</div>
            <div class="tag-grid">
                <div class="tag-pill">generate-code</div>
                <div class="tag-pill">boilerplate</div>
                <div class="tag-pill">api</div>
                <div class="tag-pill">script</div>
            </div>

            <!-- Debugging Section -->
            <div class="category-divider">🐞 Debugging</div>
            <div class="tag-grid">
                <div class="tag-pill">debug</div>
                <div class="tag-pill">fix-bug</div>
                <div class="tag-pill">optimize</div>
                <div class="tag-pill">refactor</div>
                <div class="tag-pill">review</div>
            </div>

            <!-- System Design Section -->
            <div class="category-divider">🏗️ System Design</div>
            <div class="tag-grid">
                <div class="tag-pill">lld</div>
                <div class="tag-pill">hld</div>
                <div class="tag-pill">scalability</div>
                <div class="tag-pill">architecture</div>
            </div>

            <!-- Development Section -->
            <div class="category-divider">🌐 Development</div>
            <div class="tag-grid">
                <div class="tag-pill">frontend</div>
                <div class="tag-pill">backend</div>
                <div class="tag-pill">fullstack</div>
                <div class="tag-pill">mobile</div>
                <div class="tag-pill">extension 🔥</div>
            </div>

            <!-- AI / Data Section -->
            <div class="category-divider">🤖 AI / Data</div>
            <div class="tag-grid">
                <div class="tag-pill">ml</div>
                <div class="tag-pill">nlp</div>
                <div class="tag-pill">data-analysis</div>
                <div class="tag-pill">prompt</div>
                <div class="tag-pill">openai-api</div>
            </div>

            <!-- DevOps Section -->
            <div class="category-divider">🚀 DevOps</div>
            <div class="tag-grid">
                <div class="tag-pill">docker</div>
                <div class="tag-pill">kubernetes</div>
                <div class="tag-pill">ci-cd</div>
                <div class="tag-pill">cloud</div>
                <div class="tag-pill">deploy</div>
            </div>

            <!-- Docs Section -->
            <div class="category-divider">📄 Docs</div>
            <div class="tag-grid">
                <div class="tag-pill">documentation</div>
                <div class="tag-pill">readme</div>
                <div class="tag-pill">api-docs</div>
                <div class="tag-pill">blog</div>
                <div class="tag-pill">comments</div>
            </div>
        </div>
        </div>
    `;

    // Setup search functionality
    const searchInput = document.getElementById("template-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase().trim();
            const grids = container.querySelectorAll(".tag-grid");
            
            grids.forEach(grid => {
                let hasVisibleTags = false;
                const pills = grid.querySelectorAll(".tag-pill");
                
                pills.forEach(pill => {
                    if (pill.textContent.toLowerCase().includes(term)) {
                        pill.style.display = "";
                        hasVisibleTags = true;
                    } else {
                        pill.style.display = "none";
                    }
                });
                
                const header = grid.previousElementSibling;
                
                if (hasVisibleTags) {
                    grid.style.display = "";
                    if (header && (header.classList.contains("template-header") || header.classList.contains("category-divider"))) {
                        header.style.display = "";
                    }
                } else {
                    grid.style.display = "none";
                    if (header && (header.classList.contains("template-header") || header.classList.contains("category-divider"))) {
                        header.style.display = "none";
                    }
                }
            });
        });
    }

    // Add click listeners to tags
    const allPills = container.querySelectorAll(".tag-pill");
    allPills.forEach(pill => {
        pill.addEventListener("click", () => {
            renderTagDetailsUI(pill.textContent.trim());
        });
    });
}

function renderTagDetailsUI(tagName) {
    const container = document.getElementById("tabs-container");
    
    // Generate hardcoded templates based on the tag
    const mockCards = [
        { title: `${tagName} Fundamentals`, content: `Explain the core concepts and fundamental principles of ${tagName} in a clear, concise manner.` },
        { title: `${tagName} Best Practices`, content: `What are the industry standard best practices and common pitfalls to avoid when working with ${tagName}?` },
        { title: `${tagName} Cheat Sheet`, content: `Generate a comprehensive cheat sheet for ${tagName} including key syntax, commands, or rules.` }
    ];

    container.innerHTML = `
        <div style="padding: 16px 20px; display: flex; align-items: center; border-bottom: 1px solid var(--border-dark, #333); position: sticky; top: 0; background: var(--bg-light); z-index: 10;">
            <div id="template-back-btn" style="cursor: pointer; display: flex; align-items: center; color: var(--text-color); opacity: 0.8; font-weight: 500;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </div>
            <div style="flex: 1; text-align: center; font-weight: 600; font-size: 16px; color: var(--text-color);">${tagName}</div>
            <div style="width: 26px;"></div> <!-- balance for icon width -->
        </div>
        <div id="tag-cards-container" style="padding-top: 10px;"></div>
    `;

    // Apply dark mode background if needed
    if (document.getElementById("prompt-box").classList.contains("dark-mode")) {
        container.querySelector("div").style.background = "var(--bg-dark, #1a1a1a)";
    }

    document.getElementById("template-back-btn").addEventListener("click", () => {
        renderTemplateUI();
    });

    // We use renderCards but target our new sub-container
    if (typeof renderCards === 'function') {
        // Need to temporarily mock/override 'tabs-container' ID if renderCards strictly uses document.getElementById
        // Alternatively we can modify cards.js to accept target element
        renderCards(mockCards, 'template-detail', tagName, 'tag-cards-container');
    }
}
