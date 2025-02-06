var adminEuro2024TeamPlayer = (function ($) {
    var teamId = window.teamId;

    function GetDataGrid() {
        $.ajax({
            url: "/Admin/Euro2024Management/GetPlayerGrid",
            type: 'POST',
            data: { teamId },
            success: function (res) {
                $('.data-grid').html(res);
                HandleEditPlayer();

                HandleDeletePlayer();
            }
        });
    }

    function HandleEditPlayer() {
        $('.btn-Edit').on('click', function () {
            var playerId = $(this).data('playerid');
            $.ajax({
                type: 'GET',
                url: "/Admin/Euro2024Management/EditPlayer",
                data: {playerId},
                success: function (html) {
                    $('#EditPlayerModel .modal-body').html(html);
                    $('#EditPlayerModel').modal('show');

                    $('.btn-save-edit').on('click', function () {
                        var self = $(this);
                        self.prop("disabled", true);
                        var playerId = $(this).data('id');

                        let icon = $('#icon')[0].files[0];
                        let currentIcon = $('#icon').parent().parent().parent().parent().find('.review_photo').attr('src');
                        let isDeletedIcon = currentIcon == '';

                        let formData = new FormData();
                        formData.append('playerId', playerId)
                        formData.append('teamId', teamId);
                        formData.append('playerName', $('#updatePlayer input[name=player-name]').val());
                        formData.append('playerFullName', $('#updatePlayer input[name=player-full-name]').val());
                        formData.append('birthday', $('#updatePlayer input[name=birthday]').val());
                        formData.append('shirtNumber', $('#updatePlayer input[name=shirt-number]').val());
                        formData.append('club', $('#updatePlayer input[name=club]').val());
                        formData.append('position', $('#updatePlayer .position-select').val());
                        formData.append('icon', icon);
                        formData.append('isDeletedIcon', isDeletedIcon);
                        $.ajax({
                            type: 'POST',
                            url: "/Admin/Euro2024Management/EditPlayer",
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function (response) {
                                self.prop("disabled", false);
                                if (response.isSuccessful) {
                                    $('#EditPlayerModel').modal('hide');
                                    GetSuccessPopup('#NoticeModal', 'Update Player successfully!');
                                    setTimeout(function () {
                                        $('#NoticeModal').modal('hide');
                                        GetDataGrid();
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

    function HandleDeletePlayer() {
        $('.btn-delete').on('click', function() {
            var playerId = $(this).data('playerid');
            $.ajax({
                type: 'POST',
                data: {playerId},
                url: '/Admin/Euro2024Management/DeletePlayer',
                success: function(res) {
                    if (res.isSuccessful) {
                        GetSuccessPopup('#NoticeModal', 'Delete Player successfully!');
                        setTimeout(function () {
                            $('#NoticeModal').modal('hide');
                            GetDataGrid();
                        }, 1000);
                    } else {
                        GetErrorPopup('#NoticeModal', 'An error occurred while add player, please try again');
                    }
                }
            })
        })
    }

    function HandleCreatePlayer() {
        $('.btn-create-player').on('click', function() {
            $('#CreatePlayerModel').modal('show');
        });
        $('.btn-save-create').on('click', function() {
            let formData = new FormData();
            formData.append('teamId', teamId);
            formData.append('playerName', $('input[name=player-name]').val());
            formData.append('playerFullName', $('input[name=player-full-name]').val());
            formData.append('birthday', $('input[name=birthday]').val());
            formData.append('shirtNumber', $('input[name=shirt-number]').val());
            formData.append('club', $('input[name=club]').val());
            formData.append('position', $('.position-select').val());
            formData.append('icon', $('.addPlayerIcon')[0].files[0]);
            $.ajax({
                type: 'POST',
                url: "/Admin/Euro2024Management/CreatePlayer",
                data: formData,
                processData: false,
                contentType: false,
                success: function(response)
                {
                    if (response.isSuccessful) {
                        $('#CreatePlayerModel').modal('hide');
                        GetSuccessPopup('#NoticeModal', 'Add player successfully!');
                        $('#updateMatch').trigger("reset");
                        setTimeout(function () {
                            $('#NoticeModal').modal('hide');
                            GetDataGrid();
                        }, 1000);
                    } else {
                        document.getElementById("btn-save-add").style.display = "inline-block";
                        GetErrorPopup('#NoticeModal', 'An error occurred while add player, please try again');
                    }
                }

            })
        })
    }

    function HandlePhoto() {
        $(document).on('change','.photo', function (e) {
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

        $(document).on('click','.cancel-upload', function () {
            var form = $(this).parent();
            CancelUploadHandler(form);
            $(this).hide();
        });
    }

    function ChangePhotoHanlder(form) {
        let review = $(form).parent().parent().parent();
        review.find('.cancel-upload').show();
        review.find('.review_photo').show();
        $(form).find('.photo-error').hide();

    }

    function CancelUploadHandler(form) {
        var input = $(form).parent().parent();
        console.log(input.find('.photo'));
        form.find('.review_photo').attr('src', '');
        form.find('.review_photo').hide();
        form.find('.cancel-upload').hide();
        input.find('.photo').val('');
    }

    function ValidatePhoto(files, self) {
        let isValid = true;
        let errorSection = self.parent().find('.photo-error');
        if (typeof files === "undefined") {
            errorSection.html("Please choose file first!");
            errorSection.show();
            return false;
        }
        let type_reg = /^image\/(jpg|webp|png|jpeg|bmp|gif|ico)$/;
        let fsize = files.size,
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


    function init() {
        GetDataGrid();
        HandleCreatePlayer();
        HandlePhoto();
    }

    return {
        init
    }
})(jQuery);


$(document).ready(function () {
    adminEuro2024TeamPlayer.init();
});