const express=require("express");
const session=require("express-session");
const fs=require("fs");
const path=require("path");

const app=express();
const PORT=process.env.PORT||10000;
const USER=process.env.ADMIN_USER||"admin";
const PASS=process.env.ADMIN_PASS||"change-me";
const SECRET=process.env.SESSION_SECRET||"change-this-secret";

const FILE=path.join(__dirname,"links.json");

if(!fs.existsSync(FILE)){
 fs.writeFileSync(FILE,JSON.stringify([
  {id:Date.now(),title:"LinkPays",url:"https://linkpays.in/6v8yU8",icon:"💸"}
 ],null,2));
}

const getLinks=()=>JSON.parse(fs.readFileSync(FILE,"utf8"));
const saveLinks=x=>fs.writeFileSync(FILE,JSON.stringify(x,null,2));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
 secret:SECRET,
 resave:false,
 saveUninitialized:false,
 cookie:{
  httpOnly:true,
  secure:process.env.NODE_ENV==="production",
  maxAge:86400000
 }
}));

const css=`
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
 margin:0;
 min-height:100vh;
 font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
 color:#fff;
 background:#050509;
 overflow-x:hidden;
}
body:before{
 content:"";
 position:fixed;
 width:600px;height:600px;
 top:-220px;left:-180px;
 background:radial-gradient(circle,rgba(137,70,255,.28),transparent 65%);
 filter:blur(35px);
 animation:orb1 12s ease-in-out infinite alternate;
 pointer-events:none;
}
body:after{
 content:"";
 position:fixed;
 width:600px;height:600px;
 right:-220px;bottom:-250px;
 background:radial-gradient(circle,rgba(0,180,255,.20),transparent 65%);
 filter:blur(40px);
 animation:orb2 15s ease-in-out infinite alternate;
 pointer-events:none;
}
@keyframes orb1{to{transform:translate(160px,130px) scale(1.25)}}
@keyframes orb2{to{transform:translate(-130px,-100px) scale(1.3)}}

canvas{
 position:fixed;
 inset:0;
 z-index:-1;
 opacity:.65;
}

.container{
 width:min(520px,92%);
 margin:auto;
 padding:55px 0 40px;
 position:relative;
 z-index:2;
}

.profile{
 text-align:center;
 animation:enter .9s cubic-bezier(.2,.8,.2,1);
}
@keyframes enter{
 from{opacity:0;transform:translateY(35px) scale(.96)}
 to{opacity:1;transform:none}
}

.avatar{
 width:92px;height:92px;
 margin:auto;
 border-radius:50%;
 display:grid;
 place-items:center;
 font-size:38px;
 background:linear-gradient(145deg,#171722,#08080d);
 border:1px solid rgba(255,255,255,.16);
 box-shadow:
 0 0 0 7px rgba(255,255,255,.025),
 0 20px 70px rgba(125,70,255,.3),
 inset 0 1px rgba(255,255,255,.18);
 transform:perspective(600px) rotateX(4deg);
}
.profile h1{
 margin:18px 0 5px;
 font-size:30px;
 letter-spacing:-1px;
}
.profile p{
 margin:0;
 color:#9d9daa;
 font-size:14px;
}

.links{
 margin-top:30px;
 display:grid;
 gap:14px;
}

.link{
 position:relative;
 display:flex;
 align-items:center;
 gap:14px;
 min-height:68px;
 padding:10px 18px 10px 12px;
 color:white;
 text-decoration:none;
 border:1px solid rgba(255,255,255,.11);
 border-radius:19px;
 background:linear-gradient(135deg,rgba(255,255,255,.09),rgba(255,255,255,.025));
 backdrop-filter:blur(18px);
 box-shadow:0 14px 40px rgba(0,0,0,.25),inset 0 1px rgba(255,255,255,.08);
 overflow:hidden;
 transition:transform .35s cubic-bezier(.2,.8,.2,1),border .35s,box-shadow .35s;
 animation:linkIn .7s both;
}
.link:nth-child(1){animation-delay:.08s}
.link:nth-child(2){animation-delay:.14s}
.link:nth-child(3){animation-delay:.20s}
.link:nth-child(4){animation-delay:.26s}
.link:nth-child(5){animation-delay:.32s}
@keyframes linkIn{
 from{opacity:0;transform:translateY(20px)}
 to{opacity:1;transform:none}
}
.link:before{
 content:"";
 position:absolute;
 top:0;left:-120%;
 width:70%;height:100%;
 background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);
 transform:skewX(-20deg);
 transition:.7s;
}
.link:hover:before{left:140%}
.link:hover{
 transform:translateY(-5px) scale(1.015);
 border-color:rgba(160,110,255,.45);
 box-shadow:0 22px 55px rgba(0,0,0,.38),0 0 30px rgba(120,70,255,.12);
}
.icon{
 width:46px;height:46px;
 flex:none;
 display:grid;
 place-items:center;
 border-radius:14px;
 background:rgba(255,255,255,.08);
 font-size:22px;
 box-shadow:inset 0 1px rgba(255,255,255,.12);
}
.link span:nth-child(2){
 flex:1;
 font-weight:650;
 font-size:15px;
}
.arrow{
 color:#777784;
 font-size:21px;
 transition:.3s;
}
.link:hover .arrow{
 color:#fff;
 transform:translateX(4px);
}

.footer{
 text-align:center;
 color:#555562;
 font-size:11px;
 margin-top:28px;
}

.adminWrap{
 width:min(900px,94%);
 margin:auto;
 padding:35px 0 60px;
}
.panel{
 padding:25px;
 margin-bottom:18px;
 border-radius:24px;
 border:1px solid rgba(255,255,255,.1);
 background:rgba(15,15,23,.72);
 backdrop-filter:blur(22px);
 box-shadow:0 20px 70px rgba(0,0,0,.35);
}
.panel h1,.panel h2{margin-top:0}
input{
 width:100%;
 padding:14px 15px;
 margin:7px 0 12px;
 border-radius:12px;
 border:1px solid rgba(255,255,255,.12);
 outline:none;
 background:rgba(0,0,0,.35);
 color:#fff;
 font-size:14px;
}
input:focus{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(139,92,246,.12)}
button,.btn{
 display:inline-flex;
 justify-content:center;
 align-items:center;
 border:0;
 border-radius:12px;
 padding:13px 17px;
 background:linear-gradient(135deg,#8b5cf6,#6366f1);
 color:white;
 text-decoration:none;
 font-weight:700;
 cursor:pointer;
 transition:.25s;
}
button:hover,.btn:hover{transform:translateY(-2px);filter:brightness(1.1)}
.red{background:#b91c1c}
.linkItem{
 padding:18px;
 margin:12px 0;
 border-radius:17px;
 background:rgba(255,255,255,.04);
 border:1px solid rgba(255,255,255,.08);
}
.actions{display:flex;gap:8px;flex-wrap:wrap}
.small{color:#858592;font-size:12px}
.topbar{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:18px}
.error{color:#ff7777;margin-bottom:15px;text-align:center}

@media(max-width:600px){
 .container{padding-top:35px}
 .profile h1{font-size:27px}
 .panel{padding:18px}
}
`;

const htmlStart=(title)=>`<!doctype html>
<html><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title>
<style>${css}</style>
</head><body>`;

const canvas=`
<canvas id="bg"></canvas>
<script>
const c=document.getElementById("bg"),x=c.getContext("2d");
let W,H,p=[];
function resize(){
 W=c.width=innerWidth*devicePixelRatio;
 H=c.height=innerHeight*devicePixelRatio;
 c.style.width=innerWidth+"px";
 c.style.height=innerHeight+"px";
 p=Array.from({length:45},()=>({
  x:Math.random()*W,y:Math.random()*H,
  z:Math.random()*1+.3,
  a:Math.random()*Math.PI*2,
  s:.15+Math.random()*.45
 }));
}
resize();addEventListener("resize",resize);
function draw(){
 x.clearRect(0,0,W,H);
 for(const q of p){
  q.a+=.003;
  q.x+=Math.cos(q.a)*q.s;
  q.y+=Math.sin(q.a)*q.s;
  if(q.x<0)q.x=W;if(q.x>W)q.x=0;
  if(q.y<0)q.y=H;if(q.y>H)q.y=0;
  x.beginPath();
  x.arc(q.x,q.y,1.3*q.z*devicePixelRatio,0,Math.PI*2);
  x.fillStyle="rgba(180,160,255,"+(.16*q.z)+")";
  x.fill();
 }
 requestAnimationFrame(draw);
}
draw();
</script>`;

function esc(s){
 return String(s).replace(/[&<>"']/g,m=>({
 "&":"&amp;","<":"&lt;",">":"&gt;",
 '"':"&quot;","'":"&#039;"
 }[m]));
}

function auth(req,res,next){
 if(req.session.admin)return next();
 res.redirect("/admin/login");
}

app.get("/",(req,res)=>{
 const links=getLinks();
 res.send(htmlStart("My Links")+canvas+`
 <main class="container">
  <section class="profile">
   <div class="avatar">⚡</div>
   <h1>My Links</h1>
   <p>Everything you need, in one place.</p>
  </section>

  <section class="links">
   ${links.map(l=>`
   <a class="link" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">
    <div class="icon">${esc(l.icon||"🔗")}</div>
    <span>${esc(l.title)}</span>
    <span class="arrow">›</span>
   </a>`).join("")}
  </section>

  <div class="footer">© ${new Date().getFullYear()} • All links</div>
 </main></body></html>`);
});

app.get("/admin/login",(req,res)=>{
 res.send(htmlStart("Admin Login")+`
 <main class="adminWrap">
  <div class="panel">
   <h1>Admin Panel</h1>
   <p class="small">Manage your public links.</p>
   ${req.query.error?'<div class="error">Invalid username or password.</div>':""}
   <form method="post" action="/admin/login">
    <input name="user" placeholder="Username" required>
    <input name="pass" type="password" placeholder="Password" required>
    <button type="submit">Login</button>
   </form>
  </div>
 </main></body></html>`);
});

app.post("/admin/login",(req,res)=>{
 if(req.body.user===USER&&req.body.pass===PASS){
  req.session.admin=true;
  return res.redirect("/admin");
 }
 res.redirect("/admin/login?error=1");
});

app.get("/admin",auth,(req,res)=>{
 const links=getLinks();
 res.send(htmlStart("Dashboard")+`
 <main class="adminWrap">
  <div class="topbar">
   <h1>Dashboard</h1>
   <div class="actions">
    <a class="btn" href="/" target="_blank">View Page</a>
    <form method="post" action="/admin/logout"><button>Logout</button></form>
   </div>
  </div>

  <div class="panel">
   <h2>➕ Add New Link</h2>
   <form method="post" action="/admin/add">
    <input name="title" placeholder="Link title — e.g. My LinkPays" required>
    <input name="url" type="url" placeholder="https://example.com/..." required>
    <input name="icon" maxlength="4" placeholder="Emoji — e.g. 💸">
    <button type="submit">Add Link</button>
   </form>
  </div>

  <div class="panel">
   <h2>🔗 Your Links (${links.length})</h2>
   ${links.length?links.map((l,i)=>`
    <div class="linkItem">
     <div style="font-size:17px;font-weight:700">${i+1}. ${esc(l.icon||"🔗")} ${esc(l.title)}</div>
     <div class="small" style="word-break:break-all;margin:7px 0 14px">${esc(l.url)}</div>
     <form method="post" action="/admin/edit/${l.id}">
      <input name="title" value="${esc(l.title)}" required>
      <input name="url" type="url" value="${esc(l.url)}" required>
      <input name="icon" maxlength="4" value="${esc(l.icon||"🔗")}">
      <div class="actions">
       <button type="submit">Save Changes</button>
       <button class="red" type="submit" formaction="/admin/delete/${l.id}" formmethod="post">Delete</button>
      </div>
     </form>
    </div>`).join(""):`<p class="small">No links yet.</p>`}
  </div>
 </main></body></html>`);
});

app.post("/admin/add",auth,(req,res)=>{
 const links=getLinks();
 links.push({
  id:Date.now(),
  title:req.body.title,
  url:req.body.url,
  icon:req.body.icon||"🔗"
 });
 saveLinks(links);
 res.redirect("/admin");
});

app.post("/admin/edit/:id",auth,(req,res)=>{
 const links=getLinks();
 const l=links.find(x=>String(x.id)===String(req.params.id));
 if(l){
  l.title=req.body.title;
  l.url=req.body.url;
  l.icon=req.body.icon||"🔗";
  saveLinks(links);
 }
 res.redirect("/admin");
});

app.post("/admin/delete/:id",auth,(req,res)=>{
 saveLinks(getLinks().filter(x=>String(x.id)!==String(req.params.id)));
 res.redirect("/admin");
});

app.post("/admin/logout",(req,res)=>{
 req.session.destroy(()=>res.redirect("/admin/login"));
});

app.listen(PORT,()=>console.log("\\n🚀 LinkHub 3D running on port "+PORT+"\\n"));
