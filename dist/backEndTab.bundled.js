document.addEventListener("DOMContentLoaded",()=>{const a=document.querySelector(".tabs");a&&a.addEventListener("click",n=>{const{target:t}=n;if(t.matches(".tab-links a")){n.preventDefault();const l=t.getAttribute("href");document.querySelectorAll(".tabs .tab").forEach(e=>{const s=document.querySelector(`#${e.id}`);s.style.display="none"});const c=document.querySelector(l);c&&(c.style.display="block"),document.querySelectorAll(".tabs .tab-links a").forEach(e=>e.parentElement.classList.remove("active")),t.parentElement.classList.add("active")}})});