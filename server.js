const express=require("express"),session=require("express-session"),fs=require("fs");
const app=express(),PORT=process.env.PORT||10000,DB="./links.json";
const AU=process.env.ADMIN_USER||"admin",AP=process.env.ADMIN_PASS||"admin123",SS=process.env.SESSION_SECRET||"change-this-secret";

app.use(express.urlencoded({extended:true}));app.use(express.json());
app.use(session({secret:SS,resave:false,saveUninitialized:false,cookie:{httpOnly:true,secure:process.env.NODE_ENV==="production",maxAge:86400000}}));

const initial={
 profile:{name:"ROXE",username:"@roxe",bio:"Everything you need, all in one place.",avatar:"",instagram:"",youtube:"",discord:""},
 links:[{id:1,title:"LinkPays",description:"Open my LinkPays link",url:"https://linkpays.in/6v8yU8",icon:"🔗",clicks:0}]
};
if(!fs.existsSync(DB))fs.writeFileSync(DB,JSON.stringify(initial,null,2));
function read(){let d=JSON.parse(fs.readFileSync(DB));d.profile||={};d.links||=[];return d}
function save(d){fs.writeFileSync(DB,JSON.stringify(d,null,2))}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function auth(req,res,next){req.session.admin?next():res.redirect("/admin/login")}

const style=`
*{box-sizing:border-box}body{margin:0;background:#05050a;color:#fff;font-family:Inter,Arial,sans-serif;min-height:100vh}
body:before{content:"";position:fixed;inset:0;z-index:-5;background:radial-gradient(circle at 15% 15%,#7c3aed44,transparent 30%),radial-gradient(circle at 85% 70%,#06b6d433,transparent 30%),#05050a}
nav{position:fixed;top:18px;left:50%;transform:translateX(-50%);width:min(680px,92%);z-index:20;padding:10px 12px;border:1px solid #ffffff18;border-radius:20px;background:#0d0d14b8;backdrop-filter:blur(25px);display:flex;align-items:center;justify-content:space-between;box-shadow:0 15px 50px #0008}
.brand{font-weight:900;font-size:16px;letter-spacing:.5px}.navlinks{display:flex;gap:7px}.navlinks a{color:#aaa;text-decoration:none;padding:9px 13px;border-radius:12px;font-size:13px;font-weight:700}.navlinks a:hover,.navlinks .active{background:#ffffff12;color:#fff}
.container{width:min(680px,92%);margin:auto;padding:115px 0 45px}.hero{text-align:center;animation:appear .7s ease}
.avatar{width:108px;height:108px;margin:auto;border-radius:34px;display:grid;place-items:center;font-size:40px;font-weight:900;background:linear-gradient(135deg,#8b5cf6,#06b6d4);box-shadow:0 20px 70px #7c3aed55;overflow:hidden;border:1px solid #ffffff20}.avatar img{width:100%;height:100%;object-fit:cover}
h1{font-size:35px;margin:17px 0 3px;letter-spacing:-1.5px}.username{color:#8d88a0;font-size:13px}.bio{color:#b5afc3;line-height:1.6;font-size:14px;max-width:530px;margin:12px auto 18px}
.social{display:flex;justify-content:center;gap:8px;margin-bottom:28px}.social a{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;text-decoration:none;color:#fff;background:#ffffff0b;border:1px solid #ffffff17;font-size:18px;transition:.25s}.social a:hover{transform:translateY(-4px);background:#ffffff17}
.links{display:grid;gap:13px}.link{position:relative;display:flex;align-items:center;gap:15px;padding:13px 16px;min-height:78px;border:1px solid #ffffff16;border-radius:23px;background:linear-gradient(105deg,#ffffff11,#ffffff06);backdrop-filter:blur(22px);box-shadow:0 15px 45px #0007;text-decoration:none;color:#fff;overflow:hidden;transition:.3s;animation:up .6s both}.link:after{content:"";position:absolute;width:180px;height:180px;border-radius:50%;background:#8b5cf622;filter:blur(45px);right:-90px;top:-90px}.link:hover{transform:translateY(-5px) scale(1.012);border-color:#ffffff32;box-shadow:0 22px 60px #0009}.icon{width:49px;height:49px;border-radius:16px;display:grid;place-items:center;background:#ffffff0c;border:1px solid #ffffff13;font-size:23px;flex:none;z-index:1}.lt{flex:1;min-width:0;z-index:1}.title{font-weight:850;font-size:16px}.desc{font-size:12px;color:#9993a8;margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.arrow{font-size:24px;color:#858091;z-index:1}.footer{text-align:center;color:#5e5969;font-size:11px;margin-top:28px}
.panel{width:min(1000px,94%);margin:auto;padding:105px 0 40px}.box{padding:22px;margin-bottom:18px;border:1px solid #ffffff15;border-radius:22px;background:#ffffff08;backdrop-filter:blur(20px)}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.top h1{margin:0;font-size:27px}.btn,button{display:inline-block;border:0;border-radius:12px;padding:11px 16px;background:linear-gradient(135deg,#7c3aed,#0891b2);color:white;text-decoration:none;font-weight:800;cursor:pointer}.danger{background:#b42335}.muted{color:#928b9e;font-size:12px}input,textarea{width:100%;padding:13px;margin:7px 0 13px;border-radius:12px;border:1px solid #ffffff17;background:#05050a;color:#fff;outline:0}textarea{min-height:80px;resize:vertical}label{font-size:12px;color:#aaa3b5}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.linkadmin{border:1px solid #ffffff12;border-radius:17px;padding:15px;margin-top:11px}.linkhead{display:flex;gap:12px;align-items:center}.actions{display:flex;gap:7px;margin-top:8px;flex-wrap:wrap}.stat{font-size:12px;color:#999;margin-top:7px}
.login{width:min(400px,92%);margin:15vh auto}
@keyframes up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}@keyframes appear{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}
@media(max-width:600px){h1{font-size:29px}.grid{grid-template-columns:1fr}.container{padding-top:105px}.panel{padding-top:100px}.top{gap:10px}.top h1{font-size:22px}}
`;

function nav(admin=false){return `<nav><div class="brand">✦ ROXE</div><div class="navlinks"><a href="/" class="${!admin?"active":""}">Home</a><a href="/admin" class="${admin?"active":""}">Admin</a></div></nav>`}

app.get("/",(req,res)=>{
 const d=read(),p=d.profile;
 const socials=(p.instagram?`<a href="${esc(p.instagram)}" target="_blank">◎</a>`:"")+(p.youtube?`<a href="${esc(p.youtube)}" target="_blank">▶</a>`:"")+(p.discord?`<a href="${esc(p.discord)}" target="_blank">◈</a>`:"");
 const links=d.links.map((l,i)=>`<a class="link" style="animation-delay:${i*70}ms" href="/go/${l.id}"><div class="icon">${esc(l.icon||"🔗")}</div><div class="lt"><div class="title">${esc(l.title)}</div><div class="desc">${esc(l.description||"Open link")}</div></div><div class="arrow">›</div></a>`).join("");
 res.send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.name)} — Links</title><style>${style}</style></head><body>${nav(false)}<main class="container"><section class="hero"><div class="avatar">${p.avatar?`<img src="${esc(p.avatar)}">`:esc((p.name||"R")[0])}</div><h1>${esc(p.name||"ROXE")}</h1><div class="username">${esc(p.username||"")}</div><div class="bio">${esc(p.bio||"")}</div><div class="social">${socials}</div></section><section class="links">${links||"<div class='bio'>No links available.</div>"}</section><div class="footer">© ${new Date().getFullYear()} ${esc(p.name||"ROXE")} · All links in one place</div></main></body></html>`)
});

app.get("/go/:id",(req,res)=>{
 let d=read(),l=d.links.find(x=>String(x.id)===String(req.params.id));
 if(!l)return res.redirect("/");
 l.clicks=(l.clicks||0)+1;save(d);res.redirect(l.url);
});

app.get("/admin/login",(req,res)=>res.send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${style}</style></head><body>${nav(true)}<div class="login box"><h1>Admin Login</h1><p class="muted">Manage your complete LinkHub.</p><form method="post"><label>Username</label><input name="user" required><label>Password</label><input type="password" name="pass" required><button>Login</button></form></div></body></html>`));

app.post("/admin/login",(req,res)=>{
 if(req.body.user===AU&&req.body.pass===AP){req.session.admin=true;return res.redirect("/admin")}
 res.status(401).send("Invalid username or password. <a href='/admin/login'>Back</a>");
});

app.get("/admin",auth,(req,res)=>{
 const d=read(),p=d.profile;
 const total=d.links.reduce((a,l)=>a+(l.clicks||0),0);
 const rows=d.links.map(l=>`<div class="linkadmin"><form method="post" action="/admin/edit/${l.id}"><div class="linkhead"><input name="icon" value="${esc(l.icon||"🔗")}" style="width:65px"><div style="flex:1"><label>Title</label><input name="title" value="${esc(l.title)}" required><label>Description</label><input name="description" value="${esc(l.description||"")}"><label>URL</label><input name="url" value="${esc(l.url)}" required></div></div><div class="actions"><button>Save Changes</button></form><form method="post" action="/admin/delete/${l.id}"><button class="danger" onclick="return confirm('Delete this link?')">Delete</button></form></div><div class="stat">📊 ${l.clicks||0} clicks</div></div>`).join("");
 res.send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${style}</style></head><body>${nav(true)}<main class="panel"><div class="top"><h1>Admin Dashboard</h1><div><a class="btn" href="/" target="_blank">View Site</a> <a class="btn" href="/admin/logout">Logout</a></div></div><div class="box"><b>📊 ${d.links.length} Links</b> &nbsp; <span class="muted">${total} total clicks</span></div><div class="box"><h2>Profile</h2><form method="post" action="/admin/profile"><div class="grid"><div><label>Name</label><input name="name" value="${esc(p.name)}"><label>Username</label><input name="username" value="${esc(p.username||"")}"><label>Avatar URL</label><input name="avatar" value="${esc(p.avatar||"")}"></div><div><label>Bio</label><textarea name="bio">${esc(p.bio||"")}</textarea><label>Instagram</label><input name="instagram" value="${esc(p.instagram||"")}"><label>YouTube</label><input name="youtube" value="${esc(p.youtube||"")}"><label>Discord</label><input name="discord" value="${esc(p.discord||"")}"></div></div><button>Save Profile</button></form></div><div class="box"><h2>➕ Add New Link</h2><form method="post" action="/admin/add"><div class="grid"><div><label>Title</label><input name="title" placeholder="My YouTube Channel" required><label>URL</label><input name="url" placeholder="https://..." required></div><div><label>Icon / Emoji</label><input name="icon" value="🔗"><label>Description</label><input name="description" placeholder="Watch my latest videos"></div></div><button>Add Link</button></form></div><div class="box"><h2>🔗 Manage Links</h2>${rows||"<p class='muted'>No links added.</p>"}</div></main></body></html>`)
});

app.post("/admin/profile",auth,(req,res)=>{
 let d=read();d.profile={name:req.body.name||"ROXE",username:req.body.username||"",bio:req.body.bio||"",avatar:req.body.avatar||"",instagram:req.body.instagram||"",youtube:req.body.youtube||"",discord:req.body.discord||""};save(d);res.redirect("/admin");
});
app.post("/admin/add",auth,(req,res)=>{
 let d=read();d.links.push({id:Date.now(),title:req.body.title,url:req.body.url,description:req.body.description||"",icon:req.body.icon||"🔗",clicks:0});save(d);res.redirect("/admin");
});
app.post("/admin/edit/:id",auth,(req,res)=>{
 let d=read(),l=d.links.find(x=>String(x.id)===String(req.params.id));if(l){l.title=req.body.title;l.url=req.body.url;l.description=req.body.description||"";l.icon=req.body.icon||"🔗";save(d)}res.redirect("/admin");
});
app.post("/admin/delete/:id",auth,(req,res)=>{
 let d=read();d.links=d.links.filter(x=>String(x.id)!==String(req.params.id));save(d);res.redirect("/admin");
});
app.get("/admin/logout",(req,res)=>req.session.destroy(()=>res.redirect("/")));

app.listen(PORT,()=>console.log("FINAL LINKHUB running on port "+PORT));
