/* ==================================================
   GALLERY FILTER
================================================== */

const filterButtons =
    document.querySelectorAll(".gallery-filter-btn");

const galleryItems =
    document.querySelectorAll(".gallery-items");


console.log("Gallery JS loaded");
console.log("Jumlah Tombol:", filterButtons.length);
console.log("Jumlah Foto:", galleryItems.length);

/* ============== ANIMATE GALLERY ================*/
function animateGallery(callback) {

    const firstPositions = new Map();

    /* ================= FIRST ================= */

    galleryItems.forEach(item => {

        if (item.style.display !== "none") {

            firstPositions.set(
                item,
                item.getBoundingClientRect()
            );

        }

    });


    /* ================= FILTER ================= */

    callback();


    /* ================= LAST ================= */

    requestAnimationFrame(() => {

        galleryItems.forEach(item => {

            if (
                item.style.display === "none" ||
                !firstPositions.has(item)
            ) {
                return;
            }


            const first =
                firstPositions.get(item);

            const last =
                item.getBoundingClientRect();


            const deltaX =
                first.left - last.left;

            const deltaY =
                first.top - last.top;


            if (
                deltaX === 0 &&
                deltaY === 0
            ) {
                return;
            }


            /* ================= PLAY ================= */

            item.animate(
                [
                    {
                        transform:
                            `translate(${deltaX}px, ${deltaY}px)`
                    },

                    {
                        transform:
                            "translate(0, 0)"
                    }
                ],
                {
                    duration: 500,
                    easing: "ease-in-out"
                }
            );

        });

    });

}

/* ================= FILTER BUTTON ================= */

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        /* ================= ACTIVE BUTTON ================= */

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");


        /* ================= FILTER ================= */

        const selectedFilter =
            this.dataset.filter;


        animateGallery(() => {
            galleryItems.forEach(item => {

                const itemCategory =
                    item.dataset.category;


                const shouldShow =
                    selectedFilter === "all" ||
                    selectedFilter === itemCategory;


                if (shouldShow) {

                    item.style.display = "";

                    // Pastikan item berada dalam kondisi awal animasi
                    item.classList.add("hidden");

                    requestAnimationFrame(() => {

                        requestAnimationFrame(() => {

                            item.classList.remove("hidden");

                        });

                    });

                } else {

                    item.classList.add("hidden");

                    item.style.display = "none";

                }
            });

        });
        updateVisibleItems();
    });

});


/* ==================================================
   GALLERY LIGHTBOX
================================================== */

const galleryLightbox =
    document.querySelector(".gallery-lightbox");

const lightboxImage =
    document.querySelector(".lightbox-image");

const lightboxCaption =
    document.querySelector(".lightbox-caption");

const lightboxClose =
    document.querySelector(".lightbox-close");

const lightboxPrev =
    document.querySelector(".lightbox-prev");

const lightboxNext =
    document.querySelector(".lightbox-next");

lightboxImage.addEventListener("dragstart", function (event) {
    event.preventDefault();
});

let currentIndex = 0;
let visibleItems = [];

let touchStartX = 0;
let touchEndX = 0;

let isSwiping = false;
let swipeDirection = null;

let previewImage = null;


/* ================= SWIPE SETTINGS ================= */

const SWIPE_THRESHOLD = 100;


/* ==================================================
   CREATE PREVIEW IMAGE
================================================== */

function createPreviewImage(src, alt) {

    const image =
        document.createElement("img");

    image.classList.add(
        "lightbox-image",
        "swipe-image"
    );

    image.src = src;
    image.alt = alt;

    image.draggable = false;

    /* ================= CENTER POSITION ================= */
    image.style.top = "50%";
    image.style.left = "50%";

    image.style.opacity = "0";

    image.style.transform =
        "translate3d(-50%, -50%, 0) scale(0.15)";

    image.style.transition = "none";

    return image;

}


/* ==================================================
   PREPARE PREVIEW
================================================== */

function preparePreview(index) {

    const item =
        visibleItems[index];

    if (!item) return;

    const image =
        item.querySelector("img");

    if (!image) return;


    /* Hapus preview lama */

    if (previewImage) {

        previewImage.remove();

        previewImage = null;

    }


    /* Buat preview baru */

    previewImage =
        createPreviewImage(
            image.src,
            image.alt
        );


    galleryLightbox.appendChild(
        previewImage
    );

}


/* ==================================================
   REMOVE PREVIEW
================================================== */

function removePreview() {

    if (!previewImage) return;

    previewImage.remove();

    previewImage = null;

}

/* ==================================================
   PRELOAD IMAGE
================================================== */

function preloadImage(src) {

    return new Promise((resolve) => {

        const img = new Image();

        img.onload = () => resolve(img);

        img.src = src;

    });

}


/* ==================================================
   TOUCH START
================================================== */

galleryLightbox.addEventListener(
    "touchstart",
    function (event) {

        if (
            !galleryLightbox.classList.contains(
                "active"
            )
        ) {
            return;
        }


        touchStartX =
            event.touches[0].clientX;

        touchEndX =
            touchStartX;


        isSwiping = true;

        swipeDirection = null;


        /* Pastikan gambar utama normal */

        lightboxImage.style.transition =
            "none";

        lightboxImage.style.left =
            "0px";


        /* Preview belum ada */

        removePreview();

    },
    { passive: true }
);


/* ==================================================
   TOUCH MOVE
================================================== */

galleryLightbox.addEventListener(
    "touchmove",
    function (event) {

        if (!isSwiping) return;


        const currentX =
            event.touches[0].clientX;


        const distance =
            currentX - touchStartX;


        touchEndX =
            currentX;


        /* ================= MAIN IMAGE ================= */

        lightboxImage.style.transition =
            "none";

        lightboxImage.style.left =
            `${distance}px`;


        /* ================= RESET ================= */

        if (distance === 0) {

            removePreview();

            swipeDirection = null;

            return;

        }


        /* ==================================================
           SWIPE LEFT → NEXT
        ================================================== */

        if (distance < 0) {

            swipeDirection =
                "next";


            const nextIndex =
                currentIndex + 1 >=
                    visibleItems.length
                    ? 0
                    : currentIndex + 1;


            preparePreview(nextIndex);

        }


        /* ==================================================
           SWIPE RIGHT → PREV
        ================================================== */

        if (distance > 0) {

            swipeDirection =
                "prev";


            const prevIndex =
                currentIndex - 1 < 0
                    ? visibleItems.length - 1
                    : currentIndex - 1;


            preparePreview(prevIndex);

        }


        /* ==================================================
           PREVIEW PROGRESS
        ================================================== */

        if (previewImage) {

            const progress =
                Math.min(
                    Math.abs(distance) /
                    SWIPE_THRESHOLD,
                    1
                );

            /* ================= MAIN IMAGE OPACITY ================= */

            const mainOpacity =
                1 - (0.4 * progress);

            lightboxImage.style.opacity =
                mainOpacity;


            /* ================= PREVIEW ================= */
            /*
             * Preview mulai sangat kecil,
             * lalu membesar menuju ukuran normal.
             */

            const scale =
                0.10 +
                (0.95 * progress);


            const opacity =
                progress;


            previewImage.style.transition =
                "none";

            previewImage.style.transform =
                `translate3d(-50%, -50%, 0) scale(${scale})`;

            previewImage.style.opacity =
                opacity;

        }

    },
    { passive: true }
);


/* ==================================================
   TOUCH END
================================================== */

galleryLightbox.addEventListener(
    "touchend",
    function (event) {

        if (!isSwiping) return;


        touchEndX =
            event.changedTouches[0].clientX;


        const distance =
            touchEndX - touchStartX;


        const absDistance =
            Math.abs(distance);


        /* ==================================================
           SWIPE TERLALU PENDEK → CANCEL
        ================================================== */

        if (
            absDistance <
            SWIPE_THRESHOLD
        ) {

            isSwiping = false;

            swipeDirection = null;


            /* Gambar utama kembali ke tengah */

            lightboxImage.style.transition =
                "left 0.25s ease";

            lightboxImage.style.left =
                "0px";


            /* Preview menghilang */

            if (previewImage) {

                previewImage.style.transition =
                    "opacity 0.2s ease, transform 0.2s ease";

                previewImage.style.opacity =
                    "0";

                previewImage.style.transform =
                    "translate3d(-50%, -50%, 0) scale(0.15)";

                setTimeout(() => {

                    removePreview();

                }, 200);

            }


            return;

        }


        /* ==================================================
           SWIPE BERHASIL → COMMIT
        ================================================== */

        const direction =
            distance < 0
                ? "next"
                : "prev";


        let newIndex;


        if (direction === "next") {

            newIndex =
                currentIndex + 1 >=
                    visibleItems.length
                    ? 0
                    : currentIndex + 1;

        } else {

            newIndex =
                currentIndex - 1 < 0
                    ? visibleItems.length - 1
                    : currentIndex - 1;

        }


        const newItem =
            visibleItems[newIndex];


        if (!newItem) {

            isSwiping = false;

            return;

        }


        const newImage =
            newItem.querySelector("img");


        if (!newImage) {

            isSwiping = false;

            return;

        }


        /* ==================================================
           FINISH ANIMATION
        ================================================== */

        lightboxImage.style.transition =
            "left 0.3s ease, opacity 0.3s ease";

        lightboxImage.style.left =
            direction === "next"
                ? "-100vw"
                : "100vw";

        lightboxImage.style.opacity =
            "0";


        if (previewImage) {

            previewImage.style.transition =
                "transform 0.3s ease, opacity 0.3s ease";

            previewImage.style.transform =
                "translate3d(-50%, -50%, 0) scale(1)";

            previewImage.style.opacity =
                "1";

        }


        /* ==================================================
           REPLACE MAIN IMAGE
        ================================================== */

        setTimeout(async () => {

    /* Pastikan gambar baru sudah siap */

    await preloadImage(newImage.src);


    currentIndex =
        newIndex;


    /* ================= GANTI GAMBAR ================= */

    lightboxImage.style.transition =
        "none";

    lightboxImage.style.left =
        "0px";

    lightboxImage.style.opacity =
        "1";

    lightboxImage.src =
        newImage.src;

    lightboxImage.alt =
        newImage.alt;


    lightboxCaption.textContent =
        newImage.dataset.caption || "";


    /* ================= HAPUS PREVIEW ================= */

    if (previewImage) {

        previewImage.remove();

        previewImage = null;

    }


    isSwiping = false;

    swipeDirection = null;


}, 300);

    }
);

// VISIBILITY
function updateVisibleItems() {

    visibleItems = Array.from(galleryItems)
        .filter(item => item.style.display !== "none");

}
updateVisibleItems();

/* ==================================================
   KEYBOARD ANIMATION STATE
================================================== */

let isKeyboardAnimating = false;


/* ==================================================
   SHOW LIGHTBOX IMAGE
   khusus keyboard / buka lightbox
================================================== */

async function showLightboxImage(index) {

    const item =
        visibleItems[index];

    if (!item) return;


    const image =
        item.querySelector("img");

    if (!image) return;


    /* ==================================================
       CEGAH ANIMASI KEYBOARD BERTUMPUK
    ================================================== */

    if (isKeyboardAnimating) {
        return;
    }


    isKeyboardAnimating = true;


    /* ==================================================
       RESET STYLE DARI MOUSE / SWIPE
    ================================================== */

    lightboxImage.style.transition = "";
    lightboxImage.style.left = "";
    lightboxImage.style.opacity = "";


    /* ==================================================
       FADE OUT + ZOOM OUT
    ================================================== */

    lightboxImage.classList.add(
        "changing"
    );


    /* ==================================================
       TUNGGU ANIMASI KELUAR
    ================================================== */

    setTimeout(async () => {

        /* Pastikan gambar baru sudah siap */

        await preloadImage(
            image.src
        );


        /* ==================================================
           GANTI INDEX
        ================================================== */

        currentIndex =
            index;


        /* ==================================================
           GANTI GAMBAR
        ================================================== */

        lightboxImage.src =
            image.src;

        lightboxImage.alt =
            image.alt;


        /* ==================================================
           CAPTION
        ================================================== */

        animateCaption(
            image.dataset.caption || ""
        );


        /* ==================================================
           FADE IN + ZOOM IN
        ================================================== */

        requestAnimationFrame(() => {

            lightboxImage.classList.remove(
                "changing"
            );

        });


        /* ==================================================
           SELESAI
        ================================================== */

        setTimeout(() => {

            isKeyboardAnimating =
                false;

        }, 350);


    }, 250);

}

/* ==================================================
   CAPTION ANIMATION
================================================== */

function animateCaption(newCaption) {

    /* ================= KELUARKAN CAPTION LAMA ================= */

    lightboxCaption.classList.add(
        "caption-changing"
    );


    /* ================= MASUKKAN CAPTION BARU ================= */

    setTimeout(() => {

        lightboxCaption.textContent =
            newCaption || "";


        /* ================= RESET ANIMATION ================= */

        requestAnimationFrame(() => {

            lightboxCaption.classList.remove(
                "caption-changing"
            );

        });

    }, 250);

}

/* ==================================================
   BUTTON NAVIGATION ANIMATION
================================================== */

function animateButtonNavigation(newIndex, direction) {

    const newItem =
        visibleItems[newIndex];

    if (!newItem) return;


    const newImage =
        newItem.querySelector("img");

    if (!newImage) return;


    /* ================= BUAT PREVIEW ================= */

    removePreview();


    previewImage =
        createPreviewImage(
            newImage.src,
            newImage.alt
        );


    galleryLightbox.appendChild(
        previewImage
    );


    /* ================= KONDISI AWAL ================= */

    lightboxImage.style.transition =
        "none";

    lightboxImage.style.left =
        "0px";

    lightboxImage.style.opacity =
        "1";


    /* ================= MULAI ANIMASI ================= */

    requestAnimationFrame(() => {

        /* Main image bergerak sedikit
           mengikuti arah swipe */

        lightboxImage.style.transition =
            "left 0.35s ease, opacity 0.35s ease";

        lightboxImage.style.left =
            direction === "next"
                ? "-100px"
                : "100px";

        lightboxImage.style.opacity =
            "0";


        /* Preview membesar dari tengah */

        previewImage.style.transition =
            "transform 0.35s ease, opacity 0.35s ease";

        previewImage.style.transform =
            "translate3d(-50%, -50%, 0) scale(1)";

        previewImage.style.opacity =
            "1";

    });


    /* ================= SELESAI ================= */

setTimeout(async () => {

    /* Pastikan gambar sudah siap */

    await preloadImage(newImage.src);


    currentIndex =
        newIndex;


    /* ================= GANTI GAMBAR ================= */

    lightboxImage.style.transition =
        "none";

    lightboxImage.style.opacity =
        "1";

    lightboxImage.style.left =
        "0px";


    lightboxImage.src =
        newImage.src;

    lightboxImage.alt =
        newImage.alt;


    lightboxCaption.textContent =
        newImage.dataset.caption || "";


    /* ================= HAPUS PREVIEW ================= */

    if (previewImage) {

        previewImage.remove();

        previewImage = null;

    }


}, 350);

}

// TOMBOL NEXT
lightboxNext.addEventListener("click", function (event) {

    event.stopPropagation();


    let newIndex =
        currentIndex + 1;

    if (
        newIndex >=
        visibleItems.length
    ) {
        newIndex = 0;
    }


    animateButtonNavigation(
        newIndex,
        "next"
    );

});

// TOMBOL PREVIOUS
lightboxPrev.addEventListener("click", function (event) {

    event.stopPropagation();


    let newIndex =
        currentIndex - 1;

    if (newIndex < 0) {
        newIndex =
            visibleItems.length - 1;
    }


    animateButtonNavigation(
        newIndex,
        "prev"
    );

});

/* ================= OPEN LIGHTBOX ================= */

galleryItems.forEach(item => {

    item.addEventListener("click", function () {

        updateVisibleItems();

        const image = item.querySelector("img");

        if (!image) return;

        currentIndex = visibleItems.indexOf(item);

        showLightboxImage(currentIndex);

        galleryLightbox.classList.add("active");

    });

});


/* ================= CLOSE BUTTON ================= */

lightboxClose.addEventListener("click", function () {

    galleryLightbox.classList.remove("active");

});


/* ================= CLICK OUTSIDE ================= */

galleryLightbox.addEventListener("click", function (event) {

    if (event.target === galleryLightbox) {

        galleryLightbox.classList.remove("active");

    }

});

// Keyboard listener
document.addEventListener("keydown", function (event) {

    // Keyboard hanya aktif ketika Lightbox terbuka
    if (!galleryLightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "ArrowLeft") {

        currentIndex--;

        if (currentIndex < 0) {
            currentIndex = visibleItems.length - 1;
        }

        showLightboxImage(currentIndex);

    }

    if (event.key === "ArrowRight") {

        currentIndex++;

        if (currentIndex >= visibleItems.length) {
            currentIndex = 0;
        }

        showLightboxImage(currentIndex);


    }

    if (event.key === "Escape") {

        galleryLightbox.classList.remove("active");

    }

});