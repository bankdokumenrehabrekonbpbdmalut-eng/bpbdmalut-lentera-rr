/*==================================================
LENTERA RR
QUICK SEARCH
==================================================*/

"use strict";

let semuaDokumen = [];

/*==================================================
INISIALISASI
==================================================*/

function initQuickSearch(data){

    semuaDokumen = data;

    isiQuickKategori(data);

    isiQuickTahun(data);

}

/*==================================================
KATEGORI
==================================================*/

function isiQuickKategori(data){

const select=document.getElementById("quickKategori");

if(!select) return;

const kategori=[

...new Set(

data.map(d=>d.kategori)

.filter(Boolean)

)

].sort();

select.innerHTML=`

<option value="">

Semua Kategori

</option>

`;

kategori.forEach(item=>{

select.innerHTML+=`

<option value="${item}">

${item}

</option>

`;

});

}

/*==================================================
TAHUN
==================================================*/

function isiQuickTahun(data){

const select=document.getElementById("quickTahun");

if(!select) return;

const tahun=[

...new Set(

data.map(d=>d.tahun)

.filter(Boolean)

)

]

.sort()

.reverse();

select.innerHTML=`

<option value="">

Semua Tahun

</option>

`;

tahun.forEach(item=>{

select.innerHTML+=`

<option value="${item}">

${item}

</option>

`;

});

}

/*==================================================
PENCARIAN
==================================================*/

function quickSearch(){

const keyword=document

.getElementById("quickKeyword")

.value

.toLowerCase();

const kategori=document

.getElementById("quickKategori")

.value;

const tahun=document

.getElementById("quickTahun")

.value;

const hasil=semuaDokumen.filter(item=>{

const cocokJudul=

(item.judul||"")

.toLowerCase()

.includes(keyword);

const cocokKategori=

!kategori ||

item.kategori===kategori;

const cocokTahun=

!tahun ||

item.tahun==tahun;

return(

cocokJudul &&

cocokKategori &&

cocokTahun

);

});

loadInventarisDashboard(hasil);

}

/*==================================================
RESET
==================================================*/

function resetQuickSearch(){

document

.getElementById("quickKeyword")

.value="";

document

.getElementById("quickKategori")

.value="";

document

.getElementById("quickTahun")

.value="";

loadInventarisDashboard(

semuaDokumen

);

}

/*==================================================
EVENT
==================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

document

.getElementById("quickKeyword")

?.addEventListener(

"keyup",

quickSearch

);

document

.getElementById("quickKategori")

?.addEventListener(

"change",

quickSearch

);

document

.getElementById("quickTahun")

?.addEventListener(

"change",

quickSearch

);

}
);