var standing = (function ($) {
    var isKnockout = window.isKnockout.toLowerCase();
    if (window.location.hash === '#knock-out') {
        isKnockout = 'true';
    } else if (window.location.hash === '#vong-bang') {
        isKnockout = 'false';
    }

    function handleBtn() {
        if (isKnockout === 'true') {
            $('#btn-detail-standing').removeClass("active");
            $("#btn-knock-out").addClass("active");
            $('#detail-standing').hide();
            $('#knock-out').show();
        } else {
            $('#detail-standing').show();
            $('#knock-out').hide();
        }
        
        $('#btn-detail-standing').on('click', function () {
            $('#btn-detail-standing').addClass("active");
            $("#btn-knock-out").removeClass("active");
            $('#detail-standing').show();
            $('#knock-out').hide();
        });
        $('#btn-knock-out').on('click', function () {
            $('#btn-detail-standing').removeClass("active");
            $("#btn-knock-out").addClass("active");
            $('#detail-standing').hide();
            $('#knock-out').show();
        });
    }

    function init() {
        handleBtn();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    standing.init();
});
