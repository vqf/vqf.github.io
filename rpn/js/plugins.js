// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

class formula{
  constructor(elements=null){
    this.type = 'root';
    this.content = [];
    this.precission = 8;
    this.levels = {
        '+': 0,
        '-': 0,
        '*': 1,
        '/': 2,
        '^': 3,
        '_': 3
    };
    this.level = 10;
    this.nel = 0;
    if (elements === null){
        return;
    }
    if (elements.length < 2){
        this.type = "atom";
        this.content = [elements[0]];
    }
    else{
        for (let i = 0; i < elements.length; i++){
            const el = elements[i];
            if (this.isSign(el)){
                const nel = this.narity(el);
                const nstack = [];
                for (let j = 0; j < nel; j++){
                    const ll = this.content.pop();
                    nstack.push(ll);
                }
                const c = this.solve(el, nstack);
                c.nel = nel;
                c.level = this.levels[el];
                this.content.push(c);
            }
            else{
                const nxt = new formula([el]);
                this.content.push(nxt);
            }
        }
    }
  }
  solve(op, elements){
    const r = new formula();
    r.type = op;
    r.content = elements;
    return r;
  }
  narity(c){
    const unary = ['ln', 'lg', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt'];
    const binary = ['=', '+', '-', '*', '/', '^', '_', 'rt'];
    let result = 0;
    const one =  unary.filter((w) => w === c);
    const two = binary.filter((w) => w === c);
    if (one.length > 0){
        result = 1;
    }
    if (two.length > 0){
        result = 2;
    }
    return result;
  }
  isSign(c){
    const signs = ['=', '+', '-', '*', '/',
                   '^', '_', 'rt', 'ln', 'lg', 'sin',
                   'cos', 'tan', 'asin', 'acos',
                   'atan', 'sqrt'];
    let result = false;
    for (let i = 0; i < signs.length; i++){
        result = result || (c === signs[i]);
    }
    return result;
  }
  tohtml(){
    let result = '';
    if (this.type === 'atom'){
        let r = this.content[0];
        /*if (Number.isFinite(r)){
            r = r.toFixed();
        }*/
        result = `<mn>${r}</mn>`;
    }
    if (this.type === 'root'){
        let cont = '';
        for (let i = 0; i < this.content.length; i++){
            cont += this.content[i].tohtml();
        }
        result = `<math>${cont}</math>`;
    }
    if (this.type === '/'){
        result = `<mfrac><mrow>${this.content[1].tohtml()}</mrow><mrow>${this.content[0].tohtml()}</mrow></mfrac>`;
    }
    else if (this.type === '='){
        result = `${this.content[1].tohtml()}<mo>=</mo>${this.content[0].tohtml()}`;
    }
    else if (this.type === '^'){
        let spar = '';
        let epar = '';
        if (this.content[1].level < this.level){
            spar = '<mo>(</mo>';
            epar = '<mo>)</mo>';
        }
        result = `<msup><mrow>${spar}${this.content[1].tohtml()}${epar}</mrow><mrow>${this.content[0].tohtml()}</mrow></msup>`;
    }
    else if (this.type === '_'){
        let spar = '';
        let epar = '';
        if (this.content[1].level < this.level){
            spar = '<mo>(</mo>';
            epar = '<mo>)</mo>';
        }
        result = `<msub><mrow>${spar}${this.content[1].tohtml()}${epar}</mrow><mrow>${this.content[0].tohtml()}</mrow></msub>`;
    }
    else if (this.type === 'sqrt'){
        result = `<msqrt>${this.content[0].tohtml()}</msqrt>`;
    }
    else if (this.type === 'rt'){
        result = `<mroot>${this.content[1].tohtml()}${this.content[0].tohtml()}</mroot>`;
    }
    else if (this.nel === 2){
        let fst = this.content[1].tohtml();
        let scd = this.content[0].tohtml();
        if (this.content[1].level < this.level){
            fst = '<mo>(</mo>' + fst + '<mo>)</mo>';
        }
        if (this.content[0].level < this.level){
            scd = '<mo>(</mo>' + scd + '<mo>)</mo>';
        }
        result = fst + `<mo>${this.type}</mo>` + scd;
    }
    else if (this.nel === 1){
        const l = this.type;
        result = `<mtext>${l}</mtext><mo>(</mo>${this.content[0].tohtml()}<mo>)</mo>`;
    }
    return result;
  }
}


class opArray extends Array{
    oppop(){
        let counter = 1;
        let result = [];
        while (this.length > 0 && counter > 0){
            let c = this.pop();
            result.unshift(c);
            let n = this.narity(c) - 1;
            counter += n;
        }
        return result;
    }
    oppush(v){
        this.push.apply(this, v);
    }
    narity(c){
        const unary = ['ln', 'lg', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt'];
        const binary = ['=', '+', '-', '*', '/', '^', '_'];
        let result = 0;
        const one =  unary.filter((w) => w === c);
        const two = binary.filter((w) => w === c);
        if (one.length > 0){
            result = 1;
        }
        if (two.length > 0){
            result = 2;
        }
        return result;
    }
    clone(){
        const r = this;
        return r;
    }
}