var standingManagement = (function ($) {
    var leagueId = window.leagueId;
    var seasonId = window.seasonId;
    var search = '';
    var leagueName = '';
    var seasonName = '';
    function GetSeason(leagueId) {
        $.ajax({
            url: "/Admin/MatchManagement/GetSeason",
            type: 'POST',
            data: { leagueId },
            success: function (res) {
                $('#seasonFilter').html(res);
            }
        });
    }
    function GetDataGrid() {
        $.ajax({
            url: "/Admin/StandingManagement/GetDataGrid",
            type: 'POST',
            data: { seasonId, leagueId },
            success: function (res) {
                $('.data-grid').html(res);
                initAction();
                //initPaging();
                //initSortEvent();
            }
        });
    }

    function initAction() {
        $('.btn-Edit').on('click', function () {
            var url = $(this).data('url');
            var team = $(this).data('team');
            var group = $(this).data('group');
            var divide = group !== '' ? ' -  ' : '';
            leagueName = $('.league-select').find(':selected').data('name');
            seasonName = $('.season-select').find(':selected').data('name');
            var title = `Standing Editing (${group}${divide}${team}) / ${leagueName} ${seasonName}`;
            $.ajax({
                type: 'GET',
                url: url,
                success: function (html) {
                    $('#EditStandingModal .title').html(title);
                    $('#EditStandingModal .modal-body').html(html);
                    $('#EditStandingModal').modal('show');

                    $('#btn-save').on('click', function () {
                        $(this).prop('disabled', true);
                        var stageId = $(this).data('stageid');
                        var teamId = $('#editTeamId').val();
                        var groupName = $('#groupName').val();
                        var position = $('#editPosition').val();
                        var currentIcon = $('#editIconVN').parent().find('.review_photo').attr('src');
                        var formData = new FormData();
                        if (position === '' || position <= 0) {
                            $('#editPosition').parent().find('.help-block').html('Position value is more than 1');
                            $(this).prop('disabled', false);
                            return false;
                        }
                       
                        
                        formData.append('seasonId', seasonId);
                        formData.append('stageId', stageId);
                        formData.append('teamId', teamId);
                        formData.append('position', position);
                        if (typeof groupName !== 'undefined') {
                            formData.append('groupName', groupName);
                        }
                        formData.append('total', $('#total').val());
                        formData.append('won', $('#won').val());
                        formData.append('draw', $('#draw').val());
                        formData.append('loss', $('#loss').val());
                        formData.append('goals', $('#goals').val());
                        formData.append('goalsAgainst', $('#goalsAgainst').val());
                        formData.append('goalDiff', $('#goalDiff').val());
                        formData.append('points', $('#points').val());
                        $.ajax({
                            type: 'POST',
                            url: "/Admin/StandingManagement/EditStanding",
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (response) {
                                if (response.isSuccessful) {
                                    $('#EditStandingModal').modal('hide');
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
                        });
                        event.preventDefault();
                    });

                    $('.photo').on('change', function (e) {
                        var form = $(this).parent();
                        var files = $(this)[0].files[0];
                        var isValid = ValidatePhoto(files, $(this));
                        if (!isValid) {
                            CancelUploadHandler($(this).parent());
                            return false;
                        }
                        var review = $(this).parent().find('.review_photo');

                        var reader = new FileReader();
                        reader.readAsDataURL(files);
                        reader.onload = function (e) {
                            review.attr('src', e.target.result);
                            ChangePhotoHanlder(form);
                        };
                    });

                    $('.cancel-upload').on('click', function () {
                        var form = $(this).parent().parent();
                        CancelUploadHandler(form);
                        $(this).hide();
                    });

                    $('#editPosition').on('keyup', function () {
                        $(this).parent().find('.help-block').html('');
                    });

                    $('.input-number').on('keypress', function (e) {
                        $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
                        if ((e.which != 46 || $(this).val().indexOf('.') != -1) && (e.which < 48 || e.which > 57)) {
                            e.preventDefault();
                        }
                    });

                    $('#groupName').on('change', function () {
                        var count = $(this).find(':selected').data('count');
                        var position = $('#current-position').val();
                        console.log(count, position);
                        var html = '';
                        for (var i = 1; i <= count; i++) {
                            var selected = i == position ? 'selected' : '';
                            html += '<option value="' + i + '" ' + selected + ' >' + i + '</option>'
                        }
                        $('#editPosition').html(html);
                    });
                }
            })
        });
    }

    function ChangePhotoHanlder(form) {
        $(form).find('.review_photo').show();
        $(form).find('.photo-error').hide();
        $(form).find('.txt-img').css('display', 'none');
        $(form).find('.cancel-upload').show();
    }

    function CancelUploadHandler(form) {
        $(form).find('.review_photo').attr('src', '');
        $(form).find('.review_photo').hide();
        $(form).find('.txt-img').css('display', 'flex');
        $(form).find('.cancel-upload').hide();
        $(form).find('.photo').val('');
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
            errorSection.html("Just support for jpg, png, jpeg, gif file type");
            errorSection.show();
            return false;
        } else if (fsize > 3145728) {
            errorSection.html("Exceeds the maximum upload size for this site.");
            errorSection.show();
            return false;
        }
        return isValid;
    }

    function initFilterBtn() {
        $("#submit-btn").on("click", function () {
            page = 1;
            pageSize = 10;
            leagueId = $('.league-select').val();
            seasonId = $('.season-select').val();
            GetDataGrid();
        });
        $('.league-select').on('change', function () {
            var currentLeagueId = $(this).val();
            GetSeason(currentLeagueId);
        });
        $('.btn_league').click(function () {
            initAddLeague();
        });

        $('#reset-data').on('click', function() {
            if(confirm("Your custotm data will be removed when reset, Are you sure?")) {
                $.ajax({
                    url: "/Admin/StandingManagement/ResetData",
                    type: "POST",
                    data: {seasonId},
                    success: function(res) {
                        if (res.isSuccessful) {
                            $('#EditStandingModal').modal('hide');
                            GetSuccessPopup('#NoticeModal', 'Reset data succesfully!');
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
            }
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
    standingManagement.init();
});