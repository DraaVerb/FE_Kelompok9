/* =========================
   PENCATATAN AKTIVITAS
========================= */

function catatAktivitas(jenis, detail) {

    let aktivitas = [];

    try {
        aktivitas =
            JSON.parse(localStorage.getItem("aktivitasGudeg")) || [];
    } catch (error) {
        aktivitas = [];
    }

    if (!Array.isArray(aktivitas)) {
        aktivitas = [];
    }

    aktivitas.push({
        jenis: jenis,
        waktu: new Date().toISOString(),
        detail: detail || {}
    });

    try {
        localStorage.setItem(
            "aktivitasGudeg",
            JSON.stringify(aktivitas)
        );
    } catch (error) {
        // Kegagalan menyimpan log tidak mengganggu fitur utama.
    }

}


/* =========================
   SEARCH DAN FILTER MENU
========================= */

const searchMenu = document.getElementById("searchMenu");
const filterMenu = document.getElementById("filterMenu");

const menuCards = document.querySelectorAll(".menu-card");
const menuTidakAda = document.getElementById("menuTidakAda");


function filterMenuData() {

    const kataKunci = searchMenu.value.toLowerCase();
    const kategori = filterMenu.value;

    let jumlahMenu = 0;


    menuCards.forEach(function(card) {

        const namaMenu =
            card.querySelector("h3").textContent.toLowerCase();

        const kategoriMenu =
            card.getAttribute("data-kategori");


        const cocokNama =
            namaMenu.includes(kataKunci);

        const cocokKategori =
            kategori === "semua" ||
            kategori === kategoriMenu;


        if (cocokNama && cocokKategori) {

            card.style.display = "block";
            jumlahMenu++;

        } else {

            card.style.display = "none";

        }

    });


    if (jumlahMenu === 0) {

        menuTidakAda.style.display = "block";

    } else {

        menuTidakAda.style.display = "none";

    }

}


searchMenu.addEventListener("input", filterMenuData);

filterMenu.addEventListener("change", filterMenuData);


let timerPencarian;
let pencarianTerakhir = "";

searchMenu.addEventListener("input", function() {

    clearTimeout(timerPencarian);

    const kataKunci = searchMenu.value.trim();

    if (kataKunci === "") {
        pencarianTerakhir = "";
        return;
    }

    timerPencarian = setTimeout(function() {

        if (kataKunci !== pencarianTerakhir) {
            catatAktivitas("pencarian_menu", {
                kataKunci: kataKunci
            });

            pencarianTerakhir = kataKunci;
        }

    }, 500);

});


filterMenu.addEventListener("change", function() {

    catatAktivitas("filter_kategori", {
        kategori: filterMenu.value
    });

});


/* =========================
   FAQ
========================= */

const faqQuestions =
    document.querySelectorAll(".faq-question");


faqQuestions.forEach(function(question) {

    question.addEventListener("click", function() {

        const answer =
            question.nextElementSibling;

        if (answer.style.display === "block") {

            answer.style.display = "none";

        } else {

            answer.style.display = "block";

            catatAktivitas("buka_faq", {
                pertanyaan: question.textContent.trim()
            });

        }

    });

});


/* =========================
   RATING BINTANG
========================= */

const stars =
    document.querySelectorAll(".star");

const ratingText =
    document.getElementById("ratingText");

let ratingDipilih = 0;


stars.forEach(function(star) {

    star.addEventListener("click", function() {

        ratingDipilih =
            Number(star.getAttribute("data-rating"));


        stars.forEach(function(item) {

            const nilai =
                Number(item.getAttribute("data-rating"));


            if (nilai <= ratingDipilih) {

                item.classList.add("aktif");

            } else {

                item.classList.remove("aktif");

            }

        });


        ratingText.textContent =
            ratingDipilih + " dari 5 bintang";

        catatAktivitas("beri_rating", {
            rating: ratingDipilih
        });

    });

});


/* =========================
   ULASAN
========================= */

const namaInput =
    document.getElementById("nama");

const ulasanText =
    document.getElementById("ulasanText");

const tambahUlasan =
    document.getElementById("tambahUlasan");

const daftarUlasan =
    document.getElementById("daftarUlasan");


let dataUlasan =
    JSON.parse(
        localStorage.getItem("ulasanGudeg")
    ) || [];


/* =========================
   MENAMPILKAN ULASAN
========================= */

function tampilkanUlasan() {

    daftarUlasan.innerHTML = "";


    if (dataUlasan.length === 0) {

        daftarUlasan.innerHTML = `
            <p style="text-align:center;">
                Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
            </p>
        `;

        return;
    }


    dataUlasan.forEach(function(ulasan, index) {

        let bintang = "";


        for (let i = 1; i <= 5; i++) {

            if (i <= ulasan.rating) {

                bintang += "★";

            } else {

                bintang += "☆";

            }

        }


        const card =
            document.createElement("div");

        card.classList.add("ulasan-card");


        card.innerHTML = `

            <h4>${ulasan.nama}</h4>

            <div class="ulasan-rating">
                ${bintang}
            </div>

            <p>
                ${ulasan.teks}
            </p>

            <button
                class="hapus-ulasan"
                onclick="hapusUlasan(${index})"
            >
                Hapus
            </button>

        `;


        daftarUlasan.appendChild(card);

    });

}


/* =========================
   TAMBAH ULASAN
========================= */

tambahUlasan.addEventListener(
    "click",
    function() {

        const nama =
            namaInput.value.trim();

        const teks =
            ulasanText.value.trim();


        if (nama === "") {

            alert("Silakan isi nama terlebih dahulu.");

            return;

        }


        if (ratingDipilih === 0) {

            alert("Silakan pilih rating bintang.");

            return;

        }


        if (teks === "") {

            alert("Silakan tulis ulasan terlebih dahulu.");

            return;

        }


        const ulasanBaru = {

            nama: nama,

            rating: ratingDipilih,

            teks: teks

        };


        dataUlasan.push(ulasanBaru);


        localStorage.setItem(
            "ulasanGudeg",
            JSON.stringify(dataUlasan)
        );

        catatAktivitas("tambah_ulasan", {
            rating: ratingDipilih
        });


        namaInput.value = "";

        ulasanText.value = "";

        ratingDipilih = 0;


        stars.forEach(function(star) {

            star.classList.remove("aktif");

        });


        ratingText.textContent =
            "Belum memilih rating";


        tampilkanUlasan();


        alert("Ulasan berhasil ditambahkan!");

    }
);


/* =========================
   HAPUS ULASAN
========================= */

function hapusUlasan(index) {

    const yakin =
        confirm("Apakah kamu yakin ingin menghapus ulasan ini?");


    if (!yakin) {
        return;
    }


    const ratingUlasanDihapus = dataUlasan[index].rating;

    dataUlasan.splice(index, 1);


    localStorage.setItem(
        "ulasanGudeg",
        JSON.stringify(dataUlasan)
    );

    catatAktivitas("hapus_ulasan", {
        rating: ratingUlasanDihapus
    });


    tampilkanUlasan();

}


/* =========================
   JALANKAN SAAT HALAMAN DIBUKA
========================= */

tampilkanUlasan();
