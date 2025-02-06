var video = (function ($) {
    function HandleBtn() {
        $('.btn-play-orthers').on('click', function () {
            var url = $(this).data('url');
            window.location = url;
        });
        $('.play-orthers').on('click', function () {
            var url = $(this).data('url');
            window.location = url;
        });
    }

    function init() {
        HandleBtn();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    video.init();
});
