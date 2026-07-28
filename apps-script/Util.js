/*==================================================
UTIL
==================================================*/

function getSpreadsheet(){

  return SpreadsheetApp.getActiveSpreadsheet();

}

function getSheet(name){

  return getSpreadsheet().getSheetByName(name);

}

function formatDate(date){

  return Utilities.formatDate(

    date,

    Session.getScriptTimeZone(),

    "dd/MM/yyyy HH:mm"

  );

}

/*==================================================
AMBIL METADATA FOLDER
==================================================*/

function getMetadata(path){

  const parts = path.split("/");

  let kategori = "";

  let subkategori = "";

  let jenis = "";

  if(parts.length >= 2){

    kategori = cleanFolderName(parts[1]);

  }

  if(parts.length >= 3){

    subkategori = cleanFolderName(parts[2]);

  }

  if(parts.length >= 4){

    jenis = cleanFolderName(parts[3]);

  }

  return{

    kategori,

    subkategori,

    jenis

  };

}

/*==================================================
BERSIHKAN NAMA FOLDER
==================================================*/

function cleanFolderName(text){

  if(!text) return "";

  return text

  .replace(/^\d+\.\s*/,"")

  .trim();

}