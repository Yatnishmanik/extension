function renderTemplateUI() {
    const container = document.getElementById("tabs-container");
    if (container) container.style.overflow = "";
    
    const skillsData = [
        {
            id: "react-best-practices",
            trigger: "@react-best-practices",
            category: "Developer",
            categoryName: "💻 Developers & Software Engineers",
            purpose: "Learn and implement modern React, Next.js App Router, and state management patterns.",
            bestFor: "Web developers building modern user interfaces"
        },
        {
            id: "systematic-debugging",
            trigger: "@systematic-debugging",
            category: "Developer",
            categoryName: "💻 Developers & Software Engineers",
            purpose: "Debug complex issues methodically by forming hypotheses, isolating variables, and running trace steps rather than guessing.",
            bestFor: "Developers trying to squash elusive bugs"
        },
        {
            id: "test-driven-development",
            trigger: "@test-driven-development",
            category: "Developer",
            categoryName: "💻 Developers & Software Engineers",
            purpose: "Helps you write robust tests (unit/integration) before writing actual logic (TDD approach).",
            bestFor: "Improving code quality and test coverage"
        },
        {
            id: "webapp-testing",
            trigger: "@webapp-testing",
            category: "Developer",
            categoryName: "💻 Developers & Software Engineers",
            purpose: "Write and automate end-to-end tests for web applications using Playwright or Cypress.",
            bestFor: "Quality assurance and production validation"
        },
        {
            id: "senior-fullstack",
            trigger: "@senior-fullstack",
            category: "Developer",
            categoryName: "💻 Developers & Software Engineers",
            purpose: "Design database schemas, APIs, and implement full-stack features with secure, robust patterns.",
            bestFor: "Building applications from scratch"
        },
        {
            id: "mcp-builder",
            trigger: "@mcp-builder",
            category: "Developer",
            categoryName: "💻 Developers & Software Engineers",
            purpose: "Build custom Model Context Protocol (MCP) servers to connect external databases, APIs, and tools directly to your AI.",
            bestFor: "Advanced developers extending AI capabilities"
        },
        {
            id: "subagent-driven-development",
            trigger: "@subagent-driven-development",
            category: "Developer",
            categoryName: "💻 Developers & Software Engineers",
            purpose: "Coordinate and delegate sub-tasks to multiple parallel AI agents to accelerate large development workflows.",
            bestFor: "Large-scale refactoring and system integrations"
        },
        {
            id: "brainstorming",
            trigger: "@brainstorming",
            category: "Student",
            categoryName: "📚 Students & Office Productivity",
            purpose: "Brainstorm essays, research projects, product designs, or coding projects before jumpstarting the execution.",
            bestFor: "Resolving writer's block and outlining project scopes"
        },
        {
            id: "notebooklm",
            trigger: "@notebooklm",
            category: "Student",
            categoryName: "📚 Students & Office Productivity",
            purpose: "Synthesize, summarize, and query academic sources, study guides, and documents via Google NotebookLM techniques.",
            bestFor: "Studying for exams and reviewing complex lecture notes"
        },
        {
            id: "pdf",
            trigger: "@pdf",
            category: "Student",
            categoryName: "📚 Students & Office Productivity",
            purpose: "Extract text, merge multiple study documents, split chapters, or automatically fill out digital forms.",
            bestFor: "Managing textbooks, research papers, and assignments"
        },
        {
            id: "doc-coauthoring",
            trigger: "@doc-coauthoring",
            category: "Student",
            categoryName: "📚 Students & Office Productivity",
            purpose: "Collaborate with the AI to draft research papers, essay structures, lab reports, or technical documentations.",
            bestFor: "Creative writing and project report structures"
        },
        {
            id: "docx",
            trigger: "@docx",
            category: "Student",
            categoryName: "📚 Students & Office Productivity",
            purpose: "Create and format Word documents, or collaborate on written reports and essays.",
            bestFor: "Preparing presentations, analyzing lab data, and homework"
        },
        {
            id: "xlsx",
            trigger: "@xlsx",
            category: "Student",
            categoryName: "📚 Students & Office Productivity",
            purpose: "Write Excel formulas, analyze data, and build custom data charts.",
            bestFor: "Spreadsheets, formulas, and analyzing lab data"
        },
        {
            id: "pptx",
            trigger: "@pptx",
            category: "Student",
            categoryName: "📚 Students & Office Productivity",
            purpose: "Build beautifully styled PowerPoint slide decks and presentations.",
            bestFor: "Preparing presentation slides and school projects"
        },
        {
            id: "algorithmic-art",
            trigger: "@algorithmic-art",
            category: "Student",
            categoryName: "📚 Students & Office Productivity",
            purpose: "Create interactive visual art, animations, or geometry using code (specifically p5.js and canvas).",
            bestFor: "Learning creative coding and building interactive pages"
        },
        {
            id: "writing-plans",
            trigger: "@writing-plans",
            category: "Productivity",
            categoryName: "📈 General Productivity & Workflow",
            purpose: "Outline clear step-by-step implementation plans before beginning a complex homework assignment or software task.",
            bestFor: "Getting structured, stress-free roadmaps"
        },
        {
            id: "executing-plans",
            trigger: "@executing-plans",
            category: "Productivity",
            categoryName: "📈 General Productivity & Workflow",
            purpose: "Keep track of project progress with checkpoints, validating each step before moving to the next.",
            bestFor: "Ensuring you don't miss requirements in complex projects"
        },
        {
            id: "verification-before-completion",
            trigger: "@verification-before-completion",
            category: "Productivity",
            categoryName: "📈 General Productivity & Workflow",
            purpose: "Perform rigorous checks, linting, tests, and reviews before handing in an assignment or merging a PR.",
            bestFor: "Guaranteeing zero-defect deliverables"
        },
        {
            id: "skill-creator",
            trigger: "@skill-creator",
            category: "Productivity",
            categoryName: "📈 General Productivity & Workflow",
            purpose: "Teach the AI a custom workflow you do frequently and wrap it into a reusable new skill!",
            bestFor: "Automating repetitive tasks"
        }
    ];

    container.innerHTML = `
        <style>
            .skills-wrapper {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            }
            .skills-search-bar {
                display: flex;
                align-items: center;
                padding: 12px 20px;
                border-bottom: 1px solid var(--border-light, #e0e0e0);
                flex-shrink: 0;
            }
            #prompt-box.dark-mode .skills-search-bar {
                border-bottom: 1px solid var(--border-dark, #333);
            }
            .skills-search-input {
                background: transparent;
                border: none;
                color: var(--text-color);
                font-size: 13px;
                outline: none;
                flex: 1;
                margin-right: 8px;
            }
            .skills-search-input::placeholder {
                color: #8e8e93;
                opacity: 0.6;
            }
            .skills-search-icon {
                color: var(--text-color);
                opacity: 0.5;
            }
            .skills-container {
                padding: 16px 20px 30px 20px;
                overflow-y: auto;
                height: 100%;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
            }
            .skills-container::-webkit-scrollbar {
                width: 6px;
            }
            .skills-container::-webkit-scrollbar-thumb {
                background: rgba(138, 90, 236, 0.4);
                border-radius: 4px;
            }
            .category-section {
                margin-bottom: 24px;
            }
            .category-section-title {
                font-size: 13.5px;
                font-weight: 700;
                color: var(--text-color);
                opacity: 0.5;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 14px;
                padding-left: 2px;
            }
            .skill-card {
                background: var(--card-light, #fff);
                border: 1px solid var(--border-light, #e0e0e0);
                border-radius: 14px;
                padding: 16px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), 
                            box-shadow 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), 
                            border-color 0.2s ease;
                display: flex;
                flex-direction: column;
                gap: 8px;
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
            }
            #prompt-box.dark-mode .skill-card {
                background: var(--card-dark, #222);
                border-color: var(--border-dark, #333);
            }
            .skill-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 18px rgba(10, 132, 255, 0.1);
                border-color: rgba(10, 132, 255, 0.5);
            }
            #prompt-box.dark-mode .skill-card:hover {
                box-shadow: 0 6px 18px rgba(10, 132, 255, 0.2);
                border-color: rgba(10, 132, 255, 0.6);
            }
            .skill-card:active {
                transform: translateY(1px);
            }
            .skill-badge-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .skill-trigger-badge {
                font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
                font-size: 12.5px;
                font-weight: 700;
                color: #0A84FF;
                background: rgba(10, 132, 255, 0.12);
                padding: 4px 8px;
                border-radius: 6px;
                letter-spacing: -0.2px;
            }
            .skill-category-pill {
                font-size: 10px;
                font-weight: 700;
                color: #8e8e93;
                background: rgba(142, 142, 147, 0.12);
                padding: 3px 6px;
                border-radius: 4px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .skill-purpose {
                font-size: 13px;
                color: var(--text-color);
                opacity: 0.85;
                line-height: 1.45;
                font-weight: 400;
            }
            .skill-best-for {
                font-size: 12px;
                color: var(--text-color);
                opacity: 0.55;
                margin-top: 2px;
                display: flex;
                align-items: center;
                gap: 4px;
            }
        </style>
        <div class="skills-wrapper">
            <div class="skills-search-bar">
                <input type="text" id="skills-search-input" class="skills-search-input" placeholder="Search AI skills...">
                <div class="skills-search-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
            </div>
            <div class="skills-container" id="skills-list-container">
                <!-- Developer Section -->
                <div class="category-section" data-category="Developer">
                    <div class="category-section-title">💻 Developers & Software Engineers</div>
                    <div class="skills-grid" id="dev-skills-grid"></div>
                </div>

                <!-- Student Section -->
                <div class="category-section" data-category="Student">
                    <div class="category-section-title">📚 Study & Office Productivity</div>
                    <div class="skills-grid" id="student-skills-grid"></div>
                </div>

                <!-- Productivity Section -->
                <div class="category-section" data-category="Productivity">
                    <div class="category-section-title">📈 General Productivity & Workflow</div>
                    <div class="skills-grid" id="productivity-skills-grid"></div>
                </div>
            </div>
        </div>
    `;

    // Render Cards into grids
    const devGrid = document.getElementById("dev-skills-grid");
    const studentGrid = document.getElementById("student-skills-grid");
    const prodGrid = document.getElementById("productivity-skills-grid");

    const getSkillHTML = (skill) => {
        return `
            <div class="skill-card" data-trigger="${skill.trigger}" data-search="${skill.trigger.toLowerCase()} ${skill.purpose.toLowerCase()} ${skill.bestFor.toLowerCase()}">
                <div class="skill-badge-row">
                    <span class="skill-trigger-badge">${skill.trigger}</span>
                    <span class="skill-category-pill">${skill.category}</span>
                </div>
                <div class="skill-purpose">${skill.purpose}</div>
                <div class="skill-best-for">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.8;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span>${skill.bestFor}</span>
                </div>
            </div>
        `;
    };

    skillsData.forEach(skill => {
        const html = getSkillHTML(skill);
        if (skill.category === "Developer") {
            if (devGrid) devGrid.innerHTML += html;
        } else if (skill.category === "Student") {
            if (studentGrid) studentGrid.innerHTML += html;
        } else if (skill.category === "Productivity") {
            if (prodGrid) prodGrid.innerHTML += html;
        }
    });

    // Setup search functionality
    const searchInput = document.getElementById("skills-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase().trim();
            const cards = container.querySelectorAll(".skill-card");
            
            cards.forEach(card => {
                const searchStr = card.getAttribute("data-search");
                if (searchStr && searchStr.includes(term)) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            });

            // Adjust category titles
            const sections = container.querySelectorAll(".category-section");
            sections.forEach(sec => {
                const visibleCards = sec.querySelectorAll(".skill-card:not([style*='display: none'])");
                if (visibleCards.length > 0) {
                    sec.style.display = "";
                } else {
                    sec.style.display = "none";
                }
            });
        });
    }

    // Add click listeners to trigger actions
    const allCards = container.querySelectorAll(".skill-card");
    allCards.forEach(card => {
        card.addEventListener("click", async () => {
            const trigger = card.getAttribute("data-trigger");
            if (!trigger) return;
            
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab) {
                    chrome.tabs.sendMessage(tab.id, { type: "INJECT_PROMPT", text: trigger + " " }).then(() => {
                        if (typeof window.showToast === 'function') {
                            window.showToast(`Injected ${trigger}`);
                        }
                    }).catch(() => {
                        // Fallback: Copy to clipboard if tab is not content-script supported
                        navigator.clipboard.writeText(trigger + " ");
                        if (typeof window.showToast === 'function') {
                            window.showToast(`Copied ${trigger} to clipboard`);
                        }
                    });
                }
            } catch(e) {
                navigator.clipboard.writeText(trigger + " ");
                if (typeof window.showToast === 'function') {
                    window.showToast(`Copied ${trigger} to clipboard`);
                }
            }
        });
    });
}
