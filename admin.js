/* Admin module: dashboard stats, manage doctors, manage appointment statuses. */

/* ---- Admin module (statuses are set manually) ---- */
function renderAdmin(){
  const docs=get('hvc_doctors',[]),ap=get('hvc_appts',[]),pts=get('hvc_users',[]).filter(u=>u.role==='user');
  const n=st=>ap.filter(a=>a.status===st).length;
  $('aStats').innerHTML=[[docs.length,'Doctors'],[pts.length,'Registered patients'],[n('confirmed'),'Upcoming'],[n('completed'),'Completed'],[n('expired'),'Expired'],[n('cancelled'),'Cancelled']].map(x=>`<div class="astat"><b>${x[0]}</b><span>${x[1]}</span></div>`).join('');
  $('adminDocs').innerHTML=docs.length?docs.map(d=>`<div class="approw"><div class="info"><b>${esc(d.name)}</b><span>${esc(d.specialty)} · ${d.years} yrs · ${d.hours[0]}:00–${d.hours[1]}:00</span></div><button class="linkbtn" onclick="removeDoctor('${d.id}')">Remove</button></div>`).join(''):'<div class="empty">No doctors yet. Add one above.</div>';
  $('adminAppts').innerHTML=ap.length?ap.map(a=>`
    <div class="approw"><div class="info"><b>${esc(a.patient_name)}</b> with ${esc(a.doctor_name)}<span>${a.slot_date} · ${a.slot_time} · ${esc(a.patient_email)}</span></div>
      <div class="acts"><span class="status ${a.status}">${a.status}</span>
      ${a.status==='confirmed'?`<button class="btn btn-solid-dark sm" onclick="setStatus('${a.id}','completed')">Mark completed</button><button class="btn btn-sand sm" onclick="setStatus('${a.id}','expired')">Mark expired</button><button class="linkbtn" onclick="setStatus('${a.id}','cancelled')">Cancel</button>`:''}
      ${a.status==='expired'?`<button class="btn btn-solid-dark sm" onclick="setStatus('${a.id}','completed')">Mark completed</button>`:''}
      ${a.status==='cancelled'||a.status==='expired'?`<button class="btn btn-sand sm" onclick="setStatus('${a.id}','confirmed')">Reopen</button>`:''}</div></div>`).join(''):'<div class="empty">No appointments booked yet.</div>';
}
function addDoctor(){
  const name=$('dName').value.trim(),spec=$('dSpec').value.trim(),years=+$('dYears').value||0,from=+$('dFrom').value,to=+$('dTo').value;
  if(!name||!spec||!(to>from)) return alert('Enter a name, a specialty, and a valid time range.');
  const l=get('hvc_doctors',[]);l.push({id:'d'+Date.now(),name,specialty:spec,years,hours:[from,to]});put('hvc_doctors',l);
  $('dName').value='';$('dSpec').value='';renderAdmin();
}
function removeDoctor(id){
  if(!confirm('Remove this doctor? Existing appointments stay on record.')) return;
  put('hvc_doctors',get('hvc_doctors',[]).filter(d=>d.id!==id));renderAdmin();
}
