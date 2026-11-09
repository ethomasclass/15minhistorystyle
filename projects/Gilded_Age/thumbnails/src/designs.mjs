// Short covers (1080x1920). Palette: teal #2FE0C4 draws, orange #FF9F1C tape, cream #F4EFE6 type, coral only for the Kellys.
const I = '../ep1/public/img/';
const LOGO = '../../../brand/chunk-history/final/chunk-history-mark.svg';
export const CSS = `
.big{position:absolute;left:0;right:0;text-align:center;font:800 150px/0.95 Inter;color:#F4EFE6;letter-spacing:-4px;text-shadow:0 6px 24px rgba(0,0,0,.85),0 0 4px #000}
.tape{position:absolute;left:50%;transform:translateX(-50%) rotate(-2.5deg);background:#FF9F1C;color:#111;font:800 170px/1 Inter;letter-spacing:-5px;padding:18px 44px 26px;white-space:nowrap;
 clip-path:polygon(0 6%,3% 0,20% 4%,40% 0,62% 3%,83% 0,100% 5%,98% 50%,100% 95%,80% 100%,58% 96%,35% 100%,14% 96%,0 100%,2% 50%);box-shadow:0 10px 30px rgba(0,0,0,.6)}
.pen{position:absolute;font:68px Pen;color:#2FE0C4;text-shadow:0 2px 8px #000}
.desk{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,#2a2620 0%,#16140f 70%,#0d0c09 100%)}
.cut{position:absolute;filter:drop-shadow(0 18px 30px rgba(0,0,0,.7))}
.bw{filter:grayscale(1) contrast(1.2) brightness(.97) drop-shadow(0 18px 30px rgba(0,0,0,.7))}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,transparent 50%,rgba(0,0,0,.55) 100%)}
.logo{position:absolute;left:60px;top:150px;width:110px}
`;
const V = {w: 1080, h: 1920};
export const JOBS = [
  {name: 's1_A_coil_bridge', ...V, scene: `renderScene({look:'dusk', t:3, w:1080, h:1920, cx:-200})`, strip: true,
   ov: `<div class="vig"></div><img class="cut" src="${I}props/p01_wire_coil.webp" style="left:90px;top:640px;width:900px">
   <div class="big" style="top:300px">BUILT WITH</div><div class="tape" style="top:440px">BAD WIRE</div><img class="logo" src="${LOGO}">`},
  {name: 's1_B_photo_coil', ...V, ov: `<div class="desk"></div>
   <img class="cut bw" src="${I}ch09/wire_cables_under_construction_1878.jpg" style="left:70px;top:620px;width:940px;transform:rotate(-3deg);border:14px solid #F3EAD8">
   <img class="cut" src="${I}props/p01_wire_coil.webp" style="left:360px;top:1080px;width:640px">
   <div class="big" style="top:250px">BAD WIRE.</div><div class="tape" style="top:400px;font-size:130px">STILL STANDING</div>
   <div class="pen" style="left:90px;top:1400px;transform:rotate(-4deg)">the cables, 1878</div><div class="vig"></div><img class="logo" src="${LOGO}">`},
  {name: 's2_A_son_father', ...V, ov: `<div class="desk"></div>
   <img class="cut" src="${I}desk/rockefeller_18_bust.png" style="left:-40px;top:560px;width:900px">
   <img class="cut" src="${I}desk/rockefeller_father_bust.png" style="left:640px;top:1000px;width:420px">
   <div class="big" style="top:250px">HIS DAD</div><div class="tape" style="top:390px;font-size:112px;letter-spacing:-3px">CHARGED INTEREST</div>
   <div class="pen" style="left:70px;top:1330px;transform:rotate(-4deg)">John D., about 18</div><div class="pen" style="left:700px;top:1600px;transform:rotate(-4deg)">his father</div><div class="vig"></div><img class="logo" src="${LOGO}">`},
  {name: 's2_B_father_note', ...V, ov: `<div class="desk"></div>
   <img class="cut" src="${I}props/p05_note_1868.webp" style="left:60px;top:1050px;width:760px;transform:rotate(-6deg)">
   <img class="cut" src="${I}desk/rockefeller_father_bust.png" style="left:170px;top:520px;width:740px">
   <div class="big" style="top:250px">$1,000 LOAN</div><div class="tape" style="top:390px">+ INTEREST</div>
   <div class="pen" style="left:560px;top:1560px;transform:rotate(-4deg)">from his father</div><div class="vig"></div><img class="logo" src="${LOGO}">`},
];
