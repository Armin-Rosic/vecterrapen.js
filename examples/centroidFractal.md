![Minimal Example](/images/centroids.png)

## The Code

```javascript
import {penScreen, addPenTo, addPathsTo, addTransformsTo} from '../vecterrapen.js'

const screen = penScreen()

let q1 = addPenTo(screen)
addPathsTo(q1)
addTransformsTo(q1)

q1.penSize(0.2)
q1.penColor('gold')

let meta_actions = [] // this will be our action array that defines the fractal <path>

function centroidFractal(p1,p2,p3){
    /*
    This function builds our meta_actions array that constructs a centroid fractal 
    inside the tringle defined by points 'p1', 'p2', and 'p3'.
    So, we will find the centroid/center of this outermost triangle, and then use this new
    point as well as adjacent points around the triangle to construct 6 inscribed triangles.
    We then recurively do this for all inscribed tringles, untill we draw line segments 
    smaller than a specified size (15 pixels in our case). 
    */

    // Find the centroid of the three points
    let center = centroid(p1,p2,p3) 

    // Expanding upon the three points by including the midpoint of adjacent points
    let pts = [p1, midpoint2D(p1,p2), p2, midpoint2D(p2,p3), p3, midpoint2D(p3,p1), p1]

    // Controlling the recursion / density using size of drawn line segments
    if (distance2D(center,pts[1]) < 15){ // <-- control the fractal's density, 15 is rather dense! 
        return;
    }

    // Add action that navigates to the current triangle's centroid
    meta_actions.push('goto', ...center)

    // Build an action array that walks from the centroid to each of the points on the triangle
    // .. and back to the centroid each time, (resulting in duplicated lines, but a more succinct implementation)
    let current_actions = [
        "g", pts[0][0], pts[0][1],
        "g", center[0], center[1],
        "g", pts[1][0], pts[1][1],
        "g", center[0], center[1],
        "g", pts[2][0], pts[2][1],
        "g", center[0], center[1],
        "g", pts[3][0], pts[3][1],
        "g", center[0], center[1],
        "g", pts[4][0], pts[4][1],
        "g", center[0], center[1],
        "g", pts[5][0], pts[5][1]
    ]

    // Add this part of the fractal to the meta_actions as a linear path
    meta_actions.push('pathLinear', {actions: current_actions})

    // recurse for each new triangle formed within the current triangle 
    for (let i=0; i < (pts.length-1); i++){
        centroidFractal(pts[i], pts[i+1], centroid(p1,p2,p3));   
    }
}

// Call our path builder with some intital points / triangle
centroidFractal([-900,900],[900,900],[0,-900])

// Finally draw the path we built
q1.metaPath({
    actions: meta_actions
})

// Make the resulting drawing fit in the screen
q1.fitInto(screen.select())

// Shrink it sligtly so the edges are not touching the screen edges
q1.penUp()
q1.home()
q1.zoomIn(-10)


// --------- some utility functions ---------------

// mid-point of two points
function midpoint2D(a1, a2){
    return [ (a2[0] + a1[0])/2 , (a2[1] + a1[1])/2 ]
}
// distance between points
function distance2D(p1,p2){
    return Math.sqrt(Math.pow((p1[0]-p2[0]), 2) + Math.pow((p1[1]-p2[1]), 2))
}
// centroid of three points
function centroid(a1, a2, a3){
    return [ (a2[0] + a1[0] + a3[0])/3 , (a2[1] + a1[1] + a3[1])/3 ]
}

```

## Discussion
This is a wonderful example of the need for the *metaPath* construct and it's utility with complex designs.

As we vary the density of the fractal, we very quickly reach hundreds of thoudands of constituent edges. If our implementation was such that we used raw pen commands, we would give rise to hundreds of thoudsands of svg \<line\> elements - which stalls / crashes all browsers on most desktop machines. Yup, this is how I first implemented it :). So, the next improvement would be to build a path for each constituent centroid. This is a lot better, but still results in thousands of nodes very quickly. With 'metaPath', we shift the computational burden to the JavaScript engine and make the rendering of such involved designs routine. The rendering itself takes on the order of 10 milliseconds after we have the action array and the *metaPath* it defines.   

**Future development will leverage web workers, or WebAssembly, to take the scripting off of the main thread so the construction of involved paths doesn't impede general performance and site responsiveness.

## Ideas for variations
* Experiment with varying the conditions for the recursion base case to get different designs
* Turn this into an animation by making the `centroidFractal` function async, one way is ...
  * Clear what the pen has drawn
  * Call `metaPath` within `centroidFractal` with the partially complete meta_action array
  * use `await UTILS.sleep(ms)` to set the approximate time between frames

