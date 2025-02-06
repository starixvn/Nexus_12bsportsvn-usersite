var adminManagementTopScorers = (function ($) {
    var leagueId = window.leagueId;
    var seasonId = window.seasonId;
    var rowNum = 0;

    function GetDataTopScorersGrid() {
        var search = document.getElementById("search").value;
        $.ajax({
            url: "/Admin/TopScorerManagement/GetTopScorersData",
            type: 'POST',
            data: { search, leagueId, seasonId },
            success: function (res) {
                $('.data-grid').html(res);
                HandleDelete();
                $('.btn-Edit').on('click', function () {
                    var url = $(this).data('url');
                    $.ajax({
                        type: 'GET',
                        url: url,
                        data: {leagueId, seasonId},
                        success: function (html) {
                            $('#EditPlayerContent .title').html('Edit Player');
                            $('#EditPlayerContent .modal-body').html(html);
                            $('#EditPlayerContent').modal('show');

                            $("#TeamFullNameEN").on("change", function () {
                                var teamId = document.getElementById("TeamFullNameEN").value;
                                $.ajax({
                                    type: 'Get',
                                    url: '/Admin/TopScorerManagement/GetPlayerByTeamId',
                                    data: { teamId },
                                    success: function (data) {
                                        $("#PlayerFullNameEN").empty();
                                        data.forEach(function (obj) {
                                            $('#PlayerFullNameEN').append($('<option></option>').val(obj.playerId).html(obj.fullNameEN));
                                        })
                                    }
                                })
                            });

                            $("#TeamFullNameEN").select2();
                            $("#PlayerFullNameEN").select2();
                            

                            $('#btn-save').on('click', function () {
                                if(document.getElementById("editTop").value <= 0) {
                                    return false;
                                }
                                document.getElementById("btn-save").style.display = "none";
                                var url = $(this).data('url');
                                var RowNum = $(this).data('row');
                                var Top = document.getElementById("editTop").value;
                                var Goals = document.getElementById("editGoals").value;
                                var Assists = document.getElementById("editAssist").value;
                                var TeamId = document.getElementById("TeamFullNameEN").value;
                                var PlayerId = document.getElementById("PlayerFullNameEN").value;
                                $.ajax({
                                    type: 'POST',
                                    url: url,
                                    data: { leagueId, seasonId, Top, Goals, Assists, TeamId, PlayerId, RowNum },
                                    success: function (response) {
                                        if (response.isSuccessful) {
                                            $('#EditPlayerContent').modal('hide');
                                            GetSuccessPopup('#NoticeModal', 'Update Player successfully!');
                                            setTimeout(function () {
                                                $('#NoticeModal').modal('hide');
                                                GetDataTopScorersGrid();
                                            }, 1000);
                                        } else {
                                            document.getElementById("btn-save").style.display = "inline-block";
                                            GetErrorPopup('#NoticeModal', 'An error occurred while add player, please try again');
                                        }
                                    }
                                })
                            });
                        }
                    });
                });
            }
        });
    }

    function initFilterBtn() {
        $('.league-select').on('change', function () {
            leagueId = $(this).val();
            seasonId = $(this).find('option:selected').data('season');
            GetSeason(leagueId, seasonId);
            GetDataTopScorersGrid()
        });

        $("#search").keyup(function () {
            GetDataTopScorersGrid();
        });

        $('.btn_player').click(function () {
            $.ajax({
                type: 'Get',
                url: '/Admin/TopScorerManagement/AddPlayer',
                data: {leagueId, seasonId},
                success: function (html) {
                    $('#AddPlayerContent .title').html('Add Player');
                    $('#AddPlayerContent .modal-body').html(html);
                    $('#AddPlayerContent').modal('show');


                    $("#TeamFullNameENAdd").on("change", function () {
                        var teamId = document.getElementById("TeamFullNameENAdd").value;
                        $.ajax({
                            type: 'GET',
                            url: '/Admin/TopScorerManagement/GetPlayerByTeamId',
                            data: { leagueId, seasonId, teamId},
                            success: function (data) {
                                $("#PlayerFullNameENAdd").empty();
                                data.forEach(function (obj) {
                                    $('#PlayerFullNameENAdd').append($('<option></option>').val(obj.playerId).html(obj.fullNameEN));
                                })
                            }
                        })
                    });

                    $("#TeamFullNameENAdd").select2();
                    $("#PlayerFullNameENAdd").select2();

                    $('#btn-save-add').on('click', function () {
                        if(document.getElementById("addTop").value <= 0) {
                            return false;
                        }
                        document.getElementById("btn-save-add").style.display = "none";
                        var url = $(this).data('url');                       
                        var Top = document.getElementById("addTop").value;
                        var Goals = document.getElementById("addGoals").value;
                        var Assists = document.getElementById("addAssist").value;
                        var TeamId = document.getElementById("TeamFullNameENAdd").value;
                        var PlayerId = document.getElementById("PlayerFullNameENAdd").value;
                        $.ajax({
                            type: 'POST',
                            url: url,
                            data: { leagueId, seasonId, Top, Goals, Assists, TeamId, PlayerId },
                            success: function (response) {
                                if (response.isSuccessful) {
                                    $('#AddPlayerContent').modal('hide');
                                    GetSuccessPopup('#NoticeModal', 'Add player successfully!');
                                    setTimeout(function () {
                                        $('#NoticeModal').modal('hide');
                                        GetDataTopScorersGrid();
                                    }, 1000);
                                } else {
                                    document.getElementById("btn-save-add").style.display = "inline-block";
                                    GetErrorPopup('#NoticeModal', 'An error occurred while add player, please try again');
                                }
                            }
                        });
                    });
                }
            })
        });
    }

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

    function HandleDelete() {
        $('.btn-delete').on('click', function () {
            rowNum = $(this).data('id');
            $('#ConfirmModal .confirm-action').data('action', 'remove');
            $('#ConfirmModal .modal-body').html('Are you sure you want to remove this item ?');
            $('#ConfirmModal').modal('show');
        });

        $('.confirm-action').on('click', function () {
            if (rowNum == 0) {
                return false;
            }
            $.ajax({
                type: 'POST',
                url: '/Admin/TopScorerManagement/Delete',
                data: { rowNum, leagueId, seasonId },
                success: function (response) {
                    $('#ConfirmModal').modal('hide');
                    if (response.isSuccessful) {
                        $('#NoticeModal' + ' .modal-title').removeClass('title-error').addClass('title-success');
                        $('#NoticeModal' + ' .title').html('<i class="icon-title icon-success-admin"></i> Successful');
                        $('#NoticeModal' + ' .modal-body').html('Remove iteam successfully!');
                        $('#NoticeModal').modal('show');

                        setTimeout(function () {
                            $('#NoticeModal').modal('hide');
                            GetDataTopScorersGrid();
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

    function HandleAction() {
        $(document).on('keypress','.input-number', function (e) {
            $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
            if ((e.which != 46 || $(this).val().indexOf('.') != -1) && (e.which < 48 || e.which > 57)) {
                e.preventDefault();
            }
        });
    }

    function init() {
        $('.league-select').select2();
        GetSeason(leagueId);
        GetDataTopScorersGrid();
        initFilterBtn();
        HandleAction();
    }

    return {
        init
    }
})(jQuery);


$(document).ready(function () {
    adminManagementTopScorers.init();
});