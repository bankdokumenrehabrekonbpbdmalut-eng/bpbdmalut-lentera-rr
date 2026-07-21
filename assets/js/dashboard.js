/*==================================================
LENTERA RR
DASHBOARD
==================================================*/

"use strict";

/*==================================================
LOAD DASHBOARD
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

loadDashboard();

});

/*==================================================
LOAD SEMUA DATA
==================================================*/

async function loadDashboard(){

try{

const data = await getInventaris();

loadInventarisDashboard(data);

loadStatistik(data);

isiQuickSearch(data);

}catch(error){

console.error(error);

}

}

/*==================================================
10 DOKUMEN TERBARU
==================================================*/

function loadInventarisDashboard(data){

const tbody = document.getElementById("inventarisDashboard");

if(!tbody) return;

tbody.innerHTML="";

data.slice(0,10).forEach((item,index)=>{

tbody.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${item.judul}</td>

<td>${item.kategori}</td>

<td>${item.jenis || "-"}</td>

<td>${item.tahun || "-"}</td>

<td>

<button
class="btn btn-sm btn-outline-primary"
onclick="previewDokumen('${item.fileId}')">

<i class="bi bi-eye"></i>

</button>

<button
class="btn btn-sm btn-outline-success"
onclick="window.open('${item.link}','_blank')">

<i class="bi bi-download"></i>

</button>

<button
class="btn btn-sm btn-outline-secondary"
onclick="detailDokumenById('${item.fileId}')">

<i class="bi bi-info-circle"></i>

</button>

</td>

</tr>

`;

});

}

/*==================================================
STATISTIK
==================================================*/

function loadStatistik(data){

const statistik = {};

data.forEach(item=>{

const key = item.kategori || "Lainnya";

statistik[key] = (statistik[key] || 0) + 1;

});

setStat("statProdukHukum",statistik["Produk Hukum"]);
setStat("statPedoman",statistik["Pedoman"]);
setStat("statJitupasna",statistik["JITUPASNA"]);
setStat("statR3P",statistik["R3P"]);
setStat("statAdministrasi",statistik["Administrasi"]);
setStat("statTemplate",statistik["Template"]);

}

function setStat(id,nilai){

const el=document.getElementById(id);

if(el){

el.textContent = nilai || 0;

}

}

/*==================================================
ISI FILTER QUICK SEARCH
==================================================*/

function isiQuickSearch(data){

const kategori = document.getElementById("quickKategori");
const tahun = document.getElementById("quickTahun");

if(kategori){

const daftarKategori = [...new Set(data.map(d=>d.kategori).filter(Boolean))];

daftarKategori.sort();

kategori.innerHTML = `<option value="">Semua Kategori</option>`;

daftarKategori.forEach(k=>{

kategori.innerHTML += `<option value="${k}">${k}</option>`;

});

}

if(tahun){

const daftarTahun = [...new Set(data.map(d=>d.tahun).filter(Boolean))];

daftarTahun.sort().reverse();

tahun.innerHTML = `<option value="">Semua Tahun</option>`;

daftarTahun.forEach(t=>{

tahun.innerHTML += `<option value="${t}">${t}</option>`;

});

}

}