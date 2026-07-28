/*==================================================
LOGIN USER
==================================================*/

function login(req){

  const sheet = getSheet(CONFIG.SHEET_USER);

  const data = sheet.getDataRange().getValues();

  const username = req.username || req.parameter?.username || "";

  const password = req.password || req.parameter?.password || "";

  for(let i=1;i<data.length;i++){

    const row = data[i];

    if(
      row[0] == username &&
      row[1] == password &&
      row[4] == "Aktif"
    ){

  simpanLog(

  username,

  "LOGIN",

  "Berhasil Login"

);

      return ContentService
      .createTextOutput(
        JSON.stringify({

          success:true,

          nama:row[2],

          role:row[3]

        })
      )
      .setMimeType(ContentService.MimeType.JSON);

    }

  }

  return ContentService
  .createTextOutput(
    JSON.stringify({

      success:false,

      pesan:"Username atau Password salah."

    })
  )
  .setMimeType(ContentService.MimeType.JSON);

}