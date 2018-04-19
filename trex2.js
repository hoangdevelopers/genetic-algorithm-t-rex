/*!
 * EventEmitter v5.2.4 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */
!function(e){"use strict";function t(){}function n(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function r(e){return function(){return this[e].apply(this,arguments)}}function i(e){return"function"==typeof e||e instanceof RegExp||!(!e||"object"!=typeof e)&&i(e.listener)}var s=t.prototype,o=e.EventEmitter;s.getListeners=function(e){var t,n,r=this._getEvents();if(e instanceof RegExp){t={};for(n in r)r.hasOwnProperty(n)&&e.test(n)&&(t[n]=r[n])}else t=r[e]||(r[e]=[]);return t},s.flattenListeners=function(e){var t,n=[];for(t=0;t<e.length;t+=1)n.push(e[t].listener);return n},s.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},s.addListener=function(e,t){if(!i(t))throw new TypeError("listener must be a function");var r,s=this.getListenersAsObject(e),o="object"==typeof t;for(r in s)s.hasOwnProperty(r)&&n(s[r],t)===-1&&s[r].push(o?t:{listener:t,once:!1});return this},s.on=r("addListener"),s.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},s.once=r("addOnceListener"),s.defineEvent=function(e){return this.getListeners(e),this},s.defineEvents=function(e){for(var t=0;t<e.length;t+=1)this.defineEvent(e[t]);return this},s.removeListener=function(e,t){var r,i,s=this.getListenersAsObject(e);for(i in s)s.hasOwnProperty(i)&&(r=n(s[i],t),r!==-1&&s[i].splice(r,1));return this},s.off=r("removeListener"),s.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},s.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},s.manipulateListeners=function(e,t,n){var r,i,s=e?this.removeListener:this.addListener,o=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(r=n.length;r--;)s.call(this,t,n[r]);else for(r in t)t.hasOwnProperty(r)&&(i=t[r])&&("function"==typeof i?s.call(this,r,i):o.call(this,r,i));return this},s.removeEvent=function(e){var t,n=typeof e,r=this._getEvents();if("string"===n)delete r[e];else if(e instanceof RegExp)for(t in r)r.hasOwnProperty(t)&&e.test(t)&&delete r[t];else delete this._events;return this},s.removeAllListeners=r("removeEvent"),s.emitEvent=function(e,t){var n,r,i,s,o,u=this.getListenersAsObject(e);for(s in u)if(u.hasOwnProperty(s))for(n=u[s].slice(0),i=0;i<n.length;i++)r=n[i],r.once===!0&&this.removeListener(e,r.listener),o=r.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,r.listener);return this},s.trigger=r("emitEvent"),s.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},s.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},s._getOnceReturnValue=function(){return!this.hasOwnProperty("_onceReturnValue")||this._onceReturnValue},s._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return e.EventEmitter=o,t},"function"==typeof define&&define.amd?define(function(){return t}):"object"==typeof module&&module.exports?module.exports=t:e.EventEmitter=t}(this||{});

var C = {
    fixed: 4,
    numGen: 20,
    // pixels
    blankPixel: {r: 0, g: 0, b: 0, a: 0},
    blackPixel: {r: 83, g: 83, b: 83, a: 255},
    dinoEyeColor: {r: 255, g: 255, b: 255, a: 255},

    // position of dino eye in running state
    reloadY: 99,
    //
    mutationRate: 0.9,
    mutateVolumn: 0.05,
    // moves
    mJump: 'M_JUMP',
    mDuck: 'M_DUCK',
    mSpace: 'M_SPACE',

    // states
    stateAirbone: 'S_AIRBONE',
    stateGround: 'S_GROUND',
    stateDuck: 'S_DUCK',
    runIntervalMs: 50,

    //look ahead configurations
    lookAheadX: 70 + 30,
    lookAheadY: 120,
    lookAheadBuffer: 200,
    birdLookAheadBuffer: 100,
    // position to look for birds in
    midBirdX: 75 + 5,
    midBirdY: 98 - 10,
    //event
    moveEvent: "MOVE_EVENT",
    duckEvent: "DUCK_EVENT",
    lookForwardDangerEvent: "LOOK_FORWARD_DANGER_EVENT",
    lookBirdDangerEvent: "LOOK_BIRD_DANGER_EVENT",
    startGameEvent: "START_GAME_EVENT",
    //broadcast
    lookForwardDangerBroadcast: "LOOK_FORWARD_DANGERB_ROADCAST",
    lookBirdDangerBroadcast: "LOOK_BIRD_DANGER_BROADCAST",
    moveBroadcast: "MOVE_BROADCAST",
    duckBroadcast: "DUCK_BROADCAST",
    startGameBroadcast: "START_GAME_BROADCAST",
};
class Game{
    // imageData;
    // canvas
    // ctx
    // width
    // height
    // loopUpdate
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.time = 0;
        this.inputEvent = new EventEmitter();
        this.outputEvent = new EventEmitter();
        this._assignInputEvent();
    }
    start(init = false) {
        this.time = 0;
        this._broadcast(C.startGameBroadcast, [init]);
        clearTimeout(this.loopUpdate);
        this._issueMove(C.mJump);
        this._run();
    }
    stop() {
        this.time = 0;
        clearTimeout(this.loopUpdate);
    }
    pause(){
        clearTimeout(this.loopUpdate);
    }
    resume(){
        clearTimeout(this.loopUpdate);
        this._run();
    }
    _run(){
        clearTimeout(this.loopUpdate);
        this.loopUpdate = setInterval(this._update.bind(this), C.runIntervalMs);
    }
    _assignInputEvent() {
        this.inputEvent.addListener(C.moveEvent, this._handleMove.bind(this));
        this.inputEvent.addListener(C.duckEvent, this._handleDuck.bind(this));
    }
    _handleMove(move, timeout) {
        this._issueMove(move, timeout);
    }
    _handleDuck(move, timeout) {
        this._issueMove(move, timeout);
    }
    _reloadImage() {
        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    }
    _broadcast(type, _args){
        switch(type) {
            case (C.lookForwardDangerBroadcast): {
                this.outputEvent.emitEvent(C.lookForwardDangerEvent, _args);
                break;
            }
            case (C.lookBirdDangerBroadcast): {
                this.outputEvent.emitEvent(C.lookBirdDangerEvent, _args);
                break;
            }
            case (C.startGameBroadcast): {
                this.outputEvent.emitEvent(C.startGameEvent, _args);
                break;
            }
            default: {
                break;
            }
        }
    }
    _update() {
        this.time += C.runIntervalMs;
        var look = this._lookForward();
        if (look.lookForwardDanger) {
            this._broadcast(C.lookForwardDangerBroadcast, [look.distanceToCactus, this.time]);
        }
        if (look.birdDanger) {
            this._broadcast(C.lookBirdDangerBroadcast, [look.distanceToBird, this.time]);
        }
    }
    _lookForward(){
        this._reloadImage();
        var lookForwardDanger = false,
            distanceToCactus = 0;
        for (var i = 0; i < C.lookAheadBuffer; i += 2) {
            if (isPixelEqual(this._getPixel(this.imageData, C.lookAheadX + i, C.lookAheadY), C.blackPixel)) {
                lookForwardDanger = true;
                distanceToCactus = i;
                break;
            }
        }
        var birdDanger = false;
        var distanceToBird = 0;
        for (i = C.midBirdX; i < C.midBirdX + C.birdLookAheadBuffer; i += 2) {
            if (isPixelEqual(this._getPixel(this.imageData, i, C.midBirdY), C.blackPixel)) {
                birdDanger = true;
                distanceToBird = i;
                break;
            }
        }
        var lossGame = false;
        var reloadPixel = this._getPixel(this.imageData, this.width/2, C.reloadY);
        if (isPixelEqual(reloadPixel, C.blackPixel)) {
            this.timeReloadBlack += 1;
        } else {
            this.timeReloadBlack = 0;
        }
        if (this.timeReloadBlack > 50) {
            this.timeReloadBlack = 0;
            clearTimeout(this.loopUpdate);
            this.start();
        }
        return {
            birdDanger,
            distanceToBird,
            lookForwardDanger,
            distanceToCactus
        }
    }
    _getPixel(imgData, x, y) {
        var dataStart = (x + y * this.width) * 4;
    
        return {
            r: imgData.data[dataStart],
            g: imgData.data[dataStart + 1],
            b: imgData.data[dataStart + 2],
            a: imgData.data[dataStart + 3]
        };
    }
    _issueMove(move, timeout) {
        switch (move) {
            case C.mJump:
                if (!timeout) {
                    timeout = 85;
                }
                issueKeyPress('keydown', 38);
                setTimeout(function() {
                    issueKeyPress('keyup', 38);
                }, timeout);
                break;
    
            case C.mDuck:
                if (!timeout) {
                    timeout = 200;
                }
    
                issueKeyPress('keydown', 40);
                setTimeout(function() {
                    issueKeyPress('keyup', 40);
                }, timeout);
                break;
    
            default:
                console.log('Invalid move ' + move);
        }
    }
}
function issueKeyPress(type, keycode) {
    var eventObj = document.createEventObject ?
        document.createEventObject() : document.createEvent("Events");

    if(eventObj.initEvent){
        eventObj.initEvent(type, true, true);
    }

    eventObj.keyCode = keycode;
    eventObj.which = keycode;

    document.dispatchEvent ? document.dispatchEvent(eventObj) : el.fireEvent("onkeydown", eventObj);

}
function isPixelEqual(p1, p2) {
    return p1.r === p2.r &&
        p1.g === p2.g &&
        p1.b === p2.b &&
        p1.a === p2.a;
}
function strip(number) {
    return parseFloat((parseFloat(number).toPrecision(C.fixed)));
}
// distance = velocity
class TRex {
    constructor(a, b, gen) {
        this.a = a;
        this.b = b;
        this.gen = gen;
        this.fitness = 0;
    }
    crossOver(tRex){
        console.log('crossOver', this, tRex)
        var a = Math.random() < 0.5 ? this.a : tRex.a;
        var b = Math.random() < 0.5 ? this.b : tRex.b;
        console.log(a, b);
        return new TRex(a, b, this.gen + 1);
    }
    mutate(mutateRate){
        this.a = Math.random() < mutateRate ? this._randomAround(this.a, C.mutateVolumn) : this.a;
        this.b = Math.random() < mutateRate ? this._randomAround(this.b, C.mutateVolumn) : this.b;
    }
    _random(max, min) {
        return (Math.random() * (max-min) + min);
    }
    _randomAround(src, percent){
        var max = src * percent / 2;
        var min = -max;
        return this._random(max, min) + src;
    }
    jump() {
        this.fitness += 1;
    }
    calcDistanceToJump(v){
        var calcDistanceToJump = this.a * v + this. b;
        return calcDistanceToJump;
    }
}
class Player {
    constructor(game){
        this.game = game;
        this.inputEvent = this.game.outputEvent;
        this.outputEvent = this.game.inputEvent;
        this.tRexEvent = new EventEmitter();
        this._assignInputEvent();
        this.distanceToCactus = 0;
        this.timeLookCactus = 0;
        this.distanceToBird = 0;
        this.timeLookBird = 0;
        this.velocity = 0;
        this.tRexs = [];
        this.currentTRex = 0;
        this.currentGen = 0;
        this.lastAVGFitness = 0;
        this.data = [];
    }
    _initTRex () {
        this.tRexs = [];
        for (let i = 0; i< C.numGen; i++){
            var _tRex = new TRex(this._random(20, -20), this._random(20, -20), this.currentGen);
            // var _tRex = new TRex(3.5, 0.01, 0)
            this.tRexs.push(_tRex);
        }
        console.log(`Generation ${this.currentGen} tRex`, this.tRexs);
    }
    _random(max, min) {
        return (Math.random() * (max-min) + min);
    }
    _randomAround(src, percent){
        var max = src * percent / 2;
        var min = -max;
        return this._random(max, min) + src;
    }
    _assignInputEvent() {
        this.inputEvent.addListener(C.lookForwardDangerEvent, this._handleLookForwardDanger.bind(this));
        this.inputEvent.addListener(C.lookBirdDangerEvent, this._handleLookBirdDanger.bind(this));
        this.inputEvent.addListener(C.startGameEvent, this._handleStartGame.bind(this));
    }
    _broadcast(type, _args){
        switch(type) {
            case (C.moveBroadcast): {
                this.outputEvent.emitEvent(C.moveEvent, _args);
                break;
            }
            case (C.duckBroadcast): {
                this.outputEvent.emitEvent(C.duckEvent, _args);
                break;
            }
            default: {
                break;
            }
        }
    }
    _acceptReject(array) {
        let random = Math.random();
        for(let trex of array) {
            let {weight} = trex;
            if(random < weight) {
                return trex
            } else { random -= weight }
        }
        return null;
    }
    _handleStartGame(init){
        this.distanceToCactus = 0;
        this.timeLookCactus = 0;
        this.distanceToBird = 0;
        this.timeLookBird = 0;
        this.velocity = 0;
        if (init) {
            window.clear();
            console.log('______INIT GENERATION_____')
            this._initTRex();
            console.log(`tRex ${this.currentTRex}/${this.tRexs.length} gen ${this.currentGen} : `, this.tRexs[this.currentTRex])
            return;
        }
        console.log(`tRex die: ${this.tRexs[this.currentTRex].fitness}`);
        console.log('_____________');
        this.currentTRex += 1;
        if ( this.currentTRex < this.tRexs.length ){

        } else {
            this._refill();
        }
        console.log(`tRex ${this.currentTRex}/${this.tRexs.length} gen ${this.currentGen} : `, this.tRexs[this.currentTRex])
    }
    _refill() {
        var maxFitness = Math.max(...this.tRexs.map(tRex => tRex.fitness));
        var minFitness = Math.min(...this.tRexs.map(tRex => tRex.fitness));
        var totalFitness = this.tRexs.reduce((total, current) => total + current.fitness, 0);
        var avgFitness = totalFitness/this.tRexs.length;
        this._writeData({
            gen: this.currentGen,
            tRexs: this.tRexs,
            maxFitness: maxFitness,
            totalFitness: totalFitness,
            avgFitness: avgFitness
        })
        console.log('______END GENERATION_____');
        console.log('maxFitness', maxFitness);
        console.log('minFitness', minFitness);
        console.log('totalFitness', totalFitness);
        console.log('avgFitness', avgFitness);
        console.log('improved avg fitness', avgFitness - this.lastAVGFitness);
        this.lastAVGFitness = avgFitness;
        
        let weighted = this.tRexs.map(tr => {
            tr.weight = tr.fitness/totalFitness;
            return tr;
        });

        for (let i = 0; i < this.tRexs.length; i ++ ){

            // var partnerA = this._acceptReject(weighted);
            // var partnerB = this._acceptReject(weighted);
            // if (partnerA && partnerB){
            //     var child = partnerA.crossOver(partnerB);
            //     child.mutate(C.mutationRate);
            //     this.tRexs[i] = child;
            // } else {
                this.tRexs[i].mutate(C.mutationRate);
                this.tRexs[i].fitness = 0;
            // }
        }
        this.currentTRex = 0;
        this.currentGen += 1;
    }
    _handleLossGame(){
        
    }
    _handleLookBirdDanger(distanceToBird, time){
        // console.log('distanceToBird', distanceToBird);
        if (distanceToBird < 120){
            this._broadcast(C.duckBroadcast, [C.mDuck]);
        }
    }
    _handleLookForwardDanger(distanceToCactus, time){
        var distanceDelta = this.distanceToCactus - distanceToCactus;
        var timeDelta = time - this.timeLookCactus;
        var velocity = 0;
        if (distanceDelta > 0){
            velocity = strip(distanceDelta / timeDelta);
            this.velocity = velocity;
        }
        var calcDistanceToJump = this.tRexs[this.currentTRex].calcDistanceToJump(this.velocity);
        this.distanceToCactus = distanceToCactus;
        if ( distanceToCactus < calcDistanceToJump ) {
            this._broadcast(C.moveBroadcast, [C.mJump]);
            this.tRexs[this.currentTRex].jump();
        }
    }
    _getData(){
        return JSON.stringify(this.data);
    }
    _writeData(data) {
        this.data.push(data);
        console.log('save data!')
    }
    _loadData() {

    }
}
var game = new Game(document.getElementsByClassName('runner-canvas')[0]);
var player = new Player(game);
game.start(true);
