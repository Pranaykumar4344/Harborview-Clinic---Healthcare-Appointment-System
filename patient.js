/* Patient module: browse doctors, book, reschedule, cancel, My appointments. */

/* ---- Patient module ---- */
function renderFilters(){
  const specs=['All',...new Set(get('hvc_doctors',[]).map(d=>d.specialty))];
  const el=$('filters');
  el.innerHTML=specs.map(sp=>`<button class="chip ${sp===filter?'active':''}" data-spec="${esc(sp)}">${esc(sp)}</button>`).join('');
  el.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{filter=b.dataset.spec;renderFilters();renderDoctors(filter);});
}
function renderDoctors(f){
  const list=get('hvc_doctors',[]).filter(d=>!f||f==='All'||d.specialty===f);
  $('doctorGrid').innerHTML=list.length?list.map(d=>`
    <div class="dcard"><h3>${esc(d.name)}</h3><div class="spec">${esc(d.specialty)}</div>
      <div class="meta">${d.years} yrs experience · ${d.hours[0]}:00–${d.hours[1]}:00 daily</div>
      <button onclick="openBooking('${d.id}')">Book appointment</button></div>`).join(''):'<div class="empty">No doctors available.</div>';
}
function openBooking(id,edit){
  if(!session||session.role!=='user'){pendingBook=id;openAuth('login',true);authMsg('Log in or sign up as a patient to book.',true);return;}
  activeDoctor=get('hvc_doctors',[]).find(d=>d.id===id);editId=edit||null;activeDay=0;selectedSlot=null;
  $('sheetDoctorName').textContent=(editId?'Reschedule with ':'Book with ')+activeDoctor.name;
  $('sheetSpecialty').textContent=activeDoctor.specialty;
  $('pName').value=session.name;$('pEmail').value=session.email;
  $('sheetMsg').className='msg';
  $('dayTabs').innerHTML=next7Days().map((d,i)=>`<button class="daytab ${i===0?'active':''}" data-i="${i}">${fmtDate(d)}</button>`).join('');
  document.querySelectorAll('.daytab').forEach(t=>t.onclick=()=>{
    document.querySelectorAll('.daytab').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');activeDay=+t.dataset.i;selectedSlot=null;renderSlots();});
  renderSlots();$('overlay').classList.add('open');
}
function closeSheet(){$('overlay').classList.remove('open');}
function renderSlots(){
  const day=next7Days()[activeDay],key=dayKey(day),now=new Date();
  const taken=new Set(get('hvc_appts',[]).filter(a=>a.doctor_id===activeDoctor.id&&a.slot_date===key&&a.status==='confirmed'&&a.id!==editId).map(a=>a.slot_time));
  let h='';
  for(let t=activeDoctor.hours[0];t<activeDoctor.hours[1];t++)for(const m of ['00','30']){
    const s=t+':'+m,past=new Date(day.getFullYear(),day.getMonth(),day.getDate(),t,+m)<=now;
    h+=`<button class="slot ${taken.has(s)||past?'taken':''} ${selectedSlot===s?'selected':''}" data-slot="${s}">${s}</button>`;
  }
  const grid=$('slotGrid');grid.innerHTML=h;
  grid.querySelectorAll('.slot:not(.taken)').forEach(b=>b.onclick=()=>{selectedSlot=b.dataset.slot;renderSlots();});
}
function confirmBooking(){
  const msg=$('sheetMsg');
  if(!selectedSlot){msg.textContent='Pick an open time slot.';msg.className='msg err show';return;}
  const all=get('hvc_appts',[]),day=dayKey(next7Days()[activeDay]);
  if(editId){const a=all.find(x=>x.id===editId);a.slot_date=day;a.slot_time=selectedSlot;}
  else all.push({id:'a'+Date.now(),user_id:session.id,patient_name:session.name,patient_email:session.email,patient_phone:$('pPhone').value.trim(),
    doctor_id:activeDoctor.id,doctor_name:activeDoctor.name,slot_date:day,slot_time:selectedSlot,status:'confirmed',created_at:new Date().toISOString()});
  put('hvc_appts',all);
  msg.textContent=(editId?'Appointment rescheduled to ':'Appointment confirmed for ')+day+' at '+selectedSlot+'.';msg.className='msg ok show';
  renderSlots();renderMine();setTimeout(closeSheet,1200);
}
function renderMine(){
  const rows=get('hvc_appts',[]).filter(a=>a.user_id===session.id).sort((a,b)=>(a.slot_date+a.slot_time).localeCompare(b.slot_date+b.slot_time));
  $('appList').innerHTML=rows.length?rows.map(a=>`
    <div class="approw"><div class="info"><b>${esc(a.doctor_name)}</b><span>${a.slot_date} · ${a.slot_time}</span></div>
      <div class="acts"><span class="status ${a.status}">${a.status}</span>
      ${a.status==='confirmed'?`<button class="linkbtn" style="color:var(--teal)" onclick="openBooking('${a.doctor_id}','${a.id}')">Reschedule</button><button class="linkbtn" onclick="setStatus('${a.id}','cancelled')">Cancel</button>`:''}</div></div>`).join('')
    :'<div class="empty">No appointments yet. Choose a doctor above to book one.</div>';
}
function setStatus(id,st){
  const all=get('hvc_appts',[]),a=all.find(x=>x.id===id);if(a)a.status=st;put('hvc_appts',all);
  session.role==='admin'?renderAdmin():renderMine();
}
