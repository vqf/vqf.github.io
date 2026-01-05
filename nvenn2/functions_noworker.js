let example = "";
let exanim = "";
const rinfo = /<desc>([^>]+)<\/desc>/;
const nspace = /[\s\n]/gsm;
const sinfo = /<!-- signature: ([\S\n]+) -->/;
const rsetname = /<text class="legend"[^>]+>([^<]+)<\/text>/g;
const descRegex = /<desc id=['"]result['"]>(F[^<]*)<\/desc>/sm;
let currentSignature = "";
let currentSets = "";
let currentByCol = 0;

let stopSignal = false;
let running = false;
let currentAngle = 0;
let lastAngle = 0;
let rotating = false;

const stopEvent = new Event("stopped");
const endRotEvent = new Event("endRot");
const finishedSvg = new Event("finishedSvg");
const finishedTutorialStep = new Event("finishedTutorialStep");


const xdata = `IBA	IDA	IGI	TAS
MGI:3041173	MGI:102676	MGI:1913963	MGI:105975
MGI:103206	MGI:102676	MGI:1921367	MGI:97243
MGI:1333882	MGI:87906	MGI:105975	MGI:97244
MGI:2686159	MGI:109384	MGI:88385
MGI:1889364	MGI:1098259	MGI:88385
MGI:1918731	MGI:101773	MGI:2135589
MGI:1918731	MGI:2687214	MGI:88489
MGI:88022	MGI:2687214	MGI:107539
MGI:104984	MGI:106211	MGI:1914320
MGI:1201793	MGI:1929744	MGI:1914320
MGI:2656551	MGI:1929760	MGI:2444773
MGI:3528599	MGI:108445	MGI:96923
MGI:3528602	MGI:2135589	MGI:96924
MGI:1921733	MGI:2135589	MGI:108005
MGI:1932101	MGI:1861431	MGI:1328352
MGI:98229	MGI:97838	MGI:1328352
MGI:3630303	MGI:1915168	MGI:1328352
MGI:3045315	MGI:1194884	MGI:1328352
MGI:1338036	MGI:1340905	MGI:1349420
MGI:1914385	MGI:2446089	MGI:1349420
MGI:2137431	MGI:102772	MGI:1349420
MGI:2137431	MGI:95666	MGI:1349420
MGI:2177191	MGI:1926263	MGI:1349420
MGI:1916800	MGI:97072	MGI:1349420
MGI:1917562	MGI:2429943	MGI:3622649
MGI:1889272	MGI:2140937	MGI:3622649
MGI:108443	MGI:2444421	MGI:3622649
MGI:88318	MGI:1923324	MGI:3622649
MGI:109294	MGI:3605620	MGI:3622649
MGI:2443411	MGI:4359647	MGI:3622649
MGI:3032626	MGI:3641753	MGI:1346060
MGI:2153249	MGI:1933113	MGI:3045213
MGI:2387602	MGI:95851	MGI:109274
MGI:2442261	MGI:95936	MGI:98923
MGI:3036291	MGI:95938	MGI:98923
MGI:1349412	MGI:95945	MGI:2143362
MGI:1920399	MGI:1306817
MGI:3624119	MGI:1347080
MGI:1917060	MGI:99449
MGI:3588267	MGI:1915963
MGI:1298389	MGI:1913391
MGI:1861232	MGI:107668
MGI:1861231	MGI:107664
MGI:1345151	MGI:107659
MGI:1861431	MGI:2450574
MGI:88512	MGI:96540
MGI:1859822	MGI:107936
MGI:94880	MGI:1890474
MGI:94882	MGI:1890474
MGI:94883	MGI:1890474
MGI:99584	MGI:1890474
MGI:99583	MGI:107420
MGI:99582	MGI:107420
MGI:99581	MGI:107567
MGI:99580	MGI:1100508
MGI:99579	MGI:1098268
MGI:99591	MGI:1098240
MGI:99590	MGI:107539
MGI:99588	MGI:107539
MGI:99587	MGI:107539
MGI:99586	MGI:107539
MGI:99585	MGI:107538
MGI:1345152	MGI:107538
MGI:1915259	MGI:2662547
MGI:1913548	MGI:106588
MGI:3639039	MGI:106588
MGI:3630381	MGI:2140219
MGI:3630383	MGI:1918518
MGI:3630385	MGI:1918518
MGI:3630390	MGI:1914320
MGI:3642780	MGI:1330832
MGI:3646688	MGI:96923
MGI:94881	MGI:96924
MGI:3808881	MGI:3718546
MGI:102509	MGI:97009
MGI:3709048	MGI:97142
MGI:3711900	MGI:106612
MGI:3705236	MGI:2667185
MGI:3709605	MGI:104741
MGI:3611585	MGI:104741
MGI:3708769	MGI:104741
MGI:3705230	MGI:1931595
MGI:3645033	MGI:2653833
MGI:99592	MGI:1928368
MGI:102516	MGI:97361
MGI:102514	MGI:2443180
MGI:1096878	MGI:2443180
MGI:1338754	MGI:2442295
MGI:2179198	MGI:1098586
MGI:2179205	MGI:894284
MGI:2179197	MGI:102789
MGI:2672966	MGI:1917084
MGI:2672972	MGI:109432
MGI:2672974	MGI:1861032
MGI:2672976	MGI:1345275
MGI:3033850	MGI:893577
MGI:3033850	MGI:1890156
MGI:1931560	MGI:1921982
MGI:1931560	MGI:107363
MGI:1931560	MGI:107370
MGI:108021	MGI:107362
MGI:108020	MGI:1342296
MGI:1858237	MGI:98734
MGI:1858238	MGI:96824
MGI:1890463	MGI:96824
MGI:1890464	MGI:96824
MGI:3528616	MGI:96824
MGI:1349469	MGI:96824
MGI:1890169	MGI:109274
MGI:3588218	MGI:1925027
MGI:109324	MGI:1321389
MGI:95496	MGI:1858730
MGI:1340905	MGI:1336882
MGI:1341158	MGI:98932
MGI:102772	MGI:1917656
MGI:95666	MGI:105059
MGI:1926263	MGI:2143362
MGI:97072	MGI:103072
MGI:2429943
MGI:2140937
MGI:2444421
MGI:1923324
MGI:3605620
MGI:4359647
MGI:3643814
MGI:3645205
MGI:3652173
MGI:3649299
MGI:3701966
MGI:3701966
MGI:3701968
MGI:3701968
MGI:3701970
MGI:3701970
MGI:3701972
MGI:3701972
MGI:3701974
MGI:3701974
MGI:3649573
MGI:3649573
MGI:2442492
MGI:1925558
MGI:2676308
MGI:99448
MGI:1347080
MGI:96428
MGI:96429
MGI:101847
MGI:3646410
MGI:2138302
MGI:2442822
MGI:2138243
MGI:3041120
MGI:3695276
MGI:3584522
MGI:1918836
MGI:1918836
MGI:1915963
MGI:1915963
MGI:1915963
MGI:1933382
MGI:1933382
MGI:1933382
MGI:1913391
MGI:1913391
MGI:1913391
MGI:2686976
MGI:2686976
MGI:2686976
MGI:1921732
MGI:1921732
MGI:1921732
MGI:107668
MGI:107668
MGI:107666
MGI:107666
MGI:107664
MGI:107664
MGI:107663
MGI:107663
MGI:107662
MGI:107662
MGI:107661
MGI:107661
MGI:107659
MGI:107659
MGI:109210
MGI:109210
MGI:2676324
MGI:2676324
MGI:2667155
MGI:2667155
MGI:3641425
MGI:3641425
MGI:3649418
MGI:3649418
MGI:3649260
MGI:3649260
MGI:1097683
MGI:1097683
MGI:107658
MGI:1098243
MGI:107657
MGI:107657
MGI:2667156
MGI:2667156
MGI:2683287
MGI:2683287
MGI:3647279
MGI:2450574
MGI:2448469
MGI:2448469
MGI:107729
MGI:1926259
MGI:3644953
MGI:1929612
MGI:1890474
MGI:107420
MGI:107420
MGI:107420
MGI:107567
MGI:1926262
MGI:96877
MGI:107540
MGI:107539
MGI:107538
MGI:2442965
MGI:1336161
MGI:1336161
MGI:1336162
MGI:1336162
MGI:1929720
MGI:1929720
MGI:1196275
MGI:1196275
MGI:2662547
MGI:2662547
MGI:2685002
MGI:3530275
MGI:3530275
MGI:2443965
MGI:2443965
MGI:1196250
MGI:106588
MGI:1098776
MGI:2445060
MGI:2140219
MGI:3045299
MGI:1321404
MGI:1341909
MGI:2445027
MGI:109298
MGI:2143163
MGI:88492
MGI:1330832
MGI:1859396
MGI:1098644
MGI:3780953
MGI:1913539
MGI:3779286
MGI:108005
MGI:108005
MGI:97822
MGI:1890645
MGI:1340031
MGI:3612191
MGI:2684861
MGI:3582959
MGI:2180860
MGI:2180860
MGI:97430
MGI:97430
MGI:2149633
MGI:2149633
MGI:2140770
MGI:2140770
MGI:2180856
MGI:2180856
MGI:2180855
MGI:2180855
MGI:97429
MGI:97429
MGI:2180853
MGI:2180853
MGI:2180852
MGI:2180852
MGI:2180850
MGI:2180850
MGI:2180849
MGI:2180849
MGI:1344390
MGI:1344390
MGI:1098801
MGI:3577015
MGI:1933117
MGI:1919489
MGI:2144613
MGI:104662
MGI:107682
MGI:1914005
MGI:107170
MGI:104641
MGI:107741
MGI:1931465
MGI:1918910
MGI:97897
MGI:103290
MGI:103289
MGI:2149590
MGI:2442858
MGI:2442858
MGI:1891456
MGI:1890465
MGI:1858598
MGI:1925666
MGI:2156378
MGI:1919206
MGI:1913416
MGI:1927468
MGI:1921386
MGI:2441788
MGI:109297
MGI:1913770
MGI:103063
MGI:103039
MGI:1919762
MGI:1919762
MGI:1929658
MGI:98734
MGI:3710083
MGI:2147032
MGI:3040056
MGI:2182965
MGI:2182965
MGI:2152213
MGI:1341295
MGI:1346060
MGI:2156367
MGI:96824
MGI:96824
MGI:1858171
MGI:1341296
MGI:2176882
MGI:2176882
MGI:2176887
MGI:1932389
MGI:3045226
MGI:3045221
MGI:3045213
MGI:2386643
MGI:2386643
MGI:2441706
MGI:108072
MGI:1923551
MGI:1913150
MGI:1923239
MGI:1914123
MGI:3646853
MGI:2137352
MGI:2137353
MGI:1338757
MGI:2137355
MGI:1923931
MGI:4821183
MGI:1913847
MGI:1921985
MGI:1916347
MGI:1861440
MGI:106657
MGI:1337056
MGI:97904
MGI:109274
MGI:98178
MGI:4821256
MGI:4821257
MGI:3035181
MGI:2385051
MGI:2137359
MGI:4821264
MGI:1914104
MGI:2684869
MGI:1890659
MGI:2684881
MGI:2384814
MGI:3645218
MGI:3648996
MGI:3647365
MGI:1931835
MGI:2664992
MGI:3045276
MGI:1889623
MGI:3036269
MGI:2685298
MGI:2685298
MGI:2684862
MGI:1914199
MGI:2387430
MGI:2387432
MGI:1914775
MGI:2447992
MGI:2142077
MGI:1918178
MGI:3612190
MGI:2685640
MGI:2687279
MGI:3642989
MGI:1349462
MGI:1344410
MGI:1859307
MGI:1859307
MGI:1859307
MGI:2679720
MGI:98943
MGI:1916618
MGI:1916618
MGI:1914951
MGI:1923897
MGI:2384800
MGI:3652032
MGI:3616889
MGI:3651686
MGI:2183434
MGI:3582777
MGI:1915471
MGI:2445041
MGI:2670994
MGI:3649773
MGI:107506
MGI:1913357
MGI:1927449
MGI:1915167
MGI:1915167
MGI:1918046
MGI:1923573
MGI:1918414
`;
/*
class dragInfo{
  constructor(){
    this.x = 0;
    this.isdragging = false;
  }
  isDragging(){
    return this.dragging;
  }
  startDragging(x, y){
    this.dragging = true;
    this.x = x;
    this.y = y;
  }
  probeDragging(x, y){
    const result = [this.x, this.y, x, y];
    return result;
  }
  endDragging(x, y){
    this.dragging = false;
    const result = this.probeDragging(x, y);
    return result;
  }
  val(){
    return this.x;
  }
}

let dinfo = new dragInfo();*/

function rotateVenn(e){
  const v = bodrot.value;
  currentAngle = v * 1;
  const diff = currentAngle - lastAngle;
  let ang = 2 * 3.141592654 * diff / 360;
  Module._rotate_venn(ang);
  bod.innerHTML = UTF8ToString(Module._svg());
  lastAngle = v;
  current_angle.innerHTML = `${currentAngle.toFixed(2)}&deg;`;
  document.dispatchEvent(finishedSvg);
}
/*

function doRotate(ang){
  Module._rotate_venn(ang);
  bod.innerHTML = UTF8ToString(Module._svg());
}

function startRotation(e){
  dinfo.startDragging(dinfo.val(), 0);
}

function rotationTasks(e){
  let dx = e.offsetX;
  let Dx = e.target.offsetWidth;
  let val = 360 * dx / Dx;
  bodrot.value = val;
  current_angle.innerHTML = `${val.toFixed(2)}&deg;`;
  let diff = dx - dinfo.val();
  dinfo.startDragging(e.offsetX, 0);
  let ang = 2 * 3.141592654 * diff / Dx;
  return ang;
}

function keepRotation(e){
  if (dinfo.isDragging()){
    let ang = rotationTasks(e);
    doRotate(ang);
  }
}

function endRotation(e){
  let ang = rotationTasks(e);
  doRotate(ang);
  //console.log(ang);
  dinfo.endDragging(e.offsetX , 0);
}*/

Module.onRuntimeInitialized = function() {
  //const tr = stringToNewUTF8("nVenn12 jsons/49CE6E11.json\n4\nS_salivarius\nOther\nGAS\nGCS/GGS\n0\n2\n12\n0\n28\n7\n6\n0\n84\n15\n11\n0\n16\n2\n1\n0\n");
  //example = stringToNewUTF8('nVenn12\n6\niba\nic\nida\niea\niss\nnas\n0\n39\n2\n0\n20\n0\n0\n0\n287\n39\n2\n0\n16\n1\n0\n0\n10\n0\n0\n0\n3\n0\n1\n0\n49\n4\n0\n0\n2\n0\n0\n0\n7\n0\n0\n0\n0\n0\n0\n0\n1\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n1\n0\n');
  example = stringToNewUTF8('nVenn1.2\n6\nLAKI ncRNA UP\nLAKI ncRNA DOWN\nTMS ncRNA UP\nTMS ncRNA DOWN\nZhou ncRNA UP\nZhou ncRNA DOWN\n0\n136\n130\n0\n299\n24\n16\n0\n18\n2\n7\n0\n0\n0\n0\n0\n22\n3\n6\n0\n7\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n49\n5\n6\n0\n11\n0\n1\n0\n2\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0');

  exanim = example;
};

let step = 1;
let gobble = 30;
let counter = 0;
setInterval(() => {
  //lg.innerHTML = `<p>FPS: ${counter}</p><p>Gobble: ${gobble}</p>`;
  if (counter > 50){
    gobble++;
  }
  else if (counter < 30 && gobble > 1){
    gobble--;
  }
  counter = 0;
}, 1000);

async function sendSets(){
  stopSignal = true;
  await blockUntilEvent("stopped", running);
  stopSignal = false;
  const t = document.getElementById('reg');
  const ic = document.getElementById('iscol');
  const ir = document.getElementById('isrow');
  const txt = t.value;
  initInterface();
  if (txt.length > 0){
    let bycol = 0;
    if (ic.checked){
      bycol = 1;
    }
    if (ir.checked){
      bycol = 2;
    }
    step = 1;
    currentSets = txt;
    currentByCol = bycol;
    const snd = stringToNewUTF8(txt);
    Module._load_sets(snd, bycol);
    Module._set_step(step);
    showStep();
    gobble = 30;
    showCat();
    requestAnimationFrame(aloop);
  }

}

function showCat(){
  let cat = document.getElementById('cat');
  cat.classList.remove('hidden');
  cat.classList.add('shown');
}

function hideCat(){
  let cat = document.getElementById('cat');
  cat.classList.add('hidden');
  cat.classList.remove('shown');
}


function loadPrevRun(){
  const inf = infile.files[0];
  const reader = new FileReader();
  reader.readAsText(inf, "UTF-8");
  reader.addEventListener('load', function(e){
    const ftxt = e.target.result;
    const ftext = ftxt.replace(nspace, "");
    let txt = descRegex.exec(ftext);
    if (txt && txt.length > 0){
      const tsnd = stringToNewUTF8(txt[1]);
      Module._restore_prev(tsnd);
      let error = Module._error();
      if (error > 0){
        console.log(UTF8ToString(Module._errorMsg()));
      }
      else{
        //let svgcode = UTF8ToString(Module._svg());
        prepareResult();
        //refreshSVG();
      }
    }
    else{
      alert("Invalid file. The input file must be an html or svg file downloaded from a previous run");
    }
  });
}

async function pauseRun(){
  stopSignal = true;
  await blockUntilEvent("stopped", running);
  info.innerHTML = "Animation paused";
}


async function sendFile(e){
  stopSignal = true;
  await blockUntilEvent("stopped", running);
  const inp = e.target.files[0];
  const reader = new FileReader();
  reader.readAsText(inp, "UTF-8");
  reader.addEventListener('load', function(e){reg.value = e.target.result});
}

function pasteExample(){
  reg.value = xdata;
}

function blockUntilEvent(docEvent, checkFirst) {
  if (checkFirst){
    return new Promise(resolve => document.addEventListener(
      docEvent,
      resolve,
      {
        passive: true,
        once: true,
      },
    ));
  }
  else{
    return new Promise(resolve => resolve());
  }
}

async function reSend(){
  //if (currentSets !== ""){
    stopSignal = true;
    await blockUntilEvent("stopped", running);
    step = 1;
    //const snd = stringToNewUTF8(currentSets);
    //Module._load_sets(snd, currentByCol);
    Module._reset();
    Module._set_step(step);
    showStep();
    stopSignal = false;
    setAllEdits();
    gobble = 30;
    showCat();
    requestAnimationFrame(aloop);
  //}
}

function countOutputLines(){
  const t = outp.value;
  const a = t.split("\n");
  return a.length;
}

async function writeClipboardText(text) {
  try {
    await navigator.clipboard.writeText(text);
    const n = countOutputLines();
    const msg = document.createElement('div');
    msg.classList.add('popover');
    msg.popover = "auto";
    msg.innerHTML = `Copied ${n} elements to the clipboard`;
    document.body.appendChild(msg);
    msg.showPopover();
  } catch (error) {
    console.error(error.message);
  }
}

function copyRegion(){
  const t = outp.value;
  writeClipboardText(t);
}

function xanim(){
  example = exanim;
  anim();
}

function debug(){
  Module._rotate_venn(0.1);
  let svgcode = UTF8ToString(Module._svg());
  bod.innerHTML = svgcode;

}

function reload(){
  if (currentSignature.length > 0){
    Module._load_signature(stringToNewUTF8(currentSignature));
    info.innerHTML = "";
    let error = Module._error();
    if (error > 0){
      info.innerHTML = UTF8ToString(Module._errorMsg());

    }
    else{
      Module._set_step(1);
//      console.log(UTF8ToString(Module._svg()));
      showCat();
      requestAnimationFrame(aloop);
    }

    //requestAnimationFrame(aloop);
  }
}

async function reset(){
  stopSignal = true;
  await blockUntilEvent("stopped", running);
  stopSignal = false;
  document.getElementById("defaultTab").click();
  document.getElementById("guess").click();
  reg.value = "";
  outp.value = "";
  chkboxdiv.innerHTML = "";
  const emptysvg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  emptysvg.setAttributeNS(null, "viewBox", "0 0 700 500");
  bod.innerHTML = "";
  bod.appendChild(emptysvg);
  const cp = document.querySelectorAll('.cpick');
  for (cpi of cp){
    cpi.parentNode.removeChild(cpi);
  }
  const tagain = document.getElementById('tagain');
  if (tagain !== null){
    tagain.parentNode.removeChild(tagain);
  }
  Module._reset();
}

function anim(){
  Module._init_bl(example);
  Module._set_step(step);
  //info.innerHTML = step;
  //console.log(UTF8ToString(Module._svg()));
  bod.classList.remove('bigSVG');
  bod.classList.add('smallSVG');
  showCat();
  requestAnimationFrame(aloop);
}

function rint(top){
  return Math.floor(Math.random() * (top - 1) ) + 1;
}

function setRandom(){
  const maxRegs = 20;
  const ngroups = 2 + rint(7);
  let nreg = 1 << ngroups;
  const ntop = 100;
  let nonz = 1 + rint(nreg);
  if (nonz > maxRegs){
    nonz = maxRegs;
  }
  if (nonz < 3){
    nonz = 3;
  }
  const nv = [];
  //alert(nonz);
  // Header
  nv.push('nVenn2');
  nv.push(ngroups);
  for (let i = 0; i < ngroups; i++){
    nv.push(`Group${i+1}`);
  }
  nv.push(0);
  for (let i = 0; i < (nreg - 1); i++){
    let n = rint(ntop);
    nv.push(n);
  }
  // Set zeroes
  const nz = nreg - nonz;
  //console.log(nz);
  for (let i = 0; i < nz; i++){
    let eln = rint(nreg);
    let vn = eln + ngroups + 1;
    while (nv[vn] === 0){
      eln = rint(nreg);
      vn = eln + ngroups + 1;
    }
    nv[vn] = 0;
  }
  //console.log(nv);
  const ntext = nv.join("\n");
  //console.log(ntext);
  example = stringToNewUTF8(ntext);
  anim();
}

function showStep(){
  info.innerHTML = `${step} / 7`;
}

function aloop(){
  running = true;
  let error = Module._error();
  if (error > 0 || stopSignal){
    info.innerHTML = UTF8ToString(Module._errorMsg());
    prepareResult(error);
    stopSignal = false;
    running = false;
    document.dispatchEvent(stopEvent);
    return;
  }
  else{
    for (let i = 0; i < gobble; i++){
      Module._set_cycle(step);
    }
    if (Module._finished(step) === 0){
      let svgcode = UTF8ToString(Module._svg());
      bod.innerHTML = svgcode;
      let desc = rinfo.exec(svgcode);
      let nfo = desc[1];
      if (nfo !== undefined){
        let lines = "<p>" + nfo.split(';').join("</p><p>") + "</p>";
        lg.innerHTML = lines;
        /*if (/CANDIDATE/.test(info)){
         *     console.log(info);
      }*/
      }
      start = performance.now();
      counter++;
      requestAnimationFrame(aloop);
    }
    else{
      if (step < 7 && error === 0){
        //alert(`Finished step ${step}`);
        if (step === 1){
          const s = UTF8ToString(Module._svg());
          //let sign = sinfo.exec(s);
          //let sg = sign[1];
          //currentSignature = sg;
          //sig.innerHTML = sg;
        }
        step++;
        showStep();
        let iserr = Module._set_step(step);
        requestAnimationFrame(aloop);
        return;
      }
      else{
        hideCat();
        info.innerHTML = "Done";
        running = false;
        prepareResult(error);
        return;
      }
    }
  }

}

function addEditingElements(){
  let svgresult = bod.innerHTML;
  const setnames = [];
  let names = rsetname.exec(svgresult);
  removeCheckBoxes();
  removeColorPicks();
  while (names !== null){
    setnames.push(names[1]);
    names = rsetname.exec(svgresult);
  }
  for (let i in setnames){
    let cb = setCheckBox(`groupchk${1*i+1}`, i, setnames[i]);
    cb.addEventListener('change', intersection);
    chkboxdiv.appendChild(cb);
  }
  let rcts = document.querySelectorAll('rect[class~="borderLine"');
  for (let el of rcts){
    let i = el.dataset.nbit;
    let b = el.getBoundingClientRect();
    let stl = window.getComputedStyle(el);
    let color = stl.getPropertyValue("fill");
    let id = `c${i}`;
    let p = document.getElementById(id);
    if (p === null){
      p = colorPick(i, window.scrollX + b.x, window.scrollY + b.y, b.width, b.height);
      p.value = rgb2Hex(color);
      let onthefly = function (e) {
        changeColor(e.target.value, i);
      };
      p.addEventListener('input', onthefly);
      document.body.appendChild(p);
    }
    else{
      p.setPropertyValue('left', `${b.x}px`);
      p.top = `${b.y}px`;
      p.width = `${b.width}px`;
      p.height = `${b.height}px`;
    }

  }
}




function prepareResult(error){
  refreshSVG();
  step = 1;
  if (error > 0){
    info.innerHTML = UTF8ToString(Module._errorMsg());
  }
  addEditingElements();
  document.getElementById('analysis').click();
  for (const c of cboxes){
    c.addEventListener('click', intersection);
  }
  intersection();
  const g = document.getElementById('tagain');
  if (g === null){
    const tagain = document.createElement('button');
    tagain.id = 'tagain';
    tagain.classList.add('rightflex');
    tagain.textContent = "Try again";
    tagain.addEventListener('click', reSend);
    const el = document.getElementById('topsvg');
    el.appendChild(tagain);
  }
  document.dispatchEvent(finishedSvg);
}

function uint8ToHex(u){
  let r = u.toString(16);
  let result = (r.length === 1) ? '0' + r : r;
  return result;
}

function rgb2Hex(t){
  const re = /(\d+)[;,\s]+(\d+)[;,\s]+(\d+)/;
  const c = re.exec(t);
  const r = 1 * c[1];
  const g = 1 * c[2];
  const b = 1 * c[3];
  const result = `#${uint8ToHex(r)}${uint8ToHex(g)}${uint8ToHex(b)}`;
  return result;
}

function hex2Rgb(n){
  const getn = /#*([\w\d]+)/;
  const s = getn.exec(n);
  const tmp = `0x${s[1]}`;
  const t = 0x01 * tmp;
  const blue = t & 0xFF;
  const g = t >> 0x08;
  const green = g & 0xFF;
  const r = g >> 0x08;
  const red = r & 0xFF;
  const result = [red, green, blue];
  return result;

}

function colorPick(nset, x, y, w, h){
  const id = `c${nset}`;
  const r = document.createElement('input');
  r.classList.add('cpick');
  r.type = "color";
  r.id = id;
  r.dataset.nset = nset;
  r.style.left = `${x}px`;
  r.style.top = `${y}px`;
  r.style.width = `${w}px`;
  r.style.height = `${h}px`;
  return r;
}

function changeColor(v, nset){
  const rgb = hex2Rgb(v);
  Module._set_color(1 * nset + 1, 1 * rgb[0], 1 * rgb[1], 1 * rgb[2]);
  refreshSVG();
}

function refreshSVG(){
  const svgcode = UTF8ToString(Module._svg());
  bod.innerHTML = svgcode;
  addEditingElements();
}

function setOpacity(){
  const v = opac.value;
  if (v < 0){
    v = 0;
  }
  if (v > 1){
    v = 1;
  }
  opacv.innerHTML = v;
  Module._set_opacity(v);
  refreshSVG();
  document.dispatchEvent(finishedSvg);
}

function changePalette(){
  const v = palette.value;
  Module._set_palette(v);
  refreshSVG();
  document.dispatchEvent(finishedSvg);
}

function changeFontSize(){
  const v = fsize.value;
  Module._set_font_size(v);
  refreshSVG();
  document.dispatchEvent(finishedSvg);
}

function changeLineWidth(){
  const v = linew.value;
  Module._set_line_width(v);
  refreshSVG();
  document.dispatchEvent(finishedSvg);
}

function setAllEdits(){

  const colrs = document.getElementsByClassName('cpick');
  for (let cl of colrs){
    let nset = 1 * cl.dataset.nset;
    const rgb = hex2Rgb(cl.value);
    Module._set_color(nset + 1, 1 * rgb[0], 1 * rgb[1], 1 * rgb[2]);
  }

  const vo = opac.value;
  if (vo < 0){
    vo = 0;
  }
  if (vo > 1){
    vo = 1;
  }
  opacv.innerHTML = vo;
  Module._set_opacity(vo);
  //console.log(vo);

  const vp = palette.value;
  Module._set_palette(vp);

  const vf = fsize.value;
  Module._set_font_size(vf);

  const vl = linew.value;
  Module._set_line_width(vl);

  const vs = srs.checked;
  let s = (vs) ? 1 : 0
  Module._show_region_size(s);

  const vd = srd.checked;
  s = (vd) ? 1 : 0
  Module._show_region_description(s);

  refreshSVG();
}

function intersection(){
  let region = 0;
  const checks = document.getElementsByClassName('cbox');
  for (const c of checks){
    if (c.checked){
      let n = c.dataset.nbit;
      region += 1 << n;
    }
  }
  setout(region);
}

function setout(nreg){
  outp.value = UTF8ToString(Module._get_region(nreg));
}

function fromCircle(nreg){
  document.getElementById("analysis").click();
  for (let i = 0; i < cboxes.length; i++){
    let nb = 1 << i;
    if ((nreg & nb) > 0){
      cboxes[i].checked = true;
    }
    else{
      cboxes[i].checked = false;
    }
  }
  setout(nreg);
}


function setCheckBox(id, nbit, setname){
  const result = document.createElement('span');
  result.classList.add('dynamicCheckBox');
  const c = document.createElement('input');
  c.type = 'checkbox';
  c.classList.add('cbox');
  c.id = id;
  c.name = id;
  c.dataset.nbit = nbit;
  const l = document.createElement('label');
  l.for = id;
  l.appendChild(document.createTextNode(setname));
  const s = document.createElement('script');
  const code = document.createTextNode(`cboxes.push(document.getElementById('${id}'));`);
  s.appendChild(code);
  result.appendChild(c);
  result.appendChild(l);
  result.appendChild(s);
  return result;
}

function removeCheckBoxes(){
  cboxes = [];
  let s = document.querySelector('span.dynamicCheckBox');
  while (s !== null){
    s.parentNode.removeChild(s);
    s = document.querySelector('span.dynamicCheckBox')
  }
}

function removeColorPicks(){
  let s = document.querySelector('input.cpick');
  while (s !== null){
    s.parentNode.removeChild(s);
    s = document.querySelector('input.cpick');
  }
}


function makePNG(img, jname, callback){
  let canvas = document.createElement('canvas');
  const newW = img.width;
  const newH = img.height;
  canvas.width = newW;
  canvas.height = newH;

  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, newW, newH);

  let canvasdata = canvas.toDataURL('image/png');
  let a = document.createElement('a');
  a.id="safelink";
  a.download = jname + ".png";
  a.href=canvasdata;
  if (currentUrl !== null){window.URL.revokeObjectURL(currentUrl);}
  currentUrl = canvasdata;
  callback(a);
}

function downloadLink(a){
  const lnk = document.getElementById('safelink');
  const p = lnk.parentNode;
  const cnt = lnk.innerHTML;
  a.innerHTML = cnt;
  p.removeChild(lnk);
  p.appendChild(a);
  a.click();
  dlg.close();
  dlg2.show();
}

function toggleSizes(){
  const v = srs.checked;
  let s = (v) ? 1 : 0
  Module._show_region_size(s);
  refreshSVG();
}

function toggleDesc(){
  const v = srd.checked;
  let s = (v) ? 1 : 0;
  Module._show_region_description(s);
  refreshSVG();
}

function toPNG(jname){
  const svg = document.getElementsByTagName('svg')[0];
  const svg_xml = (new XMLSerializer()).serializeToString(svg);
  const blob = new Blob([svg_xml], {type:'image/svg+xml;charset=utf-8'});
  const url = window.URL.createObjectURL(blob);
  var newW = 2800;
  var newH = 2000;
  var img = new Image();
  img.width = newW;
  img.height = newH;
  img.src = url;
  if (currentUrl !== null){window.URL.revokeObjectURL(currentUrl);}
  currentUrl = url;
  img.addEventListener('load', function(){makePNG(img, jname, downloadLink)});
}

function toSVG(jname){
  const svg = document.getElementsByTagName('svg')[0];
  const svg_xml = (new XMLSerializer()).serializeToString(svg);
  const blob = new Blob([svg_xml], {type:'image/svg+xml;charset=utf-8'});
  const url = window.URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.id="safelink";
  a.download = jname + ".svg";
  a.href=url;
  if (currentUrl !== null){window.URL.revokeObjectURL(currentUrl);}
  currentUrl = url;
  downloadLink(a);
}

function preparesvg(){
  //dlg.showModal();
  toSVG();
}

function preparepng(){
  //dlg.showModal();
  downloadpng();
}

function downloadpng(){
  toPNG(outf.value);
}

function checkfilename(e){
  if (e.keyCode === 13){
    downloadpng();
  }
}

function toHTML(jname){
  const svg = UTF8ToString(Module._html());
  console.log(svg);
  //const svg_xml = (new XMLSerializer()).serializeToString(svg);
  const blob = new Blob([svg], {type:'text/html;charset=utf-8'});
  const url = window.URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.id="safelink";
  a.download = jname + ".html";
  a.href=url;
  if (currentUrl !== null){window.URL.revokeObjectURL(currentUrl);}
  currentUrl = url;
  downloadLink(a);
}

function dhtml(){
  dlg.showModal();
  toHTML(outf.value);
}

function openTab(evt, tabName) {
  // Declare all variables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabName).style.display = "block";
  if (evt === null){
    let ct = document.getElementById("defaultTab");
    ct.currentTarget.className += " active";
  }
  else{
    evt.currentTarget.className += " active";
  }
}


function resetHighlight(e){
  e.target.classList.remove('highlighted');
  e.target.removeEventListener('animationend', resetHighlight);
}

function highlight(el){
  el.scrollIntoView({'behavior': 'smooth'});
  el.classList.add('highlighted');
  el.addEventListener('animationend', resetHighlight);
}




const tutorialSteps = [
  {'anchor': 'tut', 'popover': 'helpTut'},
  {'anchor': 'exampledata', 'popover': 'examplePopover'},
  {'anchor': 'reg', 'popover': 'helpreg', 'extra': function(){xample.click()}},
  {'anchor': 'inputfile', 'popover': 'helpFileTable'},
  {'anchor': 'iscol', 'popover': 'helpsets'},
  {'anchor': 'inputdata', 'popover': 'helpMake', 'extra': setByCol},
  {'anchor': 'screen', 'popover': 'helpSvg', 'trigger': "finishedSvg", 'extra': function(){inputSets.click()}},
  {'anchor': 'groupchk3', 'popover': 'helpExplore', 'extra': function(){fromCircle(3)}},
  {'anchor': 'copyRegion', 'popover': 'helpCopy', 'extra': checkTheThird},
  {'anchor': 'c2', 'popover': 'helpColor'},
  {'anchor': 'c2', 'popover': 'demo', 'extra': changeThirdColor, 'trigger': "finishedTutorialStep"},
  {'anchor': 'rotat', 'popover': 'helpRotate'},
  {'anchor': 'rotat', 'popover': 'demo', 'extra': showRotation, 'trigger': "finishedTutorialStep"},
  {'anchor': 'opac', 'popover': 'helpOpacity'},
  {'anchor': 'opac', 'popover': 'demo', 'extra': showOpacity, 'trigger': "finishedTutorialStep"},
  {'anchor': 'palette', 'popover': 'helpPalette'},
  {'anchor': 'palette', 'popover': 'demo', 'extra': showPalettes, 'trigger': "finishedTutorialStep"},
  {'anchor': 'linew', 'popover': 'helpLinew'},
  {'anchor': 'linew', 'popover': 'demo', 'extra': showLinew, 'trigger': "finishedTutorialStep"},
  {'anchor': 'fsize', 'popover': 'helpFsize'},
  {'anchor': 'fsize', 'popover': 'demo', 'extra': showFsize, 'trigger': "finishedTutorialStep"},
  {'anchor': 'srs', 'popover': 'helpSrs'},
  {'anchor': 'srs', 'popover': 'demo', 'extra': showSrs, 'trigger': "finishedTutorialStep"},
  {'anchor': 'srd', 'popover': 'helpSrd'},
  {'anchor': 'srd', 'popover': 'demo', 'extra': showSrd, 'trigger': "finishedTutorialStep"},
  {'anchor': 'tagain', 'popover': 'tryAgain'},
  {'anchor': 'getPNG', 'popover': 'saveDiagram'},
  {'anchor': 'infile', 'popover': 'helpload'}
];
let currentTutorialStep = 0;


function setByCol(){
  const iscol = document.getElementById('iscol');
  iscol.click();
}

function checkTheThird(){
  const trd = document.getElementById('groupchk3');
  trd.click();
}

async function changeThirdColor(){
  const cp = document.getElementById('c2');
  const democolors = ['#000000', '#ff00ff', '#00ffff', 'ffff00'];
  for (let c of democolors){
    cp.value = c;
    changeColor(c, 2);
    await new Promise(r => setTimeout(r, 1000));
  }
  document.dispatchEvent(finishedTutorialStep);
}

async function showSrs(){
  for (let i = 0; i < 4; i++){
    srs.click()
    await new Promise(r => setTimeout(r, 1000));
  }
  document.dispatchEvent(finishedTutorialStep);
}


async function showSrd(){
  for (let i = 0; i < 4; i++){
    srd.click()
    await new Promise(r => setTimeout(r, 1000));
  }
  document.dispatchEvent(finishedTutorialStep);
}


async function showSomething(obj, step, interval, extremeValues, updateFunct){
  const oldVal = 1 * obj.value;
  let newVal = oldVal;
  for (let extreme of extremeValues){
    let rev = -1;
    if (extreme > newVal){
      rev = 1;
    }
    while ((rev * newVal) < (rev * extreme)){
      newVal += rev * step;
      obj.value = newVal;
      updateFunct();
      await blockUntilEvent("finishedSvg");
      await new Promise(r => setTimeout(r, interval));
    }
  }
  document.dispatchEvent(finishedTutorialStep);
}

function showFsize(){
  showSomething(fsize, 2, 500, [8, 16, 12], changeFontSize)
}

function showOpacity(){
  showSomething(opac, 0.1, 100, [1, 0, 0.2], setOpacity);
}

function showRotation(){
  showSomething(bodrot, 10, 100, [100, 10], rotateVenn);
}

function showLinew(){
  showSomething(linew, 1, 500, [0, 4, 2], changeLineWidth);
}

async function showPalettes(){
  showSomething(palette, 1, 1000, [0, 3], changePalette);
}

function tutorialStep(e){
  if (e.type !== "toggle"){
    document.removeEventListener(e.type, tutorialStep);
  }
  if (e === undefined || e === null || e.type !== "toggle" || (e.type === "toggle" && e.newState === "closed")){
    currentTutorialStep++;
    if (currentTutorialStep < tutorialSteps.length){
      const pid = tutorialSteps[currentTutorialStep - 1].anchor;
      prev = document.getElementById(pid);
      const nid = tutorialSteps[currentTutorialStep].anchor;
      const popid = tutorialSteps[currentTutorialStep].popover;
      const trigger = tutorialSteps[currentTutorialStep].trigger;
      const xtra = tutorialSteps[currentTutorialStep].extra;
      const pop = document.getElementById(popid);
      const nxt = document.getElementById(nid);
      highlight(nxt);
      if (pop !== null && pop !== undefined){
        pop.showPopover();
      }
      if (nxt !== null){
        prev.classList.remove("anchor");
        nxt.classList.add("anchor");
      }
      if (xtra !== null && xtra !== undefined){
        xtra();
      }
      if (trigger !== null && trigger !== undefined){
        document.addEventListener(trigger, tutorialStep);
      }
      else if (pop !== null && pop !== undefined){
        pop.addEventListener('toggle', tutorialStep);
      }
    }
    else{
      cleanTutorial();
    }
  }
}

function cleanTutorial(){
  const currentAnchors = document.getElementsByClassName("anchor");
  const currentHand = document.getElementById("tutHand");
  currentTutorialStep = 0;
  if (currentAnchors.length > 0){
    for (let anch of currentAnchors){
      anch.classList.remove("anchor");
    }
  }
  if (currentHand !== null){
    document.body.removeChild(currentHand);
  }
  reset();
}

function tutorial(){
  /*highlight(inputSets);*/
  cleanTutorial();
  const nid = tutorialSteps[0].anchor;
  const pid = tutorialSteps[0].popover;
  const fid = document.getElementById(nid);
  const fpop = document.getElementById(pid);
  const pointer = document.createElement('img');
  pointer.id="tutHand";
  pointer.src="pointer.svg";
  pointer.classList.add("moveto");
  tut.classList.add("anchor");
  document.body.appendChild(pointer);
  fpop.showPopover();
  tut.classList.remove("anchor");
  fid.classList.add("anchor");
  fpop.addEventListener('toggle', tutorialStep);
}
