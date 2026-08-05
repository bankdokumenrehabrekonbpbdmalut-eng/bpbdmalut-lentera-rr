/*==================================================
LENTERA RR
STATISTIK DOKUMEN
==================================================*/

"use strict";


/*==================================================
LOAD STATISTIK
==================================================*/

async function loadStatistikDokumen(){

    try{

        const data = await getInventaris();

        if(!Array.isArray(data)){

            console.error(
                "Data inventaris bukan array:",
                data
            );

            return;

        }


        /*==========================================
        HITUNG STATISTIK
        ==========================================*/

        let produkHukum = 0;
        let pedoman = 0;
        let jitupasna = 0;
        let r3p = 0;
        let administrasi = 0;
        let template = 0;


        data.forEach(item => {

            const kategori =
                String(item.kategori || "")
                .trim()
                .toLowerCase();

            const subkategori =
                String(item.subkategori || "")
                .trim()
                .toLowerCase();

            const jenis =
                String(item.jenis || "")
                .trim()
                .toLowerCase();


            /*======================================
            PRODUK HUKUM
            ======================================*/

            if(
                kategori === "produk hukum"
            ){

                produkHukum++;

            }


            /*======================================
            PEDOMAN
            ======================================*/

            if(
                kategori === "pedoman" ||
                kategori === "pedoman rr" ||
                subkategori === "pedoman" ||
                subkategori === "pedoman rr"
            ){

                pedoman++;

            }


            /*======================================
            JITUPASNA
            ======================================*/

            if(

                kategori.includes("jitupasna") ||

                subkategori.includes("jitupasna") ||

                jenis.includes("jitupasna")

            ){

                jitupasna++;

            }


            /*======================================
            R3P
            ======================================*/

            if(

                kategori === "r3p" ||

                subkategori === "r3p" ||

                jenis === "r3p" ||

                kategori.includes("r3p") ||

                subkategori.includes("r3p") ||

                jenis.includes("r3p")

            ){

                r3p++;

            }


            /*======================================
            ADMINISTRASI
            ======================================*/

            if(
                kategori === "administrasi"
            ){

                administrasi++;

            }


            /*======================================
            TEMPLATE
            ======================================*/

            if(
                kategori === "template" ||
                kategori === "template dokumen"
            ){

                template++;

            }

        });


        /*==========================================
        TAMPILKAN STATISTIK
        ==========================================*/

        setStatistik(
            "statProdukHukum",
            produkHukum
        );

        setStatistik(
            "statPedoman",
            pedoman
        );

        setStatistik(
            "statJitupasna",
            jitupasna
        );

        setStatistik(
            "statR3P",
            r3p
        );

        setStatistik(
            "statAdministrasi",
            administrasi
        );

        setStatistik(
            "statTemplate",
            template
        );


        console.log(
            "STATISTIK DOKUMEN:",
            {
                produkHukum,
                pedoman,
                jitupasna,
                r3p,
                administrasi,
                template
            }
        );

    }
    catch(error){

        console.error(
            "GAGAL MEMUAT STATISTIK:",
            error
        );

    }

}


/*==================================================
ISI ANGKA STATISTIK
==================================================*/

function setStatistik(id, jumlah){

    const element =
        document.getElementById(id);

    if(!element){

        return;

    }

    element.textContent = jumlah;

}


/*==================================================
JALANKAN SAAT HALAMAN SELESAI DIMUAT
==================================================*/

document.addEventListener(
    "DOMContentLoaded",
    function(){

        loadStatistikDokumen();

    }
);