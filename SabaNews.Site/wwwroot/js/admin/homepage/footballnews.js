var footballnewsHomepage = (function ($) {
    function GetDataFootBallGrid() {
        $.ajax({
            url: "/Admin/HomepageManagement/GetDataFootBallGrid",
            type: 'POST',
            success: function (res) {
                $('.data-grid').html(res);

                $('.btn-Edit').on('click', function () {
                    var count = $(this).data("count");
                    var titleEdit= "Category Editing #" + count;
                    $.ajax({
                        type: 'GET',
                        url: "/Admin/HomepageManagement/EditCategory",
                        data: { count },
                        success: function (html) {
                            $('#EditCategory .title').html(titleEdit);
                            $('#EditCategory .modal-body').html(html);
                            $('#EditCategory').modal('show');

                            $("#Category").select2();

                            $("#Category").on("change", function () {
                                let category = document.getElementById("Category").value;
                                $.ajax({
                                    type: 'POST',
                                    url: "/Admin/HomepageManagement/GetSlugs",
                                    data: { category },
                                    success: function (response) {
                                        document.getElementById("editSlug").value = response.slug;
                                        document.getElementById("editCategoryName").value = response.menuTitle;
                                    }
                                });
                            });

                            $('#btn-save').on('click', function () {
                                let category = document.getElementById("Category").value;
                                let categoryName = document.getElementById("editCategoryName").value;
                                var count = $(this).data("count");

                                $.ajax({
                                    type: 'POST',
                                    url: "/Admin/HomepageManagement/EditCategory",
                                    data: { category, count, categoryName },
                                    success: function (response) {
                                        $('#EditCategory').modal('hide');

                                        $('#NoticeModal' + ' .modal-title').removeClass('title-error').addClass('title-success');
                                        $('#NoticeModal' + ' .title').html('<i class="icon-title icon-success-admin"></i> Successful');
                                        $('#NoticeModal' + ' .modal-body').html('Category was successfully changed!');
                                        $('#NoticeModal').modal('show');

                                        setTimeout(function () {
                                            $('#NoticeModal').modal('hide');
                                            GetDataFootBallGrid();
                                        }, 1000);
                                    }
                                });
                            });
                        }
                    })
                });
            }
        });
    }

    function init() {
        GetDataFootBallGrid();
    }

    return {
        init
    }
})(jQuery);



$(document).ready(function () {
    footballnewsHomepage.init();
});