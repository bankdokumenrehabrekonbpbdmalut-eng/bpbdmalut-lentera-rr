/*==================================================
ADMIN PANEL
LENTERA RR
==================================================*/

let adminInventaris = [];

let dataAdminAktif = [];

let currentPage = 1;

const perPage = 10;

/*==================================================
LOAD INVENTARIS
==================================================*/

async function loadAdminInventaris(){

    const tbody =
    document.getElementById("inventarisTable");

    if(!tbody) return;

    tbody.innerHTML=`

    <tr>

        <td colspan="6" class="text-center">

            Memuat data...

        </td>

    </tr>

    `;

    try{

        adminInventaris =
        await getInventaris();

        document
        .getElementById("kategori")
        .dispatchEvent(new Event("change"));

        dataAdminAktif =
        [...adminInventaris];

        document.getElementById(
        "totalDokumen"
        ).innerText =
        adminInventaris.length;

        isiFilterAdmin();

        renderAdminTable();

        loadDashboard();

    }catch(err){

        console.error(err);

        tbody.innerHTML=`

        <tr>

        <td colspan="6"
        class="text-danger text-center">

        Gagal mengambil data.

        </td>

        </tr>

        `;

    }

}

/*==================================================
ISI SUBKATEGORI OTOMATIS
==================================================*/

function isiSubkategori(){

const kategori =
document.getElementById("kategori").value;

const select =
document.getElementById("subkategori");

if(!select) return;

select.innerHTML = `
<option value="">
Pilih Subkategori
</option>
`;

const daftar = [

...new Set(

adminInventaris

.filter(d=>d.jenis===kategori)

.map(d=>d.kategori)

)

].sort();

daftar.forEach(item=>{

select.innerHTML +=

`<option value="${item}">
${item}
</option>`;

});

}

/*==================================================
RENDER TABEL
==================================================*/

function renderAdminTable(){

    const tbody =
    document.getElementById("inventarisTable");

    tbody.innerHTML="";

    const start =
    (currentPage-1)*perPage;

    const end =
    start+perPage;

    const data =
    dataAdminAktif.slice(start,end);

    data.forEach((item,index)=>{

        tbody.innerHTML += `

        <tr>

        <td>${start+index+1}</td>

        <td>${item.judul}</td>

        <td>${item.jenis}</td>

        <td>${item.kategori}</td>

        <td>${item.tahun||"-"}</td>

        <td>

        <div class="btn-group">

        <button
        class="btn btn-sm btn-outline-primary"
        onclick="previewDokumen('${item.fileId}')">

        <i class="bi bi-eye"></i>

        </button>

        <button
        class="btn btn-sm btn-outline-warning"
        onclick="editDokumen('${item.id}')">

        <i class="bi bi-pencil"></i>

        </button>

        <button
        class="btn btn-sm btn-outline-danger"
        onclick="hapusDokumen('${item.id}')">

        <i class="bi bi-trash"></i>

        </button>

        </div>

        </td>

        </tr>

        `;

    });

    updatePagination();

}

/*==================================================
PAGINATION
==================================================*/

function updatePagination(){

    const totalPage =
    Math.ceil(
    dataAdminAktif.length/perPage
    ) || 1;

    document.getElementById(
    "infoHalaman"
    ).innerText=

    `Halaman ${currentPage} dari ${totalPage}`;

    document.getElementById(
    "btnPrev"
    ).disabled =
    currentPage===1;

    document.getElementById(
    "btnNext"
    ).disabled =
    currentPage===totalPage;

}

document
.getElementById("btnPrev")
?.addEventListener("click",()=>{

    if(currentPage>1){

        currentPage--;

        renderAdminTable();

    }

});

document
.getElementById("btnNext")
?.addEventListener("click",()=>{

    const totalPage =
    Math.ceil(
    dataAdminAktif.length/perPage
    );

    if(currentPage<totalPage){

        currentPage++;

        renderAdminTable();

    }

});

/*==================================================
PREVIEW DOKUMEN
==================================================*/

function previewDokumen(fileId){

document.getElementById("previewFrame").src=
`https://drive.google.com/file/d/${fileId}/preview`;

new bootstrap.Modal(
document.getElementById("previewModal")
).show();

}

/*==================================================
EDIT DOKUMEN
==================================================*/

function editDokumen(id){

const item =
adminInventaris.find(d=>d.id===id);

if(!item){

alert("Dokumen tidak ditemukan.");

return;

}

document.getElementById("judul").value =
item.judul;

document.getElementById("kategori").value =
item.jenis;

document
.getElementById("kategori")
.dispatchEvent(new Event("change"));

requestAnimationFrame(()=>{

document.getElementById("subkategori").value =
item.kategori;

});

document.getElementById("tahun").value =
item.tahun;

document.getElementById("link").value =
item.link;

document
.getElementById("btnSimpanDokumen")
.dataset.mode="edit";

document
.getElementById("btnSimpanDokumen")
.dataset.id=id;

new bootstrap.Modal(
document.getElementById("modalDokumen")
).show();

}

/*==================================================
TAMBAH DOKUMEN
==================================================*/

document
.getElementById("btnTambahDokumen")
?.addEventListener("click",()=>{

document.getElementById("formDokumen").reset();

document
.getElementById("btnSimpanDokumen")
.dataset.mode="tambah";

document
.getElementById("btnSimpanDokumen")
.dataset.id="";

new bootstrap.Modal(
document.getElementById("modalDokumen")
).show();

});

/*==================================================
SIMPAN DOKUMEN
==================================================*/

document
.getElementById("btnSimpanDokumen")
?.addEventListener("click",simpanDokumen);

async function simpanDokumen(){

const mode =
document.getElementById("btnSimpanDokumen")
.dataset.mode;

const id =
document.getElementById("btnSimpanDokumen")
.dataset.id;

const data={

id:id,

kategori:
document.getElementById("kategori").value,

subkategori:
document.getElementById("subkategori").value,

judul:
document.getElementById("judul").value,

tahun:
document.getElementById("tahun").value,

link:
document.getElementById("link").value

};

try{

let hasil;

if(mode==="inventaris"){

hasil = await tambahDokumen(data);

}

else if(mode==="masuk"){

hasil = await tambahSuratMasuk(data);

}

else if(mode==="keluar"){

hasil = await tambahSuratKeluar(data);

}

alert(hasil.pesan);

bootstrap.Modal
.getInstance(
document.getElementById("modalDokumen")
).hide();

document.getElementById("formDokumen").reset();

loadAdminInventaris();

}catch(err){

console.error(err);

alert("Gagal menyimpan data.");

}

}

const mode =
document.getElementById("btnSimpanDokumen")
.dataset.mode || "inventaris";

/*==================================================
HAPUS DOKUMEN
==================================================*/

async function hapusDokumen(id){

if(!confirm("Yakin ingin menghapus dokumen ini?")){
return;
}

try{

const hasil = await deleteDokumen(id);

alert(hasil.pesan);

loadAdminInventaris();

}catch(err){

console.error(err);

alert("Gagal menghapus dokumen.");

}

}

/*==================================================
FILTER ADMIN
==================================================*/

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

return cocokJudul &&
cocokKategori &&
cocokTahun;

});

currentPage=1;

renderAdminTable();

}

/*==================================================
ISI FILTER
==================================================*/

function isiFilterAdmin(){

const kategori =
document.getElementById("adminKategori");

const tahun =
document.getElementById("adminTahun");

if(!kategori || !tahun) return;

kategori.innerHTML =
'<option value="Semua">Semua Kategori</option>';

tahun.innerHTML =
'<option value="Semua">Semua Tahun</option>';

const listKategori =
[...new Set(adminInventaris.map(i=>i.jenis))];

listKategori.sort().forEach(k=>{

kategori.innerHTML +=
`<option value="${k}">${k}</option>`;

});

const listTahun =
[...new Set(
adminInventaris
.map(i=>i.tahun)
.filter(Boolean)
)];

listTahun
.sort()
.reverse()
.forEach(t=>{

tahun.innerHTML +=
`<option value="${t}">${t}</option>`;

});

}

/*==================================================
EVENT
==================================================*/

document
.getElementById("adminCari")
?.addEventListener(
"keyup",
filterAdmin
);

document
.getElementById("adminKategori")
?.addEventListener(
"change",
filterAdmin
);

document
.getElementById("kategori")
?.addEventListener("change", isiSubkategori);

document
.getElementById("adminTahun")
?.addEventListener(
"change",
filterAdmin
);

document
.getElementById("btnResetFilter")
?.addEventListener(
"click",
()=>{

document.getElementById("adminCari").value="";

document.getElementById("adminKategori").value="Semua";

document.getElementById("adminTahun").value="Semua";

dataAdminAktif =
[...adminInventaris];

currentPage=1;

renderAdminTable();

}

);

/*==================================================
LOAD DASHBOARD
==================================================*/

async function loadDashboard(){

try{

const inventaris = await getInventaris();

const suratMasuk = await getSuratMasuk();

const suratKeluar = await getSuratKeluar();

document.getElementById("totalDokumen").innerText =
inventaris.length;

document.getElementById("totalMasuk").innerText =
suratMasuk.length;

document.getElementById("totalKeluar").innerText =
suratKeluar.length;

}catch(err){

console.error(err);

}

}

/*==================================================
SURAT MASUK
==================================================*/

console.log("Admin JS Loaded");

const btnMasuk =
document.getElementById("btnTambahMasuk");

console.log(btnMasuk);

btnMasuk?.addEventListener("click",()=>{

console.log("Klik Surat Masuk");

document.getElementById("modalTitle").innerText =
"Tambah Surat Masuk";

document.getElementById("formDokumen").reset();

document.getElementById("btnSimpanDokumen")
.dataset.mode="masuk";

new bootstrap.Modal(
document.getElementById("modalDokumen")
).show();

});

/*==================================================
SURAT KELUAR
==================================================*/

document
.getElementById("btnTambahKeluar")
?.addEventListener("click",()=>{

document.getElementById("modalTitle").innerText =
"Tambah Surat Keluar";

document.getElementById("formDokumen").reset();

document.getElementById("btnSimpanDokumen")
.dataset.mode="keluar";

new bootstrap.Modal(
document.getElementById("modalDokumen")
).show();

});