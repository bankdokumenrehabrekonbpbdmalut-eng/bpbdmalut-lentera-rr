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

async function uploadFile(file){

    const base64 = await fileToBase64(file);

    const response = await fetch(API_URL,{

        method:"POST",

        body:JSON.stringify({

            action:"uploadFile",

            nama:file.name,

            mime:file.type,

            data:base64

        })

    });

    return await response.json();

}