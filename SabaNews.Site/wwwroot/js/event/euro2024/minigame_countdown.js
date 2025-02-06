var euro2024_minigame_countdown = (function ($) {
    var isLogin = typeof checkLogin != 'undefined' ? checkLogin.toLowerCase() === 'true' : false;
    var tab = window.location.hash;
    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;


    function countDownEvent() {
        const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;
        let countDown = new Date(window.timeStartStage[0]).getTime();
        let now = new Date().getTime(),
            distance = countDown - now;
        if(distance > 0) {
            setInterval(function () {
                let now = new Date().getTime(),
                    distance = countDown - now;
                let dayShow = Math.floor(distance / (day)),
                    hourShow = Math.floor((distance % (day)) / (hour)),
                    minuteShow = Math.floor((distance % (hour)) / (minute)),
                    secondShow = Math.floor((distance % (minute)) / second)
                if(dayShow == 0 && hourShow == 0 && minuteShow == 0 && secondShow == 0 ) {
                    location.reload();
                }
                if((dayShow < 0 && secondShow < 0 && secondShow > -5)) {
                    location.reload();
                }
                if(secondShow < -5) {
                    return false;
                }
                if(secondShow >= 0) {
                    $('#days').html(`<div class="clock-time">${showTimeCountDown(dayShow)}</div> <div class="clock-text">ngày</div>`);
                    $('#hours').html(`<div class="clock-time">${showTimeCountDown(hourShow)}</div> <div class="clock-text">giờ</div>`);
                    $('#minutes').html(`<div class="clock-time">${showTimeCountDown(minuteShow)}</div> <div class="clock-text">phút</div>`);
                    $('#seconds').html(`<div class="clock-time">${showTimeCountDown(secondShow)}</div> <div class="clock-text">giây</div>`);
                } else {
                    $('#days').html(`<div class="clock-time">00</div> <div class="clock-text">ngày</div>`);
                    $('#hours').html(`<div class="clock-time">00</div> <div class="clock-text">giờ</div>`);
                    $('#minutes').html(`<div class="clock-time">00</div> <div class="clock-text">phút</div>`);
                    $('#seconds').html(`<div class="clock-time">00</div> <div class="clock-text">giây</div>`);
                }
            }, second);
        } else {
            $('#days').html(`<div class="clock-time">00</div> <div class="clock-text">ngày</div>`);
            $('#hours').html(`<div class="clock-time">00</div> <div class="clock-text">giờ</div>`);
            $('#minutes').html(`<div class="clock-time">00</div> <div class="clock-text">phút</div>`);
            $('#seconds').html(`<div class="clock-time">00</div> <div class="clock-text">giây</div>`);
        }
    }


    function showTimeCountDown(time) {
        if (time.toString().length <= 1) {
            return "0" + time;
        }
        return time;
    }

    function init() {
        countDownEvent();
    }

    return {
        init
    }

})(jQuery);


$(document).ready(function () {
    euro2024_minigame_countdown.init();
});