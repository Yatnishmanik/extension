
const tabs = document.querySelectorAll('.tab');
const pages = document.querySelectorAll('.tab-page');

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {

        tabs.forEach(t => t.classList.remove('active'));
        pages.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        pages[index].classList.add('active');
    });
});

document.querySelectorAll('.use-btn').forEach(btn => {

    btn.addEventListener('click', () => {

        const text = btn.closest('.card')
            .querySelector('.card-content')
            .innerText;

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            const tab = tabs[0];
            const url = tab.url;

            if (
                !url.includes("chatgpt.com") &&
                !url.includes("gemini.google.com") &&
                !url.includes("claude.ai")
            ) {
                alert("Use only on ChatGPT, Gemini, or Claude");
                return;
            }

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (text) => {

                    let editor = null;
                    let type = "";

                    // ChatGPT
                    if (location.hostname.includes("chatgpt.com")) {
                        editor = document.querySelector('#prompt-textarea');
                        type = "contenteditable";
                    }

                    // Gemini
                    else if (location.hostname.includes("gemini.google.com")) {
                        editor = document.querySelector('.ql-editor.textarea');
                        type = "contenteditable";
                    }

                    // Claude (ProseMirror)
                    else if (location.hostname.includes("claude.ai")) {
                        editor = document.querySelector('div.ProseMirror');
                        type = "contenteditable";
                    }

                    if (!editor) return;

                    editor.focus();

                    document.execCommand("selectAll", false, null);
                    document.execCommand("delete", false, null);
                    document.execCommand("insertText", false, text);

                    editor.dispatchEvent(new Event('input', { bubbles: true }));

                },
                args: [text]
            });

        });

    });

});