/*==================================================
LOG AKTIVITAS
==================================================*/

function simpanLog(user, aksi, keterangan){

  const sheet = getSheet(CONFIG.SHEET_LOG);

  sheet.appendRow([

    new Date(),

    user,

    aksi,

    keterangan

  ]);

}