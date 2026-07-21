/*==================================================
API LENTERA RR
==================================================*/

const API_URL =
"https://script.google.com/macros/s/AKfycbywxhFe7g8JDoWTzoRktls2MaTJgaz4ttXnCTGs0p9VceJnzah2JfS3HiGkGUUkLgI2/exec";

async function getInventaris(){

    const response = await fetch(
        API_URL + "?action=inventaris"
    );

    if(!response.ok){

        throw new Error("API gagal diakses");

    }

    return await response.json();

}

/*==================================================
TAMBAH DOKUMEN
==================================================*/

async function tambahDokumen(data){

    const response = await fetch(API_URL,{

        method:"POST",

        body:JSON.stringify({

            action:"tambahDokumen",

            data:data

        })

    });

    return await response.json();

}

async function getSuratMasuk(){

const res=
await fetch(API_URL+"?action=suratMasuk");

return await res.json();

}

async function getSuratKeluar(){

const res=
await fetch(API_URL+"?action=suratKeluar");

return await res.json();

}