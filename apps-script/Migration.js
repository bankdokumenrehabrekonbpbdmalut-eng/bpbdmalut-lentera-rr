/*==================================================
MIGRASI INVENTARIS LAMA
==================================================*/

function migrasiInventaris(){

  const sheet =
  getSheet(CONFIG.SHEET_INVENTARIS);

  const lastRow =
  sheet.getLastRow();

  if(lastRow<=1){

    Logger.log("Tidak ada data.");

    return;

  }

  const data =
  sheet.getRange(
      2,
      1,
      lastRow-1,
      16
  ).getValues();

  Logger.log(

    "Jumlah data : "+data.length

  );

}