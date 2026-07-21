/*==================================================
DATABASE INVENTARIS
==================================================*/

let inventaris = [];

let dataAktif = [];

/*==================================================
LOAD INVENTARIS
==================================================*/

async function loadInventaris(){

const tbody=document.getElementById("inventarisTable");

if(!tbody) return;

tbody.innerHTML=`

<tr>

<td colspan="6" class="text-center">

Memuat data...

</td>

</tr>

`;

try{

    inventaris = await getInventaris();

    dataAktif = [...inventaris];

    isiKategori();

    renderInventaris();

    updateStatistik();

}catch(error){

    tbody.innerHTML = `
    <tr>
        <td colspan="6" class="text-danger text-center">
            Gagal mengambil data.
        </td>
    </tr>
    `;

    console.error(error);

}

}

/*==================================================
ISI FILTER KATEGORI
==================================================*/

function isiKategori(){

const select =
document.getElementById("filterKategori");

if(!select) return;

select.innerHTML = `
<option value="">
Semua Kategori
</option>
`;

const kategori = [
...new Set(
inventaris.map(d=>d.jenis)
)
].sort();

kategori.forEach(item=>{

select.innerHTML +=
`<option value="${item}">
${item}
</option>`;

});

}

document
.getElementById("filterKategori")
?.addEventListener("change",function(){

const nilai=this.value;

if(nilai===""){

dataAktif=[...inventaris];

}else{

dataAktif=
inventaris.filter(
d=>d.jenis===nilai
);

}

currentPage=1;

renderInventaris();

});

/*==================================================
PAGINATION
==================================================*/

let currentPage = 1;

const perPage = 10;

function renderInventaris(){

const tbody =
document.getElementById("inventarisTable");

tbody.innerHTML="";

const start =
(currentPage-1)*perPage;

const end =
start+perPage;

const data =
dataAktif.slice(start,end);

data.forEach((item,index)=>{

tbody.innerHTML+=`

<tr>

<td>${start+index+1}</td>

<td>${item.judul}</td>

<td>${item.jenis}</td>

<td>${item.kategori}</td>

<td>${item.tahun||"-"}</td>

<td>

<button
class="btn btn-sm btn-primary"
onclick="previewDokumen('${item.fileId}')">

<i class="bi bi-eye"></i>

</button>

</td>

</tr>

`;

});

updatePagination();

}

function updatePagination(){

const totalPage =
Math.ceil(dataAktif.length/perPage)||1;

document.getElementById("infoHalaman").innerText=

`Halaman ${currentPage} dari ${totalPage}`;

document.getElementById("btnPrev").disabled=
currentPage===1;

document.getElementById("btnNext").disabled=
currentPage===totalPage;

}

document.getElementById("btnPrev")
?.addEventListener("click",()=>{

if(currentPage>1){

currentPage--;

renderInventaris();

}

});

document.getElementById("btnNext")
?.addEventListener("click",()=>{

const totalPage=
Math.ceil(dataAktif.length/perPage);

if(currentPage<totalPage){

currentPage++;

renderInventaris();

}

});

document.getElementById("btnPrev")
?.addEventListener("click",()=>{

if(currentPage>1){

currentPage--;

renderInventaris();

}

});

document.getElementById("btnNext")
?.addEventListener("click",()=>{

const totalPage=
Math.ceil(dataAktif.length/perPage);

if(currentPage<totalPage){

currentPage++;

renderInventaris();

}

});

/*==================================================
SIMPAN DOKUMEN
==================================================*/

const btnSimpan = document.getElementById("simpanDokumen");

if(btnSimpan){

btnSimpan.addEventListener("click",simpanDokumen);

}

function simpanDokumen(){

const judul=document
.getElementById("judulDokumen")
.value.trim();

const kategori=document
.getElementById("kategoriDokumen")
.value;

const tahun=document
.getElementById("tahunDokumen")
.value;

if(judul===""){

alert("Judul dokumen harus diisi.");

return;

}

inventaris.push({

judul,

kategori,

tahun,

status:"Aktif"

});

renderAdminTable();

updateDashboard();

document
.getElementById("formDokumen")
.reset();

const modal=document.getElementById("dokumenModal");

bootstrap.Modal.getInstance(modal).hide();

}

/*==================================================
PREVIEW DOKUMEN
==================================================*/

function previewDokumen(fileId){

const iframe=document.getElementById("previewFrame");

iframe.src=

`https://drive.google.com/file/d/${fileId}/preview`;

const modal=

new bootstrap.Modal(

document.getElementById("previewModal")

);

modal.show();

}

function detailDokumenById(fileId){

    const item = inventaris.find(
        d => d.fileId === fileId
    );

    if(!item) return;

    document.getElementById("detailDokumenBody").innerHTML = `
        <!-- isi HTML detail yang sama seperti sekarang -->
    `;

    new bootstrap.Modal(
        document.getElementById("detailModal")
    ).show();

}

/*==================================================
STATISTIK DOKUMEN DINAMIS
==================================================*/

function updateStatistik(){

const container =
document.getElementById("statistikContainer");

if(!container) return;

container.innerHTML="";

const statistik={};

inventaris.forEach(item=>{

const jenis =
(item.jenis||"Lainnya").trim();

statistik[jenis] =
(statistik[jenis]||0)+1;

});

Object.keys(statistik)
.sort()
.forEach(jenis=>{

container.innerHTML += `

<div class="col-lg-3 col-md-4 col-sm-6">

<div class="card h-100 shadow-sm border-0">

<div class="card-body text-center">

const ikon = {

"Produk Hukum":"bi-bank2",

"Pedoman":"bi-journal-text",

"Perencanaan":"bi-diagram-3",

"Administrasi":"bi-folder2-open",

"Template":"bi-file-earmark-text",

"Media":"bi-images",

"Referensi Atau Bahan Bacaan":"bi-book"

};

const iconClass = ikon[jenis] || "bi-folder-fill";

<h5 class="mt-3">

${jenis}

</h5>

<h2 class="fw-bold text-primary">

${statistik[jenis]}

</h2>

<small class="text-muted">

Dokumen

</small>

</div>

</div>

</div>

`;

});

}