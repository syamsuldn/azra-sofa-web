/* ==================================================
   REPAIR PHOTO UPLOAD
================================================== */

const sofaImageInput = document.getElementById("sofaImage");
const uploadPreview = document.getElementById("uploadPreview");

let selectedFiles = [];

if (sofaImageInput && uploadPreview) {

    sofaImageInput.addEventListener("change", function () {

        const files = Array.from(this.files);

        files.forEach(file => {

            // Hanya izinkan gambar
            if (!file.type.startsWith("image/")) {
                return;
            }

            // Maksimal 5 MB per foto
            if (file.size > 5 * 1024 * 1024) {
                alert(`Foto "${file.name}" terlalu besar. Maksimal 5 MB.`);
                return;
            }

            // Jangan masukkan file yang sama dua kali
            const alreadySelected = selectedFiles.some(
                existingFile =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size
            );

            if (!alreadySelected) {
                selectedFiles.push(file);
            }

        });

        renderPreview();

        // Reset input agar foto yang sama bisa dipilih kembali
        this.value = "";

    });


    function renderPreview() {

        uploadPreview.innerHTML = "";

        selectedFiles.forEach((file, index) => {

            const reader = new FileReader();

            reader.onload = function (event) {

                const previewItem = document.createElement("div");

                previewItem.className = "preview-item";

                previewItem.innerHTML = `
                    <img src="${event.target.result}" alt="Preview foto sofa">

                    <button
                        type="button"
                        class="preview-remove"
                        data-index="${index}"
                        aria-label="Hapus foto">
                        ×
                    </button>
                `;

                uploadPreview.appendChild(previewItem);

            };

            reader.readAsDataURL(file);

        });

    }


    // Hapus foto dari preview

    uploadPreview.addEventListener("click", function (event) {

        const removeButton =
            event.target.closest(".preview-remove");

        if (!removeButton) {
            return;
        }

        const index =
            Number(removeButton.dataset.index);

        selectedFiles.splice(index, 1);

        renderPreview();

    });

}

/* ==================================================
   BEFORE & AFTER SLIDER
================================================== */

document.querySelectorAll('.before-after-slider').forEach(slider => {

    const beforeContainer =
        slider.querySelector('.before-image-container');

    const beforeImage =
        slider.querySelector('.before-image');

    const line =
        slider.querySelector('.slider-line');

    const button =
        slider.querySelector('.slider-button');

    const beforeLabel =
        slider.querySelector('.before-label');

    const afterLabel =
        slider.querySelector('.after-label');

    /* Pastikan semua elemen slider tersedia */
    if (
        !beforeContainer ||
        !beforeImage ||
        !line ||
        !button
    ) {
        return;
    }


    let isDragging = false;


    /* ================= RESIZE IMAGE ================= */

    function resizeBeforeImage() {

        const sliderWidth =
            slider.getBoundingClientRect().width;

        beforeImage.style.width =
            sliderWidth + 'px';
    }


    /* ================= UPDATE SLIDER ================= */

    function updateSlider(clientX) {

        const rect =
            slider.getBoundingClientRect();

        let position =
            ((clientX - rect.left) / rect.width) * 100;


        /* Batasi 0% - 100% */

        position = Math.max(
            0,
            Math.min(100, position)
        );


        /* Area gambar BEFORE */

        beforeContainer.style.width =
            position + '%';


        /* Garis slider */

        line.style.left =
            position + '%';


        /* Tombol slider */

        button.style.left =
            position + '%';

        /* ===============================
LABEL FADE
================================ */

        if (beforeLabel) {

            if (position <= 15) {
                beforeLabel.classList.add('label-hidden');
            } else {
                beforeLabel.classList.remove('label-hidden');
            }

        }

        if (afterLabel) {

            if (position >= 85) {
                afterLabel.classList.add('label-hidden');
            } else {
                afterLabel.classList.remove('label-hidden');
            }

        }
    }


    /* ================= INITIALIZE ================= */

    resizeBeforeImage();


    /* ================= MOUSE ================= */

    slider.addEventListener(
        'mousedown',
        function (event) {

            isDragging = true;

            updateSlider(
                event.clientX
            );

        }
    );


    document.addEventListener(
        'mousemove',
        function (event) {

            if (!isDragging) return;

            updateSlider(
                event.clientX
            );

        }
    );


    document.addEventListener(
        'mouseup',
        function () {

            isDragging = false;

        }
    );


    /* ================= TOUCH ================= */

    slider.addEventListener(
        'touchstart',
        function (event) {

            isDragging = true;

            updateSlider(
                event.touches[0].clientX
            );

        },
        { passive: true }
    );


    slider.addEventListener(
        'touchmove',
        function (event) {

            if (!isDragging) return;

            updateSlider(
                event.touches[0].clientX
            );

        },
        { passive: true }
    );


    slider.addEventListener(
        'touchend',
        function () {

            isDragging = false;

        }
    );


    /* ================= RESIZE ================= */

    window.addEventListener(
        'resize',
        resizeBeforeImage
    );

});

/* ==================================================
   REPAIR WHATSAPP CONSULTATION
================================================== */

const repairSubmit = document.getElementById("repairSubmit");
const repairMessage = document.getElementById("repairMessage");
const repairValidation = document.getElementById("repairValidation");

if (
    repairSubmit &&
    repairMessage &&
    repairValidation
) {
    function showRepairValidation(message) {

        repairValidation.textContent = message;

        repairValidation.classList.add("show");

    }


    function clearRepairValidation() {

        repairValidation.textContent = "";

        repairValidation.classList.remove("show");

    }


    repairSubmit.addEventListener("click", function () {

        clearRepairValidation();


        // ==============================
        // CEK FOTO
        // ==============================

        if (selectedFiles.length === 0) {

            showRepairValidation(
                "Silakan pilih minimal satu foto sofa terlebih dahulu."
            );

            return;
        }


        // ==============================
        // CEK DESKRIPSI
        // ==============================

        const message =
            repairMessage.value.trim();


        if (message === "") {

            showRepairValidation(
                "Ceritakan terlebih dahulu kondisi atau kerusakan sofa Anda."
            );

            repairMessage.focus();

            return;
        }


        // ==============================
        // NOMOR WHATSAPP
        // ==============================

        const phoneNumber =
            "6285255067897";


        // ==============================
        // PESAN WHATSAPP
        // ==============================

        const whatsappMessage =
            `Halo Azra Sofa, saya ingin berkonsultasi mengenai sofa saya.

Kondisi sofa:
${message}

Saya sudah menyiapkan ${selectedFiles.length} foto sofa sebagai referensi.

Mohon bantuannya untuk melihat kondisi sofa saya.

Terima kasih.`;


        // ==============================
        // BUKA WHATSAPP
        // ==============================

        const whatsappURL =
            `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;


        window.open(
            whatsappURL,
            "_blank"
        );

    });


    // Hapus pesan error ketika
    // pelanggan mulai mengetik

    repairMessage.addEventListener(
        "input",
        function () {

            clearRepairValidation();

        }
    );

}

/* ================= BACK TO TOP ================= */

document.addEventListener("DOMContentLoaded", function () {

    const backToTop =
        document.getElementById("backToTop");

    if (!backToTop) {
        return;
    }


    /* ================= SCROLL ================= */

    window.addEventListener("scroll", function () {

        /* ==========================
           TAMPILKAN TOMBOL
        ========================== */

        if (window.scrollY > 300) {

            backToTop.classList.add("show");

        } else {

            backToTop.classList.remove("show");

        }


        /* ==========================
   CTA / FOOTER DETECTION
========================== */

const cta =
    document.querySelector(".cta, .custom-cta");

const footer =
    document.querySelector(".footer");

const target =
    cta || footer;

if (!target) {
    return;
}

const targetRect =
    target.getBoundingClientRect();

if (targetRect.top < window.innerHeight) {

    backToTop.classList.add("cta-mode");

} else {

    backToTop.classList.remove("cta-mode");

}

    });


    /* ==========================
       KEMBALI KE ATAS
    ========================== */

    backToTop.addEventListener(
        "click",
        function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

});

/* ================= NAVBAR ACTIVE ================= */

document.addEventListener("DOMContentLoaded", function () {

    const navLinks =
        document.querySelectorAll(".nav-menu a");

    if (!navLinks.length) {
        return;
    }

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";


    navLinks.forEach(function (link) {

        const linkPage =
            link.getAttribute("href").split("/").pop();


        if (linkPage === currentPage) {

            link.classList.add("active");

        } else {

            link.classList.remove("active");

        }

    });

});