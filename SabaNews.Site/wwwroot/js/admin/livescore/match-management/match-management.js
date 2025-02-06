var matchManagement = (function ($) {
    var page = 1, pageSize = 10, url = "";
    var leagueId = window.leagueId;
    var seasonId = window.seasonId;
    var search = '';
    var dateSort = 'asc';
    var leagueName = '';
    var seasonName = '';
    function GetSeason(leagueId, season = 0) {
        $.ajax({
            url: "/Admin/MatchManagement/GetSeason",
            type: 'POST',
            data: { leagueId, season },
            success: function (res) {
                $('#seasonFilter').html(res);
            }
        });
    }
    function GetDataGrid() {
        $.ajax({
            url: "/Admin/MatchManagement/GetMatchGrid",
            type: 'POST',
            data: { page, pageSize, search, seasonId, leagueId, dateSort },
            success: function (res) {
                $('.data-grid').html(res);
                initAction();
                initPaging();
                initSortEvent();
            }
        });
    }

    function initAction() {
        $('.btn-Edit').on('click', function () {
            var url = $(this).data('url');
            var team = $(this).data('team');
            leagueName = $('.league-select').find(':selected').data('name');
            seasonName = $('.season-select').find(':selected').data('name');
            var title = `Match Editing (${team}) / ${leagueName} ${seasonName}`;
            $.ajax({
                type: 'GET',
                url: url,
                success: function (html) {
                    $('#EditMatchModal .title').html(title);
                    $('#EditMatchModal .modal-body').html(html);
                    $('#EditMatchModal').modal('show');

                    $('#btn-save').on('click', function () {
                        $(this).prop('disabled', true);
                        if (!validateForm()) {
                            $(this).prop('disabled', false);
                            return false;
                        }
                        var matchId = $(this).data('id');
                        var homeTeamId = $('#editHomeId').val();
                        var homeTeamNameVN = $('#editHomeVN').val();
                        var homeIcon = $('#editHomeIcon')[0].files[0];
                        var awayTeamId = $('#editAwayId').val();
                        var awayTeamNameVN = $('#editAwayVN').val();
                        var awayIcon = $('#editAwayIcon')[0].files[0];
                        var currentHomeIcon = $('#editHomeIcon').parent().parent().parent().parent().find('.review_photo').attr('src');
                        var isDeletedHomeIcon = currentHomeIcon === '';
                        var currentAwayIcon = $('#editAwayIcon').parent().parent().parent().parent().find('.review_photo').attr('src');
                        var isDeletedAwayIcon = currentAwayIcon === '';
                        var formData = new FormData();
                        formData.append('matchId', matchId);
                        formData.append('homeTeamId', homeTeamId);
                        formData.append('homeIcon', homeIcon);
                        formData.append('homeTeamNameVN', homeTeamNameVN);
                        formData.append('awayTeamId', awayTeamId);
                        formData.append('awayIcon', awayIcon);
                        formData.append('awayTeamNameVN', awayTeamNameVN);
                        formData.append('isDeletedHomeIcon', isDeletedHomeIcon);
                        formData.append('isDeletedAwayIcon', isDeletedAwayIcon);
                        formData.append('homeTeamHalfScore', $('#homeTeamHalfScore').val());
                        formData.append('awayTeamHalfScore', $('#awayTeamHalfScore').val());
                        formData.append('homeTeamExtraScore', $('#homeTeamExtraScore').val());
                        formData.append('awayTeamExtraScore', $('#awayTeamExtraScore').val());
                        formData.append('homeTeamAggregateScore', $('#homeTeamAggregateScore').val());
                        formData.append('awayTeamAggregateScore', $('#awayTeamAggregateScore').val());
                        formData.append('homeTeamPenaltyScore', $('#homeTeamPenaltyScore').val());
                        formData.append('awayTeamPenaltyScore', $('#awayTeamPenaltyScore').val());
                        formData.append('status', $('#status').val());
                        formData.append('startTime', $('#startTime').val());
                        formData.append('round', $('#round').val());
                        formData.append('stageNameVN', $('#stageNameVN').val());

                        $.ajax({
                            type: 'POST',
                            url: "/Admin/MatchManagement/EditMatch",
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (response) {
                                if (response.isSuccessful) {
                                    $('#EditMatchModal').modal('hide');
                                    GetSuccessPopup('#NoticeModal', 'Update Match successfully!');
                                    setTimeout(function () {
                                        $('#NoticeModal').modal('hide');
                                        GetDataGrid();
                                    }, 1000);
                                } else {
                                    $(this).prop('disabled', false);
                                    GetErrorPopup('#NoticeModal', 'An error occurred while add league, please try again');
                                }
                            }
                        })
                        event.preventDefault();
                    });


                    function validateForm() {
                        var htmlHome = '';
                        var htmlAway = '';
                        var isValid = true;
                        $('.round-error').html('');
                        if (($('#round').val() < 0 || $('#round').val() > 50) && $('#round').val() !== '') {
                            var isValid = false;
                            $('.round-error').html('round value must from 0 to 50');
                        }
                        if ($('#homeTeamHalfScore').val() < 0 || $('#homeTeamHalfScore').val() > 100) {
                            htmlHome += ', 1H Score';
                            isValid = false;
                        }
                        if ($('#homeTeamExtraScore').val() < 0 || $('#homeTeamExtraScore').val() > 100) {
                            htmlHome += ', FT Score';
                            isValid = false;
                        }

                        if ($('#homeTeamAggregateScore').val() < 0 || $('#homeTeamAggregateScore').val() > 100) {
                            htmlHome += ', AGG';
                            isValid = false;
                        }

                        if ($('#homeTeamPenaltyScore').val() < 0 || $('#homeTeamPenaltyScore').val() > 100) {
                            htmlHome += ', PEN';
                            isValid = false;
                        }
                        if ($('#awayTeamHalfScore').val() < 0 || $('#awayTeamHalfScore').val() > 100) {
                            htmlAway += ', 1H Score';
                            isValid = false;
                        }
                        if ($('#awayTeamExtraScore').val() < 0 || $('#awayTeamExtraScore').val() > 100) {
                            htmlAway += ', FT Score';
                            isValid = false;
                        }

                        if ($('#awayTeamAggregateScore').val() < 0 || $('#awayTeamAggregateScore').val() > 100) {
                            htmlAway += ', AGG';
                            isValid = false;
                        }

                        if ($('#awayTeamPenaltyScore').val() < 0 || $('#awayTeamPenaltyScore').val() > 100) {
                            htmlAway += ', PEN';
                            isValid = false;
                        }
                        if (!isValid) {
                            if (htmlHome !== '') {
                                htmlHome = htmlHome.substr(1);
                                htmlHome += ' value must from 0 to 100';
                            }
                            if (htmlAway !== '') {
                                htmlAway = htmlAway.substr(1);
                                htmlAway += ' value must from 0 to 100';
                            }
                           
                        }
                        $('.home-error').html(htmlHome);
                        $('.away-error').html(htmlAway);
                        return isValid;
                    }

                    $('.photo').on('change', function (e) {
                        var form = $(this).parent();
                        var files = $(this)[0].files[0];
                        var isValid = ValidatePhoto(files, $(this));
                        if (!isValid) {
                            CancelUploadHandler($(this).parent());
                            return false;
                        }
                        var review = $(this).parent().parent().parent().parent().find('.review_photo');

                        var reader = new FileReader();
                        reader.readAsDataURL(files);
                        reader.onload = function (e) {
                            review.attr('src', e.target.result);
                            ChangePhotoHanlder(form);
                        };
                    });

                    $('.cancel-upload').on('click', function () {
                        var form = $(this).parent();
                        CancelUploadHandler(form);
                        $(this).hide();
                    });
                    $('.input-number').on('keypress', function (e) {
                        
                        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
                        if ((e.which != 46 || $(this).val().indexOf('.') != -1) && (e.which < 48 || e.which > 57)) {
                            e.preventDefault();
                        }
                    });
                }
            })
        });
    }

    function ChangePhotoHanlder(form) {
        var review = $(form).parent().parent().parent();
        review.find('.cancel-upload').show();
        review.find('.review_photo').show();
        $(form).find('.photo-error').hide();
        
    }

    function CancelUploadHandler(form) {
        var input = $(form).parent().parent();
        form.find('.review_photo').attr('src', '');
        form.find('.review_photo').hide();
        form.find('.cancel-upload').hide();
        input.find('.photo').val('');
    }

    function ValidatePhoto(files, self) {
        var isValid = true;
        var errorSection = self.parent().find('.photo-error');
        if (typeof files === "undefined") {
            errorSection.html("Please choose file first!");
            errorSection.show();
            return false;
        }
        var type_reg = /^image\/(jpg|png|jpeg|bmp|gif|ico)$/;
        var fsize = files.size,
            ftype = files.type,
            fname = files.name,
            fextension = fname.substring(fname.lastIndexOf('.') + 1);

        if (!type_reg.test(ftype)) {
            errorSection.html("Just support for jpg, png, jpeg, gif file type!");
            errorSection.show();
            return false;
        } else if (fsize > 3145728) {
            errorSection.html("Exceeds the maximum upload size for this site.");
            errorSection.show();
            return false;
        }
        return isValid;
    }

    function initPaging() {
        $('.paging').on('click', function () {
            page = $(this).data('page');
            dateSort = $("#date-sort").attr("sort-type");
            GetDataGrid();

        });

        $('#page-size').on('change', function () {
            pageSize = $(this).val();
            page = 1;
            dateSort = $("#date-sort").attr("sort-type");
            GetDataGrid();
        });
    }

    function initSortEvent() {
        $("#date-sort").on("click", function () {
            var dateType = $(this).attr("sort-type");
            if (!dateType) {
                dateSort = "desc";
                GetDataGrid(dateType);
                return;
            }
            dateSort = dateType === "desc" ? "asc" : "desc";
            GetDataGrid();
        });
    }

    function initFilterBtn() {
        $("#submit-btn").on("click", function () {
            page = 1;
            pageSize = 10;
            leagueId = $('.league-select').val();
            seasonId = $('.season-select').val();
            search = $('.search-team').val();
            GetDataGrid();
        });
        $('.league-select').on('change', function () {
            var currentLeagueId = $(this).val();
            var season = $(this).find('option:selected').data('season');
            GetSeason(currentLeagueId, season);
        });
        $('.btn_league').click(function () {
            initAddLeague();
        });
    }

    function init() {
        $('.league-select').select2();
        GetSeason(leagueId);
        GetDataGrid();
        initFilterBtn();
    }

    return {
        init
    }
})(jQuery);


$(document).ready(function () {
    matchManagement.init();
});