document.addEventListener("click", e => {

    if (e.target.classList.contains("copy-btn")) {

        const card = e.target.closest(".card");

        const text = card.querySelector(".card-content").innerText;

        const msg = card.querySelector(".copy-msg");

        navigator.clipboard.writeText(text);

        msg.style.display = "block";

        setTimeout(() => {
            msg.style.display = "none";
        }, 1000);
    }

});
