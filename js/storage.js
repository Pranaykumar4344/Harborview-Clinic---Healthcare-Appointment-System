/* Local Storage database layer. Keys: hvc_users, hvc_session, hvc_doctors, hvc_appts. */

const get=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const put=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dayKey=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const next7Days=()=>Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i);return d});
const fmtDate=d=>d.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});

/* ---- Local Storage database ----
   hvc_users: accounts | hvc_session: logged-in user | hvc_doctors: doctor list | hvc_appts: appointments */
function seed(){
  if(!get('hvc_users',null)) put('hvc_users',[{id:'u0',name:'Clinic Admin',email:'admin@harborview.com',password:'admin123',role:'admin'}]);
  if(!get('hvc_doctors',null)) put('hvc_doctors',[
    {id:'d1',name:'Dr. Maria Alvarez',specialty:'Family Medicine',years:11,hours:[9,17]},
    {id:'d2',name:'Dr. Wei Chen',specialty:'Cardiology',years:15,hours:[10,16]},
    {id:'d3',name:'Dr. Ada Okafor',specialty:'Pediatrics',years:8,hours:[9,15]},
    {id:'d4',name:'Dr. Sam Patel',specialty:'Dermatology',years:6,hours:[11,18]},
    {id:'d5',name:'Dr. Lena Kowalski',specialty:'Family Medicine',years:19,hours:[8,14]}]);
  if(!get('hvc_appts',null)) put('hvc_appts',[]);
}
