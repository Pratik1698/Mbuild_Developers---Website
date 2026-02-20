/* ================= IMAGE MODAL SCRIPT ================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll('.gallery-card');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalSize = document.getElementById('modalSize');
    const modalCost = document.getElementById('modalCost');
    const modalLocation = document.getElementById('modalLocation');
    const closeBtn = document.getElementById('closeModal');

    if (!modal) return;

    cards.forEach(card => {
        card.addEventListener('click', () => {

            const img = card.querySelector('img');

            modalImg.src = img.src;
            modalTitle.textContent = card.dataset.title || '';
            modalSize.textContent = card.dataset.size || '';
            modalCost.textContent = card.dataset.cost || '';
            modalLocation.textContent = card.dataset.location || '';

            modal.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // ✅ ESC KEY CLOSE FEATURE
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

});
