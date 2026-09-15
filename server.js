const express=require("express");
const app=express();
const PORT=process.env.PORT||10000;

const LINK="https://linkpays.in/6v8yU8";

app.get("/",(req,res)=>{
res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="theme-color" content="#07110b">
<title>Minecraft Shader Pack</title>

<style>
*{box-sizing:border-box;margin:0;padding:0}

body{
font-family:Arial,Helvetica,sans-serif;
min-height:100vh;
color:white;
background:
linear-gradient(180deg,#061008aa,#020603ee),
url("https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2000&q=90")
center/cover fixed;
overflow-x:hidden;
}

body:before{
content:"";
position:fixed;
inset:0;
background:
radial-gradient(circle at 20% 20%,#39ff8a33,transparent 25%),
radial-gradient(circle at 80% 30%,#00aaff22,transparent 25%),
linear-gradient(transparent 96%,#0005);
pointer-events:none;
}

.container{
width:min(900px,92%);
margin:auto;
padding:45px 0 55px;
text-align:center;
}

.badge{
display:inline-block;
padding:9px 17px;
border:1px solid #ffffff25;
border-radius:30px;
background:#ffffff0c;
backdrop-filter:blur(15px);
font-size:11px;
font-weight:bold;
letter-spacing:2px;
color:#a8ffca;
box-shadow:0 0 35px #28ff7030;
margin-bottom:18px;
}

h1{
font-size:clamp(38px,8vw,76px);
line-height:.95;
letter-spacing:-3px;
text-shadow:0 5px 30px #000;
margin-bottom:12px;
}

.sub{
font-size:14px;
color:#c5d0c8;
margin-bottom:28px;
}

.scene{
height:270px;
position:relative;
perspective:900px;
margin-bottom:5px;
}

.ring{
position:absolute;
left:50%;
top:50%;
width:220px;
height:220px;
border:2px solid #54ff9860;
border-radius:50%;
transform:translate(-50%,-50%) rotateX(65deg);
box-shadow:0 0 55px #36ff7840;
animation:spin 10s linear infinite;
}

.ring:nth-child(2){
width:175px;
height:175px;
border-color:#50c8ff55;
animation-duration:7s;
animation-direction:reverse;
}

.ring:nth-child(3){
width:285px;
height:285px;
border-color:#9cff4a30;
animation-duration:16s;
}

.cube{
position:absolute;
left:50%;
top:50%;
transform:translate(-50%,-50%) rotateX(-15deg) rotateY(25deg);
width:105px;
height:105px;
border-radius:22px;
background:
linear-gradient(135deg,#69ff9b,#157a3b);
box-shadow:
0 0 25px #44ff8066,
0 25px 70px #000b,
inset 0 0 30px #ffffff22;
animation:float 4s ease-in-out infinite;
}

.cube:before{
content:"";
position:absolute;
inset:12px;
border-radius:12px;
background:
linear-gradient(135deg,#9affb6,#1c9a4d);
opacity:.75;
}

.cube:after{
content:"";
position:absolute;
width:35px;
height:35px;
left:28px;
top:27px;
background:#172719;
box-shadow:43px 0 #172719,21px 37px #172719;
opacity:.9;
}

.card{
position:relative;
margin:auto;
max-width:650px;
padding:14px;
border-radius:30px;
background:#07100bd9;
border:1px solid #ffffff20;
backdrop-filter:blur(25px);
box-shadow:
0 30px 100px #000b,
0 0 60px #35ff6520;
}

.image-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:10px;
margin-bottom:15px;
}

.image{
height:145px;
border-radius:20px;
overflow:hidden;
position:relative;
border:1px solid #ffffff15;
background:linear-gradient(135deg,#193d25,#07140a);
}

.image.one{
background:
linear-gradient(#0002,#0008),
linear-gradient(135deg,#5fbf55,#162b18 45%,#8bc34a);
}

.image.two{
background:
linear-gradient(#0002,#0008),
linear-gradient(135deg,#176b91,#071d2b 50%,#4a8f48);
}

.image.three{
background:
linear-gradient(#0002,#0008),
linear-gradient(135deg,#75a832,#142f18 45%,#263f9b);
}

.image:before{
content:"";
position:absolute;
inset:0;
background:
linear-gradient(135deg,transparent 48%,#ffffff12 49%,transparent 51%),
linear-gradient(45deg,transparent 48%,#0002 49%,transparent 51%);
background-size:34px 34px;
}

.image span{
position:absolute;
bottom:10px;
left:10px;
right:10px;
padding:8px;
border-radius:12px;
background:#0008;
backdrop-filter:blur(8px);
font-size:10px;
font-weight:bold;
letter-spacing:1px;
}

.download{
display:flex;
align-items:center;
justify-content:center;
gap:12px;
width:100%;
padding:19px;
border-radius:19px;
background:linear-gradient(135deg,#38ff7b,#119447);
color:#001b09;
font-size:15px;
font-weight:1000;
letter-spacing:1px;
box-shadow:
0 10px 35px #2cff7045,
inset 0 1px #ffffff88;
transition:.25s;
}

.download:hover{
transform:translateY(-5px) scale(1.015);
box-shadow:0 18px 50px #2cff7066;
}

.download:active{
transform:scale(.98);
}

.info{
margin-top:13px;
font-size:10px;
color:#829087;
}

.footer{
margin-top:28px;
font-size:10px;
color:#59645d;
letter-spacing:1px;
}

@keyframes spin{
to{transform:translate(-50%,-50%) rotateX(65deg) rotateZ(360deg)}
}

@keyframes float{
0%,100%{transform:translate(-50%,-50%) rotateX(-15deg) rotateY(25deg) translateY(0)}
50%{transform:translate(-50%,-50%) rotateX(-15deg) rotateY(205deg) translateY(-12px)}
}

@media(max-width:600px){
.container{padding-top:30px}
.scene{height:230px}
.image{height:105px}
.card{padding:10px}
h1{letter-spacing:-2px}
}

</style>
</head>

<body>

<div class="container">

<div class="badge">⚡ MINECRAFT • SHADERS • JAVA</div>

<h1>Minecraft<br>Shader Pack</h1>

<p class="sub">Transform your Minecraft world with stunning visuals.</p>

<div class="scene">
<div class="ring"></div>
<div class="ring"></div>
<div class="ring"></div>
<div class="cube"></div>
</div>

<div class="card">

<div class="image-grid">
<div class="image one"><span>🌿 BEAUTIFUL WORLD</span></div>
<div class="image two"><span>🌊 CINEMATIC WATER</span></div>
<div class="image three"><span>☀️ BETTER LIGHTING</span></div>
</div>

<a class="download" href="${LINK}" target="_blank" rel="noopener">
⬇️ CLICK TO DOWNLOAD
</a>

<div class="info">
You will be redirected to the download page.
</div>

</div>

<div class="footer">
MINECRAFT SHADER PACK • DOWNLOAD PAGE
</div>

</div>

</body>
</html>`);
});

app.listen(PORT,()=>console.log("Minecraft Shader LinkHub running on port "+PORT));
