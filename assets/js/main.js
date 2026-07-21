/*==================================================
LENTERA RR
MAIN JS
==================================================*/

"use strict";

/*==================================================
DOM READY
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

initNavbar();

initSmoothScroll();

initBackToTop();

initAnimation();

});

/*==================================================
NAVBAR
==================================================*/

function initNavbar(){

const navbar=document.querySelector(".navbar");

if(!navbar) return;

window.addEventListener("scroll",()=>{

if(window.scrollY>50){

navbar.classList.add("shadow");

}else{

navbar.classList.remove("shadow");

}

});

}

/*==================================================
SMOOTH SCROLL
==================================================*/

function initSmoothScroll(){

document.querySelectorAll('a[href^="#"]').forEach(link=>{

link.addEventListener("click",function(e){

const target=document.querySelector(

this.getAttribute("href")

);

if(target){

e.preventDefault();

target.scrollIntoView({

behavior:"smooth"

});

}

});

});

}

/*==================================================
BACK TO TOP
==================================================*/

function initBackToTop(){

const btn=document.createElement("button");

btn.id="backTop";

btn.className="btn btn-primary";

btn.innerHTML='<i class="bi bi-arrow-up"></i>';

btn.style.position="fixed";

btn.style.right="25px";

btn.style.bottom="25px";

btn.style.display="none";

btn.style.zIndex="999";

document.body.appendChild(btn);

window.addEventListener("scroll",()=>{

btn.style.display=

window.scrollY>300

?

"block"

:

"none";

});

btn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

}

/*==================================================
SCROLL ANIMATION
==================================================*/

function initAnimation(){

const items=document.querySelectorAll(

"section,.card"

);

const observer=new IntersectionObserver(

entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.animate(

[

{

opacity:0,

transform:"translateY(40px)"

},

{

opacity:1,

transform:"translateY(0)"

}

],

{

duration:700,

fill:"forwards"

}

);

}

});

},

{

threshold:.15

}

);

items.forEach(el=>observer.observe(el));

}

/*==================================================
HELPER
==================================================*/

function formatTanggal(tanggal){

if(!tanggal) return "-";

return new Date(tanggal)

.toLocaleDateString(

"id-ID",

{

day:"2-digit",

month:"long",

year:"numeric"

}

);

}

function loading(element){

element.innerHTML=`

<tr>

<td colspan="20"

class="text-center py-4">

<div

class="spinner-border text-primary">

</div>

</td>

</tr>

`;

}

function gagal(element){

element.innerHTML=`

<tr>

<td colspan="20"

class="text-danger text-center py-4">

Gagal memuat data

</td>

</tr>

`;

}