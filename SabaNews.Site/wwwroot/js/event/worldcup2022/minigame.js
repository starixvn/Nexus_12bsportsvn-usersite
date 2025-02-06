var minigame = (function ($) {
    var isLogin = typeof checkLogin != 'undefined' ? checkLogin.toLowerCase() === 'true' : false;
    var tab = window.location.hash;
    const timeStartStage = [
        "11/16/2022, 8:00:00 AM",
        "11/22/2022, 8:00:00 AM",
        "11/26/2022, 8:00:00 AM",
        "11/30/2022, 8:00:00 AM"
    ];
    const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

    function HandleUI() {
        $('#btn-register').on('click', function () {
            $('#register').modal('show');
        });

        $('#btn-guide').on('click', function () {
            $('#guide').modal('show');
        });

        $('.btn-standing').on('click', function () {
            $('html, body').animate({
                scrollTop: 1400
            }, 500);
        });

        $('.btn-nav-guide').click(function () {
            $('.header-nav-event li a').removeClass('active');
            $(this).addClass('active');
            $('#guide').modal('show');
        });
       
        $('.btn-home').click(function () {
            $('.header-nav-event li a').removeClass('active');
            $(this).addClass('active');
            $('html, body').animate({ scrollTop: 0 }, 1000);
        });

        $('.btn-nav-prediction').click(function () {
            if (!isLogin) {
                $('#joining').modal('show');
            }
            else {
                window.location = window.location.origin + "/world-cup-2022/su-kien-du-doan-sung-nhan-qua-khung/chi-tiet";
            }
        });

        $('.stage-votes-round').click(function () {
            if (!isLogin) {
                $('#joining').modal('show');
            }
            else {
                var stage = $(this).data("stage");
                window.location = window.location.origin + "/world-cup-2022/su-kien-du-doan-sung-nhan-qua-khung/giai-doan/" + stage;
            }
        });

        $('.icon-minigame_list_user').click(function () {
            $('html, body').animate({
                scrollTop: $("#minigame-winners").offset().top
            }, 500);
        });

        $('.icon-minigame_standing').click(function () {
            $('html, body').animate({
                scrollTop: 1400
            }, 500);
        });

        $('.click-number-event').click(function () {
            if (!isLogin) {
                $('#joining').modal('show');
            }
            else {
                $('html, body').animate({
                    scrollTop: 600
                }, 500);
            }
        });

        $('.btn-auth-login').click(function () {
            if (!isLogin) {
                $('#guide').modal('hide');
                $('#joining').modal('show');
            }
            else {
                $('#guide').modal('hide');
                $('html, body').animate({
                    scrollTop: 600
                }, 500);
            }
        });

        if (tab == '#stage-minigame') {
            $('.header-nav-event li a').removeClass('active');
            $('.click-list-rigister').addClass('active');
        }

        if (tab == '#minigame-standing') {
            $('.header-nav-event li a').removeClass('active');
            $('.click-list-standing').addClass('active');
        }

        if (tab == '#minigame-winners') {
            $('.header-nav-event li a').removeClass('active');
            $('.click-list-result').addClass('active');
        }

        $('.click-list-rigister').click(function () {
            $('.header-nav-event li a').removeClass('active');
            $(this).addClass('active');
            $('html, body').animate({
                scrollTop: 600
            }, 500);
        })

        $('.click-list-standing').click(function () {
            $('.header-nav-event li a').removeClass('active');
            $(this).addClass('active');
            $('html, body').animate({
                scrollTop: 1400
            }, 500);
        })

        $('.click-list-result').click(function () {
            $('.header-nav-event li a').removeClass('active');
            $(this).addClass('active');
            $('html, body').animate({
                scrollTop: $("#minigame-winners").offset().top
            }, 500);
        })

        $('.header-control ul li a').click(function () {
            $('.header-control ul li a').removeClass("active");
            $(this).addClass("active");
        });

        $('.btn-accept').click(function () {
            $('#register').modal('hide');
        })

        $(window).click(function (e) {
            var elmAuth = $(e.target).parent().parent();
            if (!elmAuth.is('.after-login') && !elmAuth.is('.auth-section')) {
                if ($('.profile-login').hasClass('active-login-review')) {
                    $('.profile-login').removeClass('active-login-review');
                }
            }
        });
    }

    function countDownTime() {
        for (let i = 0; i < 4; i++) {
            var statusStage = getStatusStage(i);
            if (statusStage == "Sắp diễn ra" || statusStage == "Sắp kết thúc") {
                let timeCountDown = $("#stage" + (i + 1).toString()).data('timecountdown');
                let countDown = new Date(timeCountDown).getTime(),
                    x = setInterval(function () {
                        let now = new Date().getTime(),
                            distance = countDown - now;

                        let hourShow = Math.floor((distance % (day)) / (hour)),
                            minuteShow = Math.floor((distance % (hour)) / (minute)),
                            secondShow = Math.floor((distance % (minute)) / second)

                        document.getElementById('hours' + (i + 1).toString()).innerHTML = `<div class="clock-time">(${showTimeCountDown(hourShow)}:</div>`,
                            document.getElementById('minutes' + (i + 1).toString()).innerHTML = `<div class="clock-time">${showTimeCountDown(minuteShow)}:`,
                            document.getElementById('seconds' + (i + 1).toString()).innerHTML = `<div class="clock-time">${showTimeCountDown(secondShow)})`;
                        if (minuteShow == 0 && secondShow == 0) {
                            location.reload();
                        }
                    }, second);
            }
        }
    }

    function countDownEvent() {
        const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;
        let countDown = new Date('November 16, 2022 08:00:00').getTime(),
            x = setInterval(function () {
                let now = new Date().getTime(),
                    distance = countDown - now;
                if (distance < 0) {
                    return false;
                }
                let dayShow = Math.floor(distance / (day)),
                    hourShow = Math.floor((distance % (day)) / (hour)),
                    minuteShow = Math.floor((distance % (hour)) / (minute)),
                    secondShow = Math.floor((distance % (minute)) / second)

                document.getElementById('days').innerHTML = `<div class="clock-time">${showTimeCountDown(dayShow)}</div> <div class="clock-text">ngày</div>`;
                document.getElementById('hours').innerHTML = `<div class="clock-time">${showTimeCountDown(hourShow)}</div> <div class="clock-text">giờ</div>`,
                    document.getElementById('minutes').innerHTML = `<div class="clock-time">${showTimeCountDown(minuteShow)}</div> <div class="clock-text">phút</div>`,
                    document.getElementById('seconds').innerHTML = `<div class="clock-time">${showTimeCountDown(secondShow)}</div> <div class="clock-text">giây</div>`;
            }, second);
    }

    function getStatusStage(i) {
        var timeSpanNow = new Date();
        var checkNow = (new Date(timeStartStage[i]) - timeSpanNow) / 1000;
        var statusStage;
        if (checkNow > 0) {
            if (checkNow > 3600) {
                statusStage = "Chưa diễn ra";
            }
            else { statusStage = "Sắp diễn ra"; }
        }
        else {
            var timeEnd = $("#boxStage" + (i + 1).toString()).data('timeendstage');
            var timeSpanEnd = (new Date(timeEnd).getTime() / 1000);
            var timeSpanNowSecond = timeSpanNow.getTime() / 1000;
            var checkNowEnd = timeSpanEnd - timeSpanNowSecond;
            if (checkNowEnd > 5400) {
                statusStage = "Đang diễn ra";
            }
            else if (checkNowEnd <= 5400 && checkNowEnd > 1800) {
                statusStage = "Sắp kết thúc";
            }
            else { statusStage = "Đã kết thúc"; }
        }

        return statusStage;
    }

    function addClassBody() {
        var statusStageOne = getStatusStage(0);
        if (statusStageOne == "Chưa diễn ra" || statusStageOne == "Sắp diễn ra") {
            document.body.classList.add('before-start-minigame')
        }
    }

    function showTimeCountDown(time) {
        if (time.toString().length <= 1) {
            return "0" + time;
        }
        return time;
    }

    function init() {
        HandleUI();
        countDownTime();
        countDownEvent();
        addClassBody();
    }

    return {
        init
    }

})(jQuery);


$(document).ready(function () {
    minigame.init();
});