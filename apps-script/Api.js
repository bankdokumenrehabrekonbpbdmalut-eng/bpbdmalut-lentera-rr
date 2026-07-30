/*==================================================
API LENTERA RR
==================================================*/

function doGet(e){

  const action = e.parameter.action || "";

  switch(action){

    case "inventaris":
      return apiInventaris();

    case "suratMasuk":
      return apiSuratMasuk();

    case "suratKeluar":
      return apiSuratKeluar();

    case "login":
      return login(e);

    default:
      return ContentService
      .createTextOutput(
        JSON.stringify({
          status:"ok",
          aplikasi:"LENTERA RR API",
          versi:"1.0"
        })
      )
      .setMimeType(ContentService.MimeType.JSON);

  }

}

/*==================================================
POST API
==================================================*/

function doPost(e){

  let req;

try{

  req = JSON.parse(e.postData.contents);

}catch(err){

  req = {

    action:e.parameter.action,

    data:e.parameter

  };

}

  switch(req.action){

    case "tambahDokumen":
      return tambahDokumen(req.data);

    case "editDokumen":
      return editDokumen(req.data);

    case "hapusDokumen":
      return hapusDokumen(req.data.id);

    case "tambahSuratMasuk":
      return tambahSuratMasuk(req.data);

    case "login":
      return login(req);

    case "uploadFile":
      return uploadFileApi(req);

    default:
      return ContentService
      .createTextOutput(
        JSON.stringify({
          status:false,
          pesan:"Action tidak ditemukan."
        })
      )
      .setMimeType(ContentService.MimeType.JSON);

  }

}

function editDokumen(data){

    const sheet =
    getSheet(CONFIG.SHEET_INVENTARIS);

    const values =
    sheet.getDataRange().getValues();

    for(let i=1;i<values.length;i++){

    if(values[i][0]==data.id){

    sheet.getRange(i+1,2,1,10).setValues([[

    data.kategori,

    data.subkategori,

    data.jenis,

    data.judul,

    data.nomor || "",

    data.tahun || "",

    data.tentang || "",

    values[i][7],

    values[i][8],

    values[i][9]

    ]]);

return ContentService
.createTextOutput(
JSON.stringify({

status:true,

pesan:"Dokumen berhasil diperbarui."

})
)
.setMimeType(
ContentService.MimeType.JSON
);

}

}

return ContentService
.createTextOutput(
JSON.stringify({

status:false,

pesan:"Dokumen tidak ditemukan."

})
)
.setMimeType(
ContentService.MimeType.JSON
);

}

function hapusDokumen(id){

const sheet=
getSheet(CONFIG.SHEET_INVENTARIS);

const values=
sheet.getDataRange().getValues();

for(let i=1;i<values.length;i++){

if(values[i][0]==id){

const fileId=values[i][8];

try{

if(fileId){

DriveApp
.getFileById(fileId)
.setTrashed(true);

}

}catch(err){

Logger.log(err);

}

sheet.deleteRow(i+1);

return ContentService
.createTextOutput(
JSON.stringify({

status:true,

pesan:"Dokumen berhasil dihapus."

})
)
.setMimeType(
ContentService.MimeType.JSON
);

}

}

return ContentService
.createTextOutput(
JSON.stringify({

status:false,

pesan:"Dokumen tidak ditemukan."

})
)
.setMimeType(
ContentService.MimeType.JSON
);

}

/*==================================================
API INVENTARIS
==================================================*/

function apiInventaris(){

  const sheet = getSheet(CONFIG.SHEET_INVENTARIS);

  const values = sheet.getDataRange().getValues();

  const data = [];

  for(let i=1;i<values.length;i++){

    data.push({

      id: values[i][0],

      kategori: values[i][1],

      subkategori: values[i][2],

      jenis: values[i][3],

      judul: values[i][4],

      nomor: values[i][5],

      tahun: getTahunDokumen(
          values[i][4],
          values[i][6]
      ),

      tentang: values[i][7],

      folder: values[i][8],

      fileId: values[i][9],

      link: values[i][10],

      format: values[i][11],

      status: values[i][12],

      uploadOleh: values[i][13],

      tanggalUpload: values[i][14],

      terakhirUpdate: values[i][15]

  });

  }

  return ContentService

  .createTextOutput(

    JSON.stringify(data)

  )

  .setMimeType(ContentService.MimeType.JSON);

}

/*==================================================
API SURAT MASUK
==================================================*/

function apiSuratMasuk(){

const sheet=getSheet("Surat_Masuk");

const values=sheet.getDataRange().getValues();

const data=[];

for(let i=1;i<values.length;i++){

data.push({

id:values[i][0],

nomor:values[i][1],

asal:values[i][2],

tanggal:values[i][3],

perihal:values[i][4],

fileId:values[i][5],

link:values[i][6]

});

}

return ContentService
.createTextOutput(JSON.stringify(data))
.setMimeType(ContentService.MimeType.JSON);

}

/*==================================================
API SURAT KELUAR
==================================================*/

function apiSuratKeluar(){

const sheet=getSheet("Surat_Keluar");

const values=sheet.getDataRange().getValues();

const data=[];

for(let i=1;i<values.length;i++){

data.push({

id:values[i][0],

nomor:values[i][1],

tujuan:values[i][2],

tanggal:values[i][3],

perihal:values[i][4],

fileId:values[i][5],

link:values[i][6]

});

}

return ContentService
.createTextOutput(JSON.stringify(data))
.setMimeType(ContentService.MimeType.JSON);

}

function getTahunDokumen(judul,tahunSheet){

// jika kolom Tahun sudah diisi,
// gunakan nilai tersebut

if(tahunSheet!=""){
return tahunSheet;
}

// cari angka 4 digit
// antara 1900-2099

const hasil =
String(judul).match(/\b(19|20)\d{2}\b/);

if(hasil){

return hasil[0];

}

return "-";

}

/*==================================================
TAMBAH DOKUMEN
==================================================*/

function tambahDokumen(data){

  try{

    const sheet = getSheet(CONFIG.SHEET_INVENTARIS);

    const id = Utilities.getUuid();

    let fileId = "";

    let format = "";

    let link = data.link || "";

    let folderPath = data.kategori || "";

    if(data.subkategori){

    folderPath += "/" + data.subkategori;

    }

    if(data.jenis){

    folderPath += "/" + data.jenis;

    }

    let tahun=data.tahun;

    if(!tahun){

    const hasil=

    String(data.judul)

    .match(/\b(19|20)\d{2}\b/);

    tahun=

    hasil

    ?

    hasil[0]

    :

    "";

    }

    /*=========================================
    UPLOAD DARI PORTAL
    =========================================*/

    if(data.base64){

      const hasil = uploadBase64ToDrive(

      data.base64,

      data.namaFile,

      data.mime,

      data.kategori,

      data.subkategori,

      data.jenis

    );

      fileId = hasil.id;
      link = hasil.url;
      format = hasil.mime;

    }

    /*=========================================
    LINK GOOGLE DRIVE
    =========================================*/

    else{

      fileId = ambilFileId(link);

      format = data.namaFile || data.judul;

      }

      sheet.appendRow([

      id,                         // A ID

      data.kategori,              // B Kategori

      data.subkategori,           // C Subkategori

      data.jenis || "",           // D Jenis

      data.judul,                 // E Judul

      data.nomor || "",           // F Nomor

      tahun,                      // G Tahun

      data.tentang || "",         // H Tentang

      folderPath,                     // I Folder

      fileId,                     // J File ID

      link,                       // K Link

      format,                     // L Format

      "Aktif",                    // M Status

      "System",                   // N Upload Oleh

      formatDate(new Date()),     // O Upload

      formatDate(new Date())      // P Update

      ]);

    simpanLog(
      "System",
      "TAMBAH DOKUMEN",
      data.judul
    );

    return ContentService
      .createTextOutput(JSON.stringify({

        status:true,

        pesan:"Dokumen berhasil disimpan."

      }))
      .setMimeType(ContentService.MimeType.JSON);

  }catch(err){

    Logger.log(err);

    return ContentService
      .createTextOutput(JSON.stringify({

        status:false,

        pesan:String(err)

      }))
      .setMimeType(ContentService.MimeType.JSON);

  }

}

/*==================================================
ISI KOLOM TAHUN OTOMATIS
==================================================*/

function isiTahunDokumen(){

  const sheet = getSheet(CONFIG.SHEET_INVENTARIS);

  const lastRow = sheet.getLastRow();

  if(lastRow < 2) return;

  const data = sheet.getRange(2,1,lastRow-1,13).getValues();

  for(let i=0;i<data.length;i++){

    const judul = String(data[i][3]);      // Kolom D
    const tahun = data[i][5];              // Kolom F

    // jika kolom Tahun sudah terisi, lewati
    if(tahun!="") continue;

    // cari angka tahun 1900-2099
    const hasil = judul.match(/\b(19|20)\d{2}\b/);

    if(hasil){

      sheet.getRange(i+2,6).setValue(hasil[0]);

    }

  }

}

/*==================================================
UPLOAD FILE
==================================================*/

function uploadFile(req){

  try{

    const base64 = req.data.split(",")[1];

    const bytes = Utilities.base64Decode(base64);

    const blob = Utilities.newBlob(

      bytes,

      req.mime,

      req.nama

    );

    const folder = DriveApp.getFolderById(

      CONFIG.ROOT_FOLDER_ID

    );

    const file = folder.createFile(blob);

    file.setSharing(

      DriveApp.Access.ANYONE_WITH_LINK,

      DriveApp.Permission.VIEW

    );

    return ContentService
    .createTextOutput(
      JSON.stringify({

        status:true,

        fileId:file.getId(),

        link:file.getUrl(),

        nama:file.getName()

      })
    )
    .setMimeType(ContentService.MimeType.JSON);

  }catch(err){

    return ContentService
    .createTextOutput(
      JSON.stringify({

        status:false,

        pesan:err.toString()

      })
    )
    .setMimeType(ContentService.MimeType.JSON);

  }

}

/*==================================================
UPLOAD FILE DARI BASE64
==================================================*/

function uploadBase64ToDrive(

base64,

namaFile,

mimeType,

kategori,

subkategori,

jenis

){

  if(!base64){

    throw new Error("Data Base64 kosong.");

  }

  const folder=getFolderByKategori(

  kategori,

  subkategori,

  jenis

);

Logger.log("Kategori : " + kategori);
Logger.log("Subkategori : " + subkategori);

if(folder){
  Logger.log("Folder ID : " + folder.getId());
  Logger.log("Folder Nama : " + folder.getName());
}else{
  Logger.log("Folder = NULL");
}

if(!folder){

  throw new Error(

    "Folder tujuan tidak ditemukan."

  );

}

  const bytes=Utilities.base64Decode(

    base64.split(",")[1]

  );

/*=========================================
VALIDASI MIME TYPE
=========================================*/

if(!mimeType){

    throw new Error(

        "Mime Type tidak ditemukan."

    );

}

  namaFile = getUniqueFileName(

  folder,

  namaFile

);

  const blob=Utilities.newBlob(

    bytes,

    mimeType,

    namaFile

  );

  Logger.log("Akan membuat file...");
  
  const file=folder.createFile(blob);

  return{

    id:file.getId(),

    url:file.getUrl(),

    mime:file.getMimeType(),

    nama:file.getName()

};

}

function deleteDokumen(data){

  const sheet = getSheet(CONFIG.SHEET_INVENTARIS);

  const values = sheet.getDataRange().getValues();

  for(let i=1;i<values.length;i++){

    if(values[i][0]==data.id){

      // hapus file Drive jika ada
      if(values[i][8]){

        try{

          DriveApp
          .getFileById(values[i][8])
          .setTrashed(true);

        }catch(err){}

      }

      // hapus baris spreadsheet
      sheet.deleteRow(i+1);

      return ContentService
      .createTextOutput(JSON.stringify({

        status:true,
        pesan:"Dokumen berhasil dihapus."

      }))
      .setMimeType(ContentService.MimeType.JSON);

    }

  }

  return ContentService
  .createTextOutput(JSON.stringify({

    status:false,
    pesan:"Dokumen tidak ditemukan."

  }))
  .setMimeType(ContentService.MimeType.JSON);

}