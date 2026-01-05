let example = "";
let exanim = "";
const rinfo = /<desc>([^>]+)<\/desc>/;
const sinfo = /<!-- signature: ([\S]+) -->/;
let currentSignature = "";

let currentsvg = "";

const nworker = new Worker("nvenn_worker.js");
example = 'nVenn12\n6\niba\nic\nida\niea\niss\nnas\n0\n7\n10\n0\n287\n1\n49\n0\n20\n0\n3\n0\n16\n0\n2\n0\n2\n0\n0\n0\n2\n0\n0\n0\n0\n0\n1\n0\n0\n0\n0\n0\n39\n0\n0\n0\n39\n0\n4\n0\n0\n0\n0\n0\n1\n0\n0\n1\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n0\n';
exanim = example;

function showLoop(){
  bod.innerHTML = currentsvg;
  requestAnimationFrame(showLoop);
}

function xanim(){
  let init = {
    'message': 'simulate',
    'data': example
  };
  nworker.postMessage(JSON.stringify(init));
  requestAnimationFrame(showLoop);
}

function setRandom(){
  const ngroups = 6;
  const nreg = 1 << ngroups;
  const ntop = 100;
  const nonz = 15;
  const nv = [];
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
  console.log(nz);
  for (let i = 0; i < nz; i++){
    let eln = rint(nreg);
    let vn = eln + ngroups + 1;
    while (nv[vn] === 0){
      eln = rint(nreg);
      vn = eln + ngroups + 1;
    }
    nv[vn] = 0;
  }
  console.log(nv);
  const ntext = nv.join("\n");
  console.log(ntext);
  example = stringToNewUTF8(ntext);
}

nworker.addEventListener("message", function(e){
  let msg = JSON.parse(e.data);
  if (msg.message === 'init'){
    let init = {
      'message': 'inputVenn',
      'data': example
    };
    nworker.postMessage(JSON.stringify(init));
  }
  else if (msg.message === 'svg'){
    currentsvg = msg.data;
  }
});