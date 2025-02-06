var euro2024_home = (function ($) {
    function getStanding() {
        $.ajax({
            type: 'POST',
            url: '/euro2024/GetHomepageStandings',
            contentType: "application/json",
            success: function (res) {
                $('#home-standing').html(res);
            }
        });
    }
    function HandleSlider() {
        var swiper = new Swiper('.swiper-hot-news', {
            loop: true,
            speed: 900,
            spaceBetween: 10,
            grabCursor: true,
            autoplay: {
                delay: 4500,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.btn-next',
                prevEl: '.btn-prev',
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true
            }
        });

        
        var guesSwiper = new Swiper('.swiper-guess', {
            slidesPerView: 4.5,
            spaceBetween: 12,
            loop: false,
            speed: 300,
            grabCursor: true,
            navigation: {
                nextEl: '.btn-next',
                prevEl: '.btn-prev',
            },
        });

        if ($(window).innerWidth() >= 500) {
            var guesSwiper = new Swiper('.swiper-video', {
                slidesPerView: 3.5,
                spaceBetween: 12,
                loop: false,
                speed: 300,
                grabCursor: true,
                navigation: {
                    nextEl: '.btn-next',
                    prevEl: '.btn-prev',
                },
            });
        }
    }

    function HandleMenuTab () {
        $(document).on('click', '.nav-tab-js .nav-tab-item', function(){
            $('.nav-tab-js li').removeClass('active');
            $(this).parent().addClass('active');
            let currentTab = $(this).attr('data-id');
            $('.tab-content .wc-table-body').hide();
            $(currentTab).show();
            return false;
        });
    }
    
    function HandleIframe() {
        //Desktop & Mobile
        $('.match-schedule iframe').css('width', '100%');
        $('.play_video iframe').attr('allow', 'autoplay');
        $('.btn-play-video').on('click', function () {
            var slide = $(this).parent().parent().parent();
            if (!slide.hasClass("active")) {
                $('.play_video').html('');
                $('.block-items').show();
                $('.box-play-video').removeClass("active");
                $('.slide-video .card-item').first().addClass("box-video");
                var iframe = $(this).parent().parent().parent().parent().find("input[name=iframe_value]").val();
                var found = $.parseHTML(iframe);
                if (typeof found[2] === "undefined") { return false; }
                iframe = $(($.parseHTML(found[2].outerHTML)));
                iframe.attr('allow', 'autoplay');
                var src = iframe.attr('src');
                var autoplay = src.indexOf("autoplay");
                if (autoplay > -1) {
                    src = src.replace("autoplay=0", "autoplay=1");
                    src = src.replace("autoplay=1", "autoplay=1");
                }
                else {
                    var symbol = src.indexOf("?") > -1 ? "&" : "?";
                    src = src + symbol + "autoplay=1"
                }

                iframe.attr('src', src);
                $(this).parent().parent().parent().find('.play_video')[0].style.display = "block";
                $(this).parent().parent().parent().find('.play_video').html(iframe);
                $(this).parent().parent().hide();
                $(this).parent().parent().addClass('active');

                const $btn = $(this);
                var postId = $btn.attr("post-id");
                if (postId) {
                    $.ajax({
                        url: "/api/post/view-video",
                        method: "POST",
                        data: {
                            postId
                        },
                        success: function (response) {
                            if (response.IsSuccessful) {
                                $btn.removeAttr("post-id");
                            }
                        }
                    });
                }
            }
        });

        //Desktop
        $('.img-slider').on('click', function () {
            var id = $(this).data('id');
            $('.block-video .box-play-video').hide();
            var slide = $('#slide-' + id);
            slide.show();
            slide.find('.block-items-img').hide();
            $('.slide-video .block-items-img').removeClass("box-video");
            $(this).parent().addClass("box-video");
            if (!slide.hasClass("active")) {
                $('.play_video').html('');
                $('.box-play-video').removeClass("active");
                var iframe = slide.find("input[name=iframe_value]").val();
                var found = $.parseHTML(iframe);
                if (typeof found[2] === "undefined") { return false; }
                iframe = $(($.parseHTML(found[2].outerHTML)));
                iframe.attr('allow', 'autoplay');
                var src = iframe.attr('src');
                var autoplay = src.indexOf("autoplay");
                if (autoplay > -1) {
                    src = src.replace("autoplay=0", "autoplay=1");
                    src = src.replace("autoplay=1", "autoplay=1");
                }
                else {
                    var symbol = src.indexOf("?") > -1 ? "&" : "?";
                    src = src + symbol + "autoplay=1"
                }

                iframe.attr('src', src);
                slide.find('.play_video')[0].style.display = "block";
                slide.find('.play_video').html(iframe);
            }
            if (id) {
                $.ajax({
                    url: "/api/post/view-video",
                    method: "POST",
                    data: {
                        postId: id
                    },
                    success: function (response) {
                        if (response.IsSuccessful) {
                            $(this).removeAttr("post-id");
                        }
                    }
                });
            }
        });
    }
    function init() {
        HandleSlider();
        getStanding();
        HandleIframe();
        HandleMenuTab();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    euro2024_home.init();
});