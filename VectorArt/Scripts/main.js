Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };

paper.install(window);

settings.handleSize = 6;
// Value is updated in Zoom.js in respect to the zoom
settings.hitTolerance = 7;

var toolSelect = new Tool();
var toolPointer = new Tool();
var toolPen = new Tool();
var toolShape = new Tool();

var objects = [];

window.onload = function() {
    paper.setup('canvas');

    InitSidebars();

    InitZoom();

    InitToolSelect();
    InitToolPointer();
    InitToolPen();
    InitToolShape();
};

function deselectTools() {
    var toolButtons = document.querySelectorAll('.tools-active');
    for(var i=0; i < toolButtons.length; i++) {
        toolButtons[i].classList.remove('tools-active');
    }
}