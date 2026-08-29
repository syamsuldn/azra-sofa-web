const galleryCategories = {

    custom: "Custom Sofa",

    repair: "Repair Sofa",

    detail: "Details"

};

let galleryData = [];

/* ==================================================
   FLOATING ADD GALLERY BUTTON
================================================== */

const floatingAddGallery =
    document.getElementById(
        "floatingAddGallery"
    );


window.addEventListener(
    "scroll",
    function () {

        if (window.scrollY < 250) {

            floatingAddGallery.classList.remove(
                "show"
            );

            return;

        }


        floatingAddGallery.classList.add(
            "show"
        );

    }
);
