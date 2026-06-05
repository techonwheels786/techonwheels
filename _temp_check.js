
// Cursor
const cur=document.getElementById("cursor"),ring=document.getElementById("cursorRing");
let mx=0,my=0,rx=0,ry=0;
document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;});
(function tick(){cur.style.left=mx+"px";cur.style.top=my+"px";rx+=(mx-rx)*.14;ry+=(my-ry)*.14;ring.style.left=rx+"px";ring.style.top=ry+"px";requestAnimationFrame(tick);})();
document.querySelectorAll("a,button,.brand-btn,.issue-btn,.loc-btn,.svc-card,.why-card,.review-card").forEach(el=>{
  el.addEventListener("mouseenter",()=>{cur.style.width="18px";cur.style.height="18px";ring.style.width="46px";ring.style.height="46px";});
  el.addEventListener("mouseleave",()=>{cur.style.width="12px";cur.style.height="12px";ring.style.width="36px";ring.style.height="36px";});
});

// Smooth scroll
document.querySelectorAll("a[href^=\"#\"]").forEach(a=>{a.addEventListener("click",e=>{const t=document.querySelector(a.getAttribute("href"));if(t){e.preventDefault();closeMobile();t.scrollIntoView({behavior:"smooth"});}});});

// Mobile menu
function toggleMobile(){document.getElementById("mobileMenu").classList.toggle("open");document.getElementById("hamburger").classList.toggle("open");}
function closeMobile(){document.getElementById("mobileMenu").classList.remove("open");document.getElementById("hamburger").classList.remove("open");}

// Sticky bar
const sBar=document.getElementById("sBar");
new IntersectionObserver(entries=>{sBar.style.opacity=entries[0].isIntersecting?"0":"1";sBar.style.transform=entries[0].isIntersecting?"translateY(20px)":"translateY(0)";sBar.style.pointerEvents=entries[0].isIntersecting?"none":"auto";},{threshold:.1}).observe(document.querySelector("footer"));

// FAQ
function toggleFaq(el){const item=el.parentElement;document.querySelectorAll(".faq-item.open").forEach(i=>{if(i!==item)i.classList.remove("open");});item.classList.toggle("open");}

// Form state
let selBrand="",selModel="",selIssues=[],selLoc="Home",curStep=1;
// ── SEARCHABLE DROPDOWN ENGINE ──────────────────────────────────────────
const modelData={
  Apple:["iPhone 6","iPhone 6 Plus","iPhone 6s","iPhone 6s Plus","iPhone SE (1st Gen)","iPhone 7","iPhone 7 Plus","iPhone 8","iPhone 8 Plus","iPhone X","iPhone XR","iPhone XS","iPhone XS Max","iPhone SE (2nd Gen)","iPhone 11","iPhone 11 Pro","iPhone 11 Pro Max","iPhone 12 Mini","iPhone 12","iPhone 12 Pro","iPhone 12 Pro Max","iPhone 13 Mini","iPhone 13","iPhone 13 Pro","iPhone 13 Pro Max","iPhone SE (3rd Gen)","iPhone 14","iPhone 14 Plus","iPhone 14 Pro","iPhone 14 Pro Max","iPhone 15","iPhone 15 Plus","iPhone 15 Pro","iPhone 15 Pro Max","iPhone 16","iPhone 16 Plus","iPhone 16 Pro","iPhone 16 Pro Max","iPhone 17","iPhone 17 Plus","iPhone 17 Pro","iPhone 17 Pro Max","Other / Not Sure"],
  Samsung:["Galaxy S8","Galaxy S8+","Galaxy S9","Galaxy S9+","Galaxy S10e","Galaxy S10","Galaxy S10+","Galaxy S20","Galaxy S20+","Galaxy S20 Ultra","Galaxy S21","Galaxy S21+","Galaxy S21 Ultra","Galaxy S22","Galaxy S22+","Galaxy S22 Ultra","Galaxy S23","Galaxy S23+","Galaxy S23 Ultra","Galaxy S24","Galaxy S24+","Galaxy S24 Ultra","Galaxy S25","Galaxy S25+","Galaxy S25 Ultra","Galaxy S26","Galaxy S26+","Galaxy S26 Ultra","Galaxy Note 8","Galaxy Note 9","Galaxy Note 10","Galaxy Note 10+","Galaxy Note 20","Galaxy Note 20 Ultra","Galaxy Z Fold 2","Galaxy Z Fold 3","Galaxy Z Fold 4","Galaxy Z Fold 5","Galaxy Z Fold 6","Galaxy Z Flip","Galaxy Z Flip 3","Galaxy Z Flip 4","Galaxy Z Flip 5","Galaxy Z Flip 6","Galaxy A10","Galaxy A11","Galaxy A12","Galaxy A13","Galaxy A14","Galaxy A15","Galaxy A20","Galaxy A21","Galaxy A22","Galaxy A23","Galaxy A24","Galaxy A25","Galaxy A30","Galaxy A31","Galaxy A32","Galaxy A33","Galaxy A34","Galaxy A35","Galaxy A50","Galaxy A51","Galaxy A52","Galaxy A53","Galaxy A54","Galaxy A55","Galaxy A70","Galaxy A71","Galaxy A72","Galaxy A73","Other / Not Sure"],
  Google:["Pixel 3","Pixel 3 XL","Pixel 3a","Pixel 4","Pixel 4 XL","Pixel 4a","Pixel 5","Pixel 5a","Pixel 6","Pixel 6 Pro","Pixel 6a","Pixel 7","Pixel 7 Pro","Pixel 7a","Pixel 8","Pixel 8 Pro","Pixel 8a","Pixel 9","Pixel 9 Pro","Pixel 9 Pro XL","Other / Not Sure"],
  Motorola:["Moto G Power (2020)","Moto G Power (2021)","Moto G Power (2022)","Moto G Power (2023)","Moto G Play","Moto G Stylus","Moto G Stylus 5G","Moto G Pure","Moto G Fast","Moto G 5G","Moto G 5G Plus","Moto E (2020)","Moto E7","Moto Edge","Moto Edge+","Moto Edge 20","Moto Edge 30","Moto Edge 40","Moto Razr (2020)","Moto Razr 5G","Moto Razr+","Other / Not Sure"],
  OnePlus:["OnePlus 6","OnePlus 6T","OnePlus 7","OnePlus 7 Pro","OnePlus 7T","OnePlus 7T Pro","OnePlus 8","OnePlus 8 Pro","OnePlus 8T","OnePlus 9","OnePlus 9 Pro","OnePlus 9R","OnePlus 10 Pro","OnePlus 10T","OnePlus 11","OnePlus 12","OnePlus Nord","OnePlus Nord N10","OnePlus Nord N200","OnePlus Nord CE","Other / Not Sure"],
  LG:["LG V30","LG V35","LG V40","LG V50","LG V60","LG G7","LG G8","LG G8X","LG Stylo 5","LG Stylo 6","LG Stylo 7","LG Velvet","LG Wing","LG K51","LG K92","Other / Not Sure"],
  iPad:["iPad (6th Gen)","iPad (7th Gen)","iPad (8th Gen)","iPad (9th Gen)","iPad (10th Gen)","iPad Mini 4","iPad Mini 5","iPad Mini 6","iPad Air 3","iPad Air 4","iPad Air 5","iPad Pro 9.7\"","iPad Pro 10.5\"","iPad Pro 11\" (1st Gen)","iPad Pro 11\" (2nd Gen)","iPad Pro 11\" (3rd Gen)","iPad Pro 11\" (4th Gen)","iPad Pro 12.9\" (various)","Other / Not Sure"],
  Laptop:["MacBook Air","MacBook Pro 13\"","MacBook Pro 14\"","MacBook Pro 16\"","Dell XPS","Dell Inspiron","HP Pavilion","HP Spectre","HP Envy","Lenovo ThinkPad","Lenovo IdeaPad","Asus ZenBook","Asus VivoBook","Acer Aspire","Acer Predator","Microsoft Surface","Chromebook","Other / Not Sure"],
  Other:["Other / Not Sure"]
};
let _sdbOpen=null;
function toggleSDB(id){if(_sdbOpen&&_sdbOpen!==id){closeSDB(_sdbOpen);}const p=document.getElementById(id+'_panel');if(p.classList.contains('open')){closeSDB(id);}else{openSDB(id);}}
function openSDB(id){const p=document.getElementById(id+'_panel'),t=document.getElementById(id+'_trigger'),s=document.getElementById(id+'_search');p.classList.add('open');t.classList.add('open');_sdbOpen=id;if(s){s.value='';filterSDB(id,'');setTimeout(()=>s.focus(),120);}}
function closeSDB(id){const p=document.getElementById(id+'_panel'),t=document.getElementById(id+'_trigger');if(p)p.classList.remove('open');if(t)t.classList.remove('open');if(_sdbOpen===id)_sdbOpen=null;}
function filterSDB(id,q){const list=document.getElementById(id+'_list');const items=list.querySelectorAll('.sdb-item');const lq=q.toLowerCase().trim();let vis=0;items.forEach(el=>{const match=el.textContent.toLowerCase().includes(lq);el.classList.toggle('sdb-hidden',!match);if(match)vis++;});const emp=list.querySelector('.sdb-empty');if(emp)emp.style.display=vis===0?'block':'none';}
function selectSDB(id,val){const valEl=document.getElementById(id+'_val');valEl.textContent=val;valEl.classList.add('chosen');document.getElementById(id+'_list').querySelectorAll('.sdb-item').forEach(el=>el.classList.toggle('selected',el.dataset.value===val));closeSDB(id);if(id==='brandSDB'){selBrand=val;selModel='';document.getElementById('modelSDB_val').textContent='Select model…';document.getElementById('modelSDB_val').classList.remove('chosen');document.getElementById('modelSDB_list').querySelectorAll('.sdb-item').forEach(el=>el.classList.remove('selected'));populateModelSDB(val);document.getElementById('modelSDBWrap').style.display='block';}else if(id==='modelSDB'){selModel=val;}}
function populateModelSDB(brand){const list=document.getElementById('modelSDB_list');const models=modelData[brand]||['Other / Not Sure'];list.innerHTML=models.map(m=>`<div class="sdb-item" data-value="${m.replace(/"/g,'&quot;')}" onclick="selectSDB('modelSDB',this.dataset.value)">${m}</div>`).join('')+'<div class="sdb-empty" style="display:none">No matches found</div>';}
// Close SDB on outside click
document.addEventListener('click',e=>{if(_sdbOpen&&!e.target.closest('.sdb-wrap'))closeSDB(_sdbOpen);});
function pickIssue(el){el.classList.toggle("selected");const lb=el.querySelector(".ilabel").textContent;if(el.classList.contains("selected")){if(!selIssues.includes(lb))selIssues.push(lb);}else{selIssues=selIssues.filter(i=>i!==lb);}}
function pickLoc(el,t){document.querySelectorAll(".loc-btn").forEach(x=>x.classList.remove("selected"));el.classList.add("selected");selLoc=t;}
function useGPS(){if(!navigator.geolocation){alert("Geolocation not supported.");return;}navigator.geolocation.getCurrentPosition(p=>{const lat=p.coords.latitude.toFixed(5),lng=p.coords.longitude.toFixed(5);document.getElementById("locAddr").value=lat+", "+lng+" (GPS)";const c=document.getElementById("locOK");c.style.display="block";c.textContent="GPS captured: "+lat+" / "+lng;},()=>alert("Could not get location. Please enter your address manually."));}
function prevUp(inp,id){const w=document.getElementById(id);w.innerHTML="";Array.from(inp.files).forEach(f=>{const r=new FileReader();r.onload=e=>{const img=document.createElement("img");img.src=e.target.result;img.className="upload-thumb";w.appendChild(img);};r.readAsDataURL(f);});}
function goStep(s){curStep=s;document.querySelectorAll(".form-panel").forEach((p,i)=>p.classList.toggle("active",i+1===s));document.querySelectorAll(".form-step-btn").forEach((b,i)=>b.classList.toggle("active",i+1===s));document.getElementById("pFill").style.width=(s*25)+"%";if(s===4)buildSummary();document.getElementById("book").scrollIntoView({behavior:"smooth"});}
function buildSummary(){const b=selBrand||"Not selected";const m=selModel||"";const iss=selIssues.length?selIssues.join(", "):"Not specified";const addr=document.getElementById("locAddr").value||"Not entered";const t=document.getElementById("pTime").value||"Not specified";document.getElementById("summBox").innerHTML="<strong style=\"color:#0a0ef5;font-size:.76rem;letter-spacing:.1em;text-transform:uppercase\">&#128203; Booking Summary</strong><br>&#128241; Device: <strong>"+b+(m?" &#8212; "+m:"")+"</strong><br>&#128295; Issues: <strong>"+iss+"</strong><br>&#128205; Location: <strong>"+selLoc+" &#8212; "+addr+"</strong><br>&#128336; Time: <strong>"+t+"</strong>";}
function submitBook(){
  const n=document.getElementById("cName").value.trim();
  const p=document.getElementById("cPhone").value.trim();
  const h=document.getElementById("cHow").value;
  const em=document.getElementById("cEmail").value.trim();
  if(!n){alert("Please enter your name.");return;}
  if(!p){alert("Please enter your phone number.");return;}
  if(!h){alert("Please select how to reach you.");return;}
  const btn=document.querySelector(".btn-final");
  btn.textContent="Sending\u2026";btn.disabled=true;
  const payload={
    name:n, phone:p, email:em||"Not provided",
    contact_method:h,
    device_brand:selBrand||"Not specified",
    device_model:selModel||"Not specified",
    issues:selIssues.join(", ")||"Not specified",
    issue_description:document.getElementById("issDesc").value||"",
    location_type:selLoc,
    address:document.getElementById("locAddr").value||"Not provided",
    preferred_time:document.getElementById("pTime").value||"Flexible"
  };
  fetch("https://formspree.io/f/meewqgpa",{
    method:"POST",
    headers:{"Content-Type":"application/json","Accept":"application/json"},
    body:JSON.stringify(payload)
  })
  .then(r=>{
    if(!r.ok) throw new Error();
    return r.text();
  })
  .then(d=>{
    
      btn.style.display="none";
      document.getElementById("summBox").style.display="none";
      document.getElementById("bookDone").style.display="block";
      document.querySelectorAll(".form-step-btn").forEach(b=>b.style.pointerEvents="none");
  })
  .catch(()=>{
    btn.textContent="\uD83D\uDE80 Send My Repair Request!";
    btn.disabled=false;
    // Fallback: show success anyway so customer isn't stuck, log to console
    console.error("Form submission failed — check Formspree endpoint");
    alert("Hmm, something went wrong. Please call or text us directly: (574) 409-7243");
  });
}

// Intersection observer for scroll animations
const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity="1";e.target.style.transform="translateY(0)";}});},{threshold:.08});
document.querySelectorAll(".step-card,.svc-card,.why-card,.review-card,.area-chip,.faq-item").forEach(el=>{el.style.opacity="0";el.style.transform="translateY(20px)";el.style.transition="opacity .5s ease, transform .5s ease";observer.observe(el);});

