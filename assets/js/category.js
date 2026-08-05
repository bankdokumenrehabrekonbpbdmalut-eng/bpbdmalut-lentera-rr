/*==================================================
MASTER KATEGORI LENTERA RR
SESUAI FOLDER LEVEL 1 GOOGLE DRIVE
==================================================*/

"use strict";

const MASTER_KATEGORI = [

    "Produk Hukum",

    "Pedoman RR",

    "Perencanaan",

    "Administrasi",

    "Template",

    "Surat Masuk",

    "Surat Keluar",

    "Media",

    "Referensi Atau Bahan Bacaan",

    "Arsip"

];


/*==================================================
MENGAMBIL KATEGORI UTAMA DARI DATA
Mendukung data lama maupun data baru
==================================================*/

function getKategoriUtama(item){

    if(!item){

        return "";

    }

    const kategori =
        String(item.kategori || "").trim();

    const jenis =
        String(item.jenis || "").trim();


    /*
    Data baru:
    kategori = kategori utama
    */

    if(
        MASTER_KATEGORI.includes(kategori)
    ){

        return kategori;

    }


    /*
    Data lama:
    jenis = kategori utama
    */

    if(
        MASTER_KATEGORI.includes(jenis)
    ){

        return jenis;

    }


    return "";

}


/*==================================================
MEMBUAT OPTION KATEGORI
==================================================*/

function isiMasterKategori(selectId, nilaiDefault = ""){

    const select =
        document.getElementById(selectId);

    if(!select){

        return;

    }


    select.innerHTML = "";


    MASTER_KATEGORI.forEach(kategori => {

        const option =
            document.createElement("option");

        option.value = kategori;

        option.textContent = kategori;

        if(kategori === nilaiDefault){

            option.selected = true;

        }

        select.appendChild(option);

    });

}