var fixtureHomepage = (function ($) {
    var id = 0;
    
    function GetDataGrid() {
        $.ajax({
            url: "/Admin/HomepageManagement/GetLeagueGrid",
            type: 'POST',
            data: { isFixtureOption },
            success: function (res) {
                $('.data-grid').html(res);
                Edit();
                Delete();
            }
        });
    };

    function validateNumber() {
        $('.input-number').on('keypress', function (e) {
            let val = $(this).val();
            $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
            if ((e.which != 46 || val.indexOf('.') != -1 || val > max) && (e.which < 48 || e.which > 57)) {
                e.preventDefault();
            }
        });

        // $('.input-number').on('keyup', function (e) {
        //     const val = $(this).val();
        //     const max = $(this).attr('max');
        //     if(parseInt(val) > parseInt(max)) {
        //         $(this).val(max);
        //     }
        // });
    }

    function validateForm(form) {
        var isValid = true;
        var order = $(form + ' #order');
        if (($(form + ' #leagueId').val() <= 0)) {
            var isValid = false;
            $(form + ' .league-error').html('league is required');
        }
        if (($(form + ' .season-select').val() == '')) {
            var isValid = false;
            $(form + ' .season-error').html('season is required');
        }
        if ((order.val() <= 0 || parseInt(order.val()) > parseInt(order.attr('max')))) {
            var isValid = false;
            var msg = 'priority value range is [1...' + order.attr('max') +']';
            if(order.attr('max') == 1) {
                msg = 'priority value is invalid';
            }
            $(form + ' .order-error').html(msg);
        }
        return isValid;
    }


    function Edit() {
        $('.btn-Edit').on('click', function () {
            var id = $(this).data('id');
            var name = $(this).data('name');
            $.ajax({
                type: 'POST',
                url: '/Admin/HomepageManagement/GetLeagueToEdit',
                data: { id, isFixtureOption },
                success: function (res) {
                    var self = $(this);
                    $('#AddModal .modal-body').html(res);
                    $('#AddModal .title').html('League Editing / ' + name);
                    $('.league-select').select2();
                    $('#AddModal').modal('show');
                    $('#btn-save').on('click', function () {
                        $('.error-input').html('');
                        var form = '#AddModal';
                        self.prop('disabled', true);
                        if (!validateForm(form)) {
                            self.prop('disabled', false);
                            return false;
                        }
                        var order = $(form + ' #order').val();
                        var seasonId = $('option:selected', form + ' #leagueId').data('season');
                        $.ajax({
                            type: 'POST',
                            url: '/Admin/HomepageManagement/EditLeague',
                            data: { id, seasonId, order, isFixtureOption },
                            success: function (response) {
                                if (response.isSuccessful) {
                                    $(form).modal('hide');
                                    GetSuccessPopup('#NoticeModal', 'Update Fixture successfully!');
                                    setTimeout(function () {
                                        $('#NoticeModal').modal('hide');
                                        GetDataGrid();
                                    }, 1000);
                                } else {
                                    self.prop('disabled', false);
                                    var mess = response.message == '' ? 'An error occurred while add league, please try again' : response.message;
                                    GetErrorPopup('#NoticeModal', mess);
                                }
                            }
                        })
                    });
                    validateNumber();
                }
            })
            validateForm();
        });
    }

    function Add() {
        $('.btn-add-fixture').on('click', () => {
            $.ajax({
                type: 'POST',
                url: '/Admin/HomepageManagement/GetLeagueToAdd',
                data: { isFixtureOption },
                success: function (res) {
                    var self = $(this);
                    $('#AddModal .modal-body').html(res);
                    $('#AddModal .title').html('Add League');
                    $('.league-select').select2();
                    $('#AddModal').modal('show');
                    $('#btn-save').on('click', function () {
                        $('.error-input').html('');
                        var form = '#AddModal';
                        self.prop('disabled', true);
                        if (!validateForm(form)) {
                            self.prop('disabled', false);
                            return false;
                        }
                        var leagueId = $(form + ' #leagueId').val();
                        var order = $(form + ' #order').val();
                        var seasonId = $('option:selected', form + ' #leagueId').data('season');

                        $.ajax({
                            type: 'POST',
                            url: '/Admin/HomepageManagement/AddLeague',
                            data: { leagueId, seasonId, order, isFixtureOption },
                            success: function (response) {
                                if (response.isSuccessful) {
                                    $(form).modal('hide');
                                    GetSuccessPopup('#NoticeModal', 'Update Match successfully!');
                                    setTimeout(function () {
                                        $('#NoticeModal').modal('hide');
                                        GetDataGrid();
                                    }, 1000);
                                } else {
                                    self.prop('disabled', false);
                                    var mess = response.message == '' ? 'An error occurred while add league, please try again' : response.message;
                                    GetErrorPopup('#NoticeModal', mess);
                                }
                            }
                        })
                    });

                    $(".league-select").on("change", function () {
                        let leagueId = $(this).val();
                        $.ajax({
                            type: 'POST',
                            url: "/Admin/ManagementLeague/GetLeagueById",
                            data: { leagueId },
                            success: function (response) {
                                let iconCountry = response.countryIconVN ?? response.countryLogo ?? "/css/images/logo-dummy.png";
                                let iconLeague = response.iconVN ?? response.icon ?? "/css/images/logo-dummy.png";
                                $('#addLeagueId').val(leagueId);
                                $('#leagueIcon').html('<img src="' + iconLeague + '" />');
                                $('#countryIcon').html('<img src="' + iconCountry + '" />');
                                $('#country').html(response.countryEN);
                                $('#countryVN').html(response.countryVN);
                            }
                        });
                    });
                    validateNumber();
                }
            });
            validateForm();
        });
    }

    function Delete() {
        $('.btn-Delete').on('click', function () {
            id = $(this).data('id');
            $('#ConfirmModal .confirm-action').data('action', 'remove');
            $('#ConfirmModal .modal-body').html('Are you sure you want to remove this league ?');
            $('#ConfirmModal').modal('show');
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
        GetDataGrid();
        Add();
        handleModal();
       
    }

    return {
        init
    }
})(jQuery);



$(document).ready(function () {
    fixtureHomepage.init();
});