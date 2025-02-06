var euro2024Standing = (function ($) {
    var isKnockout = window.isKnockout.toLowerCase();
    $('#knock-out-main').hide();
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
            $('#knock-out-main').show();
        } else {
            $('#detail-standing').show();
            $('#knock-out-main').hide();
        }
        
        $('#btn-detail-standing').on('click', function () {
            $('#btn-detail-standing').addClass("active");
            $("#btn-knock-out").removeClass("active");
            $('#detail-standing').show();
            $('#knock-out-main').hide();
        });
        $('#btn-knock-out').on('click', function () {
            $('#btn-detail-standing').removeClass("active");
            $("#btn-knock-out").addClass("active");
            $('#detail-standing').hide();
            $('#knock-out-main').show();
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
    euro2024Standing.init();
});
