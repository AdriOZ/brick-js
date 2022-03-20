document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const
        /** @type HTMLCanvasElement */
        canvas = document.getElementById('canvas'),

        /** @type CanvasRenderingContext2D */
        context = canvas.getContext('2d', { alpha: false }),

        peep = document.getElementById('peep'),
        plop = document.getElementById('plop'),

        brickRows = 12,
        brickCols = 10,
        brickColors = ['red', 'orange', 'yellow', 'lightgreen', 'lime', 'green'],
        bricksTotal = brickRows * brickCols,

        UPS = 40,
        FPS = 40;

    canvas.width = screen.width * 0.55;
    canvas.height = canvas.width * 3 / 4;

    let ball = {
        x: 0,
        y: 0,
        sx: 7,
        sy: -4,
        r: 10
    };
    ResetBall();

    let player = {
        x: 0,
        y: 0,
        w: 130,
        h: 15,
        l: 3
    };

    player.x = canvas.width / 2 - player.w / 2;
    player.y = canvas.height - player.h;

    let bricks = [];
    let broken = 0;

    for (let i = 0; i < brickRows; i++) {
        for (let j = 0; j < brickCols; j++) {
            bricks[bricks.length] = {
                x: j * canvas.width / brickCols + 1,
                y: i * (canvas.height / 2) / brickRows + 1,
                w: canvas.width / brickCols - 1,
                h: (canvas.height / 2) / brickRows - 1,
                c: brickColors[Math.floor(i / 2)],
                t: Math.floor(brickRows / 2) - Math.floor(i / 2)
            };
        }
    }

    let mouse = {
        x: 0,
        y: 0
    };

    canvas.addEventListener('mousemove', function (evt) {
        let bound = canvas.getBoundingClientRect();
        let root = document.documentElement;
        mouse.x = evt.clientX - bound.left - root.scrollLeft;
        mouse.y = evt.clientY - bound.top - root.scrollTop;
    });

    let uinterval;
    let dinterval;

    Draw();
    setTimeout(function () {
        uinterval = setInterval(Update, 1000 / UPS);
        dinterval = setInterval(Draw, 1000 / FPS);
    }, 1000);

    function Update() {
        MoveBall();
        MovePlayer();
    }

    function MoveBall() {
        ball.x += ball.sx;
        ball.y += ball.sy;

        if (ball.x > canvas.width - ball.r) {
            ball.sx *= -1;
            PlaySound(plop);
        }

        if (ball.x < ball.r) {
            ball.sx *= -1;
            PlaySound(plop);
        }

        if (ball.y > canvas.height - ball.r - player.h && ball.x >= player.x && ball.x <= player.x + player.w) {
            ball.sy *= -1;
            PlaySound(plop);
        } else if (ball.y > canvas.height - ball.r) {
            ResetBall();
            PlaySound(peep);
            player.l--;

            if (!player.l) {
                GameOver();
            }
        }
        if (ball.y < canvas.height / 2 + ball.r) {
            let row = Math.floor(ball.y / ((canvas.height / 2) / brickRows));
            let col = Math.floor(ball.x / (canvas.width / brickCols));
            let brick = bricks[row * brickCols + col];

            if (brick && brick.t) {
                brick.t--;
                ball.sy *= -1;
                PlaySound(plop);

                if (!brick.t) {
                    broken++;

                    if (broken == bricksTotal) {
                        Victory();
                    }
                }
            }

        } else if (ball.y < canvas.height / 2 + ball.r) {
            ball.sy *= -1;
            PlaySound(plop);
        }
    }

    function MovePlayer() {
        player.x = mouse.x - player.w / 2;
        if (player.x < 0) {
            player.x = 0;
        } else if (player.x + player.w > canvas.width) {
            player.x = canvas.width - player.w;
        }
    }

    function ResetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height * 3 / 4;
        ball.sx = Random(5, 8) * (ball.sx > 0 ? -1 : 1);
        ball.sy = -Random(5, 8);
    }

    function Victory() {
        clearInterval(uinterval);
        clearInterval(dinterval);
        FillText('Victory', canvas.width / 2, canvas.height * 3 / 4, 50);
    }
    function GameOver() {
        clearInterval(uinterval);
        clearInterval(dinterval);
        FillText('Game Over', canvas.width / 2, canvas.height * 3 / 4, 50);
    }

    function Draw() {
        FillRect('black', 0, 0, canvas.width, canvas.height);
        FillRect('white', player.x, player.y, player.w, player.h);
        FillText(player.l, player.x + player.w / 2, player.y - player.h - 10, 10);
        FillCirc('red', ball.x, ball.y, ball.r);
        DrawBricks();
    }

    function DrawBricks() {
        for (let i = 0; i < bricks.length; i++) {
            if (bricks[i].t) {
                FillRect(bricks[i].c, bricks[i].x, bricks[i].y, bricks[i].w, bricks[i].h);
            }
        }
    }

    function FillRect(color, x, y, w, h) {
        context.fillStyle = color;
        context.fillRect(x, y, w, h);
    }

    function FillCirc(color, x, y, r) {
        context.beginPath();
        context.fillStyle = color;
        context.arc(x, y, r, 0, Math.PI * 2, false);
        context.fill();
    }

    function FillText(text, x, y, size) {
        context.font = size + 'px Arial';
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText(text, x, y);
    }

    function Random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function PlaySound(audio) {
        try {
            audio.play();
        } catch (_) {
        }
    }
});
