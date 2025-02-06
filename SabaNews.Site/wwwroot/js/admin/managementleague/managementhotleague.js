let originIndex = 0, nextIndex = 0;
let adminManagementHotLeague = (function ($) {
    let url = "";
    function GetDataHotLeagueExtraGrid() {
        window.location.href = window.location.origin + "/Admin/ManagementLeague/GetManagementLeagueHotData";
    }

    function ChangePhotoHanlder(form) {
        let review = $(form).parent().parent().parent();
        review.find('.cancel-upload').show();
        review.find('.review_photo').show();
        $(form).find('.photo-error').hide();

    }

    function ValidatePhoto(files, self) {
        let isValid = true;
        let errorSection = self.parent().find('.photo-error');
        if (typeof files === "undefined") {
            errorSection.html("Please choose file first!");
            errorSection.show();
            return false;
        }
        let type_reg = /^image\/(jpg|png|jpeg|bmp|gif|ico)$/;
        let fsize = files.size,
            ftype = files.type;

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

    function initAddLeague(dateSort) {
        $.ajax({
            type: 'POST',
            url: '/Admin/ManagementLeague/GetAllLeagues',
            success: function (html) {
                $('#AddLeagueContent .title').html('Add League');
                $('#AddLeagueContent .modal-body').html(html);
                $('#AddLeagueContent').modal('show');

                $('.photo').on('change', function (e) {
                    let form = $(this).parent();
                    let files = $(this)[0].files[0];
                    let isValid = ValidatePhoto(files, $(this));
                    if (!isValid) {
                        CancelUploadHandler($(this).parent());
                        return false;
                    }
                    let review = $(this).parent().parent().parent().parent().find('.review_photo');

                    let reader = new FileReader();
                    reader.readAsDataURL(files);
                    reader.onload = function (e) {
                        review.attr('src', e.target.result);
                        ChangePhotoHanlder(form);
                    };
                });


                $("#leagueFullNameEN").select2();

                $("#leagueFullNameEN").on("change", function () {
                    let LeagueId = document.getElementById("leagueFullNameEN").value;
                    $.ajax({
                        type: 'POST',
                        url: "/Admin/ManagementLeague/GetLeagueById",
                        data: { LeagueId },
                        success: function (response) {
                            let iconCountry = response.countryIconVN ?? response.countryLogo ?? "/css/images/logo-dummy.png";
                            $("#iconContry").attr("src", iconCountry);
                            let iconLeague = response.iconVN ?? response.icon ?? "/css/images/logo-dummy.png";
                            $("#iconLeague").attr("src", iconLeague);
                            document.getElementById("addCountryEN").value = response.countryEN;
                            document.getElementById("addCountryVN").value = response.countryVN;
                            document.getElementById("addLeagueNameVN").value = response.leagueNameVN;
                            document.getElementById("addLeagueId").value = response.leagueId;
                        }
                    });
                });

                $('#btn-save-add').on('click', function () {
                    document.getElementById("btn-save-add").style.display = "none";
                    url = $(this).data('url');
                    let LeagueId = document.getElementById("leagueFullNameEN").value;
                    let IsMajor = document.getElementById("addMajor").checked;
                    let Priority = document.getElementById("addPriority").value;
                    let LeagueNameVN = document.getElementById("addLeagueNameVN").value;
                    let CountryVN = document.getElementById("addCountryVN").value;

                    let IconLeague = $('#addLeagueIcon')[0].files[0];
                    let currentIconLeague = $('#addLeagueIcon').parent().parent().parent().parent().find('.review_photo').attr('src');
                    let IsDeletedIconLeague = currentIconLeague == "/css/images/logo-dummy.png" ? true : false;

                    let IconCountry = $('#addCountryIcon')[0].files[0];
                    let currentCountry = $('#addCountryIcon').parent().parent().parent().parent().find('.review_photo').attr('src');
                    let IsDeletedIconCountry = currentCountry == "/css/images/logo-dummy.png" ? true : false;


                    let formData = new FormData();
                    formData.append('leagueId', LeagueId);
                    formData.append('isMajor', IsMajor);
                    formData.append('priority', Priority);
                    formData.append('leagueNameVN', LeagueNameVN);
                    formData.append('countryVN', CountryVN);
                    formData.append('iconLeague', IconLeague);
                    formData.append('isDeletedIconLeague', IsDeletedIconLeague);
                    formData.append('iconCountry', IconCountry);
                    formData.append('isDeletedIconCountry', IsDeletedIconCountry);

                    $.ajax({
                        type: 'POST',
                        url: url,
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            if (response.isSuccessful) {
                                $('#AddLeagueContent').modal('hide');

                                $('#NoticeModal' + ' .modal-title').removeClass('title-error').addClass('title-success');
                                $('#NoticeModal' + ' .title').html('<i class="icon-title icon-success-admin"></i> Successful');
                                $('#NoticeModal' + ' .modal-body').html('League was successfully added!');
                                $('#NoticeModal').modal('show');

                                setTimeout(function () {
                                    $('#NoticeModal').modal('hide');
                                    GetDataHotLeagueExtraGrid();
                                }, 1000);
                            } else {
                                document.getElementById("btn-save-add").style.display = "inline-block";

                                $('#NoticeModal' + ' .modal-title').removeClass('title-success').addClass('title-error');
                                $('#NoticeModal' + ' .title').html('<i class="icon-title icon-error-admin"></i> Error');
                                $('#NoticeModal' + ' .modal-body').html('An error occurred while add league, please try again');
                                $('#NoticeModal').modal('show');
                            }
                        }
                    });
                });
            }
        })
    }

    function initFilterBtn() {
        $('.btn_league').click(function () {
            initAddLeague();
        });

        $('.btn_major_league').click(function () {
            window.location.href = window.location.origin + "/Admin/ManagementLeague/Index";
        });

        $('.btn-Delete').on('click', function () {
            url = $(this).data('url');
            $('#ConfirmModal .confirm-action').data('action', 'remove');
            $('#ConfirmModal .modal-body').html('Are you sure you want to remove this league ?');
            $('#ConfirmModal').modal('show');
        });
    }

    function HandleModal() {
        $('.confirm-action').on('click', function () {
            if (url == "") {
                return false;
            }
            $.ajax({
                type: 'POST',
                url: url,
                success: function (response) {
                    $('#ConfirmModal').modal('hide');
                    if (response.isSuccessful) {
                        $('#NoticeModal' + ' .modal-title').removeClass('title-error').addClass('title-success');
                        $('#NoticeModal' + ' .title').html('<i class="icon-title icon-success-admin"></i> Successful');
                        $('#NoticeModal' + ' .modal-body').html('Remove league successfully!');
                        $('#NoticeModal').modal('show');

                        setTimeout(function () {
                            $('#NoticeModal').modal('hide');
                            GetDataHotLeagueExtraGrid();
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
        initFilterBtn();
        HandleModal();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    adminManagementHotLeague.init();
    $(function () {
        $("#tblLocations").sortable({
            items: 'tr:not(tr:first-child)',
            cursor: 'pointer',
            axis: 'y',
            dropOnEmpty: false,
            start: function (e, ui) {
                originIndex = ui.item[0].children[0].innerText;
                ui.item.addClass("selected");
            },
            stop: function (e, ui) {
                $(this).find("tr").each(function (index) {
                    if (index > 0) {
                        $(this).find("td").eq(0).html(index);
                    }
                });
                nextIndex = ui.item[0].children[0].innerText;
                ui.item.removeClass("selected");
                $.ajax({
                    type: 'POST',
                    url: "/Admin/ManagementLeague/UpdatePriority",
                    data: { originIndex, nextIndex }
                });
            },
            receive: function (e, ui) {
                $(this).find("tbody").append(ui.item);
            }
        });
    });
});