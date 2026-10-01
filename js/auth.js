/* Authentication: patient signup/login and separate admin login. */

/* ---- Auth: patient signup/login, separate admin login ---- */
function openAuth(tab,patientOnly){setPortal('user');if(tab==='signup')showTab('signup');$('portalTabs').classList.toggle('hide',!!patientOnly);$('authOverlay').classList.add('open');}
function closeAuth(){$('authOverlay').classList.remove('open');pendingBook=null;}
function authMsg(t,ok){const m=$('authMsg');m.textContent=t;m.className='msg '+(ok?'ok':'err')+' show';}
function showTab(t){
  const s=t==='signup';
  $('tabLogin').classList.toggle('on',!s);$('tabSignup').classList.toggle('on',s);
  $('fName').classList.toggle('hide',!s);$('adminHint').classList.toggle('hide',portal!=='admin');
  $('authBtn').textContent=s?'Create account':'Log in';$('authMsg').className='msg';
}
function setPortal(p){
  portal=p;
  $('pUser').classList.toggle('on',p==='user');$('pAdmin').classList.toggle('on',p==='admin');
  $('authTabs').classList.toggle('hide',p==='admin');
  $('authTitle').textContent=p==='admin'?'Admin portal':'Patient portal';
  $('authSub').textContent=p==='admin'?'For clinic staff only.':'Log in or create an account to book visits.';
  $('aName').value='';$('aPass').value='';showTab('login');
}
function submitAuth(){
  const signup=!$('fName').classList.contains('hide');
  const email=$('aEmail').value.trim().toLowerCase(),pass=$('aPass').value,name=$('aName').value.trim();
  const users=get('hvc_users',[]);
  if(!email||!pass) return authMsg('Enter your email and password.');
  if(signup){
    if(!name) return authMsg('Enter your full name.');
    if(pass.length<6) return authMsg('Password must be at least 6 characters.');
    if(users.some(u=>u.email===email)) return authMsg('That email is already registered. Log in instead.');
    users.push({id:'u'+Date.now(),name,email,password:pass,role:'user'});put('hvc_users',users);
    showTab('login');$('aPass').value='';return authMsg('Account created. Log in to continue.',true);
  }
  const u=users.find(x=>x.email===email&&x.password===pass);
  if(!u) return authMsg('Incorrect email or password.');
  if(portal==='admin'&&u.role!=='admin') return authMsg('This is not an admin account. Use the Patient tab.');
  if(portal==='user'&&u.role==='admin') return authMsg('Admin accounts log in from the Admin tab.');
  put('hvc_session',{id:u.id,name:u.name,email:u.email,role:u.role});
  const b=pendingBook;pendingBook=null;closeAuth();start();
  if(b) openBooking(b);
}
function authOrLogout(){if(session){try{localStorage.removeItem('hvc_session')}catch(e){}start();window.scrollTo(0,0);}else openAuth();}
function heroAction(){session?$('appointments').scrollIntoView({behavior:'smooth'}):openAuth('signup',true);}
