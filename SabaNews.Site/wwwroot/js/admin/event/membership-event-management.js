var adminMembershipEvent = (function ($) {
    var page = 1;
    var pageSize = 10;
    function GetDataCommentGrid(dateSort) {
        var search = $('#search').val();
        $.ajax({
            url: "/Admin/Event/GetMembershipEventData",
            type: 'POST',
            data: { page, pageSize, search, dateSort },
            success: function (res) {
                $('.data-grid').html(res);
                initPaging();
                initSortEvent();
                
            }
        });
    }

    function initPaging() {
        $('.paging').on('click', function () {
            page = $(this).data('page');
            var dateSort = $("#date-sort").attr("sort-type");
            GetDataCommentGrid(dateSort);

        });

        $('#page-size').on('change', function () {
            pageSize = $(this).val();
            page = 1;
            var dateSort = $("#date-sort").attr("sort-type");
            GetDataCommentGrid(dateSort);
        });
    }

    function initSortEvent() {
        $("#date-sort").on("click", function () {
            var dateType = $(this).attr("sort-type");
            if (!dateType) {
                dateType = "desc";
                GetDataCommentGrid(dateType);
                return;
            }

            dateType = dateType === "desc" ? "asc" : "desc";
            GetDataCommentGrid(dateType);
        });
    }

    function initFilterBtn() {
        $("#filter").on("submit", function (e) {
            e.preventDefault();
            GetDataCommentGrid(null);
        });
    }

    function init() {
        GetDataCommentGrid();
        initFilterBtn();
    }

    return {
        init
    }
})(jQuery);


$(document).ready(function () {
    adminMembershipEvent.init();
});