const express=require("express");
const session=require("express-session");
const fs=require("fs");

const app=express();
const PORT=process.env.PORT||10000;
const DB="./links.json";

const ADMIN_USER=process.env.ADMIN_USER||"admin";
const ADMIN_PASS=process.env.ADMIN_PASS||"admin123";
const SECRET=process.env.SESSION_SECRET||"roxe-linkhub-change-this-secret";

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
  secret:SECRET,
  resave:false,
  saveUninitialized:false,
  cookie:{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    maxAge:1000*60*60*24
  }
}));

function db(){
  try{return JSON.parse(fs.readFileSync(DB,"utf8"))}
  catch(e){
    return {
      profile:{name:"ROXE",username:"@iamroxe01",bio:"Creator • Gaming • Minecraft • Entertainment",avatar:"",cover:"",location:"India",instagram:"",youtube:"",discord:""},
      links:[]
    }
  }
}
function save(x){fs.writeFileSync(DB,JSON.stringify(x,null,2))}
function esc(x=""){
  return String(x).replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]))
}
function auth(req,res,next){
  if(req.session.admin)return next();
  res.redirect("/admin/login");
}

const CSS=`
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
 margin:0;color:#fff;background:#05050b;
 font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
 overflow-x:hidden
}
body:before{
 content:"";position:fixed;inset:0;z-index:-10;
 background:
 radial-gradient(circle at 10% 10%,rgba(124,58,237,.35),transparent 28%),
 radial-gradient(circle at 90% 20%,rgba(6,182,212,.24),transparent 28%),
 radial-gradient(circle at 50% 100%,rgba(236,72,153,.18),transparent 32%),
 #05050b
}
body:after{
 content:"";position:fixed;inset:0;z-index:-9;pointer-events:none;
 opacity:.16;
 background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);
 background-size:70px 70px;
 mask-image:linear-gradient(to bottom,black,transparent 80%)
}
a{text-decoration:none;color:inherit}
.nav{
 position:fixed;z-index:100;top:16px;left:50%;transform:translateX(-50%);
 width:min(940px,94%);height:62px;padding:8px 10px;
 display:flex;align-items:center;justify-content:space-between;
 border:1px solid rgba(255,255,255,.13);
 background:rgba(10,10,18,.68);backdrop-filter:blur(24px);
 border-radius:22px;box-shadow:0 20px 70px rgba(0,0,0,.45)
}
.logo{display:flex;align-items:center;gap:10px;font-weight:950;letter-spacing:.8px}
.logoMark{
 width:40px;height:40px;border-radius:13px;display:grid;place-items:center;
 background:linear-gradient(135deg,#8b5cf6,#06b6d4);
 box-shadow:0 8px 30px rgba(124,58,237,.45)
}
.navlinks{display:flex;gap:5px}
.navlinks a{
 padding:10px 15px;border-radius:13px;color:#aaa6b7;font-size:13px;font-weight:800;
 transition:.25s
}
.navlinks a:hover,.navlinks .active{color:#fff;background:rgba(255,255,255,.09)}
.container{width:min(920px,92%);margin:auto;padding:120px 0 60px}

.hero{text-align:center;position:relative}
.heroScene{
 position:relative;width:min(720px,100%);height:245px;margin:0 auto 10px;
 perspective:900px
}
.ring{
 position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotateX(66deg);
 width:270px;height:270px;border:1px solid rgba(139,92,246,.55);
 border-radius:50%;box-shadow:0 0 55px rgba(124,58,237,.28),inset 0 0 35px rgba(6,182,212,.16);
 animation:spin 13s linear infinite
}
.ring:nth-child(2){width:210px;height:210px;border-color:rgba(6,182,212,.45);animation-duration:9s;animation-direction:reverse}
.ring:nth-child(3){width:340px;height:340px;border-color:rgba(236,72,153,.22);animation-duration:18s}
.core{
 position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
 width:120px;height:120px;border-radius:35px;
 display:grid;place-items:center;font-size:43px;font-weight:950;
 background:linear-gradient(135deg,#7c3aed,#0891b2);
 box-shadow:0 0 100px rgba(124,58,237,.6),0 25px 60px #0009;
 animation:core 4s ease-in-out infinite
}
.floatCard{
 position:absolute;padding:10px 14px;border:1px solid #ffffff18;
 background:#ffffff0c;backdrop-filter:blur(15px);border-radius:14px;
 color:#c7c2d2;font-size:11px;font-weight:800;box-shadow:0 15px 40px #0008;
 animation:float 4s ease-in-out infinite
}
.fc1{left:5%;top:30%}.fc2{right:5%;top:20%;animation-delay:-1.5s}.fc3{right:12%;bottom:5%;animation-delay:-3s}
@keyframes spin{to{transform:translate(-50%,-50%) rotateX(66deg) rotateZ(360deg)}}
@keyframes core{50%{transform:translate(-50%,-50%) translateY(-10px) rotateY(10deg)}}
@keyframes float{50%{transform:translateY(-12px)}}

.avatar{
 width:116px;height:116px;margin:-8px auto 15px;border-radius:36px;
 display:grid;place-items:center;font-size:43px;font-weight:950;
 background:linear-gradient(135deg,#8b5cf6,#06b6d4);
 border:2px solid rgba(255,255,255,.15);
 box-shadow:0 20px 70px rgba(124,58,237,.45);overflow:hidden
}
.avatar img{width:100%;height:100%;object-fit:cover}
h1{font-size:46px;line-height:1;margin:0;letter-spacing:-2px}
.username{margin-top:8px;color:#8d879d;font-size:14px}
.bio{max-width:620px;margin:14px auto;color:#b4afbd;line-height:1.6;font-size:15px}
.location{color:#777181;font-size:12px}
.social{display:flex;justify-content:center;gap:9px;margin:20px 0 30px}
.social a{
 width:44px;height:44px;display:grid;place-items:center;border-radius:14px;
 border:1px solid #ffffff15;background:#ffffff08;backdrop-filter:blur(15px);
 transition:.25s;font-size:18px
}
.social a:hover{transform:translateY(-5px) scale(1.05);background:#ffffff15}

.sectionTitle{
 display:flex;align-items:end;justify-content:space-between;margin:35px 0 14px
}
.sectionTitle h2{font-size:19px;margin:0}.sectionTitle span{font-size:11px;color:#777181}
.links{display:grid;gap:14px}
.link{
 position:relative;display:flex;align-items:center;gap:16px;min-height:92px;padding:15px 17px;
 border:1px solid #ffffff15;border-radius:24px;
 background:linear-gradient(105deg,rgba(255,255,255,.09),rgba(255,255,255,.035));
 backdrop-filter:blur(22px);box-shadow:0 18px 55px #0008;
 overflow:hidden;transition:.3s;animation:up .7s both
}
.link:before{
 content:"";position:absolute;inset:0;
 background:linear-gradient(100deg,transparent 20%,rgba(255,255,255,.12),transparent 80%);
 transform:translateX(-120%);transition:.8s
}
.link:hover{transform:translateY(-6px) scale(1.01);border-color:#ffffff30;box-shadow:0 28px 70px #000a}
.link:hover:before{transform:translateX(120%)}
.linkIcon{
 width:57px;height:57px;flex:none;display:grid;place-items:center;
 border-radius:18px;background:rgba(255,255,255,.08);border:1px solid #ffffff13;
 font-size:26px;z-index:1
}
.linkText{flex:1;min-width:0;z-index:1}
.linkTitle{font-weight:900;font-size:16px}
.linkDesc{color:#938c9f;font-size:12px;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tag{
 display:inline-block;margin-top:7px;padding:3px 7px;border-radius:7px;
 background:rgba(124,58,237,.2);color:#bca8ff;font-size:8px;font-weight:900;letter-spacing:.8px
}
.arrow{font-size:27px;color:#777181;z-index:1;transition:.25s}
.link:hover .arrow{color:#fff;transform:translateX(5px)}
.feature{
 margin-top:18px;padding:22px;border-radius:25px;
 background:linear-gradient(120deg,rgba(124,58,237,.22),rgba(6,182,212,.10));
 border:1px solid rgba(139,92,246,.25);display:flex;justify-content:space-between;align-items:center;
 gap:20px
}
.feature strong{font-size:16px}.feature p{margin:5px 0 0;color:#aaa3b5;font-size:12px}
.feature .pill{padding:10px 14px;border-radius:12px;background:#fff;color:#08070d;font-size:11px;font-weight:900;white-space:nowrap}
.stats{
 display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:15px
}
.stat{
 padding:18px;border:1px solid #ffffff12;border-radius:19px;background:#ffffff06;text-align:center
}
.stat b{display:block;font-size:22px}.stat span{color:#777181;font-size:10px}
.footer{text-align:center;color:#625d6d;font-size:11px;margin-top:35px}

.adminPanel{width:min(1000px,94%);margin:auto;padding:105px 0 50px}
.adminTop{display:flex;justify-content:space-between;align-items:center;gap:15px;margin-bottom:20px}
.adminTop h1{font-size:30px}
.box{
 border:1px solid #ffffff14;border-radius:22px;background:#ffffff07;
 backdrop-filter:blur(20px);padding:22px;margin-bottom:17px
}
.box h2{font-size:18px;margin:0 0 17px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}
label{display:block;color:#928b9e;font-size:11px;font-weight:800;margin-top:4px}
input,textarea{
 width:100%;padding:13px 14px;margin:7px 0 12px;border:1px solid #ffffff15;
 border-radius:12px;background:#05050a;color:#fff;outline:none;font:inherit
}
textarea{min-height:85px;resize:vertical}
button,.btn{
 border:0;border-radius:12px;padding:11px 15px;
 background:linear-gradient(135deg,#7c3aed,#0891b2);color:#fff;font-weight:900;
 cursor:pointer;text-decoration:none;font-size:12px
}
.danger{background:#a9253b}
.linkAdmin{padding:16px;border:1px solid #ffffff11;border-radius:17px;margin-top:10px}
.linkAdminTop{display:flex;gap:12px}
.actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:4px}
.small{color:#777181;font-size:11px}
.loginBox{width:min(400px,92%);margin:17vh auto}

@keyframes up{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}

@media(max-width:650px){
 .container{padding-top:105px}
 .heroScene{height:190px}
 .ring:nth-child(3){width:260px;height:260px}
 .ring{width:220px;height:220px}.ring:nth-child(2){width:165px;height:165px}
 .core{width:90px;height:90px;font-size:32px;border-radius:27px}
 .floatCard{font-size:9px;padding:8px 10px}.fc1{left:0}.fc2{right:0}.fc3{right:2%}
 h1{font-size:37px}
 .grid{grid-template-columns:1fr}
 .stats{grid-template-columns:1fr 1fr 1fr}
 .feature{align-items:flex-start;flex-direction:column}
 .adminTop{align-items:flex-start}
}
`;

function NAV(admin=false){
 return `<nav class="nav">
  <div class="logo"><div class="logoMark">✦</div>ROXE LINKHUB</div>
  <div class="navlinks">
   <a class="${admin?"":"active"}" href="/">Home</a>
   <a class="${admin?"active":""}" href="/admin">Admin</a>
  </div>
 </nav>`;
}

app.get("/",(req,res)=>{
 const d=db(),p=d.profile||{};
 const links=d.links||[];
 const total=links.reduce((n,x)=>n+(Number(x.clicks)||0),0);

 const social=
  (p.instagram?`<a href="${esc(p.instagram)}" target="_blank" rel="noopener">◎</a>`:"")+
  (p.youtube?`<a href="${esc(p.youtube)}" target="_blank" rel="noopener">▶</a>`:"")+
  (p.discord?`<a href="${esc(p.discord)}" target="_blank" rel="noopener">◈</a>`:"");

 const cards=links.map((l,i)=>`
  <a class="link" style="animation-delay:${i*80}ms" href="/go/${l.id}">
   <div class="linkIcon">${esc(l.icon||"🔗")}</div>
   <div class="linkText">
    <div class="linkTitle">${esc(l.title)}</div>
    <div class="linkDesc">${esc(l.description||"Open this link")}</div>
    ${l.tag?`<span class="tag">${esc(l.tag)}</span>`:""}
   </div>
   <div class="arrow">›</div>
  </a>`).join("");

 res.send(`<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#07050d">
<title>${esc(p.name||"ROXE")} — LinkHub</title>
<style>${CSS}</style>
</head><body>
${NAV(false)}
<main class="container">

<section class="hero">
 <div class="heroScene">
  <div class="ring"></div><div class="ring"></div><div class="ring"></div>
  <div class="core">✦</div>
  <div class="floatCard fc1">⚡ CREATOR</div>
  <div class="floatCard fc2">🎮 GAMING</div>
  <div class="floatCard fc3">🌐 COMMUNITY</div>
 </div>

 <div class="avatar">${p.avatar?`<img src="${esc(p.avatar)}" alt="">`:esc((p.name||"R")[0])}</div>
 <h1>${esc(p.name||"ROXE")}</h1>
 <div class="username">${esc(p.username||"")}</div>
 <p class="bio">${esc(p.bio||"")}</p>
 ${p.location?`<div class="location">◉ ${esc(p.location)}</div>`:""}
 <div class="social">${social}</div>
</section>

<div class="sectionTitle">
 <h2>✦ Explore my world</h2>
 <span>${links.length} LINKS</span>
</div>

<section class="links">
 ${cards||`<div class="box">No links have been added yet.</div>`}
</section>

<section class="feature">
 <div>
  <strong>⚡ Everything in one place</strong>
  <p>Follow, watch, connect and discover all my latest stuff.</p>
 </div>
 <div class="pill">${total} CLICKS</div>
</section>

<section class="stats">
 <div class="stat"><b>${links.length}</b><span>LINKS</span></div>
 <div class="stat"><b>${total}</b><span>CLICKS</span></div>
 <div class="stat"><b>24/7</b><span>ONLINE</span></div>
</section>

<div class="footer">Built with ✦ LinkHub · © ${new Date().getFullYear()} ${esc(p.name||"ROXE")}</div>
</main>
</body></html>`);
});

app.get("/go/:id",(req,res)=>{
 const d=db(),l=d.links.find(x=>String(x.id)===String(req.params.id));
 if(!l)return res.redirect("/");
 l.clicks=(Number(l.clicks)||0)+1;
 save(d);
 res.redirect(l.url);
});

app.get("/admin/login",(req,res)=>{
 res.send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${CSS}</style></head>
 <body>${NAV(true)}
 <main class="loginBox box">
 <h1>Admin Login</h1>
 <p class="small">Manage your LinkHub from one place.</p>
 <form method="post" action="/admin/login">
  <label>USERNAME</label><input name="user" autocomplete="username" required>
  <label>PASSWORD</label><input type="password" name="pass" autocomplete="current-password" required>
  <button type="submit">LOGIN →</button>
 </form>
 </main></body></html>`);
});

app.post("/admin/login",(req,res)=>{
 if(req.body.user===ADMIN_USER&&req.body.pass===ADMIN_PASS){
  req.session.admin=true;
  return res.redirect("/admin");
 }
 res.status(401).send(`<style>${CSS}</style><div class="box loginBox"><h2>❌ Invalid login</h2><p>Username or password incorrect.</p><a class="btn" href="/admin/login">Try again</a></div>`);
});

app.get("/admin",auth,(req,res)=>{
 const d=db(),p=d.profile||{},links=d.links||[];
 const clicks=links.reduce((n,x)=>n+(Number(x.clicks)||0),0);

 const rows=links.map(l=>`
 <div class="linkAdmin">
  <form method="post" action="/admin/edit/${l.id}">
   <div class="linkAdminTop">
    <div style="width:70px">
     <label>ICON</label>
     <input name="icon" value="${esc(l.icon||"🔗")}">
    </div>
    <div style="flex:1">
     <label>TITLE</label><input name="title" value="${esc(l.title)}" required>
     <label>DESCRIPTION</label><input name="description" value="${esc(l.description||"")}">
     <label>URL</label><input name="url" value="${esc(l.url)}" required>
     <label>TAG</label><input name="tag" value="${esc(l.tag||"")}">
    </div>
   </div>
   <div class="actions">
    <button>SAVE CHANGES</button>
   </form>
   <form method="post" action="/admin/delete/${l.id}">
    <button class="danger" onclick="return confirm('Delete this link?')">DELETE</button>
   </form>
   </div>
   <div class="small">📊 ${Number(l.clicks)||0} clicks</div>
 </div>`).join("");

 res.send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin — ROXE LinkHub</title><style>${CSS}</style></head><body>
 ${NAV(true)}
 <main class="adminPanel">

 <div class="adminTop">
  <h1>Dashboard</h1>
  <div><a class="btn" href="/" target="_blank">VIEW SITE</a> <a class="btn" href="/admin/logout">LOGOUT</a></div>
 </div>

 <div class="stats">
  <div class="stat"><b>${links.length}</b><span>TOTAL LINKS</span></div>
  <div class="stat"><b>${clicks}</b><span>TOTAL CLICKS</span></div>
  <div class="stat"><b>LIVE</b><span>STATUS</span></div>
 </div>

 <div class="box" style="margin-top:17px">
  <h2>👤 Profile</h2>
  <form method="post" action="/admin/profile">
   <div class="grid">
    <div>
     <label>NAME</label><input name="name" value="${esc(p.name||"")}">
     <label>USERNAME</label><input name="username" value="${esc(p.username||"")}">
     <label>AVATAR IMAGE URL</label><input name="avatar" value="${esc(p.avatar||"")}">
     <label>LOCATION</label><input name="location" value="${esc(p.location||"")}">
    </div>
    <div>
     <label>BIO</label><textarea name="bio">${esc(p.bio||"")}</textarea>
     <label>INSTAGRAM URL</label><input name="instagram" value="${esc(p.instagram||"")}">
     <label>YOUTUBE URL</label><input name="youtube" value="${esc(p.youtube||"")}">
     <label>DISCORD URL</label><input name="discord" value="${esc(p.discord||"")}">
    </div>
   </div>
   <button>SAVE PROFILE</button>
  </form>
 </div>

 <div class="box">
  <h2>➕ Add New Link</h2>
  <form method="post" action="/admin/add">
   <div class="grid">
    <div>
     <label>TITLE</label><input name="title" placeholder="My YouTube Channel" required>
     <label>URL</label><input name="url" placeholder="https://..." required>
     <label>DESCRIPTION</label><input name="description" placeholder="Watch my latest videos">
    </div>
    <div>
     <label>ICON</label><input name="icon" value="🔗">
     <label>TAG</label><input name="tag" placeholder="VIDEO">
    </div>
   </div>
   <button>ADD LINK</button>
  </form>
 </div>

 <div class="box">
  <h2>🔗 Manage Links</h2>
  ${rows||"<p class='small'>No links yet.</p>"}
 </div>

 </main></body></html>`);
});

app.post("/admin/profile",auth,(req,res)=>{
 const d=db();
 d.profile={
  name:req.body.name||"ROXE",
  username:req.body.username||"",
  bio:req.body.bio||"",
  avatar:req.body.avatar||"",
  location:req.body.location||"",
  instagram:req.body.instagram||"",
  youtube:req.body.youtube||"",
  discord:req.body.discord||""
 };
 save(d);res.redirect("/admin");
});

app.post("/admin/add",auth,(req,res)=>{
 const d=db();
 d.links.push({
  id:Date.now(),
  title:req.body.title,
  description:req.body.description||"",
  url:req.body.url,
  icon:req.body.icon||"🔗",
  tag:req.body.tag||"",
  clicks:0
 });
 save(d);res.redirect("/admin");
});

app.post("/admin/edit/:id",auth,(req,res)=>{
 const d=db(),l=d.links.find(x=>String(x.id)===String(req.params.id));
 if(l){
  l.title=req.body.title;
  l.description=req.body.description||"";
  l.url=req.body.url;
  l.icon=req.body.icon||"🔗";
  l.tag=req.body.tag||"";
  save(d);
 }
 res.redirect("/admin");
});

app.post("/admin/delete/:id",auth,(req,res)=>{
 const d=db();
 d.links=d.links.filter(x=>String(x.id)!==String(req.params.id));
 save(d);res.redirect("/admin");
});

app.get("/admin/logout",(req,res)=>{
 req.session.destroy(()=>res.redirect("/"));
});

app.listen(PORT,()=>console.log(`ROXE LINKHUB running on port ${PORT}`));
