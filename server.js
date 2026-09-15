const express=require("express");
const session=require("express-session");
const fs=require("fs");

const app=express(),PORT=process.env.PORT||10000,DB="./links.json";
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
 secret:process.env.SESSION_SECRET||"linkhub-final-secret",
 resave:false,saveUninitialized:false,
 cookie:{httpOnly:true,secure:process.env.NODE_ENV==="production",maxAge:86400000}
}));

function read(){
 try{return JSON.parse(fs.readFileSync(DB,"utf8"))}
 catch(e){return {settings:{},admin:{username:"admin",password:"admin123"},links:[]}}
}
function save(d){fs.writeFileSync(DB,JSON.stringify(d,null,2))}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function auth(req,res,next){req.session.admin?next():res.redirect("/admin/login")}

const CSS=`
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#05050a;color:#fff;font-family:Inter,system-ui,sans-serif;overflow-x:hidden}
body:before{content:"";position:fixed;inset:0;z-index:-5;background:radial-gradient(circle at 12% 10%,#7c3aed45,transparent 28%),radial-gradient(circle at 88% 25%,#06b6d435,transparent 28%),radial-gradient(circle at 50% 100%,#ec489930,transparent 32%),#05050a}
body:after{content:"";position:fixed;inset:0;z-index:-4;opacity:.12;background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:70px 70px;mask-image:linear-gradient(#000,transparent 85%)}
a{text-decoration:none;color:inherit}
.nav{position:fixed;z-index:100;top:15px;left:50%;transform:translateX(-50%);width:min(950px,94%);height:62px;padding:8px 11px;display:flex;align-items:center;justify-content:space-between;border:1px solid #ffffff18;background:#0b0b13b8;backdrop-filter:blur(25px);border-radius:21px;box-shadow:0 20px 70px #0008}
.brand{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:950;letter-spacing:.8px}.brand img{width:39px;height:39px;border-radius:12px;object-fit:cover}.brandLogo{width:39px;height:39px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,#8b5cf6,#06b6d4);font-weight:950}
.navlinks{display:flex;gap:5px}.navlinks a{padding:10px 15px;border-radius:13px;color:#9993a7;font-size:12px;font-weight:850}.navlinks a:hover,.navlinks .active{background:#ffffff0d;color:#fff}
.container{width:min(900px,92%);margin:auto;padding:110px 0 55px}.hero{text-align:center}
.cover{height:170px;width:100%;border-radius:32px;overflow:hidden;position:relative;margin-bottom:-55px;border:1px solid #ffffff15;background:linear-gradient(120deg,#24134f,#073c49)}
.cover img{width:100%;height:100%;object-fit:cover;opacity:.72}.cover:after{content:"";position:absolute;inset:0;background:linear-gradient(transparent,#05050a)}
.scene{height:210px;position:relative;perspective:900px;pointer-events:none}.ring{position:absolute;left:50%;top:50%;width:230px;height:230px;border:1px solid #9b7cff66;border-radius:50%;transform:translate(-50%,-50%) rotateX(68deg);box-shadow:0 0 55px #7c3aed44;animation:spin 12s linear infinite}.ring:nth-child(2){width:175px;height:175px;border-color:#22d3ee66;animation-duration:8s;animation-direction:reverse}.ring:nth-child(3){width:290px;height:290px;border-color:#ec489944;animation-duration:18s}.core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:92px;height:92px;border-radius:28px;background:linear-gradient(135deg,#7c3aed,#0891b2);box-shadow:0 0 80px #7c3aed88;display:grid;place-items:center;overflow:hidden;font-size:0;animation:pulse 4s ease-in-out infinite}.core img{width:100%;height:100%;object-fit:cover}
@keyframes spin{to{transform:translate(-50%,-50%) rotateX(68deg) rotateZ(360deg)}}@keyframes pulse{50%{transform:translate(-50%,-50%) translateY(-8px) rotateY(8deg)}}
.avatar{position:relative;width:112px;height:112px;margin:auto;border-radius:34px;border:3px solid #ffffff22;background:linear-gradient(135deg,#8b5cf6,#06b6d4);box-shadow:0 20px 70px #7c3aed55;overflow:hidden;display:grid;place-items:center;font-size:40px;font-weight:950}.avatar img{width:100%;height:100%;object-fit:cover}
h1{font-size:45px;letter-spacing:-2px;margin:17px 0 4px}.username{color:#8c869c;font-size:13px}.bio{max-width:650px;margin:12px auto;color:#b6b0c1;font-size:14px;line-height:1.7}.location{color:#716b7b;font-size:11px}
.social{display:flex;justify-content:center;gap:9px;margin:19px 0 30px}.social a{width:43px;height:43px;display:grid;place-items:center;border-radius:14px;border:1px solid #ffffff15;background:#ffffff08;transition:.25s}.social a:hover{transform:translateY(-5px) scale(1.05);background:#ffffff16}
.intro{padding:24px;border:1px solid #ffffff15;border-radius:25px;background:linear-gradient(120deg,#7c3aed18,#06b6d412);backdrop-filter:blur(20px);margin-bottom:22px;text-align:left}.intro h2{margin:0 0 7px;font-size:21px}.intro p{margin:0;color:#aaa4b5;font-size:13px;line-height:1.6}
.heading{display:flex;justify-content:space-between;align-items:end;margin:30px 0 13px}.heading h2{margin:0;font-size:18px}.heading span{color:#686272;font-size:10px}
.links{display:grid;gap:14px}.link{min-height:91px;display:flex;align-items:center;gap:15px;padding:14px 17px;border:1px solid #ffffff15;border-radius:24px;background:linear-gradient(105deg,#ffffff0e,#ffffff04);backdrop-filter:blur(23px);box-shadow:0 18px 55px #0008;position:relative;overflow:hidden;transition:.3s;animation:up .65s both}.link:before{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 20%,#ffffff14,transparent 80%);transform:translateX(-120%);transition:.8s}.link:hover{transform:translateY(-6px) scale(1.01);border-color:#ffffff32;box-shadow:0 28px 75px #000a}.link:hover:before{transform:translateX(120%)}
.li{width:57px;height:57px;flex:none;border-radius:18px;background:#ffffff09;border:1px solid #ffffff14;display:grid;place-items:center;overflow:hidden;font-size:25px;z-index:1}.li img{width:100%;height:100%;object-fit:cover}.lt{flex:1;min-width:0;z-index:1}.title{font-weight:900;font-size:16px}.desc{color:#938c9f;font-size:12px;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tag{display:inline-block;margin-top:7px;padding:3px 7px;border-radius:7px;background:#7c3aed25;color:#c0adff;font-size:8px;font-weight:950}.arrow{font-size:26px;color:#716b7c;z-index:1;transition:.25s}.link:hover .arrow{color:#fff;transform:translateX(5px)}
.bottom{margin-top:22px;display:grid;grid-template-columns:1fr 1fr;gap:14px}.info{padding:20px;border:1px solid #ffffff12;border-radius:22px;background:#ffffff06;text-align:center}.info b{display:block;font-size:24px}.info span{font-size:10px;color:#716b7c}
.footer{text-align:center;color:#5e5969;font-size:11px;margin-top:32px}

.admin{width:min(1000px,94%);margin:auto;padding:105px 0 50px}.adminTop{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:20px}.adminTop h1{font-size:29px;margin:0}.box{padding:22px;border:1px solid #ffffff14;border-radius:22px;background:#ffffff07;backdrop-filter:blur(20px);margin-bottom:17px}.box h2{font-size:18px;margin:0 0 17px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}label{display:block;color:#918a9c;font-size:10px;font-weight:850;margin-top:5px}input,textarea{width:100%;padding:13px 14px;margin:6px 0 12px;border:1px solid #ffffff15;border-radius:12px;background:#05050a;color:#fff;outline:0;font:inherit}textarea{min-height:85px;resize:vertical}button,.btn{border:0;border-radius:12px;padding:11px 15px;background:linear-gradient(135deg,#7c3aed,#0891b2);color:#fff;font-weight:900;font-size:11px;cursor:pointer;text-decoration:none}.danger{background:#a9283d}.small{font-size:11px;color:#746d7e}.linkAdmin{border:1px solid #ffffff11;border-radius:17px;padding:16px;margin-top:10px}.actions{display:flex;gap:7px;flex-wrap:wrap}.login{width:min(400px,92%);margin:16vh auto}
@keyframes up{from{opacity:0;transform:translateY(23px)}to{opacity:1;transform:none}}
@media(max-width:650px){.container{padding-top:100px}.cover{height:135px}.scene{height:175px}.ring{width:185px;height:185px}.ring:nth-child(2){width:140px;height:140px}.ring:nth-child(3){width:235px;height:235px}.core{width:75px;height:75px}.avatar{width:100px;height:100px}h1{font-size:36px}.grid{grid-template-columns:1fr}.bottom{grid-template-columns:1fr 1fr}.nav{height:58px}.brand{font-size:11px}.brandLogo,.brand img{width:35px;height:35px}}
`;

function nav(s,admin=false){
 const logo=s.logo||"";
 return `<nav class="nav"><div class="brand">${logo?`<img src="${esc(logo)}">`:`<div class="brandLogo">✦</div>`}${esc(s.brand||"LINKHUB")}</div><div class="navlinks"><a class="${admin?"":"active"}" href="/">Home</a><a class="${admin?"active":""}" href="/admin">Admin</a></div></nav>`;
}

app.get("/",(req,res)=>{
 const d=read(),s=d.settings||{},links=d.links||[];
 const clicks=links.reduce((n,l)=>n+(Number(l.clicks)||0),0);
 const socials=(s.instagram?`<a href="${esc(s.instagram)}" target="_blank">◎</a>`:"")+(s.youtube?`<a href="${esc(s.youtube)}" target="_blank">▶</a>`:"")+(s.discord?`<a href="${esc(s.discord)}" target="_blank">◈</a>`:"");
 const cards=links.map((l,i)=>`<a class="link" style="animation-delay:${i*70}ms" href="/go/${l.id}"><div class="li">${l.image?`<img src="${esc(l.image)}">`:esc(l.icon||"🔗")}</div><div class="lt"><div class="title">${esc(l.title)}</div><div class="desc">${esc(l.description||"Open this link")}</div>${l.tag?`<span class="tag">${esc(l.tag)}</span>`:""}</div><div class="arrow">›</div></a>`).join("");
 res.send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#05050a"><title>${esc(s.name||"LinkHub")} — ${esc(s.brand||"LINKHUB")}</title><style>${CSS}</style></head><body>
 ${nav(s)}
 <main class="container">
 ${s.cover?`<div class="cover"><img src="${esc(s.cover)}"></div>`:""}
 <section class="hero">
  <div class="scene"><div class="ring"></div><div class="ring"></div><div class="ring"></div><div class="core">${s.avatar?`<img src="${esc(s.avatar)}">`:"✦"}</div></div>
  <div class="avatar">${s.avatar?`<img src="${esc(s.avatar)}">`:esc((s.name||"L")[0])}</div>
  <h1>${esc(s.name||"Your Name")}</h1><div class="username">${esc(s.username||"")}</div>
  <div class="bio">${esc(s.bio||"")}</div>${s.location?`<div class="location">◉ ${esc(s.location)}</div>`:""}
  <div class="social">${socials}</div>
 </section>
 <section class="intro"><h2>${esc(s.heroTitle||"Everything. In One Place.")}</h2><p>${esc(s.heroText||"All my important links in one beautiful place.")}</p></section>
 <div class="heading"><h2>✦ Explore</h2><span>${links.length} LINKS</span></div>
 <section class="links">${cards||"<div class='box'>No links added.</div>"}</section>
 <div class="bottom"><div class="info"><b>${links.length}</b><span>LINKS</span></div><div class="info"><b>${clicks}</b><span>TOTAL CLICKS</span></div></div>
 <div class="footer">${esc(s.footer||"Made with LinkHub")} · © ${new Date().getFullYear()}</div>
 </main></body></html>`);
});

app.get("/go/:id",(req,res)=>{
 const d=read(),l=d.links.find(x=>String(x.id)===String(req.params.id));
 if(!l)return res.redirect("/");
 l.clicks=(Number(l.clicks)||0)+1;save(d);res.redirect(l.url);
});

app.get("/admin/login",(req,res)=>{
 const s=read().settings||{};
 res.send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${CSS}</style></head><body>${nav(s,true)}<main class="login box"><h1>Admin</h1><p class="small">Sign in to manage your entire website.</p><form method="post"><label>USERNAME</label><input name="user" required><label>PASSWORD</label><input type="password" name="pass" required><button>LOGIN →</button></form></main></body></html>`);
});

app.post("/admin/login",(req,res)=>{
 const d=read(),a=d.admin||{};
 if(req.body.user===a.username&&req.body.pass===a.password){req.session.admin=true;return res.redirect("/admin")}
 res.status(401).send(`<style>${CSS}</style><main class="login box"><h2>❌ Wrong login</h2><p class="small">Check your username and password.</p><a class="btn" href="/admin/login">TRY AGAIN</a></main>`);
});

app.get("/admin",auth,(req,res)=>{
 const d=read(),s=d.settings||{},links=d.links||[];
 const total=links.reduce((n,l)=>n+(Number(l.clicks)||0),0);
 const rows=links.map(l=>`<div class="linkAdmin"><form method="post" action="/admin/edit/${l.id}"><div class="grid"><div><label>IMAGE URL</label><input name="image" value="${esc(l.image||"")}"><label>ICON</label><input name="icon" value="${esc(l.icon||"🔗")}"><label>TITLE</label><input name="title" value="${esc(l.title)}" required><label>DESCRIPTION</label><input name="description" value="${esc(l.description||"")}"></div><div><label>URL</label><input name="url" value="${esc(l.url)}" required><label>TAG</label><input name="tag" value="${esc(l.tag||"")}"><label>CLICKS</label><input value="${Number(l.clicks)||0}" disabled></div></div><div class="actions"><button>SAVE LINK</button></form><form method="post" action="/admin/delete/${l.id}"><button class="danger" onclick="return confirm('Delete this link?')">DELETE</button></form></div></div>`).join("");
 res.send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin — ${esc(s.brand||"LinkHub")}</title><style>${CSS}</style></head><body>${nav(s,true)}<main class="admin">
 <div class="adminTop"><h1>Dashboard</h1><div><a class="btn" href="/" target="_blank">VIEW SITE</a> <a class="btn" href="/admin/logout">LOGOUT</a></div></div>
 <div class="bottom"><div class="info"><b>${links.length}</b><span>LINKS</span></div><div class="info"><b>${total}</b><span>CLICKS</span></div></div>
 <div class="box" style="margin-top:17px"><h2>🎨 Website & Profile</h2><form method="post" action="/admin/settings"><div class="grid"><div>
 <label>BRAND / NAV NAME</label><input name="brand" value="${esc(s.brand||"")}"><label>YOUR NAME</label><input name="name" value="${esc(s.name||"")}"><label>USERNAME</label><input name="username" value="${esc(s.username||"")}"><label>PROFILE / LOGO IMAGE URL</label><input name="avatar" value="${esc(s.avatar||"")}"><label>COVER IMAGE URL</label><input name="cover" value="${esc(s.cover||"")}"><label>LOCATION</label><input name="location" value="${esc(s.location||"")}">
 </div><div>
 <label>BIO</label><textarea name="bio">${esc(s.bio||"")}</textarea><label>HERO TITLE</label><input name="heroTitle" value="${esc(s.heroTitle||"")}"><label>HERO TEXT</label><textarea name="heroText">${esc(s.heroText||"")}</textarea><label>FOOTER TEXT</label><input name="footer" value="${esc(s.footer||"")}">
 </div></div><h3>Socials</h3><div class="grid"><div><label>INSTAGRAM</label><input name="instagram" value="${esc(s.instagram||"")}"><label>YOUTUBE</label><input name="youtube" value="${esc(s.youtube||"")}" ></div><div><label>DISCORD</label><input name="discord" value="${esc(s.discord||"")}"></div></div><button>SAVE WEBSITE</button></form></div>
 <div class="box"><h2>➕ Add Link</h2><form method="post" action="/admin/add"><div class="grid"><div><label>TITLE</label><input name="title" required><label>DESCRIPTION</label><input name="description"><label>URL</label><input name="url" required></div><div><label>IMAGE URL</label><input name="image"><label>ICON</label><input name="icon" value="🔗"><label>TAG</label><input name="tag" placeholder="VIDEO"></div></div><button>ADD LINK</button></form></div>
 <div class="box"><h2>🔗 Manage All Links</h2>${rows||"<p class='small'>No links.</p>"}</div>
 <div class="box"><h2>🔐 Change Admin Login</h2><form method="post" action="/admin/password"><div class="grid"><div><label>NEW USERNAME</label><input name="username" required></div><div><label>NEW PASSWORD</label><input type="password" name="password" required></div></div><button>UPDATE LOGIN</button></form><p class="small">Default: admin / admin123</p></div>
 </main></body></html>`);
});

app.post("/admin/settings",auth,(req,res)=>{
 const d=read();d.settings={...d.settings,brand:req.body.brand,name:req.body.name,username:req.body.username,bio:req.body.bio,avatar:req.body.avatar,cover:req.body.cover,location:req.body.location,heroTitle:req.body.heroTitle,heroText:req.body.heroText,footer:req.body.footer,instagram:req.body.instagram,youtube:req.body.youtube,discord:req.body.discord};save(d);res.redirect("/admin");
});
app.post("/admin/add",auth,(req,res)=>{
 const d=read();d.links.push({id:Date.now(),title:req.body.title,description:req.body.description||"",url:req.body.url,icon:req.body.icon||"🔗",image:req.body.image||"",tag:req.body.tag||"",clicks:0});save(d);res.redirect("/admin");
});
app.post("/admin/edit/:id",auth,(req,res)=>{
 const d=read(),l=d.links.find(x=>String(x.id)===String(req.params.id));
 if(l){l.title=req.body.title;l.description=req.body.description||"";l.url=req.body.url;l.icon=req.body.icon||"🔗";l.image=req.body.image||"";l.tag=req.body.tag||"";save(d)}res.redirect("/admin");
});
app.post("/admin/delete/:id",auth,(req,res)=>{
 const d=read();d.links=d.links.filter(x=>String(x.id)!==String(req.params.id));save(d);res.redirect("/admin");
});
app.post("/admin/password",auth,(req,res)=>{
 const d=read();d.admin={username:req.body.username,password:req.body.password};save(d);res.redirect("/admin");
});
app.get("/admin/logout",(req,res)=>req.session.destroy(()=>res.redirect("/")));

app.listen(PORT,()=>console.log("FINAL LINKHUB LIVE ON PORT "+PORT));
