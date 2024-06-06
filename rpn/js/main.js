//document.body.addEventListener('focus', allowed);
//document.body.addEventListener('blur', denied, true);
document.body.addEventListener('keydown', pressed);
const display = document.getElementById("display");
const stackDisplay = document.getElementById("stack");
const buttons = document.getElementById('buttons');
const sformula = document.getElementById('formula');
let symbolic = false;
let opstack = {};
opstack.stack = [];  // Stack as it appears in the calculator
opstack.fstack = new opArray(); // Stack for the formula

const greek = {
    'a': '\u03B1', 'b': '\u03B2', 'g': '\u03B3', 'd': '\u03B4',
    'e': '\u03B5', 'z': '\u03B6', 'h': '\u03B7', 'c': '\u03B8',
    'i': '\u03B9', 'k': '\u03BA', 'l': '\u03BB', 'm': '\u03BC',
    'n': '\u03BD', 'x': '\u03BE', 'o': '\u03BF', 'p': '\u03C0',
    'r': '\u03C1', 's': '\u03C3', 't': '\u03C4', 'u': '\u03C5',
    'f': '\u03C6', 'q': '\u03C7', 'y': '\u03C8', 'w': '\u03C9'
}

let euler = 2;
let de = 1;
for (let i = 0; i < 20; i++){
    de *= 1/(i+2);
    euler += de;
}

let pi = 3.14159265358979323846264338327950288419716939;

const btn = {
    'tag': 'button',
    'class': 'calcButton'
};

const btnsep = {
    'tag': 'br',
    'class': 'bsep'
};

function uid() {
    let l = 10;
    let result = '';
    let letters = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
      'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'
    ];
    for (let i = 0; i < l; i++) {
      let tl = 0;
      for (let j = 0; j < 4; j++) {
        tl = tl << 1;
        let r = Math.random();
        if (r > 0.5) {
          tl++;
        }
      }
      result += letters[tl];
    }
    return result;
  }


function loadTag(dsc, newId = "") {
    let result = null;
    if (typeof dsc === 'object') {
      if (dsc.hasOwnProperty('tag')) {
        let tag = dsc.tag;
        let sid = uid();
        if (newId != "") {
          sid = newId;
        }
        else if (dsc.hasOwnProperty('id')) {
          sid = dsc.id + uid;
        }
        //dsc.id = sid;
        result = document.getElementById(sid);
        if (result === null) {
        result = document.createElement(tag);
          Object.keys(dsc).forEach((k) => {
            if (k !== 'content' && k !== 'tag') {
              result.setAttribute(k, dsc[k]);
            } else if (k === 'content') {
              if (Array.isArray(dsc.content) === true) {
                dsc.content.forEach((el) => {
                  result.appendChild(loadTag(el));
                });
              } else {
                result.appendChild(loadTag(dsc.content));
              }
            }
          });
        }
      }
    } else {
      // Not an object
      result = document.createTextNode(dsc);
    }
    return result;
}

function commonFunctionTasks(op){
    opstack.fstack.push(op);
}

function showFormula(){
    const toshow = opstack.fstack.map((x) => x);
    if (symbolic){
        let t = "";
        while (toshow.length > 0){
            let op = toshow.oppop();
            let f = new formula(op);
            let h = f.tohtml();
            t += `<p class="stack"><math> ${h} </math></p>`;
        }
        stackDisplay.innerHTML = t;
    }
    else{
        toshow.push(opstack.stack[0], '=');
        const tmp = new formula(toshow);
        sformula.innerHTML = tmp.tohtml(); 
    }
}

function registerUnaryFunction(op, sigil){
    const result = function(){
        const d = display.innerHTML * 1;
        condAdd();
        if (d != d && !symbolic){
            addChar(`${sigil}`);
        }
        if (opstack.stack.length < 1){
            //noop();
        }
        else{
            commonFunctionTasks(sigil);
            if (!symbolic){
                const v1 = opstack.stack.shift() * 1;
                const r = op(v1);
                opstack.stack.unshift(r);
            }
            displayStack();
        }
    };
    return result;
}

function registerBinaryFunction(op, sigil){
    const result = function(){
        const d = display.innerHTML * 1;
        condAdd();
        if (d != d && !symbolic){
            addChar(`${sigil}`);
        }
        if (opstack.stack.length < 2){
            //noop();
        }
        else{
            commonFunctionTasks(sigil);
            if (!symbolic){
                const v2 = opstack.stack.shift() * 1;
                const v1 = opstack.stack.shift() * 1;
                const r = op(v1, v2);
                opstack.stack.unshift(r);
            }
            displayStack();
        }
    };
    return result;
}

function addButton(f, op, shortcut="", small=false, el=null){
    const b = btn;
    if (small){
        b.content = [{
            'tag': 'span',
            'class': 'shortCut',
            'content': op
        }];
    }
    else{
        b.content = [op];
    }
    if (shortcut !==""){
        b.content.push({'tag': 'span',
                       'class': 'shortCut',
                       'content': `(${shortcut})`});
    }
    const r = loadTag(b);
    r.addEventListener('click', f);
    if (el === null){
        buttons.appendChild(r);
    }
    else{
        el.appendChild(r);
    }
}

function sepButtons(el=null){
    const bsep = loadTag(btnsep);
    if (el === null){
        buttons.appendChild(bsep);
    }
    else{
        el.appendChild(bsep);
    }
}


const numbers = buttons.appendChild(loadTag({'tag': 'div', 'id': 'numbers', 'class': 'buttons'}));
for (let i = 0; i < 3; i++){
    for (let j = (3*i+1); j < (3*i+4); j++){
        const f = function(){addChar(j);};
        addButton(f, j, "", false, numbers); 
    }
    sepButtons(numbers);
}
const dpoint = function(){addChar('.');};
addButton(dpoint, '.', "", false, numbers);
for (let i = 0; i < 1; i++){
    const f = function(){addChar(i);};
    addButton(f, i, "", false, numbers); 
}
const delme = function(){addToStack();};
addButton(delme, "\u21B2", "", false, numbers);
sepButtons(numbers);
addButton(function(){addChar('E');}, 'E', "", false, numbers);
addButton(function(){neg();}, '+/-', "n", true, numbers);


const binary = buttons.appendChild(loadTag({'tag': 'div', 'class': 'buttons', 'id': 'binary'}));

const sum = registerBinaryFunction(function(a, b){return a + b;}, '+'); addButton(sum, '+', "", false, binary);
const mul = registerBinaryFunction(function(a, b){return a * b;}, '*'); addButton(mul, '*', "", false, binary);
const sub = registerBinaryFunction(function(a, b){return a - b;}, '-'); addButton(sub, '-', "", false, binary);
const div = registerBinaryFunction(function(a, b){return a / b;}, '/'); addButton(div, '/', "", false, binary);
const eq  = registerBinaryFunction(function(a, b){a=a; b=b;}, '=');
const pow = registerBinaryFunction(function(a, b){return Math.pow(a, b);}, '^'); addButton(pow, '^', "\u2191", false, binary);
const und = registerBinaryFunction(function(a, b){a=a; b=b;}, '_'); addButton(und, '_', "\u2193", false, binary);
const rt  = registerBinaryFunction(function(a, b){return Math.pow(a, 1/b);}, 'rt'); addButton(rt, '\u00AA\u221A', "", false, binary);

const unary = buttons.appendChild(loadTag({'tag': 'div', 'class': 'buttons', 'id': 'unary'}));
addButton(function(){clearDisplay(); addChar(euler);}, 'e', "", false, unary);
addButton(function(){clearDisplay(); addChar(pi);}, "\u03C0", 'p', false, unary);
const ln = registerUnaryFunction(function(a){return Math.log(a);}, 'ln'); addButton(ln, 'ln', 'l', false, unary);

const lg = registerUnaryFunction(function(a){return Math.log(a) / Math.log(10);}, 'lg'); addButton(lg, 'lg', 'o', false, unary);
const sqrt = registerUnaryFunction(function(a){return Math.sqrt(a);}, 'sqrt'); addButton(sqrt, '\u221A', '', false, unary);
sepButtons(unary);
const fsin = registerUnaryFunction(function(a){return Math.sin(a);}, 'sin'); addButton(fsin, 'sin', 's', true, unary);
const fcos = registerUnaryFunction(function(a){return Math.cos(a);}, 'cos'); addButton(fcos, 'cos', 'c', true, unary);
const ftan = registerUnaryFunction(function(a){return Math.tan(a);}, 'tan'); addButton(ftan, 'tan', 't', true, unary);
const asin = registerUnaryFunction(function(a){return Math.asin(a);}, 'asin'); addButton(asin, 'asin', "", true, unary);
const acos = registerUnaryFunction(function(a){return Math.acos(a);}, 'acos'); addButton(acos, 'acos', "", true, unary);
const atan = registerUnaryFunction(function(a){return Math.atan(a);}, 'atan'); addButton(atan, 'atan', "", true, unary);
//sepButtons(unary);
addButton(function(){pop();}, 'pop', "\u2190", true, unary);
addButton(function(){dup();}, 'dup', "\u2192", true, unary);
addButton(function(){toggleSymbolic();}, 'sym', 'y', true, unary);
//const fneg = registerUnaryFunction(function(a){return -a;}, 'neg'); addButton(fneg, 'neg', 'n', true);

function toggleSymbolic(){
    symbolic = !symbolic;
    if (symbolic){
        allowed();
    }
    else{
        denied();
    }
}

function neg(){
    const v = display.innerHTML * 1;
    if (v === v){
        display.innerHTML = -v;
    }
}

function toggleClass(el, classname) {
    if (el.classList.contains(classname)) {
      el.classList.remove(classname);
    } else {
      el.classList.add(classname);
    }
}

function addClass(el, classname){
    if (!el.classList.contains(classname)) {
        el.classList.add(classname);
    }
}

function removeClass(el, classname){
    if (el.classList.contains(classname)) {
      el.classList.remove(classname);
    }
}


function allowed(){
    addClass(display, "blockedinterf");
}
function denied(){
    removeClass(display, "blockedinterf");
}

function spressed(e){
    const k = e.keyCode;
    const v = e.key;
    if (v === "Control"){
        return;
    }
    //if (!e.ctrlKey && !e.altKey){
        e.stopPropagation(); e.preventDefault();
    //}
    if (e.ctrlKey){
        checkUnary(e);
    }
    else if (e.altKey === false){
        const oper = checkOperations(e);
        if (!oper && v.length < 2){
            addChar(v);
        }
    }
    else{
        if (Object.keys(greek).includes(v)){
            addChar(greek[v]);
        }
    }
}


function pressed(e){
    if (symbolic){
        spressed(e);
    }
    else{
        const k = e.keyCode;
        const v = e.key;
        if (!e.ctrlKey && !e.altKey){
            e.stopPropagation(); e.preventDefault();
        }
        const normalKey = (e.ctrlKey === false && e.metaKey === false && e.shiftKey === false);
        const numeric = (k >= 48 && k <= 57) || (k >= 96 && k <= 105);
        const isNumber = normalKey && numeric;
        if (isNumber ||
            (v === "E") ||
            (v === ".")){ // A number
            addChar(v);
        }
        else if (v === ","){
            addChar('.');
        }       
        else{
            checkUnary(e);
            checkOperations(e);
        }
        //console.log(e);
    }
}

function checkUnary(e){
    const v = e.key;
    let result = true;
    if (v === "e"){
        clearDisplay();
        addChar(euler);
    }
    else if (v === "p"){
        clearDisplay();
        addChar(pi);
    }
    else if (v === "s"){
        fsin();
    }
    else if (v === 'n'){
        neg();
    }
    else if (v === "c"){
        fcos();
    }
    else if (v === "t"){
        ftan();
    }
    else if (v === "l"){
        ln();
    }
    else if (v === "o"){
        lg();
    }
    else{
        result = false;
    }
    return result;
}

function checkOperations(e){
    const v = e.key;
    let result = true;
    if (v === "Enter"){
        addToStack();
    }
    else if (v === "Backspace"){
        removeChar();
    }
    else if (v === "+"){
        sum();
    }
    else if (v === "*"){
        mul();
    }
    else if (v === "-"){
        sub();
    }
    else if (v === "/"){
        div();
    }
    else if (v === "^" || v === "ArrowUp"){
        pow();
    }
    else if (v === "ArrowRight"){
        dup();
    }
    else if (v === "ArrowLeft"){
        pop();
    }
    else if (v === "ArrowDown"){
        condAdd();
        opstack.fstack.push('_');
        //addToStack();
        displayStack();
    }
    else if (v === "x"){
        exch();
    }
    else if (v === "="){
        eq();
    }
    else if (v === "Escape"){
        const d = display.innerHTML * 1;
        if (d > 0){
            clearDisplay();
        }
        else{
            clearDisplay();
            clearStack(); 
        }
    }
    else{
        result = false;
    }
    return result;
}

function condAdd(){
    const d = display.innerHTML * 1;
    if (d > 0 || symbolic){
        if (display.innerHTML !== "0"){
            addToStack();
        }
    }
}


function exch(){
    condAdd();
    if (opstack.stack.length >= 2){
        const v1 = opstack.stack.shift();
        const v2 = opstack.stack.shift();
        opstack.stack.unshift(v1);
        opstack.stack.unshift(v2);
        const fv1 = opstack.fstack.oppop();
        const fv2 = opstack.fstack.oppop();
        opstack.fstack.oppush(fv1);
        opstack.fstack.oppush(fv2);
        displayStack();
    }
}

function dup(){
    condAdd();
    if (opstack.stack.length >= 0){
        const v1 = opstack.stack.shift();
        opstack.stack.unshift(v1);
        opstack.stack.unshift(v1);
        displayStack();
        const fv1 = opstack.fstack.oppop();
        opstack.fstack.oppush(fv1);
        opstack.fstack.oppush(fv1);
    }
}

function pop(){
    //condAdd();
    if (opstack.stack.length >= 0){
        opstack.stack.shift();
        opstack.fstack.oppop();
        displayStack();
    }
}


function atStart(){
    if (display.innerHTML === "0"){
        display.innerHTML = "";
    }
}

function atEnd(){
    if (display.innerHTML === ""){
        display.innerHTML = 0;
    }
}

function clearDisplay(){
    display.innerHTML = "0";
    sformula.innerHTML = "";
}

function addChar(c){
    atStart();
    display.innerHTML = display.innerHTML + c;
    atEnd();
}

function removeChar(){
    atStart();
    display.innerHTML = display.innerHTML.substring(0, display.innerHTML.length - 1);
    atEnd();
}

function addToStack(){
    let v = display.innerHTML;
    if (!symbolic){
        v = v * 1;
    }
    opstack.stack.unshift(v);
    opstack.fstack.push(v);
    displayStack();
    clearDisplay();
}


function displayStack(){
    if (symbolic){
        showFormula();
    }
    else{
        let t = "";
        for (let i = 0; i < opstack.stack.length; i++){
            let v = opstack.stack[i];
            t += `<p class="stack"> ${v} </p>`;
        }
        stackDisplay.innerHTML = t;
        if (opstack.stack.length === 1){
            showFormula();
        }
    }
}

function clearStack(){
    opstack.stack = [];
    opstack.fstack = new opArray();
    displayStack();
}