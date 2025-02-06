var postViewStatistic = (function ($) {
    function getPostViewStatistic() {
        var fromDate = $("#FromDate").val();
        var toDate = $("#ToDate").val();
        if (isValidFilter(fromDate, toDate)) {
            $.ajax({
                url: "PostViewStatistic",
                method: "POST",
                data: {
                    fromDate: new Date(fromDate).toISOString(),
                    toDate: new Date(toDate).toISOString()
                },
                success: function (result) {
                    $("#statistic-report").html(result);
                }
            });
        }
    }

    function isValidFilter(fromDate, toDate) {
        if (!fromDate) {
            $('#error').show();
            $('#error').html('From Date is required');
            return false;
        }

        if (!toDate) {
            $('#error').show();
            $('#error').html('To Date is required');
            return false;
        }

        if (fromDate > toDate) {
            $('#error').show();
            $('#error').html('From Date must bigger than To Date');
            return false;
        }

        $('#error').hide();
        return true;
    }

    function initEventSubmitBtn() {
        $("#filter").on("submit", function (e) {
            e.preventDefault();
            getPostViewStatistic();
        });
    }

    function init() {
        initEventSubmitBtn();
        getPostViewStatistic();
    }

    return { init };
})(jQuery);

$(document).ready(function () {
    postViewStatistic.init();
});