/*==================================================
LENTERA RR
ADMIN SURAT
==================================================*/

"use strict";


/*==================================================
INISIALISASI
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    initAdminSurat();

});


/*==================================================
INIT ADMIN SURAT
==================================================*/

function initAdminSurat(){

    const btnTambahMasuk =
        document.getElementById("btnTambahMasuk");

    const btnTambahKeluar =
        document.getElementById("btnTambahKeluar");

    const btnSimpanMasuk =
        document.getElementById("btnSimpanSuratMasuk");

    const btnSimpanKeluar =
        document.getElementById("btnSimpanSuratKeluar");


    /*==================================================
    TOMBOL TAMBAH SURAT MASUK
    ==================================================*/

    btnTambahMasuk?.addEventListener("click",()=>{

        const form =
            document.getElementById("formSuratMasuk");

        if(form){

            form.reset();

        }

        const modalElement =
            document.getElementById("modalSuratMasuk");

        if(modalElement){

            const modal =
                bootstrap.Modal.getOrCreateInstance(
                    modalElement
                );

            modal.show();

        }

    });


    /*==================================================
    TOMBOL TAMBAH SURAT KELUAR
    ==================================================*/

    btnTambahKeluar?.addEventListener("click",()=>{

        const form =
            document.getElementById("formSuratKeluar");

        if(form){

            form.reset();

        }

        const modalElement =
            document.getElementById("modalSuratKeluar");

        if(modalElement){

            const modal =
                bootstrap.Modal.getOrCreateInstance(
                    modalElement
                );

            modal.show();

        }

    });


    /*==================================================
    SIMPAN SURAT MASUK
    ==================================================*/

    btnSimpanMasuk?.addEventListener(
        "click",
        simpanSuratMasuk
    );


    /*==================================================
    SIMPAN SURAT KELUAR
    ==================================================*/

    btnSimpanKeluar?.addEventListener(
        "click",
        simpanSuratKeluar
    );

}

/*==================================================
SIMPAN SURAT MASUK
==================================================*/

async function simpanSuratMasuk(){

    const form =
        document.getElementById("formSuratMasuk");

    if(!form) return;


    if(!form.checkValidity()){

        form.reportValidity();

        return;

    }


    /*==============================================
    AMBIL DATA FORM
    ==============================================*/

    const nomor =
        document
        .getElementById("smNomor")
        .value
        .trim();

    const tanggal =
        document
        .getElementById("smTanggal")
        .value;

    const asal =
        document
        .getElementById("smAsal")
        .value
        .trim();

    const perihal =
        document
        .getElementById("smPerihal")
        .value
        .trim();

    const fileInput =
        document.getElementById("smFile");

    const file =
        fileInput?.files?.[0];


    /*==============================================
    VALIDASI FILE
    ==============================================*/

    if(!file){

        alert(
            "Silakan pilih file surat terlebih dahulu."
        );

        return;

    }


    console.log(
        "DATA SURAT MASUK:",
        {
            nomor,
            tanggal,
            asal,
            perihal,
            file: file.name,
            mime: file.type,
            ukuran: file.size
        }
    );


    try{

        /*==========================================
        1. UPLOAD FILE KE GOOGLE DRIVE
        ==========================================*/

        console.log(
            "UPLOAD FILE SURAT MASUK:",
            file.name
        );


        const hasilUpload =
            await uploadFile(file, "masuk");


        console.log(
            "RESPON UPLOAD:",
            hasilUpload
        );


        if(
            !hasilUpload ||
            !hasilUpload.status
        ){

            throw new Error(
                hasilUpload?.pesan ||
                "File surat gagal diupload."
            );

        }


        /*==========================================
        2. SIAPKAN DATA SURAT
        ==========================================*/

        const data = {

            nomor: nomor,

            tanggal: tanggal,

            asal: asal,

            perihal: perihal,

            fileId:
                hasilUpload.fileId || "",

            link:
                hasilUpload.link || "",

            namaFile:
                hasilUpload.nama || file.name,

            mime:
                hasilUpload.mime || file.type

        };


        console.log(
            "DATA YANG AKAN DISIMPAN:",
            data
        );


        /*==========================================
        3. SIMPAN DATA SURAT KE SPREADSHEET
        ==========================================*/

        const hasil =
            await tambahSuratMasuk(data);


        console.log(
            "RESPON SURAT MASUK:",
            hasil
        );


        if(
            !hasil ||
            !hasil.status
        ){

            throw new Error(
                hasil?.pesan ||
                "Surat masuk gagal disimpan."
            );

        }


        /*==========================================
        4. BERHASIL
        ==========================================*/

        alert(
            "Surat masuk dan file berhasil disimpan."
        );


        form.reset();


        const modalElement =
            document.getElementById(
                "modalSuratMasuk"
            );


        if(modalElement){

            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );

            modal?.hide();

        }


        await muatSuratMasuk();

        await refreshStatistikSurat();


    }catch(error){

        console.error(
            "ERROR SIMPAN SURAT MASUK:",
            error
        );


        alert(
            "Gagal menyimpan surat masuk.\n" +
            error.message
        );

    }

}

/*==================================================
SIMPAN SURAT KELUAR
==================================================*/

async function simpanSuratKeluar(){

    const form =
        document.getElementById("formSuratKeluar");

    if(!form) return;


    if(!form.checkValidity()){

        form.reportValidity();

        return;

    }


    /*==============================================
    AMBIL DATA FORM
    ==============================================*/

    const nomor =
        document
        .getElementById("skNomor")
        .value
        .trim();

    const tanggal =
        document
        .getElementById("skTanggal")
        .value;

    const tujuan =
        document
        .getElementById("skTujuan")
        .value
        .trim();

    const perihal =
        document
        .getElementById("skPerihal")
        .value
        .trim();

    const fileInput =
        document.getElementById("skFile");

    const file =
        fileInput?.files?.[0];


    /*==============================================
    VALIDASI FILE
    ==============================================*/

    if(!file){

        alert(
            "Silakan pilih file surat terlebih dahulu."
        );

        return;

    }


    console.log(
        "DATA SURAT KELUAR:",
        {
            nomor,
            tanggal,
            tujuan,
            perihal,
            file: file.name,
            mime: file.type,
            ukuran: file.size
        }
    );


    try{

        /*==========================================
        1. UPLOAD FILE KE GOOGLE DRIVE
        ==========================================*/

        console.log(
            "UPLOAD FILE SURAT KELUAR:",
            file.name
        );


        const hasilUpload =
            await uploadFile(file, "keluar");


        console.log(
            "RESPON UPLOAD SURAT KELUAR:",
            hasilUpload
        );


        if(
            !hasilUpload ||
            !hasilUpload.status
        ){

            throw new Error(
                hasilUpload?.pesan ||
                "File surat keluar gagal diupload."
            );

        }


        /*==========================================
        2. SIAPKAN DATA SURAT
        ==========================================*/

        const data = {

            nomor: nomor,

            tanggal: tanggal,

            tujuan: tujuan,

            perihal: perihal,

            fileId:
                hasilUpload.fileId || "",

            link:
                hasilUpload.link || "",

            namaFile:
                hasilUpload.nama || file.name,

            mime:
                hasilUpload.mime || file.type

        };


        console.log(
            "DATA YANG AKAN DISIMPAN:",
            data
        );


        /*==========================================
        3. SIMPAN DATA SURAT KE SPREADSHEET
        ==========================================*/

        const hasil =
            await tambahSuratKeluar(data);


        console.log(
            "RESPON SURAT KELUAR:",
            hasil
        );


        if(
            !hasil ||
            !hasil.status
        ){

            throw new Error(
                hasil?.pesan ||
                "Surat keluar gagal disimpan."
            );

        }


        /*==========================================
        4. BERHASIL
        ==========================================*/

        alert(
            "Surat keluar dan file berhasil disimpan."
        );


        form.reset();


        const modalElement =
            document.getElementById(
                "modalSuratKeluar"
            );


        if(modalElement){

            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );

            modal?.hide();

        }


        await muatSuratKeluar();

        await refreshStatistikSurat();


    }catch(error){

        console.error(
            "ERROR SIMPAN SURAT KELUAR:",
            error
        );


        alert(
            "Gagal menyimpan surat keluar.\n" +
            error.message
        );

    }

}

/*==================================================
MUAT SURAT MASUK
==================================================*/

async function muatSuratMasuk(){

    try{

        const data =
            await getSuratMasuk();

        renderSuratMasuk(data);

    }catch(error){

        console.error(
            "ERROR LOAD SURAT MASUK:",
            error
        );

    }

}


/*==================================================
MUAT SURAT KELUAR
==================================================*/

async function muatSuratKeluar(){

    try{

        const data =
            await getSuratKeluar();

        renderSuratKeluar(data);

    }catch(error){

        console.error(
            "ERROR LOAD SURAT KELUAR:",
            error
        );

    }

}


/*==================================================
RENDER SURAT MASUK
==================================================*/

function renderSuratMasuk(data){

    const tbody =
        document.getElementById(
            "suratMasukTable"
        );

    if(!tbody) return;


    tbody.innerHTML = "";


    if(!Array.isArray(data) || data.length===0){

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="text-center"
                >

                    Belum ada data.

                </td>

            </tr>

        `;

        return;

    }


    data.forEach((item,index)=>{

    tbody.innerHTML += `

        <tr>

            <td>${index+1}</td>

            <td>${item.nomor || "-"}</td>

            <td>${item.asal || "-"}</td>

            <td>${item.tanggal || "-"}</td>

            <td>

                ${
                    item.link
                    ?
                    `
                    <a
                        href="${item.link}"
                        target="_blank"
                        class="btn btn-sm btn-outline-success"
                        title="Preview Surat"
                    >

                        <i class="bi bi-eye"></i>

                    </a>
                    `
                    :
                    ""
                }

                <button
                    type="button"
                    class="btn btn-sm btn-outline-danger ms-1"
                    title="Hapus Surat"
                    onclick="hapusSuratMasukAdmin('${item.id}')"
                >

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

    `;

});

}


/*==================================================
RENDER SURAT KELUAR
==================================================*/

function renderSuratKeluar(data){

    const tbody =
        document.getElementById(
            "suratKeluarTable"
        );

    if(!tbody) return;


    tbody.innerHTML = "";


    if(!Array.isArray(data) || data.length===0){

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="text-center"
                >

                    Belum ada data.

                </td>

            </tr>

        `;

        return;

    }


    data.forEach((item,index)=>{

    tbody.innerHTML += `

        <tr>

            <td>${index+1}</td>

            <td>${item.nomor || "-"}</td>

            <td>${item.tujuan || "-"}</td>

            <td>${item.tanggal || "-"}</td>

            <td>

                ${
                    item.link
                    ?
                    `
                    <a
                        href="${item.link}"
                        target="_blank"
                        class="btn btn-sm btn-outline-success"
                        title="Preview Surat"
                    >

                        <i class="bi bi-eye"></i>

                    </a>
                    `
                    :
                    ""
                }

                <button
                    type="button"
                    class="btn btn-sm btn-outline-danger ms-1"
                    title="Hapus Surat"
                    onclick="hapusSuratKeluarAdmin('${item.id}')"
                >

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

    `;

});

}

/*==================================================
HAPUS SURAT MASUK
==================================================*/

async function hapusSuratMasukAdmin(id){

    if(!id){

        alert(
            "ID surat masuk tidak ditemukan."
        );

        return;

    }


    const konfirmasi =
        confirm(
            "Apakah Anda yakin ingin menghapus surat masuk ini?"
        );


    if(!konfirmasi){

        return;

    }


    try{

        const hasil =
            await hapusSuratMasuk(id);


        if(
            !hasil ||
            !hasil.status
        ){

            throw new Error(
                hasil?.pesan ||
                "Surat masuk gagal dihapus."
            );

        }


        alert(
            "Surat masuk berhasil dihapus."
        );


        await muatSuratMasuk();

        await refreshStatistikSurat();


    }catch(error){

        console.error(
            "ERROR HAPUS SURAT MASUK:",
            error
        );


        alert(
            "Gagal menghapus surat masuk.\n" +
            error.message
        );

    }

}


/*==================================================
HAPUS SURAT KELUAR
==================================================*/

async function hapusSuratKeluarAdmin(id){

    if(!id){

        alert(
            "ID surat keluar tidak ditemukan."
        );

        return;

    }


    const konfirmasi =
        confirm(
            "Apakah Anda yakin ingin menghapus surat keluar ini?"
        );


    if(!konfirmasi){

        return;

    }


    try{

        const hasil =
            await hapusSuratKeluar(id);


        if(
            !hasil ||
            !hasil.status
        ){

            throw new Error(
                hasil?.pesan ||
                "Surat keluar gagal dihapus."
            );

        }


        alert(
            "Surat keluar berhasil dihapus."
        );


        await muatSuratKeluar();

        await refreshStatistikSurat();


    }catch(error){

        console.error(
            "ERROR HAPUS SURAT KELUAR:",
            error
        );


        alert(
            "Gagal menghapus surat keluar.\n" +
            error.message
        );

    }

}

/*==================================================
REFRESH STATISTIK SURAT
==================================================*/

async function refreshStatistikSurat(){

    try{

        const suratMasuk =
            await getSuratMasuk();

        const suratKeluar =
            await getSuratKeluar();


        /*
         * Statistik Surat Masuk
         */

        const statMasuk =
            document.getElementById(
                "statSuratMasuk"
            );

        if(statMasuk){

            statMasuk.textContent =
                Array.isArray(suratMasuk)
                ? suratMasuk.length
                : 0;

        }


        /*
         * Statistik Surat Keluar
         */

        const statKeluar =
            document.getElementById(
                "statSuratKeluar"
            );

        if(statKeluar){

            statKeluar.textContent =
                Array.isArray(suratKeluar)
                ? suratKeluar.length
                : 0;

        }


    }catch(error){

        console.error(
            "ERROR REFRESH STATISTIK SURAT:",
            error
        );

    }

}

/*==================================================
LOAD AWAL DATA SURAT
==================================================*/

document.addEventListener(
    "DOMContentLoaded",
    async ()=>{

        await muatSuratMasuk();

        await muatSuratKeluar();

        await refreshStatistikSurat();

    }
);