/*!
 * EventEmitter v5.2.4 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */
!function(e){"use strict";function t(){}function n(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function r(e){return function(){return this[e].apply(this,arguments)}}function i(e){return"function"==typeof e||e instanceof RegExp||!(!e||"object"!=typeof e)&&i(e.listener)}var s=t.prototype,o=e.EventEmitter;s.getListeners=function(e){var t,n,r=this._getEvents();if(e instanceof RegExp){t={};for(n in r)r.hasOwnProperty(n)&&e.test(n)&&(t[n]=r[n])}else t=r[e]||(r[e]=[]);return t},s.flattenListeners=function(e){var t,n=[];for(t=0;t<e.length;t+=1)n.push(e[t].listener);return n},s.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},s.addListener=function(e,t){if(!i(t))throw new TypeError("listener must be a function");var r,s=this.getListenersAsObject(e),o="object"==typeof t;for(r in s)s.hasOwnProperty(r)&&n(s[r],t)===-1&&s[r].push(o?t:{listener:t,once:!1});return this},s.on=r("addListener"),s.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},s.once=r("addOnceListener"),s.defineEvent=function(e){return this.getListeners(e),this},s.defineEvents=function(e){for(var t=0;t<e.length;t+=1)this.defineEvent(e[t]);return this},s.removeListener=function(e,t){var r,i,s=this.getListenersAsObject(e);for(i in s)s.hasOwnProperty(i)&&(r=n(s[i],t),r!==-1&&s[i].splice(r,1));return this},s.off=r("removeListener"),s.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},s.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},s.manipulateListeners=function(e,t,n){var r,i,s=e?this.removeListener:this.addListener,o=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(r=n.length;r--;)s.call(this,t,n[r]);else for(r in t)t.hasOwnProperty(r)&&(i=t[r])&&("function"==typeof i?s.call(this,r,i):o.call(this,r,i));return this},s.removeEvent=function(e){var t,n=typeof e,r=this._getEvents();if("string"===n)delete r[e];else if(e instanceof RegExp)for(t in r)r.hasOwnProperty(t)&&e.test(t)&&delete r[t];else delete this._events;return this},s.removeAllListeners=r("removeEvent"),s.emitEvent=function(e,t){var n,r,i,s,o,u=this.getListenersAsObject(e);for(s in u)if(u.hasOwnProperty(s))for(n=u[s].slice(0),i=0;i<n.length;i++)r=n[i],r.once===!0&&this.removeListener(e,r.listener),o=r.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,r.listener);return this},s.trigger=r("emitEvent"),s.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},s.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},s._getOnceReturnValue=function(){return!this.hasOwnProperty("_onceReturnValue")||this._onceReturnValue},s._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return e.EventEmitter=o,t},"function"==typeof define&&define.amd?define(function(){return t}):"object"==typeof module&&module.exports?module.exports=t:e.EventEmitter=t}(this||{});

var C = {
    // pixels
    blankPixel: {r: 0, g: 0, b: 0, a: 0},
    blackPixel: {r: 83, g: 83, b: 83, a: 255},
    dinoEyeColor: {r: 255, g: 255, b: 255, a: 255},

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
    lookAheadX: 70 + 5,
    lookAheadY: 131 - 10,
    lookAheadBuffer: 200,
    //event
    moveEvent: "MOVE_EVENT",
    lookforwardDangerEvent: "LOOK_FORWARD_DANGER_EVENT"
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
        this.inputEvent = new EventEmitter();
        this.outputEvent = new EventEmitter();
        this._assignInputEvent();
    }
    _assignInputEvent() {
        this.inputEvent.addListener(C.moveEvent, this._handleMove.bind(this));
    }
    _handleMove(move, timeout) {
        this._issueMove(move, timeout);
    }
    _reloadImage() {
        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    }
    run(){
        this._issueMove(C.mJump);
        clearTimeout(this.loopUpdate);
        this.loopUpdate = setInterval(this._update.bind(this), C.runIntervalMs);
    }
    stop(){
        clearTimeout(this.loopUpdate);
    }
    _update() {
        var look = this._lookForward();
        if (look.lookforwardDanger && look.distanceToCactus < 70){
            this._issueMove(C.mJump);
        }

    }
    _lookForward(){
        this._reloadImage();
        var lookforwardDanger = false,
            distanceToCactus = 0;
        for (var i = 0; i < C.lookAheadBuffer; i += 2) {
            if (isPixelEqual(this._getPixel(this.imageData, C.lookAheadX + i, C.lookAheadY), C.blackPixel)) {
                lookforwardDanger = true;
                distanceToCactus = i;
                break;
            }
        }
        if (lookforwardDanger) {
            this.outputEvent.emitEvent(C.lookforwardDangerEvent, [lookforwardDanger, distanceToCactus]);
        }
        return {
            lookforwardDanger,
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
var game = new Game(document.getElementsByClassName('runner-canvas')[0]);
game.run();

class Player {
    constructor(game){
        this.game = game;
        this.inputEvent = this.game.outputEvent;
        this.outputEvent = this.game.inputEvent;
    }
    _assignInputEvent() {
        // this.inputEvent.addListener(C.lookforwardDangerEvent, this.)
    }
    _writeData() {

    }
    _loadData() {

    }
}