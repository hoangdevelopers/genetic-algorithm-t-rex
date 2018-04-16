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
    }
    reloadImage() {
        this.imageData = ctx.getImageData(0, 0, C.width, C.height);
    }
    run(){
        clearTimeout(this.loopUpdate);
        this.loopUpdate = setInterval(this.update, C.runIntervalMs)
    }
    stop(){
        clearTimeout(this.loopUpdate);
    }
    update() {
        console.log('update')
    }
}
function getPixel(imgData, x, y) {
    var dataStart = (x + y * C.width) * 4;

    return {
        r: imgData.data[dataStart],
        g: imgData.data[dataStart + 1],
        b: imgData.data[dataStart + 2],
        a: imgData.data[dataStart + 3]
    };
}
function issueMove(move, timeout) {
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
var game = new Game(document.getElementsByClassName('runner-canvas')[0]);
