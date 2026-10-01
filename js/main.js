/* App entry point: switches the screen by role, then boots the app. */

function start(){
  session=get('hvc_session',null);
  const admin=session&&session.role==='admin',patient=session&&session.role==='user';
  $('publicView').classList.toggle('hide',!!admin);
  $('adminView').classList.toggle('hide',!admin);
  $('appointments').classList.toggle('hide',!patient);
  $('navAppts').classList.toggle('hide',!patient);
  $('navDoctors').classList.toggle('hide',!!admin);
  $('userChip').classList.toggle('hide',!session);
  $('userChip').textContent=session?(admin?'Admin · ':'')+session.name:'';
  $('navAuth').textContent=session?'Log out':'Log in';
  $('heroSecond').textContent=patient?'View my appointments':'Create patient account';
  if(admin) renderAdmin(); else {renderFilters();renderDoctors(filter);if(patient)renderMine();}
}

/* ---- Boot ---- */
seed();setPortal('user');start();
