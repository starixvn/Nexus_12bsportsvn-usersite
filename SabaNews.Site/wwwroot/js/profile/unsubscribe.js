var unsubscribe = (function ($) {

    function ConfirmUnsubscribe() {
        $('#ConfirmUnSubscribe').modal('show');
        $('#ConfirmUnSubscribe').on('hidden.bs.modal', function () {
            window.location = "/";
        });

        $('.unsubscribe').on('click', function () {
            $.ajax({
                type: "POST",
                url: "/Profile/Unsubscribe",
                data: { userId, token },
                success: function (res) {
                    $('.content').html(res);
                    $('#ConfirmUnSubscribe').unbind('hidden.bs.modal');
                    $('#ConfirmUnSubscribe').modal('hide');
                   
                }
            });
        });
    }

    function init() {
        ConfirmUnsubscribe();
    }

    return {
        init
    }

})(jQuery);

$(document).ready(function () {
    unsubscribe.init();
});