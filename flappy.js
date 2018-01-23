$(function start() {
	$window = $('.window'),
		$bird = $('.bird'),
		tempsChute = 1000, // in msecs time for flappy to fall from the top of the screen if no action
		jeuActif = false, // start in pause mode
		obstacleId = 0, // to have unique identifier per pipe
		score = 0, // start with 0

		espacePipe = 180, // average
		timeCall = 1800; // time between the call of the functions below


	// timer 1800  mseconds main loop
	var time = setInterval(function () {
		if (jeuActif) {
			genererObstacle(); // create new pipe
			bougerObstacle(); // move pipes to the left
			suppObstacle(); // remove 'old' pipe
			compteScore(); // update score

		}
	}, timeCall);


	// timer 100 mseconds collision detection timer
	var checkCollision = setInterval(function () {
		if (jeuActif) {
			toucheSol(); // check if flappy touched down
			verifierCollisions(); // check if collision between flappy and any pipe
			//compteScore(); // update score

		}
	}, 100);


	// keyboard management
	$(window).keydown(function keyboardManagement(key) {
		// manage only the space key
		if (key.keyCode === 32) {
			if (jeuActif === false) {
				jeuActif = true; // first start
			}
			// no need to test here
			if (jeuActif === true) {

				deplacementBird();
			}
			key.preventDefault();

		} else { // debug mode for other key
			var positionBird = recupererPosition($bird);
			console.log("bird position is ", positionBird)
			console.log(parseInt($bird.css('top')));


		}
	});

	// touchscreen management
	$window.on('click', function () {
		if (jeuActif === false) {
			jeuActif = true; // first start
		}
		// no need to test here
		if (jeuActif === true) {

			deplacementBird();
		}
	});

	// handle the bird movements
	function deplacementBird() {
		if (parseInt($bird.css('top')) > 40) { // can not fly too high.....

			// rotate up and up 60 px
			$bird.css('transform', 'rotate(-20deg)');
			$bird.stop().animate({
				bottom: '+=60px'
			}, 200, function () {
				// toucheSol();
				// rotate flat after 200 ms
				$bird.css('transform', 'rotate(0deg)');
				$bird.stop().animate({
					bottom: '-=60px'
				}, 200, 'linear', function () {
					// rotate down and start falling down
					// toucheSol();
					gravity();
				});
			});
		}
	}

	// simulate gravity
	// flappy is rotated downward and goes down at a constant speed
	// speed depends on tempsChute and currentPosition
	function gravity() {
		birdPercent = parseInt($bird.css('bottom')) / $window.height();
		tempsChuteTotal = tempsChute * birdPercent;
		$bird.animate({
			bottom: '0'
		}, tempsChuteTotal, 'linear');

		$bird.css('transform', 'rotate(90deg)');
	}

	// genere un obstacle sur 2 en haut puis en bas
	function genererObstacle() {

		obstacleId++;

		hauteurObstacle = Math.floor(Math.random() * (espacePipe + 1)) + espacePipe * 0.8;

		const obstacleType = (obstacleId % 2 == 0) ? "obstacleHaut" : "obstacleBas";
		obstacle = '<div class="pipe" id="' + obstacleId + '"><div style="height: ' + hauteurObstacle + 'px" class="' + obstacleType + '"></div></div>';

		$('.window').append(obstacle);
	}

	// move all remaining pipes 300 pixels to the left ?
	function bougerObstacle() {
		$('.pipe').each(function () {
			$(this).animate({
				right: '+=300px'
			}, 1800, 'linear');

		});
	}

	// remove the first pipe
	function suppObstacle() {
		$('.pipe').first().remove();
	}

	// add one to the score every time we pass a pipe
	function compteScore() {
		score++;
		$('.score').text("Score : " + score).css({
			"top": "30%",
			"font-size": "45px",
			"font-family": "FlappyBird",
		});

		console.log(score);
	}

	// check if flappy touches earth
	function toucheSol() {
		console.log("toucheSol? " + parseInt($('.bird').css('bottom')))

		if (parseInt($('.bird').css('bottom')) <= 0) {
			gameOver();
		}
	}

	// Collision Testing
	// item1 [ left, right, top, bottom]
	// item2 [ left, right, top, bottom]
	function collision(r2, r1) {
		console.log("r1=", r1, " r2=", r2)
		return !(r2[0] > r1[1] ||
			r2[1] < r1[0] ||
			r2[2] > r1[3] ||
			r2[3] < r1[2]
		);
	}

	// check if a collision happens
	function verifierCollisions() {
		var positionBird = recupererPosition($bird); // rectangle for flappy

		$('.pipe').each(function () {
			const positionPipe = recupererPosition($(this)); // rectangle for this pipe

			const bas = $(this).find('.obstacleBas') // need to adjust rectangle depending on obstace type
			if (bas.length) {
				console.log("pipe bas:" + bas + " " + positionPipe[2] + " " + positionPipe[3] + "==>", bas.position());
				positionPipe[2] = bas.position().top + 40;

			} else {
				const haut = $(this).find('.obstacleHaut')
				console.log("pipe haut:" + bas + " " + positionPipe[2] + " " + positionPipe[3] + "==>", haut.position());
				positionPipe[3] = haut.height() + 40;
			}

			console.log("positionPipe:", positionPipe);
			var bad = collision(positionBird, positionPipe);
			if (bad) {
				alert("collision detected\nflappy:" + Math.floor(positionBird[0]) + " " + Math.floor(positionBird[1]) + " " + Math.floor(positionBird[2]) + " " + Math.floor(positionBird[3]) +
					"\npipe:" + Math.floor(positionPipe[0]) + " " + Math.floor(positionPipe[1]) + " " + Math.floor(positionPipe[2]) + " " + Math.floor(positionPipe[3]));

				gameOver();
			}
		})
	};

	// cette fonction permet de récupérer les coordonnées d'un objet
	function recupererPosition(objet) {
		var pos = $(objet).offset();

		var width = $(objet).width();
		var height = $(objet).height();

		return [pos.left, pos.left + width, pos.top, pos.top + height];
	}

	function gameOver() {
		jeuActif = 'over';

		clearInterval(time);
		clearInterval(checkCollision);

		$(".animated").css('animation-play-state', 'paused');
		$(".animated").css('-webkit-animation-play-state', 'paused');

		alert("game over");


	}
});
