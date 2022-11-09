var color1 = "#0095DD";

        window.onload = function () {
            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");

            var menu = document.getElementById("menuCanvas");
            var menuctx = menu.getContext("2d");  


            var ballRadius = 10;
            var x = canvas.width / 2;
            var y = canvas.height - 30;
            var dx = 2;
            var dy = -2;
            var paddleHeight = 10;
            var paddleWidth = 75;
            var paddleX = (canvas.width - paddleWidth) / 2;
            var rightPressed = false;
            var leftPressed = false;
            var brickRowCount = 5;
            var brickColumnCount = 3;
            var brickWidth = 75;
            var brickHeight = 20;
            var brickPadding = 10;
            var brickOffsetTop = 30;
            var brickOffsetLeft = 30;
            var score = 0;
            var lives = 3;

            var bricks = [];
            
            for (var c = 0; c < brickColumnCount; c++) {
                bricks[c] = [];
                for (var r = 0; r < brickRowCount; r++) {
                    bricks[c][r] = { x: 0, y: 0, status: 1 };
                }
            }

            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);
            document.addEventListener("mousemove", mouseMoveHandler, false);
            
            drawMenu();
            setShadow();
            function keyDownHandler(e) {
                if (e.keyCode == 39) {
                    rightPressed = true;
                }
                else if (e.keyCode == 37) {
                    leftPressed = true;
                }
            }

            function keyUpHandler(e) {
                if (e.keyCode == 39) {
                    rightPressed = false;
                }
                else if (e.keyCode == 37) {
                    leftPressed = false;
                }
            }

            function mouseMoveHandler(e) {
                var relativeX = e.clientX - canvas.offsetLeft;
                if (relativeX > 0 && relativeX < canvas.width) {
                    paddleX = relativeX - paddleWidth / 2;
                }
            }

            function collisionDetection() {
                for (var c = 0; c < brickColumnCount; c++) {
                    for (var r = 0; r < brickRowCount; r++) {
                        var b = bricks[c][r];
                        if (b.status == 1) {
                            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                                dy = -dy;
                                b.status = 0;
                                score++;
                                checkWinState()
                            }
                        }
                    }
                }
            }

            function drawBall() {
                ctx.beginPath();
                ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
                ctx.fillStyle = color1;
                ctx.fill();
                ctx.closePath();
            }

            function drawPaddle() {
                ctx.beginPath();
                ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
                ctx.fillStyle = color1;
                ctx.fill();
                ctx.closePath();
            }

            function drawBricks() {
                for (var c = 0; c < brickColumnCount; c++) {
                    for (var r = 0; r < brickRowCount; r++) {
                        if (bricks[c][r].status == 1) {
                            var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                            var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                            bricks[c][r].x = brickX;
                            bricks[c][r].y = brickY;
                            ctx.beginPath();
                            ctx.rect(brickX, brickY, brickWidth, brickHeight);
                            ctx.fillStyle = "white";
                            ctx.fill();
                            ctx.closePath();
                        }
                    }
                }
            }
            function drawScore() {
                ctx.font = "16px Arial";
                ctx.fillStyle = color1;
                ctx.fillText("Score: " + score, 60, 20);
            }

            function drawLives() {
                ctx.font = "16px Arial";
                ctx.fillStyle = color1;
                ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
            }

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawBricks();
                drawBall();
                drawPaddle();
                drawScore();
                drawHighScore();
                drawLives();
                collisionDetection();

                if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                    dx = -dx;
                }
                if (y + dy < ballRadius) {
                    dy = -dy;
                }
                else if (y + dy > canvas.height - ballRadius) {
                    if (x > paddleX && x < paddleX + paddleWidth) {
                        dy = -dy;
                    }
                    else {
                        lives--;
                        if (lives <= 0) {
                            checkWinState()
                        }
                        else {
                            x = canvas.width / 2;
                            y = canvas.height - 30;
                            dx = 3;
                            dy = -3;
                            paddleX = (canvas.width - paddleWidth) / 2;
                        }
                    }
                }

                if (rightPressed && paddleX < canvas.width - paddleWidth) {
                    paddleX += 7;
                }
                else if (leftPressed && paddleX > 0) {
                    paddleX -= 7;
                }

                //TODO: adjust speed
                x += dx;
                y += dy;

                //TODO: pause game check
                

                requestAnimationFrame(draw);
            }

            /*
                Additions to starter code
            */

            //Additional variables used to help make dimensions/locations easier to reuse            
            //controls game speed            
            //pause game variable 
            var paused = false;           
            //high score tracking variables
            var hs = 0;
            //other variables?  
                    

            //event listeners added
            //game speed changes handler     
            var speed = document.getElementById("speedSlider")       
            //pause game event handler
            const pause = document.getElementById("pauseButton");
            pause.addEventListener("click", togglePauseGame);            
            //start a new game event handler
            const newGame = document.getElementById("newGame");
            newGame.addEventListener("click", startNewGame);        
            //continue playing
            const cont = document.getElementById("continue");
            cont.addEventListener("click", continuePlaying);
            //reload click event listener            
            const reload = document.getElementById("reload");
            reload.addEventListener("click", resetBoard);

            //Drawing a high score
            function drawHighScore() {
                ctx.font = "16px Arial";
                ctx.fillStyle = color1;
                ctx.fillText("High Score: " + hs, canvas.width/2-30, 20);
            }

            //draw the menu screen, including labels and button
            function drawMenu() {
                //draw the rectangle menu backdrop
                
                //draw the menu header
                menuctx.font = "30px Arial";
                menuctx.fillText("BREAKOUT!", 135, 50);
                //start game button area
                menuctx.fillStyle = "orange";
                menuctx.fillRect(135, 100, 200, 75);
                menuctx.font = "30px Arial";
                menuctx.fillStyle = "blue";
                menuctx.fillText("Start", 200, 150);
                //event listener for clicking start
                //need to add it here because the menu should be able to come back after 
                //we remove the it later 
                menu.addEventListener("click", startGameClick);

            }

            //function used to set shadow properties
            function setShadow() {
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;
                ctx.shadowColor = "black";
                //ctx.fillRect(0,0,canvas.width, canvas.height)
            };

            //function used to reset shadow properties to 'normal'
            function resetShadow() {
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;
                ctx.shadowColor = "black";
            };

            //function to clear the menu when we want to start the game
            function clearMenu() {
                //remove event listener for menu, 
                //we don't want to trigger the start game click event during a game   
                menu.remove();
                menu = null;            
            }

            //function to start the game
            //this should check to see if the player clicked the button
            //i.e., did the user click in the bounds of where the button is drawn
            //if so, we want to trigger the draw(); function to start our game
            function startGameClick(event) {
                var canvas = document.getElementById("menuCanvas");
                var xVal = event.pageX - canvas.offsetLeft,
                    yVal = event.pageY - canvas.offsetTop;

                    if (yVal > 100 && xVal > 135 && yVal < 175 && xVal < 335) 
                    {
                        clearMenu();
                        draw();
                    }
                
            };

            //function to handle game speed adjustments when we move our slider
            function adjustGameSpeed() {
                //update the slider display                
                //update the game speed multiplier                
            };

            //function to toggle the play/paused game state
            function togglePauseGame() {
                //toggle state                
                //if we are not paused, we want to continue animating (hint: zyBook 8.9)
                if (paused == false)
                {
                  canvas.cancelAnimationFrame("myCanvas");
                  paused = true;
                }
                else
                {
                canvas.requestAnimationFrame("myCanvas");
                paused = false;
                }
            };

            //function to check win state
            //if we win, we want to accumulate high score and draw a message to the canvas
            //if we lose, we want to draw a losing message to the canvas
            function checkWinState() {
                if (score == brickRowCount * brickColumnCount) {
                    //TODO: draw message on the canvas
                    ctx.font = "30px Arial";
                    ctx.fillText("YOU WIN, CONGRATS!", 75, 150);
                    //alert("YOU WIN, CONGRATS!");
                    //TODO: pause game instead of reloading
                    ctx.togglePauseGame();
                    //document.location.reload();
                }
                if (lives <= 0) 
                {
                    ctx.font = "30px Arial";
                    ctx.fillText("GAME OVER", 150, 150);
                    //alert("YOU WIN, CONGRATS!");
                    //TODO: pause game instead of reloading
                    ctx.togglePauseGame();
                }
            };

            //function to clear the board state and start a new game (no high score accumulation)
            function startNewGame(resetScore) {
                score = 0;
                lives = 3;
                drawBricks();
                draw();
            };

            //function to reset the board and continue playing (accumulate high score)
            //should make sure we didn't lose before accumulating high score
            function continuePlaying() {
                if (lives > 0)
                {
                  hs += score;
                  drawBricks();
                }
            };

            //function to reset starting game info
            function resetBoard(resetLives) {
                //reset paddle position
                paddleX = (canvas.width - paddleWidth) / 2;
                //reset bricks 
                drawBricks();              
                //reset score and lives  
                score = 0;
                lives = 3;             
            };

            //draw the menu.
            //we don't want to immediately draw... only when we click start game            
            //draw();

        };//end window.onload function