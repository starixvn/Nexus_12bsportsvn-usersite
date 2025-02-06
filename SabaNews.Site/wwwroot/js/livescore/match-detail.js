var checkScroll = function (e) {
    var heightSection = $(".sticky-header").innerHeight();
    var top_of_window = window.scrollY;
    if (top_of_window > heightSection) {
        $('.detail-fixed').addClass('active-scroll');
        $('.sticky-header').addClass('active-scroll');
    } else {
        $('.detail-fixed').removeClass('active-scroll');
        $('.sticky-header').removeClass('active-scroll');
    }
}
var setMainWidth = function () {
    var mainWidth = $('.livescore-soccer-main').width();
    $('.detail-fixed').css('max-width', mainWidth)
}
$(window).on("load scroll resize", function () {
    setMainWidth();
});

window.addEventListener('scroll', function () { checkScroll() })

