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
GET STRUKTUR FOLDER GOOGLE DRIVE
==================================================*/

async function getFolderStructure(){

    const response = await fetch(
        API_URL + "?action=folder"
    );

    if(!response.ok){

        throw new Error(
            "Gagal mengambil struktur folder."
        );

    }

    const hasil = await response.json();

    if(!hasil.status){

        throw new Error(
            hasil.pesan ||
            "Struktur folder gagal diambil."
        );

    }

    return hasil.data || [];

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

    const params = new URLSearchParams();

    params.append(
        "action",
        "tambahSuratMasuk"
    );

    params.append(
        "data",
        JSON.stringify(data)
    );

    const response = await fetch(API_URL, {

        method: "POST",

        body: params

    });

    if(!response.ok){

        throw new Error(
            "Server mengembalikan status " +
            response.status
        );

    }

    return await response.json();

}

/*==================================================
GET SURAT MASUK
==================================================*/

async function getSuratMasuk(){

    const response = await fetch(
        API_URL +
        "?action=suratMasuk"
    );

    if(!response.ok){

        throw new Error(
            "Gagal mengambil data surat masuk. Status: " +
            response.status
        );

    }

    return await response.json();

}

/*==================================================
TAMBAH SURAT KELUAR
==================================================*/

async function tambahSuratKeluar(data){

    const response = await fetch(API_URL,{

        method:"POST",

        body:JSON.stringify({

            action:"tambahSuratKeluar",

            data:data

        })

    });

    return await response.json();

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

/*==================================================
HAPUS SURAT MASUK
==================================================*/

async function hapusSuratMasuk(id){

    const response =
        await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"hapusSuratMasuk",

                data:{
                    id:id
                }

            })

        });

    if(!response.ok){

        throw new Error(
            "Gagal menghapus surat masuk."
        );

    }

    return await response.json();

}

/*==================================================
HAPUS SURAT KELUAR
==================================================*/

async function hapusSuratKeluar(id){

    const response =
        await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"hapusSuratKeluar",

                data:{
                    id:id
                }

            })

        });

    if(!response.ok){

        throw new Error(
            "Gagal menghapus surat keluar."
        );

    }

    return await response.json();

}