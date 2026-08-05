/*==================================================
DATABASE INVENTARIS
==================================================*/

let inventaris = [];

let dataAktif = [];

/*==================================================
LOAD INVENTARIS
==================================================*/

async function loadInventaris(){

const tbody=document.getElementById("inventarisTable");

if(!tbody) return;

tbody.innerHTML=`

<tr>

<td colspan="6" class="text-center">

Memuat data...

</td>

</tr>

`;

try{

    inventaris = await getInventaris();

    dataAktif = [...inventaris];

    isiKategori();

    renderInventaris();

    updateStatistik();

}catch(error){

    tbody.innerHTML = `
    <tr>
        <td colspan="6" class="text-danger text-center">
            Gagal mengambil data.
        </td>
    </tr>
    `;

    console.error(error);

}

}

/*==================================================
ISI FILTER KATEGORI
MENGIKUTI FOLDER LEVEL 1 GOOGLE DRIVE
==================================================*/

function isiKategori(){

    const select =
        document.getElementById("filterKategori");

    if(!select) return;


    select.innerHTML =
        '<option value="">Semua Kategori</option>';


    const daftarKategori = [
        "Produk Hukum",
        "Pedoman RR",
        "Perencanaan",
        "Administrasi",
        "Template"
    ];

    daftarKategori.forEach(item => {

        const option =
            document.createElement("option");

        option.value = item;

        option.textContent = item;

        select.appendChild(option);

    });

}

/*==================================================
FILTER BERDASARKAN STRUKTUR FOLDER
==================================================*/

function normalisasiPath(path){

    return String(path || "")
        .split("/")
        .map(item =>
            String(item)
            .replace(/^\d+[\.\-\s]*/, "")
            .trim()
        )
        .join("/");

}


function pathInventaris(item){

    const bagian = [

        item.kategori,

        item.subkategori,

        item.jenis

    ]
    .filter(Boolean)
    .map(item =>
        String(item)
        .replace(/^\d+[\.\-\s]*/, "")
        .trim()
    );

    return bagian.join("/");

}

/*==================================================
FILTER INVENTARIS BERDASARKAN STRUKTUR FOLDER
==================================================*/

/*==================================================
BERSIHKAN NAMA FOLDER
==================================================*/

function namaFolderBersih(nama){

    return String(nama || "")
        .replace(/^\d+[\.\-\s]*/, "")
        .trim();

}

/*==================================================
NORMALISASI PATH
==================================================*/

function normalisasiPath(path){

    return String(path || "")
        .split("/")
        .map(item =>
            namaFolderBersih(item)
        )
        .join("/");

}

function renderDenganFilter(){

    const kategori =
        document.getElementById(
            "filterKategori"
        )?.value || "";

    const subkategori =
        document.getElementById(
            "filterSubkategori"
        )?.value || "";

    const container =
        document.getElementById(
            "filterFolderDinamis"
        );

    const search =
        document.getElementById(
            "searchDokumen"
        )?.value
        .toLowerCase()
        .trim() || "";


    /*
     * Ambil seluruh folder dinamis
     */

    const selectFolder =
        container
        ?.querySelectorAll("select");


    dataAktif =
        inventaris.filter(item => {


            /*======================================
            CARI BERDASARKAN JUDUL
            ======================================*/

            if(search){

                const judul =
                    String(
                        item.judul || ""
                    )
                    .toLowerCase();

                if(
                    !judul.includes(search)
                ){

                    return false;

                }

            }


            /*======================================
            FILTER KATEGORI
            ======================================*/

            if(kategori){

                const namaKategoriDrive =
                    String(kategori)
                    .split("/")
                    .pop();

                const kategoriDriveBersih =
                    namaFolderBersih(
                        namaKategoriDrive
                    );

                const kategoriData =
                    namaFolderBersih(
                        item.kategori
                    );

                if(
                    kategoriData !==
                    kategoriDriveBersih
                ){

                    return false;

                }

            }


            /*======================================
            FILTER SUBKATEGORI
            ======================================*/

            if(subkategori){

                const namaSubDrive =
                    String(subkategori)
                    .split("/")
                    .pop();

                const subDriveBersih =
                    namaFolderBersih(
                        namaSubDrive
                    );

                const subData =
                    namaFolderBersih(
                        item.subkategori
                    );

                /*
                 * Jika data subkategori tersedia,
                 * cocokkan langsung.
                 */

                if(
                    subData !==
                    subDriveBersih
                ){

                    /*
                     * Jika tidak cocok,
                     * coba cocokkan dengan folder/path.
                     */

                    const folderData =
                        String(
                            item.folder || ""
                        );

                    const folderBersih =
                        normalisasiPath(
                            folderData
                        );

                    const subPathBersih =
                        normalisasiPath(
                            subkategori
                        );

                    if(
                        !folderBersih.endsWith(
                            subPathBersih
                        )
                    ){

                        return false;

                    }

                }

            }


            /*======================================
            FILTER FOLDER LEVEL LANJUTAN
            ======================================*/

            if(selectFolder){

                for(
                    const select
                    of selectFolder
                ){

                    if(!select.value){

                        continue;

                    }


                    const folderPilihan =
                        normalisasiPath(
                            select.value
                        );


                    /*
                     * Folder pada data inventaris
                     */

                    const folderData =
                        normalisasiPath(
                            item.folder || ""
                        );


                    /*
                     * Buang nama root LENTERA RR
                     * agar path Drive dan Sheet
                     * dapat dibandingkan.
                     */

                    const pathDrive =
                        normalisasiPath(
                            select.value
                        )
                        .replace(
                            /^LENTERA RR\//i,
                            ""
                        );


                    /*
                     * Cek berdasarkan folder/path
                     */

                    if(
                        !folderData.endsWith(
                            pathDrive
                        )
                    ){

                        /*
                         * Alternatif:
                         * cek berdasarkan kategori,
                         * subkategori, dan jenis.
                         */

                        const pathData =
                            normalisasiPath(

                                [
                                    item.kategori,
                                    item.subkategori,
                                    item.jenis
                                ]
                                .filter(Boolean)
                                .join("/")
                            );


                        if(
                            !pathData.endsWith(
                                pathDrive
                            )
                        ){

                            return false;

                        }

                    }

                }

            }


            return true;

        });


    currentPage = 1;

    renderInventaris();

}

/*==================================================
PAGINATION
==================================================*/

let currentPage = 1;

const perPage = 10;

function renderInventaris(){

const tbody =
document.getElementById("inventarisTable");

tbody.innerHTML="";

const start =
(currentPage-1)*perPage;

const end =
start+perPage;

const data =
dataAktif.slice(start,end);

data.forEach((item,index)=>{

tbody.innerHTML+=`

<tr>

<td>${start+index+1}</td>

<td>${item.judul}</td>

<td>${item.kategori || "-"}</td>

<td>${item.subkategori || "-"}</td>

<td>${item.tahun || "-"}</td>

<td>

<div class="btn-group">

<button
class="btn btn-sm btn-outline-primary"
onclick="previewDokumen('${item.fileId}')"
title="Preview">

<i class="bi bi-eye"></i>

</button>

<button
class="btn btn-sm btn-outline-info"
onclick="detailDokumenById('${item.fileId}')"
title="Detail">

<i class="bi bi-info-circle"></i>

</button>

<button
class="btn btn-sm btn-outline-success"
onclick="downloadDokumen('${item.fileId}')"
title="Download">

<i class="bi bi-download"></i>

</button>

</div>

</td>

</tr>

`;

});

updatePagination();

}

function updatePagination(){

const totalPage =
Math.ceil(dataAktif.length/perPage)||1;

document.getElementById("infoHalaman").innerText=

`Halaman ${currentPage} dari ${totalPage}`;

document.getElementById("btnPrev").disabled=
currentPage===1;

document.getElementById("btnNext").disabled=
currentPage===totalPage;

}

document.getElementById("btnPrev")
?.addEventListener("click",()=>{

if(currentPage>1){

currentPage--;

renderInventaris();

}

});

document.getElementById("btnNext")
?.addEventListener("click",()=>{

const totalPage=
Math.ceil(dataAktif.length/perPage);

if(currentPage<totalPage){

currentPage++;

renderInventaris();

}

});

/*==================================================
SIMPAN DOKUMEN
==================================================*/

const btnSimpan = document.getElementById("simpanDokumen");

if(btnSimpan){

btnSimpan.addEventListener("click",simpanDokumen);

}

function simpanDokumen(){

const judul=document
.getElementById("judulDokumen")
.value.trim();

const kategori=document
.getElementById("kategoriDokumen")
.value;

const tahun=document
.getElementById("tahunDokumen")
.value;

if(judul===""){

alert("Judul dokumen harus diisi.");

return;

}

inventaris.push({

judul,

kategori,

tahun,

status:"Aktif"

});

renderAdminTable();

updateDashboard();

document
.getElementById("formDokumen")
.reset();

const modal=document.getElementById("dokumenModal");

bootstrap.Modal.getInstance(modal).hide();

}

/*==================================================
PREVIEW DOKUMEN
==================================================*/

function previewDokumen(fileId){

const iframe=document.getElementById("previewFrame");

iframe.src=

`https://drive.google.com/file/d/${fileId}/preview`;

const modal=

new bootstrap.Modal(

document.getElementById("previewModal")

);

modal.show();

}

function detailDokumenById(fileId){

    console.log(
        "DETAIL DOKUMEN:",
        fileId
    );


    if(!fileId){

        console.error(
            "DETAIL: fileId kosong."
        );

        return;

    }


    /*
     * Cari dokumen pada data inventaris.
     *
     * Pada index.html, data dapat berada
     * pada dataAktif atau inventaris.
     */

    let item = null;


    if(Array.isArray(dataAktif)){

        item = dataAktif.find(
            d =>
                String(d.fileId).trim() ===
                String(fileId).trim()
        );

    }


    if(!item && Array.isArray(inventaris)){

        item = inventaris.find(
            d =>
                String(d.fileId).trim() ===
                String(fileId).trim()
        );

    }


    /*
     * Jika belum ditemukan, coba ambil ulang
     * data dari API.
     */

    if(!item){

        getInventaris()
            .then(data => {

                const dokumen =
                    Array.isArray(data)
                        ? data.find(
                            d =>
                                String(d.fileId).trim() ===
                                String(fileId).trim()
                        )
                        : null;


                if(!dokumen){

                    console.error(
                        "Dokumen tidak ditemukan:",
                        fileId
                    );

                    alert(
                        "Data detail dokumen tidak ditemukan."
                    );

                    return;

                }


                tampilkanDetailDokumen(
                    dokumen
                );

            })
            .catch(error => {

                console.error(
                    "ERROR DETAIL DOKUMEN:",
                    error
                );

            });

        return;

    }


    tampilkanDetailDokumen(item);

}

function tampilkanDetailDokumen(item){

    const modalElement =
        document.getElementById(
            "detailModal"
        );


    const body =
        document.getElementById(
            "detailDokumenBody"
        );


    if(!modalElement || !body){

        console.error(
            "DETAIL: modal detail tidak ditemukan."
        );

        return;

    }


    body.innerHTML = `

        <div class="row g-3">

            <div class="col-md-4 fw-semibold text-muted">
                Judul Dokumen
            </div>

            <div class="col-md-8">
                ${item.judul || "-"}
            </div>


            <div class="col-md-4 fw-semibold text-muted">
                Kategori
            </div>

            <div class="col-md-8">
                ${item.kategori || "-"}
            </div>


            <div class="col-md-4 fw-semibold text-muted">
                Subkategori
            </div>

            <div class="col-md-8">
                ${item.subkategori || "-"}
            </div>


            <div class="col-md-4 fw-semibold text-muted">
                Jenis
            </div>

            <div class="col-md-8">
                ${item.jenis || "-"}
            </div>


            <div class="col-md-4 fw-semibold text-muted">
                Nomor
            </div>

            <div class="col-md-8">
                ${item.nomor || "-"}
            </div>


            <div class="col-md-4 fw-semibold text-muted">
                Tahun
            </div>

            <div class="col-md-8">
                ${item.tahun || "-"}
            </div>


            <div class="col-md-4 fw-semibold text-muted">
                Tentang
            </div>

            <div class="col-md-8">
                ${item.tentang || "-"}
            </div>


            <div class="col-md-4 fw-semibold text-muted">
                Folder
            </div>

            <div class="col-md-8">
                ${item.folder || "-"}
            </div>


            <div class="col-md-4 fw-semibold text-muted">
                Format
            </div>

            <div class="col-md-8">
                ${item.format || "-"}
            </div>


            <div class="col-md-4 fw-semibold text-muted">
                Status
            </div>

            <div class="col-md-8">
                ${item.status || "-"}
            </div>

        </div>

    `;


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}

/*==================================================
STATISTIK DOKUMEN DINAMIS
==================================================*/

function updateStatistik(){

const container =
document.getElementById("statistikContainer");

if(!container) return;

container.innerHTML="";

const statistik={};

inventaris.forEach(item=>{

const kategori =
(item.kategori || "Lainnya").trim();

statistik[kategori] =
(statistik[kategori]||0)+1;

});

Object.keys(statistik)
.sort()
.forEach(kategori=>{

const ikon={

"Produk Hukum":"bi-bank2",

"Pedoman":"bi-journal-text",

"Perencanaan":"bi-diagram-3",

"Administrasi":"bi-folder2-open",

"Template":"bi-file-earmark-text",

"Media":"bi-images",

"Referensi Atau Bahan Bacaan":"bi-book"

};

const iconClass =
ikon[kategori] ||
"bi-folder-fill";

container.innerHTML += `

<div class="col-lg-3 col-md-4 col-sm-6">

<div class="card h-100 shadow-sm border-0">

<div class="card-body text-center">

<i class="bi ${iconClass} display-5 text-primary"></i>

<h5 class="mt-3">

${kategori}

</h5>

<h2 class="fw-bold text-primary">

${statistik[kategori]}

</h2>

<small class="text-muted">

Dokumen

</small>

</div>

</div>

</div>

`;

});

}

/*==================================================
DOWNLOAD DOKUMEN
==================================================*/

function downloadDokumen(fileId){

    if(!fileId){

        alert("File tidak ditemukan.");

        return;

    }


    window.open(
        `https://drive.google.com/file/d/${fileId}/view`,
        "_blank",
        "noopener,noreferrer"
    );

}

/*==================================================
AUTO REFRESH INVENTARIS
==================================================*/

setInterval(async ()=>{

    try{

        /*
         * Ambil data terbaru dari Google Sheets
         * melalui API
         */

        const data =
            await getInventaris();


        /*
         * Perbarui database inventaris
         */

        inventaris =
            Array.isArray(data)
            ? data
            : [];


        /*
         * Perbarui data yang sedang ditampilkan
         */

        dataAktif =
            [...inventaris];


        /*
         * Perbarui isi filter kategori
         */

        isiKategori();


        /*
         * Kembalikan ke halaman pertama
         */

        currentPage = 1;


        /*
         * Render ulang tabel
         */

        renderInventaris();


        /*
         * Perbarui statistik
         */

        updateStatistik();


    }catch(error){

        console.error(
            "AUTO REFRESH INVENTARIS:",
            error
        );

    }

}, 300000);