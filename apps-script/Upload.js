/*==================================================
UPLOAD FILE PDF
==================================================*/

function uploadFile(data){

const folder =
DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID);

const bytes =
Utilities.base64Decode(data.base64);

const blob =
Utilities.newBlob(

bytes,

data.mime,

data.namaFile

);

const file =
folder.createFile(blob);

return ContentService

.createTextOutput(

JSON.stringify({

status:true,

fileId:file.getId(),

link:file.getUrl()

})

)

.setMimeType(ContentService.MimeType.JSON);

}