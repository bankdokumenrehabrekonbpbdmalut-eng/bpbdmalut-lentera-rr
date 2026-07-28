/*==================================================
CONFIG LENTERA RR
==================================================*/

const CONFIG = {

  // ID Folder Utama Google Drive
  ROOT_FOLDER_ID : "1imqZp3pjS2Anfn9po3-MVa5KLDGXDNre",

  // Nama Sheet
  SHEET_INVENTARIS : "Inventaris_Dokumen",

  SHEET_SURAT_MASUK : "Surat_Masuk",

  SHEET_SURAT_KELUAR : "Surat_Keluar",

  SHEET_MEDIA : "Media",

  SHEET_REFERENSI : "Referensi",

  SHEET_LOG : "Log_Aktivitas",

  SHEET_USER : "User"

};

function testFiles(){

  const files=getAllFiles();

  Logger.log(files);

}