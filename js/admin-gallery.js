/* ==================================================
   FLOATING ADD GALLERY BUTTON
================================================== */

const floatingAddGalleryButton =
    document.getElementById(
        "floatingAddGalleryButton"
    );

let currentAddGalleryCard = null;


/* ==================================================
   UPDATE FLOATING BUTTON
================================================== */

function updateFloatingAddGalleryButton() {

    if (!floatingAddGalleryButton) return;


    /* ==================================================
       CEK FORM
    ================================================== */

    if (
        galleryFormContainer &&
        galleryFormContainer.classList.contains("active")
    ) {

        floatingAddGalleryButton.classList.remove(
            "visible"
        );

        return;

    }


    /* ==================================================
       CEK ADD GALLERY CARD
    ================================================== */

    if (currentAddGalleryCard) {

        const rect =
            currentAddGalleryCard.getBoundingClientRect();


        const cardVisible =
            rect.top < window.innerHeight &&
            rect.bottom > 0;


        /* Jika card masih terlihat */

        if (cardVisible) {

            floatingAddGalleryButton.classList.remove(
                "visible"
            );

            return;

        }

    }


    /* ==================================================
       CEK POSISI SCROLL
    ================================================== */

    if (window.scrollY <= 250) {

        floatingAddGalleryButton.classList.remove(
            "visible"
        );

        return;

    }


    /* ==================================================
       TAMPILKAN FLOATING BUTTON
    ================================================== */

    floatingAddGalleryButton.classList.add(
        "visible"
    );

}


/* ==================================================
   SET ADD GALLERY CARD
================================================== */

function setupFloatingAddGallery(card) {

    currentAddGalleryCard = card;

    updateFloatingAddGalleryButton();

}


/* ==================================================
   FLOATING BUTTON CLICK
================================================== */

if (floatingAddGalleryButton) {

    floatingAddGalleryButton.addEventListener(
        "click",
        function () {

            /* ===============================
               RESET FORM
            =============================== */

            resetGalleryForm();


            /* ===============================
               BUKA FORM
            =============================== */

            galleryFormContainer.classList.add(
                "active"
            );


            /* ===============================
               SEMBUNYIKAN BUTTON
            =============================== */

            floatingAddGalleryButton.classList.remove(
                "visible"
            );


            /* ===============================
               SCROLL KE ATAS
            =============================== */

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* ==================================================
   SCROLL
================================================== */

window.addEventListener(
    "scroll",
    updateFloatingAddGalleryButton,
    {
        passive: true
    }
);


/* ==================================================
   RESIZE
================================================== */

window.addEventListener(
    "resize",
    updateFloatingAddGalleryButton
);


/* ==================================================
   INITIAL STATE
================================================== */

updateFloatingAddGalleryButton();