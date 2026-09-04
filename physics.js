

function initPhysics() {
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    const canvas = document.getElementById('physics-canvas');
    if (!canvas) return;

    const engine = Engine.create();
    
    // Create renderer
    const render = Render.create({
        canvas: canvas,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            background: 'transparent',
            wireframes: false,
            pixelRatio: window.devicePixelRatio
        }
    });

    // Create boundaries (walls, floor, ceiling)
    const wallOptions = { isStatic: true, render: { fillStyle: 'transparent' } };
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, wallOptions);
    const leftWall = Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, wallOptions);
    const rightWall = Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, wallOptions);
    const ceiling = Bodies.rectangle(window.innerWidth / 2, -500, window.innerWidth * 2, 50, wallOptions); // High ceiling to drop things

    Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    // Create falling molecules
    const colors = ['#3b82f6', '#f97316', '#10b981', '#facc15', '#ec4899', '#8b5cf6'];
    const bodies = [];
    
    for (let i = 0; i < 40; i++) {
        let radius = 20 + Math.random() * 15;
        let x = Math.random() * window.innerWidth;
        let y = -Math.random() * 2000; // Drop from sky
        
        let circle = Bodies.circle(x, y, radius, {
            restitution: 0.8, // Bouncy
            friction: 0.05,
            render: {
                fillStyle: colors[Math.floor(Math.random() * colors.length)],
                strokeStyle: '#ffffff',
                lineWidth: 3
            }
        });
        bodies.push(circle);
    }
    
    Composite.add(engine.world, bodies);

    // Add mouse interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });
    
    // Important: Let mouse events pass through to the canvas without breaking underlying HTML
    // But since canvas is z-index 0, the menu cards (z-index 10) will capture clicks on themselves.
    // The canvas will only capture clicks in the empty background!
    
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Run engine and renderer
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Handle window resize
    window.addEventListener('resize', () => {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;
        render.options.width = window.innerWidth;
        render.options.height = window.innerHeight;
        Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 25 });
        Matter.Body.setPosition(rightWall, { x: window.innerWidth + 25, y: window.innerHeight / 2 });
    });
}
