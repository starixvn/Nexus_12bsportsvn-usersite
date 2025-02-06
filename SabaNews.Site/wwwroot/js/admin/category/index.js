var categoryLivescore = (function ($) {
    var id = 0;
    $('.league-select').select2();

    function UpdateInfo(leagueId, seasonId, status, cateId) {
        $.ajax({
            type: 'POST',
            url: '/Admin/CategoryManagement/UpdateCate',
            data: { leagueId, seasonId, status, cateId},
            success: function(res) {
                $('#EditCateLeague').modal('hide');
                if (!res.isSuccessful) {
                    var mess = res.message == '' ? 'An error occurred while add league, please try again' : res.message;
                    GetErrorPopup('#NoticeModal', mess);
                }
            }
        })
    }

    function Edit() {
        $('.league-select').on('change', function() {
            var leagueId = $(this).val();
            var seasonId = $(this).find('option:selected').data('season');
            var icon = $(this).find('option:selected').data('icon');
            var row = $(this).parent().parent();
            var status = row.find('.cate-status').is(":checked")? 1 : 0;
            var cateId = row.data('id');
            if( typeof icon !== "undefined") {
                var img = $('<img />', {src : icon});
                img.appendTo('body');
                row.find('.league-icon').html(img)
            } else {
                row.find('.league-icon').html('')
            }
            UpdateInfo(leagueId, seasonId, status, cateId);
        });

        $('.cate-status').on('change', function() {
            var league = $(this).parent().parent().find('.league-select');
            var leagueId = league.val();
            var seasonId = league.find('option:selected').data('season');;
            var status = $(this).is(":checked")? 1 : 0;
            var cateId = $(this).parent().parent().data('id');
            UpdateInfo(leagueId, seasonId, status, cateId);
        });
        $('.child').addClass('hide');
        $('.league-name').on('click', function() {
            var id = $(this).parent().data('id');
            $(this).toggleClass('active');
            $('.parent-'+ id).toggleClass('hide');
        });
    }


    function handleModal() {
        $('.confirm-action').on('click', function () {
            if (id == 0) {
                return false;
            }
            $.ajax({
                type: 'POST',
                url: '/Admin/HomepageManagement/DeleteLeague',
                data: { id, isFixtureOption },
                success: function (response) {
                    $('#ConfirmModal').modal('hide');
                    if (response.isSuccessful) {
                        $('#NoticeModal' + ' .modal-title').removeClass('title-error').addClass('title-success');
                        $('#NoticeModal' + ' .title').html('<i class="icon-title icon-success-admin"></i> Successful');
                        $('#NoticeModal' + ' .modal-body').html('Remove league successfully!');
                        $('#NoticeModal').modal('show');

                        setTimeout(function () {
                            $('#NoticeModal').modal('hide');
                            GetDataGrid();
                        }, 1000);
                    } else {
                        $('#NoticeModal' + ' .modal-title').removeClass('title-success').addClass('title-error');
                        $('#NoticeModal' + ' .title').html('<i class="icon-title icon-error-admin"></i> Error');
                        $('#NoticeModal' + ' .modal-body').html('An error occurred while remove league, please try again');
                        $('#NoticeModal').modal('show');
                    }
                }
            })
            url = "";
        });
    }

    function init() {
        Edit();
        handleModal();
    }

    return {
        init
    }
})(jQuery);



$(document).ready(function () {
    categoryLivescore.init();
});