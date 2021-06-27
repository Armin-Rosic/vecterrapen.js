
Vecterrapen.js is an SVG graphics library inspired by Python's Turtle graphics module. It's primary goal is to bring the ease and joy of Turtle graphics to the web in a modern and viable way. 
However, given the fantastic support and performance of SVGs in modern browsers and the DOM nature of SVG elements, vecterrapen.js also serves as a micro UI and game framework with high performance / interactive 2D graphics, cross-browser support, and a beginner friendly and extensible architecture.


###### My personal [website](https://www.arminrosic.com) is built entirely with vecterrapen. 

# Table of contents
- Getting Started
- [Screens](#screens)
- [Pens (turtles / terrapins)](#pens) 
- [Paths](#paths)
- [Transforms](#transforms)
- [Odds and Ends](#odds-and-ends)
  - [Colors](#colors)
  - [UTILS](#utils)
  - [Architecture](#architecture)
  - [Hey, what's up with the name?](#hey-whats-up-with-the-name)

## Overview 
* A screen is instantiated and will serve as the canvas for your creation. 
* On that screen you add as many independently controllable pens (turtles/terrapins) as you'd like. 
* Each pen patiently awaits your instructions facing to the right in the middle of it's screen.
* Each pen can also have additional superpowers added to it (paths and transforms for now).
* You happily wield your pens with the wildest algorithms you can dream up. :)
* Art. UIs. Websites. Visualizations. Animations. ... :) :)

## Minimal example 

```javascript
import * as vtp from './vecterrapen.js'

const screen = vtp.penScreen()  
const pen_1 = vtp.addPenTo(screen)  

pen_1.forward(100)
pen_1.dot(10)
```

![Minimal Example](/images/minimalExample.png)


## Minimal example (multiple screens)

```html
<body>
    <div id='firstScreen'></div>
    <div id='secondScreen'></div>

    <script type="module" src='vecterrapen.js'></script>
    <script type="module" src='test.js'></script>
</body>

```

```javascript
//in test.js
import * as vtp from './vecterrapen.js'

// setup first screen
const screen_1 = vtp.penScreen(300, 150, 'firstScreen')
const pen_1 = vtp.addPenTo(screen_1)

pen_1.forward(100)
pen_1.dot(10)


// setup second screen
const screen_2 = vtp.penScreen(500, 450, 'secondScreen')
screen_2.bgColor('gray')

const pen_2 = vtp.addPenTo(screen_2)
pen_2.penColor('cyan')

pen_2.backward(100)
pen_2.dot(10)
```

![Multi Screen Example](/images/minimalExampleTwoScreens.png)



## Two modes of use ...
1.Single screen / prototype mode
* call penScreen() and bind to a screen name, this will be the only screen
* add as many pens as you need to your screen
* have gobs of fun !

2.Embedding in larger site
* add screens to existing elements (usually div)...
* call penScreen(screenWidth, screenHeight, element_id), and bind to a name
* control screen positioning via CSS, like you would a regular image 
* add pens to your screens and draw as if each was in single screen mode
* have gobs of fun, on every screen !

## Minimal FUN example 

```javascript
import * as vtp from './vecterrapen.js'

const screen = vtp.penScreen()  
const pen_1 = vtp.addPenTo(screen) 
const pen_2 = vtp.addPenTo(screen)

//set colors
screen.bgColor('pink')
pen_1.penColor('purple')
pen_2.penColor('blue')

//random walks
for (let i = 0; i < 3000; i++){
    pen_1.forward(2)
    pen_1.right(vtp.UTILS.randInt(-90,90))

    pen_2.forward(2)
    pen_2.right(vtp.UTILS.randInt(-90,90))
}
```

![Minimal FUN Example](/images/minimalFUNExample.png)

**This implementation of random walks adds 6,000 nodes to the DOM, yikes!!   
**Even though most browsers/devices handle this just fine, paths allow for a much more compact implementation. 
**see [Random Walks Revisited](#random-walks-revisited) 

---
---
---
# Screens 
### `penScreen( ?[width, height, tag_id] )`
The *penScreen* is the parent object of all vecterrapen graphics. It defines the drawing canvas (an SVG element / viewBox), the origin of the drawing as it's center, the orientation of the drawing as a standard X-Y axis (+Y is up, +X is to the right), and can have any number of pens added to it.


#### Instantiation  

```javascript
// single screen mode
const myScreen = penScreen()
```
```javascript
// add to existing tag
// call as many times as you'd like screens
const myScreen = penScreen(width, height, tag_id)
```
#### Methods
* #### `clear()` 
  - *( )  -->  ( )*
  - erase all that has been drawn, no other mutations
* #### `bgColor(color)` 
  - *(string) --> ( )*
  - see [colors](#colors) 
* #### `getOriginalWidth() / getOriginalHeight()` 
  - *( )  -->  (number)*
  - width/height of screen prior to any resizing events


### 
---
---
---
# Pens 
### `addPenTo(screen)`
Pens, and their extensions, do all of the interesting work and are the primary object we interact with. Pens can only come to life by being added to an existing screen, and they begin their life at 'home', which is at the center of their screen facing to the right.     
    
As the pen recieves drawing, stylistic, and other instructions, it updates it's state atomically in accordance with the particular instruction. Instructions that result in something being drawn on the screen have a return value of the actual graphics primitive that was drawn, upon binding this value to a variable - one can interact with the raw SVG element directly. (see [below](#drawn-svg-elements))  


#### Instantiation  


```javascript
// myScreen is an existing screen reference
const pen_1 = addPenTo(myScreen)
const pen_2 = addPenTo(myScreen)
...
```

#### Methods
- [Drawing](#drawing)
  - penUp / penDown
  - isPenDown
  - forward / backward
  - goto
  - right / left
  - setAngle / getAngle
  - getPosition
  - home
  - face
  - clear
  - dot
  - squareDot
  - circle
  - rect 
  - text
  - htmlTextBox
  - setX / setY
  - getX / getY
  - vector
  - vectorDyDx
  - image
  - generatePoints
  - generateEndpoint
  - setTransform / getTransform
  - _getSVGLocation / _setSVGLocation
  - _coordinatesSVGToUser / _coordinatesUserToSVG

- [Stylistic](#stylistic)
  - penColor / getPenColor
  - fillColor / getFillColor
  - penSize / getPenSize
  - textSize / getTextSize
  - setFont / getFont
  - linecapRound / linecapSquare
  - getLinecap
- [Batch Processing](#batch-processing)
  - renderOff / renderOn
  - renderUpdate
  - isRenderOn
  - getRenderBuffer


###### Drawing
* #### `penUp() / penDown()`
  - *( )  -->  ( )*
  - controls whether or not the pen draws a line when it moves
* #### `isPenDown()`
  - *( )  -->  (bool)*
* #### `forward(distance) / backward(distance)`
  - *(number) --> (svg \< line \>) || ( )* 
  - moves (distance), drawing line if pen is down
* #### `goto(x,y)` 
  - *(number, number) --> (svg \< line \>) || ( )* 
  - moves to (x,y), drawing line if pen is down
* #### `right(angle) / left(angle)`
  - *( number )  -->  ( )*
  - turn pen (angle) degrees
* #### `setAngle(angle)` 
  - *( number )  -->  ( )*
  - counter-clockwise from +X axis
* #### `getAngle()`
  - *( )  -->  ( number )*
  - counter-clockwise from +X axis

* #### `getPosition()` 
  - *( )  -->  ( [x,y] )*
* #### `home()`
  - *( ) --> (svg \< line \>) || ( )* 
  - moves to origin, drawing line if pen is down, and sets angle to 0 degrees 
* #### `face(x,y)`
  - *(number, number) --> (number)* 
  - orients pen to face (x,y), returns resulting pen angle 
* #### `clear()`
  - *( )  -->  ( )*
  - erases everything the pen has drawn, no other mutations
* #### `dot(radius)`
  - *(number) --> (svg \< circle \>)* 
  - draws a dot with (radius), centered at current position
* #### `squareDot(size)`
  - *(number) --> (svg \< rect \>)* 
  - draws a filled square with (side = size * 2), centered at current position
* #### `circle(radius)`
  - *(number) --> (svg \< circle \>)* 
  - draws a circle with (radius), centered at current position
* #### `rect(width, height, ?[align])`
  - *(number, number, optional_string) --> (svg \< rect \> )* 
  - draws rectangle of (height) (width)
  - optional alignment string default value "topLeft", "center" and "topRight" available
* #### `text(text, ?[jumpTo])`
  - *( string, optional_string) --> ( html \< p \> embedded in svg \< foreignObject \> )* 
  - draws text that preserves spacing/new-line by default
  - optional jumpTo string default value "after", "under" also available 
  - "after" updates pen position to the right of text, for horizontal arrangement
  - "under", for vertical arrangement
* #### `htmlTextBox(width, text)`
  - *( number, string ) --> ( html \< p \> embedded in svg \< foreignObject \> )* 
  - draws text that wraps to fit in (width)

* #### `setX(x) / setY(y)` 
  - *( number ) --> (svg \< line \>) || ( )* 
  - moves the pen horizontally or vertically, drawing a line if the pen is down

* #### `getX() / getY()`
  - *( )  -->  ( number )*

* #### `vector(magnitude, angle)`
  - *( number, number ) --> (svg \< line \>) || ( )* 
  - sets the pen's (angle) and moves the pen by (magnitude), drawing a line if the pen down

* #### `vectorDxDy(dy, dx)`
  - *( number, number ) --> (svg \< line \>) || ( )* 
  - displaces the pen by (dy) and (dx), drawing a line if the pen down

* #### `image(height, width, href)`
  - *( number, number, string ) --> (svg \< image \>)* 
  - incorporates external image found at (href)

* #### `generatePoints(actionArray, ?[coordinateSpace])`
  - *( [ actions ], optional_string )  -->  ( [ [number, number], [number, number], ... ] )*
  - An interpreter that simulates pen actions, and reports how the pen's position changed as a result. 
  - While this method can be useful on it's own, it is generally used indirectly via [paths](#paths).
  - See [Action Arrays](#action-arrays) for details.
* #### `generateEndpoint(actionArray, ?[coordinteSpace])`
  - *( [ actions ], optional_string )  -->  ( [number, number] )*
  - same as generatePoints, but only returns the final pen position
  - (useful for e.g. visualizing the Fourier Transform)
* #### `setTransform(transform)`  
  - *( DOMMatrix )  -->  ( )*
  - sets pen's affine transform to that of provided matrix
  - while this method can be used directly, it is usually used indirectly via the 'addTransformsTo(...)' mixin.
  - one scenario where it is directly useful is in setting the transform of one pen that of another
  - see [Transforms](#transforms)
* #### `getTransform()`
  - *( )  -->  ( DOMMatrix )*

* #### `_coordinatesSVGToUser(x,y)` 
  - *( number, number) --> ( [ number, number ])* 
  - converts a coordinate (x,y) from the underlying, untransformed, SVG coordinate system to the standard pen coordinate system. 
* #### `_coordinatesUserToSVG(x,y)`
  - *( number, number) --> ( [ number, number ])* 
  - converts a coordinate (x,y) from the standard pen coordinate system to the underlying, untransformed, SVG coordinate system. 
* #### `_getSVGLocation()` 
  - *( ) --> ( [ number, number ])* 
  - returns the pen's position on the underlying, untransformed, SVG coordinate system. 
* #### `_setSVGLocation()`
  - *( number, number ) --> ( )* 
  - sets the pen's position on the underlying, untransformed, SVG coordinate system. 

###### Stylistic
* #### `penColor(color)` 
  - *( string )  -->  ( )*

* #### `getPenColor()`
  - *( )  -->  ( string )*

* #### `fillColor(color)` 
  - *( string )  -->  ( )*

* #### `getFillColor()`
  - *( )  -->  ( string )*

* #### `penSize(size)`
  - *( number )  -->  ( )*
  - sets the width of line the pen draws
* #### `getPenSize()`
  - *( )  -->  ( number )*
* #### `textSize(size)` 
  - *( number )  -->  ( )*

* #### `getTextSize()`
  - *( )  -->  ( number )*

* #### `setFont(fontFamily)` 
  - *( string )  -->  ( )*
  - can be of a built-in or linked font
* #### `getFont()`
  - *( )  -->  ( string )*

* #### `linecapRound() / linecapSquare()` 
  - *( )  -->  ( )*

* #### `getLinecap()`
  - *( )  -->  ( string )*


###### Batch Processing
For various reasons, the need comes up to be able to assemble/define parts of drawings and then send them to the DOM all at once. 
This is accomplished via rendering controls. 
These controls are particularly useful with the drawing of a large collection of elements, as it is generally far more efficient 
to define them all and then draw them all at once - than it is to define and draw each one in turn.  
This is also very useful when used in conjunction with asynchronous code, for preparing animation frames. 
 
* #### `renderOff() / renderOn()` 
  - *( )  -->  ( )*
  - toggle pen rendering
  - renderOn will also call renderUpdate

* #### `renderUpdate()` 
  - *( )  -->  ( )*
  - sends accumulated drawing buffer (DocumentFragment) to be rendered on screen 
  - clears drawing buffer 
* #### `isRenderOn()` 
  - *( )  -->  ( bool )*

* #### `getRenderBuffer()` 
  - *( )  -->  ( DocumentFragment )*
  - allows for the direct interaction with the current drawing buffer 

---
---
---

# Paths
### `addPathsTo(pen)`

Paths are the bread and butter of the SVG standard, and of vector design in general.
They allow for the description of arbitrary shapes using any combination of Bézier curves, arcs, line sections, and non-drawing movement. 

All modern browsers are extremely good at rendering paths - even with large numbers of components, which is why we often turn to them for more involved and performance critical applications. Furthermore, since a path stores it's shape information in it's attibutes (mainly 'd'), it allows for the drawing of very involved shapes using only a single DOM node. 

In *vecterrapen*, paths are extensions/mixins to existing pens. They are generated from  **action arrays**, by specifying a type of arc, or imported from your favorite design software for inclusion in the drawing, via **pathExternal** .

#### Instantiation  


```javascript
// pen_1 is an existing pen reference
addPathsTo(pen_1)

// all path methods are now accesible to pen_1
pen_1.arc(200,90,45)
```
#### Types of Paths

- [Action or Point Defined Curves](#action-defined-curves)
   - pathLinear
   - pathQuadratic
   - pathQuadratic
- [Arcs](#arcs)
   - arc
   - wedge
   - arcBigClockwiseTo
   - arcBigAnticlockwiseTo
   - arcSmallAnticlockwiseTo
   - arcSmallClockwiseTo
- [Imported](#imported)
   - pathExternal
- [General Paths](#general-paths)
   - metaPath


###### Action Defined Curves

##### Action Arrays
Action arrays are JS arrays of drawing commands encoded as strings, followed by the arguments to those commands. 
They are used to simulate pen actions and harvest the points those actions take the pen to. 
These points are then used as the control points for various curves, or simply returned as in the case of generatePoints() and generateEndpoint(). 
```javascript
// a simple action array
let actions = [
  'forward', 155, 
  'right', 90, 
  'forward', 200
]
```
Actions also have shortened aliases for brevity. 
```javascript
// equivalent to above
let aliased = [
  'f', 155, 
  'r', 90, 
  'f', 200
]
```

##### Action Aliases

|    |     |     |
| ---| --- | --- |
| 'forward' ... ' f '| ' right ' ... ' r ' | 'left' ...' l '|
| 'goto' ... ' g ' | 'vector' ... ' v ' | 'vectorDxDy' ... ' dxdy ' |
| 'face' ... ' f ' | 'setAngle' ... ' a ' | 'backward' ... ' b '|
| 'home' ... ' h ' | 'setX' ... ' x ' | 'setY' ... ' y ' |

* #### `pathLinear({actions || points, ?options})` 
  - *( {actions: actionArray || points: pointArray, ?options: optionsArray} )  -->  ( svg \< path \>) )*
  - draws a path of line sections between the provided points, or between the points generated by an action array.
  - options are specified in an array, as strings, and can be any combination of 'fill', 'close', 'pin' and 'detach' 
    - 'fill' applies the fill color to the resulting path, which can have *interesting* behavior basen on how the path intersects itself
    - 'close' adds the starting point as the ending point, closing the path
    - 'pin' keeps the pen's position and angle unchanged after the path is drawn
    - 'detach' has the path start at the end of the first generated point, not at the pen's location 
* #### `pathQuadratic({actions || points, ?options})` 
  - *( {actions: actionArray || points: pointArray, ?options: optionsArray} )  -->  ( svg \< path \>) )*
  - draws a path of second order sections between every other point, using skipped points as control points 
  - resulting curve is generally smooth and without kinks (differentiable)
  - curve tends to stray from control points in order to remain smooth 
  - options same as for pathLinear
* #### `pathCubic({actions || points, ?options})` 
  - *( {actions: actionArray || points: pointArray, ?options: optionsArray} )  -->  ( svg \< path \>) )*
  - draws a path of third order sections between every other point, using skipped points as control points 
  - resulting curve is generally smooth and without kinks (differentiable)
  - curve tends to stay relatively close to control points 
  - options same as for pathLinear

##### Random Walks Revisited
Here we reimplement our previous random walk example, but have each walk of 3,000 steps be defined as a single path.
The screens look identical, but we are now using 2 DOM nodes instead of 6,000. Yes, paths rock! 
```javascript
import * as vtp from './vecterrapen.js'

const screen = vtp.penScreen()  
const pen_1 = vtp.addPenTo(screen) 
const pen_2 = vtp.addPenTo(screen)

// add paths to both pens
vtp.addPathsTo(pen_1)
vtp.addPathsTo(pen_2)

//set colors
screen.bgColor('pink')
pen_1.penColor('purple')
pen_2.penColor('blue')

// construct action arrays 
let actions_1 = []
let actions_2 = []
for (let i = 0; i < 3000; i++){
    actions_1.push('forward', 2)
    actions_1.push('right', vtp.UTILS.randInt(-90,90))

    actions_2.push('forward', 2)
    actions_2.push('right', vtp.UTILS.randInt(-90,90))
}

// make the walks/actions into paths !! 
pen_1.pathLinear({
  actions: actions_1
})

pen_2.pathLinear({
  actions: actions_2
})
```



###### Arcs
* #### `arc(radius, startAngle, endAngle)` 
  - *( number, number, number )  -->  ( svg \< path \>) )*
  - draws arc centered at the pen's position, does not move the pen
  - angles are measured from the +X axis 
* #### `wedge(radius, startAngle, endAngle)` 
  - *( number, number, number )  -->  ( svg \< path \>) )*
  - same as arc, but connects arc ends to pen's position (center)
  - yes, it's a pizza slice :) (but slice is already used in JS :( ) 
* #### `arcBigClockwiseTo(endPointArray, radius)` 
  - *( [ number, number ], number )  -->  ( svg \< path \>) )*
  - draws large arc of (radius) clockwise from the pen's position to the (endPoint)
  - updates pen position to (endPoint)
* #### `arcBigAnticlockwiseTo(endPointArray, radius)` 
  - *( [ number, number ], number )  -->  ( svg \< path \>) )*
  - draws large arc of (radius) anticlockwise from the pen's position to the (endPoint)
  - updates pen position to (endPoint)
* #### `arcSmallAnticlockwiseTo(endPointArray, radius)` 
  - *( [ number, number ], number )  -->  ( svg \< path \>) )*
  - draws small arc of (radius) anticlockwise from the pen's position to the (endPoint)
  - updates pen position to (endPoint)
* #### `arcSmallClockwiseTo(endPointArray, radius)` 
  - *( [ number, number ], number )  -->  ( svg \< path \>) )*
  - draws small arc of (radius) clockwise from the pen's position to the (endPoint)
  - updates pen position to (endPoint)


###### Imported
* #### `pathExternal(dAttribute)` 
  - *( string )  -->  ( svg \< path \>) )*
  - draws a path specified elsewhere based on its 'd' attribute 

###### General Paths
Putting it all together now! *metaPath* is like other action defined curves but, it takes as actions other paths! 
It also accepts movement actions, but they are only for movement - all drawing is done by the constiuent paths.
The purpose of such a construction is to be able to use all existing path abstractions to construct arbitrary hybrid paths.


* #### `metaPath({actions})` 
  - *( {actions: actionArray} )  -->  ( svg \< path \>) )*
  - makes one path from the constituent paths specified in (actionArray) 
---
---
---

# Transforms

### `addTransformsTo(pen)`

If *paths* are the bread and butter of the SVG standard, *transforms* are surely the dessert.
They allow us to independently translate, rotate, warp, dilate, and skew the drawing plane of each pen. 
Transforms are indispensible for controlling the layout of drawings, as well as for animation. 

#### Instantiation  

```javascript
// pen_1 is an existing pen reference
addTransformsTo(pen_1)

// all transform methods are now accesible to pen_1
pen_1.moveUp(20)
```

#### Methods
- [Simple Transforms](#simple-transforms)
  - **setTransform / getTransform
  - clearTransforms
  - moveOver / moveUp
  - rotate
  - zoomIn
  - stretchX / stretchY
  - flipX / flipY
  - shearX / shearY
- [Compound Transforms](#Compound-transforms)
  - fitInto

###### Simple Transforms
* #### `setTransform(transform)`  
  - *( DOMMatrix )  -->  ( )*
  - sets pen's affine transform to that of provided matrix
  - it is actually a method on the pen directly, before the addTransformsTo mixin is added - but it is repeated here for completion
  - while this method can be used directly, it is usually used as an internal setter for the other transform methods
  - one scenario where it is directly useful is in setting the transform of one pen that of another
* #### `getTransform()`
  - *( )  -->  ( DOMMatrix )*
  - returns the current transform matrix, which is the result of all previous transform compositions
* #### `clearTransforms()` 
  - *( )  -->  ( )*
  - return/transform pen to the original, untransformed, coordinate plane
* #### `moveOver(dx) / moveUp(dy)` 
  - *( number )  -->  ( )*
  - move everything the pen has drawn ( number ) pixels over/up
* #### `rotate(degrees)` 
  - *( number )  -->  ( )*
  - rotate the pen's drawing, about the pen's current position, counterclockwise (degrees)
* #### `zoomIn(percent)` 
  - *( number )  -->  ( )*
  - zoomIn / dilate about the pen's current position by (percent)
  - positive inputs make the drawing bigger, negative smaller
  - note: the scale is not linear. (-100) makes the drawing the smallest possible, i.e. dissapear, while there is no upper bound on how large the drawing can be scalled
* #### `stretchX(amount) / stretchY(amount)` 
  - *( number )  -->  ( )*
  - stretch the drawing horizontally or vertically
* #### `flipX() / flipY()` 
  - *( )  -->  ( )*
  - flips the drawing about the pen's current position
* #### `shearX() / shearY()` 
  - *( )  -->  ( )*
  - shears the drawing about the pen's current position

###### Compound Transforms
* #### `fitInto(element)` 
  - *( svg element )  -->  ( )*
  - finds the bounding box of everything the pen has draw, shrinks it just enough to fit in (element)'s bounding box, and moves it's center to correspond with the center of (element)
  - intended to be used with an element that was not drawn by the current pen
  - currently, only meant to factor in the bounding box - so, it only fits into rectangular elements nicely
  - future development will check if (element) is a circle, and fit the drawing into the circle's inscribed square 
  - future development will also have a 'fitIntoAnimated' that will show the transformation of the drawing into (element)


---
---
---

# Odds and Ends

### Colors
Colors are currently specified as strings and can take all the standard color formats.

| Format | Examples |
| ------ | ------- |
| Color Names |'red', 'cyan'
| RGB | 'rgb(255, 0, 0)'|
| RGBA | 'rgba(255, 0, 0, 0.3)'| 
| %RGB / %RGBA | 'rgba(100%, 0%, 0%, 30%)'
| HEX | '#00FFFF'|

###### Try RGBA for fills in complex overlapping shapes ! 
A lot of really beautiful things happen when the SVG renderers get a complex shape with fill colors containing alpha values, it was one of the unexpectedly beautiful things that kept me working on this project and doing gobs of exploratory programming with it.  

---

### UTILS
I debated whether or not to include these, but they come up so often in my *vecterrapen* programs, that I figured I best add them. I will be adding many more, if I keep this section going forward.

#### Functions
- UTILS.sleep(ms)
- UTILS.randInt(from, to)
- UTILS.randRGB()
- UTILS.randRGBA()


* #### `UTILS.sleep(ms)` 
  - *( number )  -->  ( )*
  - used in asynchronous code to await for some number of (ms)
* #### `UTILS.randInt(from, to)` 
  - *( int, int )  -->  ( number )*
  - returns an integer in the range [from, to], so both the lower and upper bound are included in the possible return values.  
* #### `UTILS.randRGB()` 
  - *( )  -->  ( string )*
  - returns a random RGB color.  
* #### `UTILS.randRGBA()` 
  - *( )  -->  ( string )*
  - returns a random RGBA color.  

---

### Architecture

`The overarching design is that of factory functions (and closures) with mixins.` 
This was a very deliberate choice, and came after numerous other implementations - including JS classes. 
I wanted an architecture that is uncompromisingly simple for newcomers to JS to interact with and that is extensible/futureproof. I believe that the hybrid Object Oriented approch that the factory/mixin pattern provides is the closest in nature to what people expect in an OOP context, and completely circumvents the need to directly interact with JS prototypes and 'this'. I agree with Douglas Crockford that JS is objectively better (especailly for new programmers) without the 'this' keyword.  
`Is there a cost?`  
Yup - memory! But, it's a moot compromise given the memory available even on modest devices, and the galactic leap in simplicity of the interfaces, and the fact that objects only grow in size if they need a feature that a mixin provides.
`So, why mixins again?`
They are a very nimble way to make hybrid objects, overcoming some of the shortcoming of standard OOP design. And, yes, they help keep memeory down - but that wasn't the main reason for their inclusion. 
I want *vecterrapen* to be able to grow not only as I adopt/incorporate more of the SVG standard, but as I get ideas for functionality that would make *vecterrapen* more useful in more use cases. And, while *paths* and *transforms* are the only current mixins, there are many more in the pipeline. 
`With that said...`
As I work on the inclusion of parts of the standard, like animation and filters, there may very well be functionality that works from stand alone functions: functions that receive state, enact side-effects, and perhaps return a handle to a spawned element.   

---

### Hey, what's up with the name?

Well, since you asked...   
The original inspiration for the project was Python's Turtle module, as I mentioned before.   
In the endless back and forth of available package names and name ideas, I one day learned that there is a collection of turtle species called "terrapins". That struck an immediate chord as it referred to turtles and, with some adjusted spelling (given pens), I was going to call it 'terrapen'. But, something was missing ... these aren't just turtles/pens they are vector turtles!  So, I decided to sneak in a reference to vectors as well.   
(There is something so awesomly satisfying about bringing punny words to life!) 

---

Thanks for checking out vecterrapen ! :) 




