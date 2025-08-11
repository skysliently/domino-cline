// Module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Events = Matter.Events,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

// Create engine
const engine = Engine.create();
engine.world.gravity.y = 2; // Set gravity

// Create renderer
const canvas = document.getElementById('dominoCanvas');
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#fff'
    }
});

// Create ground
const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, render: { fillStyle: '#333' } });
World.add(engine.world, ground);

// Create left wall
const leftWall = Bodies.rectangle(-10, 300, 20, 600, { isStatic: true, render: { fillStyle: '#333' } });
World.add(engine.world, leftWall);

// Create right wall
const rightWall = Bodies.rectangle(810, 300, 20, 600, { isStatic: true, render: { fillStyle: '#333' } });
World.add(engine.world, rightWall);


// Array to keep track of dominoes
let dominoes = [];

// Function to create a domino
function createDomino(x, y) {
    const dominoWidth = 10;
    const dominoHeight = 60;
    const domino = Bodies.rectangle(x, y, dominoWidth, dominoHeight, {
        render: {
            fillStyle: 'blue'
        }
    });
    dominoes.push(domino);
    World.add(engine.world, domino);
}

// Mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
});

World.add(engine.world, mouseConstraint);

// Keep the mouse in sync with rendering
render.mouse = mouse;

// Handle mouse clicks
Events.on(mouseConstraint, 'mousedown', function(event) {
    const mousePosition = event.mouse.position;
    if (event.mouse.button === 0) { // Left click
        createDomino(mousePosition.x, mousePosition.y);
    } else if (event.mouse.button === 2) { // Right click
        // Find the nearest domino
        let nearestDomino = null;
        let minDistance = Infinity;
        dominoes.forEach(domino => {
            const distance = Math.sqrt(Math.pow(domino.position.x - mousePosition.x, 2) + Math.pow(domino.position.y - mousePosition.y, 2));
            if (distance < minDistance) {
                minDistance = distance;
                nearestDomino = domino;
            }
        });

        if (nearestDomino) {
            // Apply a force to knock it over
            Body.applyForce(nearestDomino, nearestDomino.position, { x: 0.005, y: -0.005 });
        }
    }
});

// Prevent context menu on right click
canvas.addEventListener('contextmenu', event => event.preventDefault());

// Run the engine
Engine.run(engine);

// Run the renderer
Render.run(render);