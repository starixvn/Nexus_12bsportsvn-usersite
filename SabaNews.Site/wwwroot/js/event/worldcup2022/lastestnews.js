var lastestnews = (function ($) {
    var numRow = 1;
    var isMobile = false;
    var total = 0;
        
    function showStandings() {
        if (isMobile === "False") {
            for (var i = 1; i <= total; i++) {
                if (i != numRow) {
                    $('#standing-' + i).hide();
                }
                else {
                    $('#standing-' + i).show();
                }
            }
        }
    }

    function getStandings() {
        $.ajax({
            url: '/WorldCup2022/GetStandings',
            type: 'GET'
        }).done(function (data) {
            $('#standingWC').html(data);

            total = $(".btn-next-standing").data('total');
            isMobile = $("#standingWC").data('ismobile');
            showStandings();
           
            $('.btn-back-standing').on('click', function () {
                numRow--;
                if (numRow >= 1) {
                    showStandings();
                }
                else {
                    numRow++;
                }
            });

            $('.btn-next-standing').on('click', function () {
                numRow++;
                var total = $(this).data("total");
                if (numRow <= total) {
                    showStandings();
                }
                else {
                    numRow--;
                }
            });
        })
    }

    function init() {
        getStandings();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    lastestnews.init();
});