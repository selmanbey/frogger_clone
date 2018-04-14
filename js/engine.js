/* THIS FILE IS ORIGINALLY PROVIDED BY UDACITY */
/* I have only made some modifications in it */

/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on the player and enemy objects (defined in app.js).
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefines the variables to be used within this scope,
     * creates the canvas element, grabs the 2D context for that canvas,
     * sets the canvas elements height/width and adds it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Gets a time delta information to create smooth animation.
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();

        /* Sets a lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Uses the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function and loops through all of the
     * objects within the allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for the
     * player object.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        levelTable.render();
        bestSoFarTable.render();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. It is called every
     * game tick (or loop of the game engine).
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/grass-block.png',   // Top row is grass
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/stone-block.png',   // Row 1 of 2 of stone
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Clears existing canvas before each drawing
        ctx.clearRect(0,0,canvas.width,canvas.height)

        /* Loops through the number of rows and columns defined above
         * and, using the rowImages array, draws the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * It uses Resources helpers to refer to images
                 * to get the benefits of caching these images, since
                 * they are used over and over.
                 */
                 ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);

            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions defined
     * on the enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loops through all of the objects within the allEnemies array and calls
         * the render function.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        reward.render();
        levelTable.render();
        bestSoFarTable.render();
    }

    /* Goes ahead and loads the images to
     * draw our game level. Then sets init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* Assigns the canvas' context object to the global variable (the window
     * object when run in a browser) so that it can be used more easily
     * from the app.js files.
     */
    global.ctx = ctx;
})(this);
