var viewDetails = (function ($) {
    function getViewDetails(viewSort, authorSort, pageIndex = 1, pageSize = 10) {
        var createdDate = $('input[name="CreatedDate"]').val();
        var isVideo = $('input[name="IsVideo"]').attr("checked");
        $.ajax({
            url: "GetViewDetails",
            method: "POST",
            data: {
                createdDate: new Date(createdDate).toISOString(),
                isVideo: isVideo ? true : false,
                viewSort: viewSort,
                authorSort: authorSort,
                pageIndex: pageIndex,
                pageSize: pageSize
            },
            success: function (result) {
                $("#grid-details").html(result);
                initSortViewEvent();
                initSortAuthorEvent();
                initPagingIndexEvent();
                initPagingSizeEvent();
            }
        });
    }

    function initPagingIndexEvent() {
        $('.paging').on('click', function () {
            var pageIndex = $(this).data('page');
            var viewSort = $("#view-sort").attr("sort-type");
            var authorSort = $("#author-sort").attr("sort-type");
            var pageSize = $('#page-size').val();
            getViewDetails(viewSort, authorSort, pageIndex, pageSize);
        });
    }

    function initPagingSizeEvent() {
        $('#page-size').on('change', function () {
            var pageSize = $(this).val();
            var viewSort = $("#view-sort").attr("sort-type");
            var authorSort = $("#author-sort").attr("sort-type");
            getViewDetails(viewSort, authorSort, 1, pageSize);
        });
    }

    function initSortViewEvent() {
        $("#view-sort").on("click", function () {
            var currentType = $(this).attr("sort-type");
            var pageSize = $('#page-size').val();
            if (!currentType) {
                currentType = "desc";
                getViewDetails(currentType, null, 1, pageSize);
                return;
            }

            currentType = currentType === "desc" ? "asc" : "desc";
            getViewDetails(currentType, null, 1, pageSize);
        });
    }

    function initSortAuthorEvent() {
        $("#author-sort").on("click", function () {
            var authorType = $(this).attr("sort-type");
            var pageSize = $('#page-size').val();
            if (!authorType) {
                authorType = "desc";
                getViewDetails(null, authorType, 1, pageSize);
                return;
            }

            authorType = authorType === "desc" ? "asc" : "desc";
            getViewDetails(null, authorType, 1, pageSize);
        });
    }

    function init() {
        getViewDetails();
    }

    return { init };
})(jQuery);

$(document).ready(function () {
    viewDetails.init();
});