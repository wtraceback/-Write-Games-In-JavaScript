// 写程序有一个原则，最外层只能有函数，且只有一个入口
// 多用变量，方便调试
// 凡是有重复性的，都是用变量来接替

var log = console.log.bind(console);

var $ = function(selector) {
    return document.querySelector(selector);
}

var imageFromPath = function(path) {
    var img = new Image();
    img.src = path;

    return img;
}

var Paddle = function() {
    var image = imageFromPath('images/paddle.png');

    var o = {
        image: image,
        x: 100,
        y: 250,
        speed: 15,
    };

    o.moveLeft = function() {
        o.x -= o.speed;
    }

    o.moveRight = function() {
        o.x += o.speed;
    }

    o.collide = function(ball) {
        if (ball.y + ball.image.height >= o.y) {
            if (ball.x > o.x && ball.x < o.x + o.image.width) {
                log('相撞');
                return true;
            }
        }

        return false;
    }

    return o;
}

var Ball = function() {
    var image = imageFromPath('images/ball.png');

    var o = {
        image: image,
        x: 100,
        y: 200,
        speedX: 10,
        speedY: 10,
        fired: false,
    };

    o.fire = function() {
        o.fired = true;
    }

    o.move = function() {
        if (o.fired) {
            // log('move');
            if (o.x < 0 || o.x > 400) {
                o.speedX *= -1;
            }

            if (o.y < 0 || o.y > 300) {
                o.speedY *= -1;
            }

	    // move
            o.x += o.speedX;
            o.y += o.speedY;
        }
    }

    o.rebound = function() {
        o.speedY *= -1;
    }

    return o;
}

var GuaGame = function() {
    var g = {
        keydowns: {},
        actions: {},
    };
    var canvas = $("#id-canvas");
    var ctx = canvas.getContext('2d');

    g.canvas = canvas;
    g.ctx = ctx;

    // draw
    g.drawImage = function(mod) {
        g.ctx.drawImage(mod.image, mod.x, mod.y);
    }

    g.registerAction = function(key, callback) {
        g.actions[key] = callback;
    }

    // events
    window.addEventListener('keydown', function(event) {
        g.keydowns[event.key] = true;
    })

    window.addEventListener('keyup', function(event) {
        g.keydowns[event.key] = false;
    })

    // timer
    setInterval(function() {
	// events
        var actions = Object.keys(g.actions);
        for (var i = 0; i < actions.length; i++) {
            var key = actions[i];

            if (g.keydowns[key]) {
                // 如果按键被按下，调用注册的 action
                g.actions[key]();
            }
        }

        // update
        g.update();

        // clear
        g.ctx.clearRect(0, 0, g.canvas.width, g.canvas.height);

        // draw
        g.draw();
    }, 1000 / 30)

    return g;
}

var __main = function() {
    var game = GuaGame();

    var paddle = Paddle();

    var ball = Ball();

    game.registerAction('a', function() {
        paddle.moveLeft();
    });

    game.registerAction('d', function() {
        paddle.moveRight();
    });

    game.registerAction('f', function() {
        ball.fire();
    })

    game.update = function() {
        ball.move();

        // 判断相撞
        if (paddle.collide(ball)) {
            // 反弹
            ball.rebound();
        }
    }

    game.draw = function() {
	// draw
        game.drawImage(paddle);
        game.drawImage(ball);
    }
}

__main();
