/*==================================================
DRIVE SERVICE
==================================================*/

function getRootFolder(){

  return DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);

}

/*==================================================
AMBIL FOLDER BERDASARKAN KATEGORI
==================================================*/

function getFolderByKategori(kategori, subkategori, jenis){

  const root=getRootFolder();

/*=========================
FOLDER LEVEL 1
=========================*/

const folderKategori=

cariFolder(

root,

kategori

);

if(!folderKategori){

return null;

}

/*=========================
JIKA TIDAK ADA SUBKATEGORI
=========================*/

if(!subkategori){

return folderKategori;

}

/*=========================
FOLDER LEVEL 2
=========================*/

const folderSub=

cariFolder(

folderKategori,

subkategori

);

if(!folderSub){

return folderKategori;

}

/*=========================
JIKA TIDAK ADA JENIS
=========================*/

if(!jenis){

return folderSub;

}

/*=========================
FOLDER LEVEL 3
=========================*/

const folderJenis=

cariFolder(

folderSub,

jenis

);

return folderJenis || folderSub;

}

function cariFolder(parent,nama){

const folders=

parent.getFolders();

while(folders.hasNext()){

const folder=

folders.next();

if(

cleanFolderName(

folder.getName()

)

===

cleanFolderName(

nama

)

){

return folder;

}

}

return null;

}

/*==================================================
CEK NAMA FILE DUPLIKAT
==================================================*/

function getUniqueFileName(folder,namaFile){

  if(!folder){

    return namaFile;

  }

  const titik = namaFile.lastIndexOf(".");

  let nama = namaFile;

  let ext = "";

  if(titik>-1){

    nama = namaFile.substring(0,titik);

    ext = namaFile.substring(titik);

  }

  let hasil = namaFile;

  let nomor = 1;

  while(folder.getFilesByName(hasil).hasNext()){

    hasil = `${nama} (${nomor})${ext}`;

    nomor++;

  }

  return hasil;

}

/*==================================================
AMBIL SEMUA FOLDER
==================================================*/

function getAllFolders(){

  const folders=[];

  const root=getRootFolder();

  readFolder(root,"",folders);

  return folders;

}

/*==================================================
REKURSIF MEMBACA FOLDER
==================================================*/

function readFolder(folder,path,folders){

  folders.push({

    id:folder.getId(),

    name:folder.getName(),

    path:path+folder.getName()

  });

  const subFolders=folder.getFolders();

  while(subFolders.hasNext()){

    const sub=subFolders.next();

    readFolder(

      sub,

      path+folder.getName()+"/",

      folders

    );

  }

}

/*==================================================
AMBIL SELURUH FILE
==================================================*/

function getAllFiles(){

  const files=[];

  const root=getRootFolder();

  readFiles(root,"",files);

  return files;

}

/*==================================================
REKURSIF MEMBACA FILE
==================================================*/

function readFiles(folder,path,files){

  // FILE PADA FOLDER SAAT INI

  const folderFiles=folder.getFiles();

  while(folderFiles.hasNext()){

    const file=folderFiles.next();

    files.push({

      id:file.getId(),

      name:file.getName(),

      url:file.getUrl(),

      mime:file.getMimeType(),

      size:file.getSize(),

      created:file.getDateCreated(),

      updated:file.getLastUpdated(),

      folder:folder.getName(),

      path:path+folder.getName()

    });

  }

  // SUBFOLDER

  const subFolders=folder.getFolders();

  while(subFolders.hasNext()){

    const sub=subFolders.next();

    readFiles(

      sub,

      path+folder.getName()+"/",

      files

    );

  }

}