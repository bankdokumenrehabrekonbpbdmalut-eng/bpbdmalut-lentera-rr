/*==================================================
LENTERA RR
DASHBOARD
==================================================*/

"use strict";

/*==================================================
LOAD DASHBOARD
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

loadDashboard();

});

/*==================================================
LOAD SEMUA DATA
==================================================*/

async function loadDashboard(){

try{

const data = await getInventaris();

loadInventarisDashboard(data);

isiQuickSearch(data);


/*==================================================
SURAT MASUK TERBARU
==================================================*/

try{

const suratMasuk =
    await getSuratMasuk();

loadSuratMasukDashboard(suratMasuk);

}catch(error){

console.error(
    "ERROR LOAD SURAT MASUK DASHBOARD:",
    error
);

}


/*==================================================
SURAT KELUAR TERBARU
==================================================*/

try{

const suratKeluar =
    await getSuratKeluar();

loadSuratKeluarDashboard(suratKeluar);

}catch(error){

console.error(
    "ERROR LOAD SURAT KELUAR DASHBOARD:",
    error
);

}

}catch(error){

console.error(
    "ERROR LOAD DASHBOARD:",
    error
);

}

}

/*==================================================
10 DOKUMEN TERBARU
==================================================*/

function loadInventarisDashboard(data){

const tbody = document.getElementById("inventarisDashboard");

if(!tbody) return;

tbody.innerHTML="";

data.slice(0,10).forEach((item,index)=>{

tbody.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${item.judul}</td>

<td>${item.kategori}</td>

<td>${item.jenis || "-"}</td>

<td>${item.tahun || "-"}</td>

<td>

<button
class="btn btn-sm btn-outline-primary"
onclick="previewDokumen('${item.fileId}')">

<i class="bi bi-eye"></i>

</button>

<button
class="btn btn-sm btn-outline-success"
onclick="window.open('${item.link}','_blank')">

<i class="bi bi-download"></i>

</button>

<button
class="btn btn-sm btn-outline-secondary"
onclick="detailDokumenById('${item.fileId}')">

<i class="bi bi-info-circle"></i>

</button>

</td>

</tr>

`;

});

}

/*==================================================
SURAT MASUK TERBARU
==================================================*/

function loadSuratMasukDashboard(data){

    const tbody =
        document.getElementById(
            "suratMasukDashboard"
        );

    if(!tbody) return;


    tbody.innerHTML = "";


    if(
        !Array.isArray(data) ||
        data.length === 0
    ){

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="2"
                    class="text-center"
                >

                    Belum ada data

                </td>

            </tr>

        `;

        return;

    }


    data
    .slice(0,5)
    .forEach(item=>{

        const fileId =
            item.fileId || "";

        const link =
            item.link || "";


        const tombolPreview =
            fileId
            ?
            `
            <button
                class="btn btn-sm btn-outline-primary me-1"
                onclick="previewDokumen('${fileId}')"
                title="Preview"
            >

                <i class="bi bi-eye"></i>

            </button>
            `
            :
            "";


        const tombolDownload =
            link
            ?
            `
            <a
                href="${link}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-sm btn-outline-success"
                title="Download"
            >

                <i class="bi bi-download"></i>

            </a>
            `
            :
            "";


        tbody.innerHTML += `

            <tr>

                <td>

                    ${
                        item.nomor || "-"
                    }

                </td>

                <td>

                    ${
                        item.tanggal || "-"
                    }

                </td>

                <td>

                    ${tombolPreview}

                    ${tombolDownload}

                </td>

            </tr>

        `;

    });

}


/*==================================================
SURAT KELUAR TERBARU
==================================================*/

function loadSuratKeluarDashboard(data){

    const tbody =
        document.getElementById(
            "suratKeluarDashboard"
        );

    if(!tbody) return;


    tbody.innerHTML = "";


    if(
        !Array.isArray(data) ||
        data.length === 0
    ){

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="2"
                    class="text-center"
                >

                    Belum ada data

                </td>

            </tr>

        `;

        return;

    }


    data
    .slice(0,5)
    .forEach(item=>{

        const fileId =
            item.fileId || "";

        const link =
            item.link || "";


        const tombolPreview =
            fileId
            ?
            `
            <button
                class="btn btn-sm btn-outline-primary me-1"
                onclick="previewDokumen('${fileId}')"
                title="Preview"
            >

                <i class="bi bi-eye"></i>

            </button>
            `
            :
            "";


        const tombolDownload =
            link
            ?
            `
            <a
                href="${link}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-sm btn-outline-success"
                title="Download"
            >

                <i class="bi bi-download"></i>

            </a>
            `
            :
            "";


        tbody.innerHTML += `

            <tr>

                <td>

                    ${
                        item.nomor || "-"
                    }

                </td>

                <td>

                    ${
                        item.tanggal || "-"
                    }

                </td>

                <td>

                    ${tombolPreview}

                    ${tombolDownload}

                </td>

            </tr>

        `;

    });

}

/*==================================================
STATISTIK DOKUMEN
==================================================*/

async function loadStatistikDokumen(){

    try{

        const data = await getInventaris();

        if(!Array.isArray(data)){

            throw new Error(
                "Data inventaris tidak valid."
            );

        }


        /*==========================================
        HITUNG BERDASARKAN KATEGORI DRIVE
        ==========================================*/

        const statistik = {

            "Produk Hukum": 0,

            "Pedoman": 0,

            "Perencanaan": 0,

            "Administrasi": 0,

            "Template": 0

        };


        data.forEach(item => {

            const kategori =
                String(
                    item.kategori || ""
                )
                .replace(
                    /^\d+[\.\-\s]*/,
                    ""
                )
                .trim();


            if(
                Object.prototype.hasOwnProperty.call(
                    statistik,
                    kategori
                )
            ){

                statistik[kategori]++;

            }

        });


        /*==========================================
        TAMPILKAN STATISTIK
        ==========================================*/

        const elemen = {

            "Produk Hukum":
                "statProdukHukum",

            "Pedoman":
                "statPedoman",

            "Perencanaan":
                "statPerencanaan",

            "Administrasi":
                "statAdministrasi",

            "Template":
                "statTemplate"

        };


        Object.keys(elemen).forEach(kategori => {

            const element =
                document.getElementById(
                    elemen[kategori]
                );

            if(element){

                element.textContent =
                    statistik[kategori];

            }

        });


    }catch(error){

        console.error(
            "STATISTIK DOKUMEN:",
            error
        );

    }

}

/*==================================================
ISI FILTER QUICK SEARCH
KATEGORI MENGIKUTI FOLDER LEVEL 1 GOOGLE DRIVE
==================================================*/

function isiQuickSearch(data){

    const kategori =
        document.getElementById("quickKategori");

    const tahun =
        document.getElementById("quickTahun");


    /*==================================================
    KATEGORI
    ==================================================*/

    if(kategori){

        kategori.innerHTML =
            `<option value="">
                Semua Kategori
            </option>`;


        MASTER_KATEGORI.forEach(item => {

            kategori.innerHTML += `
                <option value="${item}">
                    ${item}
                </option>
            `;

        });

    }


    /*==================================================
    TAHUN
    ==================================================*/

    if(tahun){

        const daftarTahun = [

            ...new Set(

                data
                    .map(d => d.tahun)
                    .filter(Boolean)

            )

        ];

        daftarTahun.sort().reverse();


        tahun.innerHTML =
            `<option value="">
                Semua Tahun
            </option>`;


        daftarTahun.forEach(t => {

            tahun.innerHTML += `
                <option value="${t}">
                    ${t}
                </option>
            `;

        });

    }

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadStatistikDokumen();

    }

);