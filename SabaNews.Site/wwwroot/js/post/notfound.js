var notfound = (function ($) {
    function init() {
        $('.search-button').on('click', function (e) {
            e.preventDefault();
            var input = $(this).parent().find('.keyword');
            var form = $(this).parent();
            var keyword = input.val();
            if ($.trim(keyword) === '') {
                input.focus();
            } else {
                form.trigger("reset");
                form.attr('action', '/Search/' + keyword);
                form.submit();
            }
        });
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    notfound.init();
});
