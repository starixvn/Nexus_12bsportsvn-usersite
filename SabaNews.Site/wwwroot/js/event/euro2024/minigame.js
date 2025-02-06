var euro2024_minigame = (function ($) {
    var isLogin = typeof checkLogin != 'undefined' ? checkLogin.toLowerCase() === 'true' : false;
    var tab = window.location.hash;
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
                scrollTop: $('#minigame-standing').offset().top - 77
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

        $('.btn-nav-prediction').click(function (event) {
            if (!isLogin) {
                $('#joining').modal('show');
            }
            else {
                var url = window.location.origin + "/euro-2024/minigame/du-doan-cua-toi";
                if (event.ctrlKey) {
                    window.open(url, '_blank');
                } else {
                    window.location = url;
                }
            }
        });

        $('.stage-votes-round .btn-stage').click(function (event) {
            if (!isLogin) {
                $('#joining').modal('show');
            }
            else {
                var stage = $(this).data("stage");
                var url = window.location.origin + "/euro-2024/minigame/giai-doan/" + stage;
                if (event.ctrlKey) {
                    window.open(url, '_blank');
                } else {
                    window.location = url;
                }
            }
        });

        $('.icon-minigame_list_user').click(function () {
            $('html, body').animate({
                scrollTop: $("#minigame-winners").offset().top - 77
            }, 500);
        });

        $('.icon-icon-minigame_standing_full').click(function () {
            $('html, body').animate({
                scrollTop: $('#minigame-standing').offset().top - 77
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
                scrollTop: $('#minigame-standing').offset().top - 77
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
        for (let i = 1; i <= 2; i++) {
            var stageElemement = $('#boxStage' + i);
            var statusStage = stageElemement.data('status');
            if (statusStage == "Sắp diễn ra" || statusStage == "Sắp kết thúc") {
                var timeCountDown = $("#stage" + i).data('timecountdown');
                var countDown = new Date(timeCountDown).getTime();
                setInterval(function () {
                        var now = new Date().getTime();
                        var distance = countDown - now;

                        var hourShow = Math.floor((distance % (day)) / (hour)),
                            minuteShow = Math.floor((distance % (hour)) / (minute)),
                            secondShow = Math.floor((distance % (minute)) / second)
                        if (minuteShow == 0 && secondShow == 0) {
                            location.reload();
                            return false;
                        }

                        if (distance < 0) {
                            return false;
                        }

                        $('#hours' + i).html(`<div class="clock-time">(${showTimeCountDown(hourShow)}:</div>`);
                        $('#minutes' + i).html(`<div class="clock-time">${showTimeCountDown(minuteShow)}:`);
                        $('#seconds' + i).html(`<div class="clock-time">${showTimeCountDown(secondShow)})`);
                    }, second);
            }
        }
    }

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
                if(distance < 0) {
                    location.reload();
                    return false;
                }
                $('#days').html(`<div class="clock-time">${showTimeCountDown(dayShow)}</div> <div class="clock-text">ngày</div>`);
                $('#hours').html(`<div class="clock-time">${showTimeCountDown(hourShow)}</div> <div class="clock-text">giờ</div>`);
                $('#minutes').html(`<div class="clock-time">${showTimeCountDown(minuteShow)}</div> <div class="clock-text">phút</div>`);
                $('#seconds').html(`<div class="clock-time">${showTimeCountDown(secondShow)}</div> <div class="clock-text">giây</div>`);
            }, second);
        }
    }


    function addClassBody() {
        var statusStageOne = $('#boxStage1');
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

    function scrollNavLeft () {
        var lastScrollTop = 0;
        $(window).scroll(function(event){
            var st = $(this).scrollTop();
            if (st > lastScrollTop){
                $('.header-nav-event').addClass('active');
            } else {
                $('.header-nav-event').removeClass('active');
            }
            lastScrollTop = st;
         });
    }

    function init() {
        HandleUI();
        countDownTime();
        addClassBody();
        scrollNavLeft();
    }

    return {
        init
    }

})(jQuery);


$(document).ready(function () {
    euro2024_minigame.init();
});