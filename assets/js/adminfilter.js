/*==================================================
FILTER ADMIN INVENTARIS
==================================================*/

let dataAdminAktif = [];

function filterAdmin(){

const keyword =
document.getElementById("adminCari")
.value
.toLowerCase();

const kategori =
document.getElementById("adminKategori")
.value;

const tahun =
document.getElementById("adminTahun")
.value;

dataAdminAktif =
adminInventaris.filter(item=>{

const cocokJudul =
(item.judul||"")
.toLowerCase()
.includes(keyword);

const cocokKategori =
kategori==="Semua" ||
item.jenis===kategori;

const cocokTahun =
tahun==="Semua" ||
String(item.tahun)===tahun;

return cocokJudul
&& cocokKategori
&& cocokTahun;

});

currentPage=1;

renderAdminTable();

}

function isiFilterAdmin(){

const kategoriSelect =
document.getElementById("adminKategori");

const tahunSelect =
document.getElementById("adminTahun");

kategoriSelect.innerHTML=
'<option value="Semua">Semua Kategori</option>';

tahunSelect.innerHTML=
'<option value="Semua">Semua Tahun</option>';

const kategori=[
...new Set(
adminInventaris.map(i=>i.jenis)
)];

kategori.forEach(k=>{

kategoriSelect.innerHTML+=
`<option>${k}</option>`;

});

const tahun=[
...new Set(
adminInventaris
.map(i=>i.tahun)
.filter(Boolean)
)]
.sort()
.reverse();

tahun.forEach(t=>{

tahunSelect.innerHTML+=
`<option>${t}</option>`;

});

dataAdminAktif=adminInventaris;

}

document.addEventListener("DOMContentLoaded",()=>{

document
.getElementById("adminCari")
?.addEventListener("keyup",filterAdmin);

document
.getElementById("adminKategori")
?.addEventListener("change",filterAdmin);

document
.getElementById("adminTahun")
?.addEventListener("change",filterAdmin);

document
.getElementById("btnResetFilter")
?.addEventListener("click",()=>{

document.getElementById("adminCari").value="";

document.getElementById("adminKategori").value="Semua";

document.getElementById("adminTahun").value="Semua";

dataAdminAktif=adminInventaris;

currentPage=1;

renderAdminTable();

});

});