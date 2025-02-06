var euroHome = (function ($) {
    function handleRankingTable() {
        $('.tab-item').on('click', function () {
            var tab = $(this).data('tab');
            var table = "#" + tab;
            if ($(table).hasClass('hide')) {
                $('.tab-detail').addClass('hide')
                $(table).removeClass('hide');
                $('.tab-item .tab-link').removeClass('active');
                $(this).find('.tab-link').addClass('active');
            }
        });
    }
    function init() {
        handleRankingTable();
        scrollHeader();
    }

    return {
        init
    }
})(jQuery);


$(document).ready(function () {
    euroHome.init();
});