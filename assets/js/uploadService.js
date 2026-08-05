/*=========================================
UPLOAD SERVICE
LENTERA RR
=========================================*/

async function fileToBase64(file){

    return new Promise((resolve,reject)=>{

        const reader = new FileReader();

        reader.onload = ()=>{

            resolve(reader.result);

        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}

/*=========================================
UPLOAD FILE
LENTERA RR
=========================================*/

async function uploadFile(file, jenisSurat){

    if(!file){

        throw new Error(
            "File belum dipilih."
        );

    }

    if(
        jenisSurat !== "masuk" &&
        jenisSurat !== "keluar"
    ){

        throw new Error(
            "Jenis surat tidak valid."
        );

    }

    const base64 =
        await fileToBase64(file);

    const params =
        new URLSearchParams();

    params.append(
        "action",
        "uploadFile"
    );

    params.append(
        "data",
        JSON.stringify({

            base64: base64,

            mime: file.type,

            namaFile: file.name,

            jenisSurat: jenisSurat

        })
    );

    const response =
        await fetch(API_URL, {

            method: "POST",

            body: params

        });

    if(!response.ok){

        throw new Error(
            "Upload gagal. Status server: " +
            response.status
        );

    }

    const hasil =
        await response.json();

    if(
        !hasil ||
        !hasil.status
    ){

        throw new Error(
            hasil?.pesan ||
            "File gagal diupload."
        );

    }

    return hasil;

}