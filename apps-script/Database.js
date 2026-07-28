/*==================================================
DATABASE
==================================================*/

function clearInventaris(){

  const sheet=getSheet(CONFIG.SHEET_INVENTARIS);

  const last=sheet.getLastRow();

  if(last>1){

    sheet.getRange(2,1,last-1,15).clearContent();

  }

}

/*==================================================
SIMPAN INVENTARIS
==================================================*/

function saveInventaris(data){

  const sheet = getSheet(CONFIG.SHEET_INVENTARIS);

  clearInventaris();

  if(data.length===0){
    return;
  }

  const rows = data.map((item,index)=>{

    const meta = getMetadata(item.path);

    return [

    index + 1,                     // A ID

    meta.kategori || "",           // B Kategori

    meta.subkategori || "",        // C Subkategori

    meta.jenis || "",              // D Jenis

    item.name,                     // E Judul

    "",                            // F Nomor

    "",                            // G Tahun

    "",                            // H Tentang

    item.path,                     // I Folder

    item.id,                       // J File ID

    item.url,                      // K Link

    item.mime,                     // L Format

    "Aktif",                       // M Status

    "System",                      // N Upload Oleh

    formatDate(new Date()),        // O Tanggal Upload

    formatDate(item.updated)       // P Terakhir Update

];

});

  sheet
      .getRange(2,1,rows.length,rows[0].length)
      .setValues(rows);

}