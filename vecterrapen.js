/*
The MIT License (MIT)

Copyright (c) 2021 Armin Rosic

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const topLevelState = {};

// private utilities
const utils = {
    newNSElem: function(elementName){
        return document.createElementNS("http://www.w3.org/2000/svg", elementName);
    },

    setAttrs: function(element, attrs){
        for (let [attribute, value] of Object.entries(attrs)){
            element.setAttributeNS(null, attribute, value);
        };  
        return;   
    },

    setStyles: function(element, styles){
        for (let [style, value] of Object.entries(styles)){
            element.style.setProperty(style, value);
        };  
        return;   
    }
};

export function penScreen(screenWidth = window.innerWidth, screenHeight = window.innerHeight, parentTagId = 'vecterrapenDefault', addAt = "bottom") {

    let TAG_ID;
    let GROUP_ID;
    let penCount = 0;
    let penGroupIds = [];

    if (parentTagId === 'vecterrapenDefault'){ // standalone full-page 

        TAG_ID = parentTagId
        GROUP_ID = `${TAG_ID}_groups`

        let svgMain = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        let svgMainAttrs = {
            'id': TAG_ID, 
            'version': 1.1, 
            'viewBox': `0 0 ${screenWidth} ${screenHeight}`, 
            'width': `${screenWidth}`,
            'height': `${screenHeight}`,
            'preserveAspectRatio': 'xMidYMid meet',
            'shape-rendering': 'geometricPrecision'
        };

        let svgMainStyles = {
            'background': "black", 
            'position': "absolute", 
            'left': '0px',
            'top': '0px', 
            'width': "100%", 
            'height': "100%", 
            'position': 'fixed'
        };

        utils.setAttrs(svgMain, svgMainAttrs);
        utils.setStyles(svgMain, svgMainStyles); 

        let mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        mainGroup.setAttributeNS(null, "id", `${GROUP_ID}`);
        svgMain.appendChild(mainGroup);

        document.body.appendChild(svgMain)

    }else{ // embeded in html existing tag

        if (! Object.keys(topLevelState).includes(`${parentTagId}`)){
            topLevelState[`${parentTagId}`] = 0;
        }
    
        topLevelState[`${parentTagId}`] += 1; 
        TAG_ID = `${parentTagId}_svg_${topLevelState[`${parentTagId}`]}`
        GROUP_ID = `${TAG_ID}_groups`

        let svgMain = document.createElementNS("http://www.w3.org/2000/svg", "svg");

        let svgMainAttrs = {
            'id': TAG_ID, 
            'version': 1.1, 
            'viewBox': `0 0 ${screenWidth} ${screenHeight}`, 
            'width': `${screenWidth}`,
            'height': `${screenHeight}`,
            'preserveAspectRatio': 'xMidYMid meet',
            'shape-rendering': 'geometricPrecision'

        };

        let svgMainStyles = {
            'position': "relative", 
            'margin': '0px',
            'max-width': '100%', 
        };
        
        utils.setAttrs(svgMain, svgMainAttrs);
        utils.setStyles(svgMain, svgMainStyles); 

        let bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        let bgRectAttrs = {
            'id': `${TAG_ID}_background`,
            'fill': 'black', 
            'x': 0, 
            'y': 0, 
            'width': screenWidth, 
            'height': screenHeight
        };

        utils.setAttrs(bgRect, bgRectAttrs);
        svgMain.appendChild(bgRect);

        let mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        mainGroup.setAttributeNS(null, "id", `${GROUP_ID}`);
        svgMain.appendChild(mainGroup);

        if (addAt === "bottom"){
            document.getElementById(parentTagId).appendChild(svgMain)
        } else if (addAt === "top"){
            document.getElementById(parentTagId).prepend(svgMain)
        }


    }// end constructor

    // Pass State To Pen
    function select() {return document.getElementById(TAG_ID);}
    function selectGroups() {return document.getElementById(GROUP_ID);}
    function getScreenId() {return TAG_ID};
    function getGroupId() {return GROUP_ID};
    function getPenCount() {return penCount};
    function _incrementPenCount() {penCount = penCount + 1};
    function getOriginalWidth() {return screenWidth};
    function getOriginalHeight() {return screenHeight};

    function _addGroupId(id){
        penGroupIds.push(id);
    }

    function bgColor(color) { 
        if (parentTagId === 'vecterrapenDefault'){
            document.getElementById('vecterrapenDefault').style.background = color; 
        } else {
            document.getElementById(`${TAG_ID}_background`).setAttributeNS(null,'fill', color) 
        }
        return; 
    }

    function clear() { 
        for (let grp of penGroupIds) {
            document.getElementById(`${grp}`).innerHTML = "";
        }
    }

    return {
        type: 'screen',
        select,
        selectGroups,
        getScreenId,
        getGroupId, 
        getPenCount, 
        _incrementPenCount,
        getOriginalWidth,
        getOriginalHeight,
        _addGroupId,
        clear,
        bgColor,
    };
}

export function addPenTo(SCREEN, position='top', relativePEN=null) {  

    SCREEN._incrementPenCount();

    let screenGroupId = SCREEN.getGroupId() 
    let penGroupNumber = SCREEN.getPenCount();
    let penGroupId = `${screenGroupId.slice(0,-1)}_${penGroupNumber}`; 

    {
        let penGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        penGroup.setAttributeNS(null, "id", `${penGroupId}`);
        // set relative z-index
        switch (position){
            case 'top':
                document.getElementById(`${screenGroupId}`).appendChild(penGroup);
                break;   
            case 'bottom':
                let first = SCREEN.selectGroups().firstChild;
                document.getElementById(`${screenGroupId}`).insertBefore(penGroup, first);
                break;
            case 'behind':
                document.getElementById(`${screenGroupId}`).insertBefore(penGroup, relativePEN.getElement());
                break;
            case 'on-top-of':
                let last = SCREEN.selectGroups().lastElementChild;
                if (relativePEN.getElement() === last){
                    //same as plain top
                    document.getElementById(`${screenGroupId}`).appendChild(penGroup);
                } else {
                    document.getElementById(`${screenGroupId}`).insertBefore(penGroup, relativePEN.getElement().nextSibling);
                }
                break;
        }   
    }

    SCREEN._addGroupId(penGroupId);

    let GROUP_ID_SELECT = document.getElementById(penGroupId)
    let ORIGIN = [ (SCREEN.getOriginalWidth()/2.0) , (SCREEN.getOriginalHeight()/2.0) ];        
    let _svgLocation = ORIGIN; 
    let _isPenDown = true;
    let _isRenderOn = true;
    let _renderBuffer = new DocumentFragment();
    let _transform = new DOMMatrix()
    let _transformAwaitingRenderUpdate = false;
    let _penColor = "rgba(255,255,255,1)";
    let _fillColor = `rgba(255,255,255,0.4)`;
    let _linecap = "round";
    let _penSize = 1.0;
    let _textSize = 30;
    let _font = 'monospace';
    let _angle = 0.0; 

    const penUtils = {
        sendToRender: function(element){
            if (_isRenderOn){
                GROUP_ID_SELECT.appendChild(element);
                return;
            }else{
                _renderBuffer.appendChild(element); 
                return; 
            }
        }
    };

    function clear(){ 
        GROUP_ID_SELECT.innerHTML = ""; 
        return; 
    }

    function getGroupId() {return penGroupId;}
    function getElement() {return document.getElementById(penGroupId);}

    function getTransform(){
        return _transform;
    }

    function setTransform(domMatrix){

        for (let key of ["a","b","c","d","e","f"]){
            _transform[key] = domMatrix[key]
        }

        if (isRenderOn()){
            const {a,b,c,d,e,f} = domMatrix; 
            const matrix = `matrix(${a},${b},${c},${d},${e},${f})`;
            GROUP_ID_SELECT.setAttributeNS(null,"transform", matrix);
            return;
        }else{
            _transformAwaitingRenderUpdate = true;
        }
        return;
    }

    function renderUpdate(){ 
        GROUP_ID_SELECT.appendChild(_renderBuffer); 

        if (_transformAwaitingRenderUpdate) {
            _transformAwaitingRenderUpdate = false;
            const {a,b,c,d,e,f} = _transform; 
            let matrix = `matrix(${a},${b},${c},${d},${e},${f})`;
            GROUP_ID_SELECT.setAttributeNS(null,"transform", matrix);
        }
        return;
    }

    function renderOff(){ 
        _isRenderOn = false; 
        return;
    }

    function renderOn(){ 
        _isRenderOn = true; 
        renderUpdate();
        return;
    }

    function isRenderOn(){
        return _isRenderOn; 
    }

    function getRenderBuffer(){
        return _renderBuffer;
    }

    function penDown(){ 
        _isPenDown = true; 
        return;
    }

    function penUp(){ 
        _isPenDown = false; 
        return;
    }

    function isPenDown(){
        return _isPenDown
    }

    function penSize(size){ 
        _penSize = size; 
        return;
    }
    function textSize(size){
        _textSize = size;
        return;
    }
    function getTextSize(){
        return _textSize; 
    }
    function getFont(){
        return _font; 
    }
    function setFont(fontFamily){
        _font = fontFamily;
        return;
    }
    function getPenSize(){
        return _penSize;
    }

    function penColor(color){ 
        _penColor = color; 
        return;
    }

    function getPenColor(){
        return _penColor; 
    }

    function fillColor(color) { 
        _fillColor = color; 
        return;
    }

    function getFillColor(){
        return _fillColor;
    }

    function linecapRound(){
        _linecap = "round";
        return;
    }

    function linecapSquare(){
        _linecap = "square";
        return;
    }

    function getLinecap(){
        return _linecap; 
    }

    function right(angle){ 
        _angle = ((_angle + (360 - (angle % 360))) % 360); 
        return;
    }

    function left(angle){ 
        _angle = ((_angle + (angle % 360)) % 360); 
        return;
    }

    function getX(){
        return _svgLocation[0] - ORIGIN[0];
    }

    function getY(){
        return -(_svgLocation[1] - ORIGIN[1]);
    }

    function getOrigin(){
        return ORIGIN; 
    }

    function getPosition(){
        return [getX(), getY()];
    }

    function _getSVGLocation(){
        return _svgLocation; 
    }

    function _setSVGLocation(x,y){
        _svgLocation = [x,y]; 
        return;
    }

    function _coordinatesUserToSVG(userX, userY){
        return [(ORIGIN[0] + userX), (ORIGIN[1] - userY)];
    }

    function _coordinatesSVGToUser(pageX, pageY){
        return [(pageX - ORIGIN[0]), -(pageY - ORIGIN[1])];
    }

    function getAngle(){ 
        return _angle; 
    }

    function setAngle(angle){ 
        if (angle >= 0){
            _angle = angle % 360
        }else{
            _angle = 360 + (angle % 360)
        }
        return;
    }

    function goto(x,y){
        if (_isPenDown){
            let line = utils.newNSElem("line"); 
            let lineAttrs = {
                'x1': `${_svgLocation[0]}`,
                'y1': `${_svgLocation[1]}`,
                'x2': `${(ORIGIN[0] + x)}`,
                'y2': `${(ORIGIN[1] - y)}`,
                'stroke': `${_penColor}`, 
                'stroke-width': `${_penSize}`,
                'stroke-linecap': `${_linecap}` 
            };
            utils.setAttrs(line, lineAttrs);
            penUtils.sendToRender(line);
            _svgLocation = [(ORIGIN[0] + x), (ORIGIN[1] - y)];
            return line; 
        } else {
            _svgLocation = [(ORIGIN[0] + x), (ORIGIN[1] - y)];
            return;
        }
    }


    function setX(x) {     
        goto(x,getY());
        return;
    }

    function setY(y) {      
        goto(getX(), y);
        return;
    }

    function home(){        
        if (_isPenDown){
            let line = goto(0,0);
            _angle = 0.0;
            return line;
        } else {
            _svgLocation = ORIGIN;
            _angle = 0.0;
            return;
        }
    }

    function dot(size){
        let dot = utils.newNSElem("circle"); 
        let dotAttrs = {
            'cx': `${_svgLocation[0]}`, 
            'cy': `${_svgLocation[1]}`, 
            'r': `${size}`, 
            'stroke': `${_penColor}`, 
            'fill': `${_penColor}`
        };
        utils.setAttrs(dot, dotAttrs);
        penUtils.sendToRender(dot);
        return dot;
    }

    function squareDot(size){
        let dot = utils.newNSElem("rect"); 
        let dotAttrs = {
            'x': `${_svgLocation[0] - size}`, 
            'y': `${_svgLocation[1] - size}`,
            'width': `${size*2}`, 
            'height': `${size*2}`, 
            'stroke': `${_penColor}`, 
            'fill': `${_penColor}`
        };
        utils.setAttrs(dot, dotAttrs);
        penUtils.sendToRender(dot);
        return dot;
    }

    function rect(width, height, align="topLeft") {
        let rect = utils.newNSElem("rect"); 
        //alignment
        let [x,y] = _svgLocation
        if (align !== "topLeft"){
            if (align === 'center'){
                x = x - width/2;
                y = y - height/2;
            } else if (align === 'topRight'){
                x = x - width;
                y = y;
            }
        }
        let rectAttrs = {
            'x': `${x}`, 
            'y': `${y}`, 
            'width': `${width}`,
            'height': `${height}`, 
            'stroke': `${_penColor}`, 
            'fill': `${_fillColor}`
        };
        utils.setAttrs(rect, rectAttrs);
        penUtils.sendToRender(rect);
        return rect;
    }

    function circle(size){
        let circle = utils.newNSElem("circle"); 
        let circleAttrs = {
            'cx': `${_svgLocation[0]}`, 
            'cy': `${_svgLocation[1]}`, 
            'r': `${size}`,
            'stroke': `${_penColor}`, 
            'stroke-width': `${_penSize}`, 
            'fill': `${_fillColor}`            
        };
        utils.setAttrs(circle, circleAttrs);
        penUtils.sendToRender(circle);
        return circle;
    }

    function forward(dist){
        let svgEndpointX = (_svgLocation[0] + (dist * Math.cos( _angle * (Math.PI / 180))));
        let svgEndpointY = (_svgLocation[1] - (dist * Math.sin( _angle * (Math.PI / 180))));  
      
        let line = goto(..._coordinatesSVGToUser(svgEndpointX, svgEndpointY));
        return line; 
    }

    function backward(dist){
        forward(-dist);
    }

    function text(textString, jumpTo="after"){ 

       let wasPenDown = _isPenDown;

        const wrapper = utils.newNSElem("foreignObject"); 
        let wrapperAttrs = {
            'x': `${_svgLocation[0]}`,
            'y': `${_svgLocation[1]}`, 
            'height': '1000000',  
            'width': '1000000'
        }
        utils.setAttrs(wrapper, wrapperAttrs);
        const interior = document.createElementNS("http://www.w3.org/1999/xhtml","p");
        let interiorStyles = {
            'position': 'relative',
            'display': 'inline',
            'font-family': `${_font}`,
            'color': `${_penColor}`, 
            'font-size': `${_textSize}px`,
            'height': '100%',
            'white-space': 'pre',
            'background-color': 'rgba(0,0,0,0)'
        }    
        utils.setStyles(interior, interiorStyles);
        interior.textContent = `${textString}`;
        wrapper.appendChild(interior);
        penUtils.sendToRender(wrapper);

        let bounds = interior.getBoundingClientRect();
 
        wrapper.setAttribute('width', bounds.width);
        wrapper.setAttribute('height', bounds.height);

        penUp()
        if (jumpTo === 'after'){
            setX(getX() + bounds.width);
        } else if (jumpTo === 'under'){
            setY(getY() - bounds.height);
        }

        if (wasPenDown){
            penDown()
        }
        return interior; 
    }

    function htmlTextBox(width, text){
        const wrapper = utils.newNSElem("foreignObject"); 
        let wrapperAttrs = {
            'x': `${_svgLocation[0]}`,
            'y': `${_svgLocation[1]}`, 
            'height': '100000', 
            'width': `${width}`
        }
        utils.setAttrs(wrapper, wrapperAttrs);
        const interior = document.createElementNS("http://www.w3.org/1999/xhtml","p");
        let interiorStyles = {
            'font-family': `${_font}`,
            'color': `${_penColor}`,
            'font-size': `${_textSize}px`,
            'height': '100%',
            'white-space': 'pre-wrap',
            'margin-top': '0px',
            'background-color': 'rgba(0,0,0,0)'
        }    
        utils.setStyles(interior, interiorStyles);
        interior.xmlns = "http://www.w3.org/1999/xhtml";
        interior.textContent = `${text}`;
        wrapper.appendChild(interior);
        penUtils.sendToRender(wrapper);
        return interior; 
    }

    function image(height, width, href){
        let image = utils.newNSElem("image"); 
        let imageAttrs = {
            'x': `${_svgLocation[0]}`,
            'y': `${_svgLocation[1]}`, 
            'height': `${height}`, 
            'width': `${width}`,
            'href': `${href}`
        }
        utils.setAttrs(image, imageAttrs);
        penUtils.sendToRender(image);
        return image;
    }

    function face(x,y){
        let relX = x - getX();
        let relY = y - getY();
        let relAngle = Math.atan2(relY,relX) * (180/Math.PI);
        _angle = relAngle;
        return _angle;
    }

    function vector(magnitude, angle){
        setAngle(angle);
        forward(magnitude);
    }

    function vectorDxDy(dx,dy){
        let startX = getX();
        let startY = getY();
        let endX = startX + dx;
        let endY = startY + dy;
        goto(endX, endY);
    }

    function generateEndpoint(actionArray, coordinateSpace="userCoordinates"){
        let finalPosition; 
        //save state and lift pen
        let startPosition = getPosition();
        let startAngle = _angle;
        let wasPenDown = _isPenDown;
        _isPenDown = false;

        let cursor = 0; //cursor indexing actionArray
        let action = actionArray[cursor];
        while (action !== undefined){  
            switch (action){
                case "f":
                case "forward":
                    forward(actionArray[cursor+1]);
                    cursor += 2;
                    break;
                case "r":
                case "right":
                    right(actionArray[cursor+1]);
                    cursor += 2;
                    break;
                case "l":
                case "left":
                    left(actionArray[cursor+1]);
                    cursor += 2;
                    break;
                case "g":
                case "goto":
                    goto(actionArray[cursor+1], actionArray[cursor+2]);
                    cursor += 3;
                    break;
                case "v":
                case "vector":
                    vector(actionArray[cursor+1], actionArray[cursor+2]);
                    cursor += 3;
                    break;
                case "dxdy":
                case "vectorDxDy":
                    vectorDxDy(actionArray[cursor+1], actionArray[cursor+2]);
                    cursor += 3;
                    break;
                case "fa":
                case "face":
                    face(actionArray[cursor+1], actionArray[cursor+2]);
                    cursor += 3;
                    break;
                case "a":
                case "setAngle":
                    setAngle(actionArray[cursor+1]);
                    cursor += 2;
                    break;
                case "b":
                case "backward":
                    backward(actionArray[cursor+1]);
                    cursor += 2;
                    break;
                case "h":
                case "home":
                    home();
                    cursor += 1;
                    break;
                case "x":
                case "setX":
                    setX(actionArray[cursor+1]);
                    cursor += 2;
                    break;
                case "y":
                case "setY":
                    setY(actionArray[cursor+1]);
                    cursor += 2;
                    break;
                default:
                    break;
    
            }
            action = actionArray[cursor]
        }
        //capture return value
        if (coordinateSpace === "userCoordinates"){
            finalPosition = getPosition();
        } else if (coordinateSpace === "svgCoordinates"){
            finalPosition = _getSVGLocation()
        }

        goto(...startPosition);
        setAngle(startAngle);
        _isPenDown = wasPenDown; 
        
        return finalPosition;    
    }

    function generatePoints(actionArray, coordinateSpace="userCoordinates"){
        let points = [];   

        //save state and lift pen
        let startPosition = getPosition(); 
        let startAngle = _angle;
        let wasPenDown = _isPenDown;
        _isPenDown = false; 

        let cursor = 0; 
        let action = actionArray[cursor];

        let coordinateGetter;
        if (coordinateSpace === "userCoordinates"){
            coordinateGetter = getPosition;
        } else if (coordinateSpace === "svgCoordinates"){
            coordinateGetter = _getSVGLocation; 
        }

        //build return array
        while (action !== undefined){   
            switch (action){
                case "f":
                case "forward":
                    forward(actionArray[cursor+1]);
                    points.push(coordinateGetter());
                    cursor += 2;
                    break;
                case "r":
                case "right":
                    right(actionArray[cursor+1]);
                    cursor += 2;
                    break;
                case "l":
                case "left":
                    left(actionArray[cursor+1]);
                    cursor += 2;
                    break;
                case "g":
                case "goto":
                    goto(actionArray[cursor+1], actionArray[cursor+2]);
                    points.push(coordinateGetter());
                    cursor += 3;
                    break;
                case "v":
                case "vector":
                    vector(actionArray[cursor+1], actionArray[cursor+2]);
                    points.push(coordinateGetter());
                    cursor += 3;
                    break;
                case "dxdy":
                case "vectorDxDy":
                    vectorDxDy(actionArray[cursor+1], actionArray[cursor+2]);
                    points.push(coordinateGetter());
                    cursor += 3;
                    break;
                case "fa":
                case "face":
                    face(actionArray[cursor+1], actionArray[cursor+2]);
                    cursor += 3;
                    break;
                case "a":
                case "setAngle":
                    setAngle(actionArray[cursor+1]);
                    cursor += 2;
                    break;
                case "b":
                case "backward":
                    backward(actionArray[cursor+1]);
                    points.push(coordinateGetter());
                    cursor += 2;
                    break;
                case "h":
                case "home":
                    home();
                    points.push(coordinateGetter());
                    cursor += 1;
                    break;
                case "x":
                case "setX":
                    setX(actionArray[cursor+1]);
                    points.push(coordinateGetter());
                    cursor += 2;
                    break;
                case "y":
                case "setY":
                    setY(actionArray[cursor+1]);
                    points.push(coordinateGetter());
                    cursor += 2;
                    break;
                default:
                    break   
            };
            action = actionArray[cursor];  
        }

        goto(...startPosition);
        setAngle(startAngle);   
        _isPenDown = wasPenDown; 
    
        return points;
        
    }

    function getScreenId(){
        return SCREEN.getScreenId();
    }

    return {
        type: "pen",
        getTransform,
        selectParent: function() {return SCREEN.select()},
        getScreenId,
        getGroupId, 
        getElement,
        renderOff, 
        renderOn, 
        renderUpdate, 
        isRenderOn,
        getRenderBuffer,
        setTransform,
        penDown, 
        penUp, 
        isPenDown,
        penSize, 
        getPenSize,
        textSize, 
        getTextSize,
        getFont, 
        setFont,
        penColor, 
        getPenColor,
        fillColor,
        getFillColor, 
        linecapRound, 
        linecapSquare,
        getLinecap,
        right, 
        left, 
        getX, 
        getY, 
        getOrigin, 
        getPosition, 
        getAngle, 
        setAngle, 
        goto, 
        setX, 
        setY, 
        home, 
        dot, 
        squareDot,
        circle, 
        forward, 
        backward, 
        text, 
        htmlTextBox, 
        image,
        clear, 
        rect, 
        face, 
        vector, 
        vectorDxDy, 
        generateEndpoint, 
        generatePoints,
        _getSVGLocation,
        _setSVGLocation, 
        _coordinatesSVGToUser, 
        _coordinatesUserToSVG, 
    };
}

export function addPathsTo(PEN){

    const pathUtils = {
        angleFromTo: function(point1, point2){
            let startPosition = PEN.getPosition();
            let startAngle = PEN.getAngle();
            let returnAngle;
            PEN.penUp();
            PEN.goto(...point1);
            PEN.face(...point2);
            returnAngle = PEN.getAngle();
            PEN.goto(...startPosition);
            PEN.setAngle(startAngle);
            PEN.penDown();
            return returnAngle;
        }, 
        lastAngle: function(pointArray){
            let arrayLength = pointArray.length
            const secondToLastPosition = pointArray[arrayLength - 2];
            const lastPosition = pointArray[arrayLength - 1];
            const lastAngle = pathUtils.angleFromTo(secondToLastPosition, lastPosition)
            return lastAngle; 
        },

        sendToRender: function(element) {
            if (PEN.isRenderOn()){
                PEN.getElement().appendChild(element);
            }else{
                PEN.getRenderBuffer().appendChild(element);
            };
            return;         
        }
    }

    function arc(radius, startAngle, endAngle, dOnly=false){

        let pathString; 

        if (startAngle >= 0){ 
            startAngle = startAngle % 360;
        }else{ 
            startAngle = 360 + (startAngle % 360);
        }

        if (endAngle >= 0){
            endAngle = endAngle % 360;
        }else{
            endAngle = 360 + (endAngle % 360);
        }

        //save pen state
        let wasPenDown = PEN.isPenDown();
        if (wasPenDown) {PEN.penUp()};
    
        //save location / angle
        let [locationX, locationY] = PEN._getSVGLocation();
        let angle = PEN.getAngle(); 

        //find start point
        PEN.setAngle(startAngle);
        PEN.forward(radius);
        const [startX,startY] = PEN._getSVGLocation();

        //go back to original location
        PEN._setSVGLocation(locationX, locationY);

        //find end point
        PEN.setAngle(endAngle);
        PEN.forward(radius);
        const [endX,endY] = PEN._getSVGLocation();

        let isArcBig = 1;
        if (((startAngle > endAngle) && ((startAngle - endAngle) <= 180)) || 
            ((startAngle < endAngle) && ((startAngle + (360 - endAngle)) <= 180))){
            isArcBig = 0;
        }

        pathString = `M ${startX} ${startY} A ${radius} ${radius} 0 ${isArcBig} 1 ${endX} ${endY}`

        if (dOnly){
             //resert state
            PEN._setSVGLocation(locationX,locationY);
            PEN.setAngle(angle); 

            if (wasPenDown) {PEN.penDown();} 

            return {d: pathString, endPoint: [locationX,locationY]}
        }
       
        let arc = utils.newNSElem("path");
        let arcAttrs = {
            'd': pathString, 
            'stroke': `${PEN.getPenColor()}`, 
            'stroke-width': `${PEN.getPenSize()}`, 
            'fill': `${PEN.getFillColor()}`, 
            'stroke-linecap': `${PEN.getLinecap()}`
        }
        utils.setAttrs(arc, arcAttrs);

        pathUtils.sendToRender(arc)

        //resert state
        PEN._setSVGLocation(locationX,locationY);
        PEN.setAngle(angle); 

        if (wasPenDown) {PEN.penDown();} 

        return arc;
    }

    function wedge(radius, startAngle, endAngle, dOnly=false){

        if (startAngle >= 0){ 
            startAngle = startAngle % 360;
        }else{ 
            startAngle = 360 + (startAngle % 360);
        }

        if (endAngle >= 0){
            endAngle = endAngle % 360;
        }else{
            endAngle = 360 + (endAngle % 360);
        }

        //save pen state
        let wasPenDown = PEN.isPenDown();
        if (wasPenDown) {PEN.penUp()};
    
        //save location / angle
        let [locationX, locationY] = PEN._getSVGLocation();
        let angle = PEN.getAngle(); 

        //find start point
        PEN.setAngle(startAngle);
        PEN.forward(radius);
        const [startX,startY] = PEN._getSVGLocation();

        //go back to original location
        PEN._setSVGLocation(locationX, locationY);

        //find end point
        PEN.setAngle(endAngle);
        PEN.forward(radius);
        const [endX,endY] = PEN._getSVGLocation();

        let isArcBig = 1;
        if (((startAngle > endAngle) && ((startAngle - endAngle) <= 180)) || 
            ((startAngle < endAngle) && ((startAngle + (360 - endAngle)) <= 180))){
            isArcBig = 0;
        }

        let pathString = ``;
        pathString += `M ${locationX} ${locationY} `
        pathString += `L ${startX} ${startY}`
        pathString += `A ${radius} ${radius} 0 ${isArcBig} 1 ${endX} ${endY}`
        pathString += `L ${locationX} ${locationY}`

        if (dOnly){
            //resert state
           PEN._setSVGLocation(locationX,locationY);
           PEN.setAngle(angle); 

           if (wasPenDown) {PEN.penDown();} 

           return {d: pathString, endPoint: [locationX,locationY]}
       }


        let arc = utils.newNSElem("path");
        let arcAttrs = {
            'd': pathString, 
            'stroke': `${PEN.getPenColor()}`, 
            'stroke-width': `${PEN.getPenSize()}`, 
            'fill': `${PEN.getFillColor()}`, 
            'stroke-linecap': `${PEN.getLinecap()}`
        }
        utils.setAttrs(arc, arcAttrs);

        pathUtils.sendToRender(arc)

        //resert state
        PEN._setSVGLocation(locationX,locationY);
        PEN.setAngle(angle); 

        if (wasPenDown) {PEN.penDown();} 

        return arc;
    }


    function arcBigClockwiseTo(_endPointArray, radius, isClockwise=1, isArcBig=1, dOnly=false){

        let _svgLocation = PEN._getSVGLocation();
        let endLocation = PEN._coordinatesUserToSVG(..._endPointArray);
        
        let arc = utils.newNSElem("path");

        let d = `M ${_svgLocation[0]} ${_svgLocation[1]} A ${radius} ${radius} 0 ${isArcBig} ${isClockwise} ${endLocation[0]} ${endLocation[1]}`;

        PEN._setSVGLocation(...endLocation);

        if (dOnly){
            return {d, endPoint: endLocation};
        }

        let arcAttrs = {
            'd': d, 
            'stroke': `${PEN.getPenColor()}`, 
            'stroke-width': `${PEN.getPenSize()}`, 
            'fill': `${PEN.getFillColor()}`, 
            'stroke-linecap': `${PEN.getLinecap()}`
        }
        utils.setAttrs(arc, arcAttrs);

        pathUtils.sendToRender(arc);


        return arc;
    
    }

    function arcBigAnticlockwiseTo(_endPointArray, radius, dOnly=false){
        let arc = arcBigClockwiseTo(_endPointArray, radius, 0, 1, dOnly);
        return arc;
    }

    function arcSmallAnticlockwiseTo(_endPointArray, radius){
        let arc = arcBigClockwiseTo(_endPointArray, radius, 0, 0);
        return arc;
    }

    function arcSmallClockwiseTo(_endPointArray, radius){
        let arc = arcBigClockwiseTo(_endPointArray, radius, 1, 0);
        return arc;
    }

    function pathLinear(pathObject, dOnly=false){

        let controlPoints = []; 
        let pathString = ``;  
        let finalAngle; 
        const startingSVGPosition = PEN._getSVGLocation(); 
        const keys = Object.keys(pathObject);
        const fromActions = keys.includes("actions");
        const fromPoints = !fromActions;
        const usingOptions = keys.includes("options");
        const svgToUser = PEN._coordinatesSVGToUser;
        
        if (usingOptions){           
            var optionArray = pathObject["options"];
            //unpack it 
            var isClosed = optionArray.includes("close"); 
            var isDetached = optionArray.includes("detach");
            var isPinned = optionArray.includes("pin");  
            var isFilled = optionArray.includes("fill"); 
        }

        if (usingOptions && isDetached){
            //do nothing
        }else{
            controlPoints.push(startingSVGPosition);     
        }

        if (fromPoints){ 
            const pointsArray = pathObject["points"];
            const userToSVG = PEN._coordinatesUserToSVG;
            controlPoints.push(...pointsArray.map(pointUser => userToSVG(...pointUser)));
        }else{ 
            const actionArray = pathObject["actions"] 
            const generatedPoints = PEN.generatePoints(actionArray, "svgCoordinates");
            controlPoints.push(...generatedPoints);     
        }

        if (usingOptions && isPinned){
            //do nothing
        }else{
            finalAngle = pathUtils.lastAngle(controlPoints.map(pointSVG => svgToUser(...pointSVG)));          
        }

        if (usingOptions && isClosed){
            controlPoints.push(controlPoints[0]);          
            if (usingOptions && isPinned){
                //do nothing
            }else{
                finalAngle = pathUtils.lastAngle(controlPoints.map(pointSVG => svgToUser(...pointSVG)));          
            }
        }

        const numControlPoints = controlPoints.length; 

        /// path assembly 
        pathString += `M${controlPoints[0][0]} ${controlPoints[0][1]}`;
        for (let pair = 1; pair < numControlPoints; pair++){
            pathString += `L ${controlPoints[pair][0]} ${controlPoints[pair][1]}`
        }

        if (dOnly){
            PEN._setSVGLocation(...controlPoints[controlPoints.length - 1]);
            PEN.setAngle(finalAngle); 

            return {d: pathString, endPoint: controlPoints[controlPoints.length - 1] }
        }

        let path = utils.newNSElem("path");

        let pathAttrs = {
            'd': pathString, 
            'stroke': `${PEN.getPenColor()}`, 
            'stroke-width': `${PEN.getPenSize()}`, 
            'fill': "rgba(1,1,1,0)", 
            'stroke-linecap': `${PEN.getLinecap()}`
        }

        if (usingOptions && isFilled){
            pathAttrs.fill = `${PEN.getFillColor()}`
        }

        utils.setAttrs(path, pathAttrs);

        pathUtils.sendToRender(path);

        if (usingOptions && isPinned){
            //do nothing
        }else{
            PEN._setSVGLocation(...controlPoints[controlPoints.length - 1]);
            PEN.setAngle(finalAngle); 
        }
        return path;         
    }

    function pathCubic(pathObject, dOnly=false){

        let controlPoints = []; 
        let pathString = ``;  
        let finalAngle; 
        const startingSVGPosition = PEN._getSVGLocation(); 
        const keys = Object.keys(pathObject);
        const fromActions = keys.includes("actions");
        const fromPoints = !fromActions;
        const usingOptions = keys.includes("options");
        const svgToUser = PEN._coordinatesSVGToUser;
             
        if (usingOptions){           
            var optionArray = pathObject["options"];
            var isClosed = optionArray.includes("close"); 
            var isDetached = optionArray.includes("detach");
            var isPinned = optionArray.includes("pin");  
            var isFilled = optionArray.includes("fill"); 
        }
    
        if (usingOptions && isDetached){
            //do nothing
        }else{
            controlPoints.push(startingSVGPosition);     
        }

        if (fromPoints){ 
            const pointsArray = pathObject["points"];
            const userToSVG = PEN._coordinatesUserToSVG;
            controlPoints.push(...pointsArray.map(pointUser => userToSVG(...pointUser)));
        }else{ 
            const actionArray = pathObject["actions"] 
            const generatedPoints = PEN.generatePoints(actionArray, "svgCoordinates");
            controlPoints.push(...generatedPoints);     
        }
    
        if (usingOptions && isPinned){ //do nothing     
        }else{ 
            finalAngle = pathUtils.lastAngle(controlPoints.map(pointSVG => svgToUser(...pointSVG)));          
        }
    
        if (usingOptions && isClosed){
            controlPoints.push(controlPoints[0]);          
            if (usingOptions && isPinned){ //do nothing
            }else{ 
                finalAngle = pathUtils.lastAngle(controlPoints.map(pointSVG => svgToUser(...pointSVG)));          
            }
        }
    
        const numControlPoints = controlPoints.length; 
        
        //path assembly
        pathString += `M ${controlPoints[0][0]} ${controlPoints[0][1]}`;
                
        let cursor = 1;  
        if (numControlPoints % 2 === 1) {
            while (cursor < numControlPoints){
                pathString += ` S ${controlPoints[cursor][0]} ${controlPoints[cursor][1]}, `
                pathString += `${controlPoints[cursor + 1][0]} ${controlPoints[cursor + 1][1]}`;
                cursor += 2;
            }
        } else {
            let cursor = 1; 
            while (cursor < (numControlPoints - 1)){   
                pathString += ` S ${controlPoints[cursor][0]} ${controlPoints[cursor][1]}, `
                pathString += `${controlPoints[cursor + 1][0]} ${controlPoints[cursor + 1][1]}`;
                cursor += 2;
            }
            pathString += ` S ${controlPoints[numControlPoints - 2][0]} ${controlPoints[numControlPoints - 2][1]}, `
            pathString += `${controlPoints[numControlPoints - 1][0]} ${controlPoints[numControlPoints - 1][1]}`;
        }

        if (dOnly){
            PEN._setSVGLocation(...controlPoints[controlPoints.length - 1]);
            PEN.setAngle(finalAngle); 

            return {d: pathString, endPoint: controlPoints[controlPoints.length - 1] }
        }


        let path = utils.newNSElem("path");

        let pathAttrs = {
            'd': pathString, 
            'stroke': `${PEN.getPenColor()}`, 
            'stroke-width': `${PEN.getPenSize()}`, 
            'fill': "rgba(1,1,1,0)", 
            'stroke-linecap': `${PEN.getLinecap()}`
        }

        if (usingOptions && isFilled){
            pathAttrs.fill = `${PEN.getFillColor()}`
        }

        utils.setAttrs(path, pathAttrs);
        pathUtils.sendToRender(path)

        if (usingOptions && isPinned){
            //do nothing
        }else{
            PEN._setSVGLocation(...controlPoints[controlPoints.length - 1]);
            PEN.setAngle(finalAngle); 
        }
        return path;
    }

function pathQuadratic(pathObject, dOnly=false){
 
    let controlPoints = []; 
    let pathString = ``;  
    let finalAngle; 
    const startingSVGPosition = PEN._getSVGLocation(); 
    const keys = Object.keys(pathObject);
    const fromActions = keys.includes("actions");
    const fromPoints = !fromActions;
    const usingOptions = keys.includes("options");
    const svgToUser = PEN._coordinatesSVGToUser;
      
    if (usingOptions){           
        var optionArray = pathObject["options"];
        var isClosed = optionArray.includes("close"); 
        var isDetached = optionArray.includes("detach");
        var isPinned = optionArray.includes("pin");  
        var isFilled = optionArray.includes("fill"); 
    }

    if (usingOptions && isDetached){
        //do nothing
    }else{
        controlPoints.push(startingSVGPosition);     
    }

    if (fromPoints){ 
        const pointsArray = pathObject["points"];
        const userToSVG = PEN._coordinatesUserToSVG;
        controlPoints.push(...pointsArray.map(pointUser => userToSVG(...pointUser)));
    }else{ 
        const actionArray = pathObject["actions"] 
        const generatedPoints = PEN.generatePoints(actionArray, "svgCoordinates");
        controlPoints.push(...generatedPoints);     
    }

    if (usingOptions && isPinned){
        //do nothing
    }else{
        finalAngle = pathUtils.lastAngle(controlPoints.map(pointSVG => svgToUser(...pointSVG)));          
    }

    if (usingOptions && isClosed){
        controlPoints.push(controlPoints[0]);          
        if (usingOptions && isPinned){
            //do nothing
        }else{
            //updateAngle();   
            finalAngle = pathUtils.lastAngle(controlPoints.map(pointSVG => svgToUser(...pointSVG)));          

        }
    }

    const numControlPoints = controlPoints.length; 
    
    /// path assembly         
    pathString += `M ${controlPoints[0][0]} ${controlPoints[0][1]} `

    if (numControlPoints < 2){
        console.log('Not enough control points for a quadratic path.')
        return;
    }

    let cursor = 1;
    while (cursor < numControlPoints){
        pathString += ` T ${controlPoints[cursor][0]} ${controlPoints[cursor][1]}`;
        cursor += 1;
    }
            
    if (dOnly){
        PEN._setSVGLocation(...controlPoints[controlPoints.length - 1]);
        PEN.setAngle(finalAngle); 

        return {d: pathString, endPoint: controlPoints[controlPoints.length - 1] }
    }

    let path = utils.newNSElem("path");

    let pathAttrs = {
        'd': pathString, 
        'stroke': `${PEN.getPenColor()}`, 
        'stroke-width': `${PEN.getPenSize()}`, 
        'fill': "rgba(1,1,1,0)", 
        'stroke-linecap': `${PEN.getLinecap()}`
    }

    if (usingOptions && isFilled){
        pathAttrs.fill = `${PEN.getFillColor()}`
    }

    utils.setAttrs(path, pathAttrs);
    pathUtils.sendToRender(path)

    if (usingOptions && isPinned){
        //do nothing
    }else{
        PEN._setSVGLocation(...controlPoints[controlPoints.length - 1]);
        PEN.setAngle(finalAngle); 
    }
    return;    
}

function pathExternal(dAttribute){
    let path = utils.newNSElem("path");

    let pathAttrs = {
        'd': dAttribute, 
        'stroke': `${PEN.getPenColor()}`, 
        'stroke-width': `${PEN.getPenSize()}`, 
        'fill': `${PEN.getFillColor()}`, 
        'stroke-linecap': `${PEN.getLinecap()}`
    }
    utils.setAttrs(path, pathAttrs);
    pathUtils.sendToRender(path)

    return path;
}

function metaPath(pathsObject){
    const actionArray = pathsObject.actions;
    let finalLocation; 
    let startPosition = PEN._getSVGLocation();
    let startAngle = PEN.getAngle();

    let wasPenDown = PEN.isPenDown();
    PEN.penUp();

    let pathStrings = ``
    let lastPath
    // all movement commands are non-drawing
    let cursor = 0; //cursor indexing actionArray
    let action = actionArray[cursor];
    while (action !== undefined){  
        switch (action){
            case "pathLinear":
                lastPath = pathLinear(actionArray[cursor+1], true);
                PEN.penUp() //this seems to be necesary due to an issue with closures ?? 
                pathStrings += lastPath.d + ` `; 
                cursor += 2;
                break;
            case "pathCubic":
                lastPath = pathCubic(actionArray[cursor+1], true);
                PEN.penUp() //this seems to be necesary due to an issue with closures ?? 
                pathStrings += lastPath.d + ` `; 
                cursor += 2;
                break;
            case "pathQuadratic":
                lastPath = pathQuadratic(actionArray[cursor+1], true);
                PEN.penUp() //this seems to be necesary due to an issue with closures ?? 
                pathStrings += lastPath.d + ` `; 
                cursor += 2;
                break;
            case "arcBigClockwiseTo":
                lastPath = arcBigClockwiseTo(actionArray[cursor+1], actionArray[cursor+2], 1, 1, true);
                pathStrings += lastPath.d + ` `; 
                cursor += 3;
                break;
            case "arcBigAnticlockwiseTo":
                lastPath = arcBigClockwiseTo(actionArray[cursor+1], actionArray[cursor+2], 0, 1, true);
                pathStrings += lastPath.d + ` `; 
                cursor += 3;
                break;
            case "arcSmallAnticlockwiseTo":
                lastPath = arcBigClockwiseTo(actionArray[cursor+1], actionArray[cursor+2], 0, 0, true);
                pathStrings += lastPath.d + ` `; 
                cursor += 3;
                break;
            case "arcSmallClockwiseTo":
                lastPath = arcBigClockwiseTo(actionArray[cursor+1], actionArray[cursor+2], 1, 0, true);
                pathStrings += lastPath.d + ` `; 
                cursor += 3;
                break;
            case "arc":
                lastPath = arc(actionArray[cursor+1], actionArray[cursor+2], actionArray[cursor+3], true);
                pathStrings += lastPath.d + ` `; 
                cursor += 4;
                break;
            case "wedge":
                lastPath = wedge(actionArray[cursor+1], actionArray[cursor+2], actionArray[cursor+3], true);
                pathStrings += lastPath.d + ` `; 
                cursor += 4;
                break;
            case "pathExternal":
                pathString += actionArray[cursor+1];
                cursor += 2;
                break;
            case "f":
            case "forward":
                PEN.forward(actionArray[cursor+1]);
                cursor += 2;
                break;
            case "r":
            case "right":
                PEN.right(actionArray[cursor+1]);
                cursor += 2;
                break;
            case "l":
            case "left":
                PEN.left(actionArray[cursor+1]);
                cursor += 2;
                break;
            case "g":
            case "goto":
                PEN.goto(actionArray[cursor+1], actionArray[cursor+2]);
                cursor += 3;
                break;
            case "v":
            case "vector":
                PEN.vector(actionArray[cursor+1], actionArray[cursor+2]);
                cursor += 3;
                break;
            case "dxdy":
            case "vectorDxDy":
                PEN.vectorDxDy(actionArray[cursor+1], actionArray[cursor+2]);
                cursor += 3;
                break;
            case "fa":
            case "face":
                PEN.face(actionArray[cursor+1], actionArray[cursor+2]);
                cursor += 3;
                break;
            case "a":
            case "setAngle":
                PEN.setAngle(actionArray[cursor+1]);
                cursor += 2;
                break;
            case "b":
            case "backward":
                PEN.backward(actionArray[cursor+1]);
                cursor += 2;
                break;
            case "h":
            case "home":
                PEN.home();
                cursor += 1;
                break;
            case "x":
            case "setX":
                PEN.setX(actionArray[cursor+1]);
                cursor += 2;
                break;
            case "y":
            case "setY":
                PEN.setY(actionArray[cursor+1]);
                cursor += 2;
                break;
            default:
                break;
        }
        action = actionArray[cursor];  
    }

    let path = utils.newNSElem("path");

    let pathAttrs = {
        'd': pathStrings, 
        'stroke': `${PEN.getPenColor()}`, 
        'stroke-width': `${PEN.getPenSize()}`, 
        'fill': "rgba(1,1,1,0)", 
        'stroke-linecap': `${PEN.getLinecap()}`
    }

    utils.setAttrs(path, pathAttrs);
    pathUtils.sendToRender(path);

    if (wasPenDown){
        PEN.penDown();
    }

    return path;         

}




    Object.assign(PEN, {
        arc, 
        wedge,
        arcBigClockwiseTo,
        arcBigAnticlockwiseTo,
        arcSmallAnticlockwiseTo,
        arcSmallClockwiseTo,
        pathLinear, 
        pathCubic, 
        pathQuadratic,
        pathExternal, 
        metaPath
    })
    return; 
}

export function addTransformsTo(PEN){

    const transformUtils = {
        toDOMPoint: function(x,y){
            let pt = new DOMPoint(); 
            pt.x = x;
            pt.y = y;   
            return pt;
        },
        affineTransform: function(DOMMatrixTransform){
            let currentTransform = PEN.getTransform()
            const svgLocation = PEN._getSVGLocation();
            const transformedLocation = transformUtils.toDOMPoint(...svgLocation).matrixTransform(currentTransform)
            // translate to SVG origin
            const matrixMoveToSvgOrigin = new DOMMatrix();
            matrixMoveToSvgOrigin.e = -transformedLocation.x;
            matrixMoveToSvgOrigin.f = -transformedLocation.y;
            currentTransform = matrixMoveToSvgOrigin.multiplySelf(currentTransform);
            // main transform step
            currentTransform = DOMMatrixTransform.multiply(currentTransform); 
            // translate back
            const matrixMoveBackToPenOrigin = new DOMMatrix();
            matrixMoveBackToPenOrigin.e = +transformedLocation.x;
            matrixMoveBackToPenOrigin.f = +transformedLocation.y;
            currentTransform = matrixMoveBackToPenOrigin.multiplySelf(currentTransform);
            // update transorm state
            PEN.setTransform(currentTransform);
            return;
        }
    }
     
    function clearTransforms(){
        PEN.setTransform(new DOMMatrix())
        return; 
    }

    function moveOver(dx){
        //define moveX
        let moveX = new DOMMatrix();
        moveX.e = dx;
        //perform moveX
        transformUtils.affineTransform(moveX);
        return;     
    }

    function moveUp(dy){
        // define moveY
        let moveY = new DOMMatrix();
        moveY.f = -dy;
        //perform moveY
        transformUtils.affineTransform(moveY);
        return; 
    }

    function rotate(degreesAnticlockwise){
        //define rotate
        const rotate = new DOMMatrix();
        const radians = -degreesAnticlockwise * (Math.PI/180)
        rotate.a = Math.cos(radians);
        rotate.b = Math.sin(radians);
        rotate.c = -Math.sin(radians);
        rotate.d = Math.cos(radians)
        // perform rotate
        transformUtils.affineTransform(rotate);
        return;
    }   


    /// scaling is done relative to -100, 100


    function zoomIn(percent){
        /// define zoom
        const zoom = new DOMMatrix();
        percent = percent/100;
        zoom.a += percent;
        zoom.d += percent; 
        // perform zoom
        transformUtils.affineTransform(zoom)
        return;
    }

    function stretchX(percent){
        /// define stretch
        const stretchX = new DOMMatrix();
        percent = percent/100;
        stretchX.a += percent;
        //perform stretch
        transformUtils.affineTransform(stretchX);
        return;
    }

    function stretchY(percent){
        /// define stretch
        const stretchY = new DOMMatrix();
        percent = percent/100;
        stretchY.d += percent;
        //perform stretch
        transformUtils.affineTransform(stretchY);
        return;
    }

    function flipX(){
        /// define stretch
        const flip = new DOMMatrix();
        flip.a = -1;
        //perform stretch
        transformUtils.affineTransform(flip);
        return;
    }
    function flipY(){
        /// define stretch
        const flip = new DOMMatrix();
        flip.d = -1;
        //perform stretch
        transformUtils.affineTransform(flip);
        return;
    }

    function shearX(percent){
        /// define stretch
        const shearX = new DOMMatrix();
        percent = percent/100;
        shearX.c = percent;
        //perform stretch
        transformUtils.affineTransform(shearX);
        return;
    }

    function shearY(percent){
        /// define stretch
        const shearY = new DOMMatrix();
        percent = percent/100;
        shearY.b = percent;
        //perform stretch
        transformUtils.affineTransform(shearY);
        return;
    }

    function fitInto(ELEMENT){ 
        let end = ELEMENT.getBoundingClientRect();
        let current = PEN.getElement().getBoundingClientRect();
        // for scaling
            //find the limiting dimension (width or height)
            let percent = Math.min(end.width/current.width, end.height/current.height)
            //find the percent difference
            percent = percent*100 - 100;
            //scale by that percent
            PEN.zoomIn(percent)
            current = PEN.getElement().getBoundingClientRect();

        // for translation
            //find centers of both
            let endCenter = [end.x + (end.width/2), end.y + (end.height/2)];
            let currentCenter = [current.x + (current.width/2), current.y + (current.height/2)];
            //find differences (dx,dy)
            let dx = endCenter[0] - currentCenter[0];
            let dy = -endCenter[1] + currentCenter[1];

            PEN.moveOver(dx);
            PEN.moveUp(dy);
        return;
    }

    Object.assign(PEN, {
        clearTransforms,
        moveOver, 
        moveUp, 
        rotate,
        zoomIn, 
        stretchX,
        stretchY,
        flipX,
        flipY, 
        shearX,
        shearY, 
        fitInto
    });
    return;
}

// provided common utilities
export let UTILS = {
    sleep: function(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    randInt: function(min,max){
        let range = (max + 1) - min;
        let offset = Math.floor(Math.random()*range);
        return min + offset;    
    }, 
    randRGB: function(){
        return `rgb(${UTILS.randInt(0,255)}, ${UTILS.randInt(0,255)}, ${UTILS.randInt(0,255)})`
    },
    randRGBA: function(){
        return `rgba(${UTILS.randInt(0,255)}, ${UTILS.randInt(0,255)}, ${UTILS.randInt(0,255)}, ${Math.random()})`
    }

}