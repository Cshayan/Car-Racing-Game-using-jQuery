$(document).ready(function () {
  var anim_id;

  // Getting the DOM elements from HTML
  var container = $("#container");
  var car = $("#car");
  var car_1 = $("#car-1");
  var car_2 = $("#car-2");
  var car_3 = $("#car-3");
  var line_1 = $("#line-1");
  var line_2 = $("#line-2");
  var line_3 = $("#line-3");
  var restart_container = $("#restart-container");
  var restart = $("#restart");
  var start_container = $("#start-game-container");
  var start = $("#start");
  var score = $("#score");

  var message = $("#message");
  var messagetime = $("#message-time");

  // Getting some values
  var container_left = parseInt(container.css("left"));
  var container_width = parseInt(container.width());
  var container_height = parseInt(container.height());
  var car_width = parseInt(car.width());
  var car_height = parseInt(car.height());

  // Set the game over to false initially
  var game_over = false;

  var speed = 3;
  var line_speed = 5;

  // Different navigations
  var move_up = false;
  var move_down = false;
  var move_left = false;
  var move_right = false;

  // Audio controller
  var background_music = new Audio("Music/race_music.mp3");
  var game_over_music = new Audio("Music/gameOver.wav");
  var countdown_music = new Audio("Music/countdown.mp3");
  var match = new Audio('Music/match.wav');
  background_music.loop = true;

  /************************Game Code**********************/
  function start_game() {
    start_container.slideUp();
    //   Playing the music
    background_music.play();

    // Setting up the keyboard controls
    $(document).on("keydown", function (e) {
      if (game_over === false) {
        var key = e.keyCode;
        // 37 is keycode when left arrow is pressed
        if (key == 37 && move_left === false) {
          move_left = requestAnimationFrame(left);
        } else if (key == 39 && move_right === false) {
          // key code for right arrow key is 39
          move_right = requestAnimationFrame(right);
        } else if (key == 38 && move_up === false) {
          //   key code for up arrow key is 38
          move_up = requestAnimationFrame(up);
        } else if (key == 40 && move_down === false) {
          //   Key code for down is 40
          move_dowm = requestAnimationFrame(down);
        }
      }
    });

    $(document).on("keyup", function (e) {
      if (game_over === false) {
        var key = e.keyCode;
        // For left key, keycode is 37
        if (key == 37) {
          cancelAnimationFrame(move_left);
          move_left = false;
        } else if (key == 39) {
          cancelAnimationFrame(move_right);
          move_right = false;
        } else if (key == 38) {
          cancelAnimationFrame(move_up);
          move_up = false;
        } else if (key == 40) {
          cancelAnimationFrame(move_down);
          move_down = false;
        }
      }
    });

    function left() {
      if (game_over === false && parseInt(car.css("left")) > 15) {
        // Decrease the left value for the car to move it to left
        car.css("left", parseInt(car.css("left")) - 5);
        move_left = requestAnimationFrame(left);
      }
    }

    function right() {
      if (
        game_over === false &&
        parseInt(car.css("left")) < container_width - car_width - 15
      ) {
        // Increase the car left to move it to right
        car.css("left", parseInt(car.css("left")) + 5);
        move_right = requestAnimationFrame(right);
      }
    }

    function up() {
      if (game_over === false && parseInt(car.css("top")) > 15) {
        //   Decrease the car top value for moving it up
        car.css("top", parseInt(car.css("top")) - 5);
        move_up = requestAnimationFrame(up);
      }
    }

    function down() {
      if (
        game_over === false &&
        parseInt(car.css("top")) < container_height - car_height - 15
      ) {
        // Increase the top value of the car to move it down
        car.css("top", parseInt(car.css("top")) + 5);
        move_down = requestAnimationFrame(down);
      }
    }

    /***  Keyboard control setup ends here  ***/

    // Increase the score
    var timer = setInterval(function () {
      score.html(parseInt(score.text()) + 1);
    }, 2000);

    // After every 20 sec play the victory music
    var match_play = setInterval(function () {
      match.play();
    }, 20000);

   

    //   Repeat every processes
    anim_id = requestAnimationFrame(repeat);

    function repeat() {
      if (game_over === false) {
        //   Check for collision
        if (
          collision(car, car_1) ||
          collision(car, car_2) ||
          collision(car, car_3)
        ) {
          stop_game();
        }

        //  Bring the 3 cars down
        car_down(car_1);
        car_down(car_2);
        car_down(car_3);

        //  Bring the 3 lines on the road down
        line_down(line_1);
        line_down(line_2);
        line_down(line_3);

        anim_id = requestAnimationFrame(repeat);
      }
    }

    function car_down(car) {
      var current_top = parseInt(car.css("top"));
      if (current_top > container_height) {
        current_top = -100;
        // to move the car randomly when they reappear
        var car_left = parseInt(Math.random() * (container_width - car_width));
        car.css("left", car_left);
      }
      car.css("top", current_top + speed);
    }

    function line_down(line) {
      var line_current_top = parseInt(line.css("top"));
      if (line_current_top > container_height) {
        line_current_top = -300;
      }
      line.css("top", line_current_top + line_speed);
    }

    //    Function to stop the game
    function stop_game() {
      // stop the music and play the game over sound
      background_music.pause();
      background_music.currentTime = 0;
      game_over_music.play();

      game_over = true;
      clearInterval(timer);
      clearInterval(match_play);

      // cancel the animations
      cancelAnimationFrame(anim_id);
      cancelAnimationFrame(move_up);
      cancelAnimationFrame(move_down);
      cancelAnimationFrame(move_left);
      cancelAnimationFrame(move_right);
      restart_container.slideDown();
      restart.focus();
    }

    // Function to detect collisions of two cars
    function collision($div1, $div2) {
      // calculate the breadth and height of our car
      var x1 = $div1.offset().left;
      var y1 = $div1.offset().top;
      var h1 = $div1.outerHeight(true);
      var w1 = $div1.outerWidth(true);
      var b1 = y1 + h1;
      var r1 = x1 + w1;
      // calculate the breadth and height of opponent colliding car
      var x2 = $div2.offset().left;
      var y2 = $div2.offset().top;
      var h2 = $div2.outerHeight(true);
      var w2 = $div2.outerWidth(true);
      var b2 = y2 + h2;
      var r2 = x2 + w2;
      // check if they collide
      if (b1 < y2 || b2 < y1 || r1 < x2 || r2 < x1) {
        return false;
      }
      return true;
    }
  }

   // Increase the speed of the car after every 1 min
   setInterval(function () {
    speed = speed + 2;
  }, 60000);

  start.focus();
  start.on("click", function () {
    //   Display the countdown message and play the countdown music
    message.slideDown();
    countdown_music.play();
    //   Message timer
    var messageCount = setInterval(function () {
      // message_timer++;
      messagetime.html(parseInt(messagetime.text()) + 1);
      if (parseInt(messagetime.text()) == 3) {
        clearInterval(messageCount);
        message.slideUp();
        countdown_music.pause();
        countdown_music.currentTime = 0;
        start_game();
      }
    }, 1000);
  });

  restart.on("click", function () {
    location.reload();
  });
  /****************Game Code Ends here *******************************/
});