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

        console.log(
        "KATEGORI/FOLDER LEVEL 1:",
        [
            ...new Set(
                adminInventaris
                    .map(item =>
                        String(
                            item.jenis ??
                            item.kategori ??
                            ""
                        )
                    )
                    .filter(Boolean)
            )
        ].sort()
    );

        console.table(
        adminInventaris.map(item => ({
            judul: item.judul,
            jenis: item.jenis,
            kategori: item.kategori,
            subkategori: item.subkategori,
            tahun: item.tahun
        }))
    );

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

if(!fileId){

alert("File tidak ditemukan.");

return;

}

document
.getElementById("previewFrame").src=

`https://drive.google.com/file/d/${fileId}/preview`;

bootstrap.Modal
.getOrCreateInstance(

document.getElementById("previewModal")

).show();

}

/*==================================================
EDIT DOKUMEN
==================================================*/

function editDokumen(id){

const item =
adminInventaris.find(
d => String(d.id) === String(id)
);

console.log("ID diklik :", id);

console.log("Data ditemukan :", item);

if(!item){

alert("Dokumen tidak ditemukan.");

return;

}

document.getElementById("judul").value =
item.judul;

document.getElementById("nomor").value =
item.nomor || "";

document.getElementById("tentang").value =
item.tentang || "";

document.getElementById("kategori").value =
item.kategori;

document
.getElementById("kategori")
.dispatchEvent(new Event("change"));

requestAnimationFrame(()=>{

document.getElementById("subkategori").value =
item.subkategori || "";

document
.getElementById("subkategori")
.dispatchEvent(
new Event("change")
);

requestAnimationFrame(()=>{

document.getElementById("jenis").value =
item.jenis || "";

});

});

document.getElementById("tahun").value =
item.tahun || "";

document.getElementById("link").value =
item.link || "";

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

    document.getElementById("modalTitle").innerText =
    "Tambah Dokumen";

    document.getElementById("formDokumen").reset();

    const namaFile =
    document.getElementById("namaFile");

    if(namaFile){

    namaFile.innerHTML =
    "Belum ada file dipilih.";

    }

    document.getElementById("btnSimpanDokumen")
    .dataset.mode="inventaris";

    document.getElementById("btnSimpanDokumen")
    .dataset.id="";

});

/*==================================================
UBAH FILE MENJADI BASE64
==================================================*/

function fileToBase64(file){

return new Promise((resolve,reject)=>{

const reader=new FileReader();

reader.onload=()=>{

resolve(reader.result);

};

reader.onerror=reject;

reader.readAsDataURL(file);

});

}

/*==================================================
SIMPAN DOKUMEN
==================================================*/

document
.getElementById("btnSimpanDokumen")
?.addEventListener("click", simpanDokumen);

async function simpanDokumen(){

console.log("=== SIMPAN DOKUMEN ===");

    try{

        const btn =
        document.getElementById("btnSimpanDokumen");

        const mode = btn.dataset.mode;

        const id = btn.dataset.id || "";

        const file =
        document.getElementById("fileDokumen").files[0];

        const link =
        document.getElementById("link").value.trim();

        /*==========================
        VALIDASI
        ==========================*/

        if(!file && !link){

            alert(
            "Silakan upload dokumen atau masukkan Link Google Drive."
            );

            return;

        }

        let base64 = "";
        let namaFile = "";
        let mime = "";

        /*==========================
        FILE DARI KOMPUTER
        ==========================*/

        if(file){

            const MAX_SIZE =
            10 * 1024 * 1024;

            if(file.size > MAX_SIZE){

                alert(
                "Ukuran file maksimal 10 MB."
                );

                return;

            }

            base64 =
            await fileToBase64(file);

            namaFile =
            file.name;

            mime =
            file.type;

        }

        console.log({
        kategori: document.getElementById("kategori")?.value,
        subkategori: document.getElementById("subkategori")?.value,
        link: document.getElementById("link")?.value,
        file: document.getElementById("fileDokumen")?.files[0]
    });

        /*==========================
        DATA
        ==========================*/

        const jenisElement =
        document.getElementById("jenis");

        const data={

        id:id,

        kategori:
        document.getElementById("kategori").value,

        subkategori:
        document.getElementById("subkategori").value,

        jenis:
        document.getElementById("jenis").value,

        judul:
        document.getElementById("judul").value.trim(),

        nomor:
        document.getElementById("nomor").value.trim(),

        tentang:
        document.getElementById("tentang").value.trim(),

        tahun:
        document.getElementById("tahun").value,

        link:link,

        namaFile:namaFile,

        mime:mime,

        base64:base64

    };

        let hasil;

        if(mode==="edit"){

        hasil =
        await editDokumen(data);

    }else{

        console.log("DATA YANG DIKIRIM:");
        console.log(data);

        hasil =
        await tambahDokumen(data);

    }

        if(!hasil.status){

        alert(

        hasil.pesan ||

        "Gagal menyimpan dokumen."

    );

    return;

    }

        if(!hasil.status){

            alert(

            hasil.pesan ||

            "Gagal menyimpan dokumen."

            );

            return;

        }

        alert("Dokumen berhasil disimpan.");

        bootstrap.Modal
        .getInstance(
        document.getElementById("modalDokumen")
        )
        ?.hide();

        document
        .getElementById("formDokumen")
        ?.reset();

        await loadAdminInventaris();

        await loadDashboard();

        }catch(err){

        console.error(err);

        alert(err.message);

    }

}

/*==================================================
HAPUS DOKUMEN
==================================================*/

async function hapusDokumen(id){

if(!confirm("Yakin ingin menghapus dokumen ini?")){
return;
}

try{

const hasil=
await deleteDokumen(id);

if(!hasil.status){

alert(hasil.pesan);

return;

}

alert(hasil.pesan);

await loadAdminInventaris();

await loadDashboard();

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
kategori === "Semua" ||
(item.jenis || item.kategori) === kategori;

const cocokTahun =
tahun==="Semua" ||
String(item.tahun)===tahun;

return cocokJudul && cocokKategori && cocokTahun;

});

currentPage=1;

renderAdminTable();

}

/*==================================================
ISI FILTER ADMIN
KATEGORI MENGIKUTI FOLDER LEVEL 1 GOOGLE DRIVE
==================================================*/

function isiFilterAdmin(){

    const kategori =
        document.getElementById("adminKategori");

    const tahun =
        document.getElementById("adminTahun");

    if(!kategori || !tahun) return;

    /*==================================================
    KATEGORI
    ==================================================*/

    kategori.innerHTML =
        '<option value="Semua">Semua Kategori</option>';

    MASTER_KATEGORI.forEach(item => {

        kategori.innerHTML += `
            <option value="${item}">
                ${item}
            </option>
        `;

    });

    /*==================================================
    TAHUN
    ==================================================*/

    tahun.innerHTML =
        '<option value="Semua">Semua Tahun</option>';

    const listTahun = [

        ...new Set(

            adminInventaris
                .map(item => item.tahun)
                .filter(Boolean)

        )

    ];

    listTahun
        .sort()
        .reverse()
        .forEach(item => {

            tahun.innerHTML += `
                <option value="${item}">
                    ${item}
                </option>
            `;

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
.addEventListener("change",function(){

const kategori=this.value;

const select=
document.getElementById("subkategori");

select.innerHTML="";

(subkategoriData[kategori]||[])
.forEach(item=>{

select.innerHTML+=`

<option value="${item}">

${item}

</option>

`;

});

const jenisContainer =
document.getElementById("jenisContainer");

const jenis =
document.getElementById("jenis");

if(jenisContainer){

    jenisContainer.style.display = "none";

}

if(jenis){

    jenis.innerHTML =
    '<option value="">Pilih Jenis</option>';

}

});

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
MODAL SURAT MASUK
==================================================*/

document
.querySelectorAll("#btnTambahMasuk")
.forEach(btn=>{

btn.addEventListener("click",()=>{

const form =
document.getElementById("formSuratMasuk");

if(form){

form.reset();

}

bootstrap.Modal
.getOrCreateInstance(

document.getElementById("modalSuratMasuk")

).show();

});

});

/*==================================================
MODAL SURAT KELUAR
==================================================*/

document
.querySelectorAll("#btnTambahKeluar")
.forEach(btn=>{

btn.addEventListener("click",()=>{

const form =
document.getElementById("formSuratKeluar");

if(form){

form.reset();

}

bootstrap.Modal
.getOrCreateInstance(

document.getElementById("modalSuratKeluar")

).show();

});

});

/*==================================================
LOAD SURAT MASUK
==================================================*/

async function loadAdminSuratMasuk(){

    const tbody=document.getElementById("suratMasukTable");

    if(!tbody) return;

    try{

        const data=await getSuratMasuk();

        if(data.length===0){

            tbody.innerHTML=`
            <tr>
                <td colspan="5" class="text-center">
                    Belum ada data.
                </td>
            </tr>`;
            return;
        }

        tbody.innerHTML="";

        data.forEach((item,index)=>{

            tbody.innerHTML+=`
            <tr>

                <td>${index+1}</td>

                <td>${item.nomor||"-"}</td>

                <td>${item.asal||"-"}</td>

                <td>${item.tanggal||"-"}</td>

                <td>

                    <button
                        class="btn btn-sm btn-outline-primary"
                        onclick="previewDokumen('${item.fileId}')">

                        <i class="bi bi-eye"></i>

                    </button>

                </td>

            </tr>
            `;

        });

    }catch(err){

        console.error(err);

    }

}

/*==================================================
LOAD SURAT KELUAR
==================================================*/

async function loadAdminSuratKeluar(){

    const tbody=document.getElementById("suratKeluarTable");

    if(!tbody) return;

    try{

        const data=await getSuratKeluar();

        if(data.length===0){

            tbody.innerHTML=`
            <tr>
                <td colspan="5" class="text-center">
                    Belum ada data.
                </td>
            </tr>`;
            return;
        }

        tbody.innerHTML="";

        data.forEach((item,index)=>{

            tbody.innerHTML+=`
            <tr>

                <td>${index+1}</td>

                <td>${item.nomor||"-"}</td>

                <td>${item.tujuan||"-"}</td>

                <td>${item.tanggal||"-"}</td>

                <td>

                    <button
                        class="btn btn-sm btn-outline-primary"
                        onclick="previewDokumen('${item.fileId}')">

                        <i class="bi bi-eye"></i>

                    </button>

                </td>

            </tr>
            `;

        });

    }catch(err){

        console.error(err);

    }

}