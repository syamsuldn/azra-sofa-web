const slider = document.querySelector('.before-after-slider');
const afterContainer = document.querySelector('.after-image-container');
const sliderLine = document.querySelector('.slider-line');
const afterImage = document.querySelector('.after-image');
const beforeLabel = document.querySelector('.before-label');
const afterLabel = document.querySelector('.after-label');

function updateLabels(percentage) {

    const beforeScale = Math.min(1, percentage / 20);
    const afterScale = Math.min(1, (100 - percentage) / 20);

    beforeLabel.style.opacity = beforeScale;
    beforeLabel.style.transform = `scale(${beforeScale})`;

    afterLabel.style.opacity = afterScale;
    afterLabel.style.transform = `scale(${afterScale})`;
}

updateAfterImageWidth();
window.addEventListener('resize', updateAfterImageWidth);

slider.addEventListener('dragstart', function (event) {
    event.preventDefault();
});

let isDragging = false;

function moveSlider(clientX) {

    const rect = slider.getBoundingClientRect();

    let position = clientX - rect.left;

    position = Math.max(0, Math.min(position, rect.width));

    const percentage = (position / rect.width) * 100;

    updateLabels(percentage);

    afterContainer.style.width = percentage + '%';
    sliderLine.style.left = percentage + '%';

    beforeLabel.style.opacity = Math.min(1, percentage / 20);
    afterLabel.style.opacity = Math.min(1, (100 - percentage) / 20);

    beforeLabel.style.transform =
        `scale(${Math.min(1, percentage / 20)})`;

    afterLabel.style.transform =
        `scale(${Math.min(1, (100 - percentage) / 20)})`;
}

function updateAfterImageWidth() {
    const sliderWidth = slider.offsetWidth;

    afterImage.style.width = sliderWidth + 'px';
}

slider.addEventListener('pointerdown', function (event) {

    isDragging = true;

    slider.setPointerCapture(event.pointerId);

    moveSlider(event.clientX);
});

slider.addEventListener('pointermove', function (event) {

    if (!isDragging) return;

    moveSlider(event.clientX);
});

slider.addEventListener('pointerup', function () {

    isDragging = false;
});

slider.addEventListener('pointercancel', function () {

    isDragging = false;
});

/* Portfolio Lightbox Start */

const portfolioItems = document.querySelectorAll('.portfolio-item img');

const lightbox = document.querySelector('.portfolio-lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentPortfolio = 0;

function showPortfolio(index) {

    if (index < 0) {
        index = portfolioItems.length - 1;
    }

    if (index >= portfolioItems.length) {
        index = 0;
    }

    currentPortfolio = index;

    lightboxImage.src = portfolioItems[index].src;
    lightboxImage.alt = portfolioItems[index].alt;
}

function openLightbox(index) {

    showPortfolio(index);

    lightbox.classList.add('active');

    document.body.style.overflow = 'hidden';
}

function closeLightbox() {

    lightbox.classList.remove('active');

    document.body.style.overflow = '';
}

portfolioItems.forEach(function (image, index) {

    image.addEventListener('click', function () {

        openLightbox(index);

    });

});

lightboxClose.addEventListener('click', closeLightbox);

lightboxPrev.addEventListener('click', function () {

    showPortfolio(currentPortfolio - 1);

});

lightboxNext.addEventListener('click', function () {

    showPortfolio(currentPortfolio + 1);

});

/* Klik area gelap untuk menutup */

lightbox.addEventListener('click', function (event) {

    if (event.target === lightbox) {

        closeLightbox();

    }

});

/* Keyboard */

document.addEventListener('keydown', function (event) {

    if (!lightbox.classList.contains('active')) return;

    if (event.key === 'Escape') {
        closeLightbox();
    }

    if (event.key === 'ArrowLeft') {
        showPortfolio(currentPortfolio - 1);
    }

    if (event.key === 'ArrowRight') {
        showPortfolio(currentPortfolio + 1);
    }

});

/* Portfolio Lightbox End */

