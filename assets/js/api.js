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

    const payload={

        action:"tambahDokumen",

        data:{

        id:data.id,

        kategori:data.kategori,

        subkategori:data.subkategori,

        jenis:data.jenis,

        judul:data.judul,

        nomor:data.nomor,

        tentang:data.tentang,

        tahun:data.tahun,

        link:data.link,

        namaFile:data.namaFile || "",

        mime:data.mime || "",

        base64:data.base64 || ""

    }

    };

    console.log("PAYLOAD API:");
    console.log(payload);
    
    const response=await fetch(API_URL,{

        method:"POST",

        body:JSON.stringify(payload)

    });

    const hasil = await response.json();

    console.log("RESPON API:");
    console.log(hasil);

    return hasil;

}

async function editDokumen(data){

const response=
await fetch(API_URL,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

action:"editDokumen",

data:data

})

});

return await response.json();

}

async function editDokumen(data){

const response=
await fetch(API_URL,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

action:"editDokumen",

data:data

})

});

return await response.json();

}

/*==================================================
UPLOAD FILE
(Digunakan oleh Modul Surat.
Tidak digunakan oleh Inventaris.)
==================================================*/

async function uploadFile(data){

    const response = await fetch(API_URL,{

        method:"POST",

        body:JSON.stringify({

            action:"uploadFile",

            data:data

        })

    });

    return await response.json();

}

/*==================================================
TAMBAH SURAT MASUK
==================================================*/

async function tambahSuratMasuk(data){

    const response = await fetch(API_URL,{

        method:"POST",

        body:JSON.stringify({

            action:"tambahSuratMasuk",

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

async function deleteDokumen(id){

    const formData = new FormData();

    formData.append("action","hapusDokumen");

    formData.append("id",id);

    const response = await fetch(API_URL,{

        method:"POST",

        body:formData

    });

    return await response.json();

}