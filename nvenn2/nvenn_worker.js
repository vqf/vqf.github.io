importScripts("nvenn.js");

let ready = false;
let currentsvg;
Module.onRuntimeInitialized = function() {
  ready = true;
  const msg = {
    'message': 'init'
  };
  self.postMessage(JSON.stringify(msg));
};

let svgmsg = {
  'message': 'svg'
};

self.addEventListener("message", function(e){
  if (ready){
    let msg = JSON.parse(e.data);
    if (msg.message === "inputVenn"){
      Module._init_bl(stringToNewUTF8(msg.data));
      if (Module._error()){
        console.log(UTF8ToString(Module._errorMsg()));
      }
      else{
        console.log("Loaded");
      }
    }
    else if (msg.message === "get_svg"){
      let msg = {
        'message': "svg",
        'data': UTF8ToString(currentsvg)
      };
      self.postMessage(JSON.stringify(msg));
    }
    else if (msg.message === "simulate"){
      start = performance.now();
      for (let step = 1; step < 8; step++){
        if (Module._error()){
          let msg = {
            'message': "error",
            'data': `Error (${Module._errorMsg()}), skipping ${step}`
          };
          self.postMessage(JSON.stringify(msg));
        }
        else{
          console.log(`Step ${step}`);
          let bquit = false;
          Module._set_step(step);
          if (Module._error()){
            let msg = {
              'message': 'error',
              'data': UTF8ToStrin(gModule._errorMsg())
            };
            self.postMessage(JSON.stringify(msg));
          }
          else{
            while (!bquit){
              Module._set_cycle(step);
              if (Module._error()){
                let msg = {
                  'message': 'error',
                  'data': `Error, skipping ${step}`
                };
                self.postMessage(JSON.stringify(msg));
                bquit = true;
              }
              svgmsg.data = UTF8ToString(currentsvg);
              self.postMessage(JSON.stringify(svgmsg));
              if (Module._finished(step)){
                bquit = true;
              }
            }
          }
          currentsvg = Module._svg();
        }
      }
    }
  }
  else{
    console.log("Not ready yet");
  }
});