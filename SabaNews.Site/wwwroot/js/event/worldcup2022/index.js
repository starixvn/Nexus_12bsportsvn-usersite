var worldcup_home = (function ($) {
    var leagueId = 14638;
    var seasonId = 10810;
    function getStanding() {
        var param = JSON.stringify({ leagueId, seasonId });
        
        $.ajax({
            type: 'POST',
            url: '/worldcup2022/GetHomepageStandings',
            data: param,
            contentType: "application/json",
            success: function (res) {
                $('#home-standing').html(res);
            }
        });
    }

    function HandleSlide() {
        if ($(window).innerWidth() > 1025) {
            var swipers = new Swiper('.swipper-guess', {
                loop: false,
                spaceBetween: 20,
                watchOverflow: true,
                navigation: {
                    nextEl: '.guess-next',
                    prevEl: '.guess-prev',
                    disabledClass: 'disabled-swiper-navigation'
                }
            });
            var Swipers = new Swiper('.swipper-video', {
                loop: false,
                slidesPerView: 3,
                spaceBetween: 20,
                watchOverflow: true,
                navigation: {
                    nextEl: '.video-next',
                    prevEl: '.video-prev',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 1
                    },
                    768: {
                        slidesPerView: 1
                    },
                    1024: {
                        slidesPerView: 1
                    },
                },
            });
        }
    }

    function HandlePlayVideo() {
        $('.icon-play-video').on('click', function () {
            var content = $(this).find('input[name=content]').val();
            var title = $(this).find('input[name=title]').val();
            $('#PlayIframeVideo').modal('show');
            $('#PlayIframeVideo .if-content').html(content);
            $('#PlayIframeVideo .if-title').html(title);
        });

        $('#PlayIframeVideo').on('hidden.bs.modal', function () {
            $('#PlayIframeVideo .if-content').html('');
            $('#PlayIframeVideo .if-title').html('');
        });
    }

    function init() {
        getStanding();
        HandleSlide();
        HandlePlayVideo();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    worldcup_home.init();
});