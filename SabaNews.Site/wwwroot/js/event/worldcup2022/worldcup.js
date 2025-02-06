var worldcup = (function ($) {

    function getTopScorers() {
        if ($('#topScorersWC').length > 0) {
            var isHide = true;
            var more = $('#topScorersWC').data('more');
            $.ajax({
                url: '/WorldCup2022/GetTopScorers',
                type: 'POST',
                data: { more },
            }).done(function (data) {
                $('#topScorersWC').html(data);
                $('.top-scorer-hide-button').on('click', function () {
                    $('.top-scorer-table .wc-table-row.more').toggleClass('hide');
                    $('.top-scorer-table .wc-table-row.ori').toggleClass('show');
                    if (isHide) {
                        $(this).html('Thu gọn <i class="icon-chevron-up"></i>');
                    } else {
                        $(this).html('Xem thêm <i class="icon-chevron-down"></i>');
                    }
                    isHide = !isHide;
                });
            })
        }
    }


    function scrollEffectHeader() {
        $(window).scroll(function () {
            var topScroll = $(window).scrollTop();
            var header = $('.top-header');
            if (topScroll > 0) {
                header.addClass('scroll-height');
            } else {
                header.removeClass('scroll-height');
            }
        });
    }

    function handleActions() {
        $('.btn-nav-guide').on('click', function () {
            $('#guide').modal('show');
        });

        $(document).on('shown.bs.modal', '.modal', function (e) {
            $('html').addClass('overflow-page');
        })

        $(document).on('hidden.bs.modal', '.modal', function (e) {
            $('html').removeClass('overflow-page');
        });

        if ($('.header-nav-event').length > 0 && $(window).innerWidth() < 768) {
            var lastScrollTop = 0;
            $(window).on('scroll', function () {
                var st = $(this).scrollTop();
                if (st > lastScrollTop) {
                    $('.header-nav-event').addClass('active');
                } else {
                    $('.header-nav-event').removeClass('active');
                }
                lastScrollTop = st;
            });
        }
    }

    function HandleSlide() {
        if ($(window).innerWidth() <= 768 && $('.swipper-mobile-banner').length > 0) {
            console.log($('.swipper-mobile-banner').length, 123)
            var swipers = new Swiper('.swipper-mobile-banner', {
                loop: false,
                spaceBetween: 20,
                watchOverflow: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                autoplay: {
                    delay: 5000,
                }
            });
        }
    }
    

    function init() {
        getTopScorers();
        scrollEffectHeader();
        handleActions();
        HandleSlide();
    }
   

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    worldcup.init();
});

