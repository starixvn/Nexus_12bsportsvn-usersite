var banner = (function ($) {

    function UpdateBannerInfo() {
        $('.btn-save-navigation').on('click', function () {
            var value = $(this).parent().find('input[name=NavigationUrl]').val();
            var current = $(this).data('current');
            if (value === current) {
                $(this).parent().removeClass('toggle-active-form');
                return false;
            }
            var type = $(this).data('type');
            SaveNavigationData(value, type);
        });
    }

    function SaveNavigationData(value, type) {
        $.ajax({
            type: 'POST',
            url: '/Admin/BannerManagement/UpdateInfo',
            data: { value: value, type: type },
            success: function (res) {
                if (res.isSuccessful) {
                    var msg = 'Update Info Succesfully'
                    GetSuccessPopup('#NoticeModal', msg);
                } else {
                    GetErrorPopup('#NoticeModal', res.message);
                }
                $('#NoticeModal').bind('hidden.bs.modal', function () {
                    location.reload();
                });
            }
        });
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
            errorSection.html("Sorry, this file type is not permitted for security reasons!");
            errorSection.show();
            return false;
        } else if (fsize > 3145728) {
            errorSection.html("Exceeds the maximum upload size for this site.");
            errorSection.show();
            return false;
        }
        return isValid;
    }

    function UploadBannerProcess() {
        $('.upload-banner').on('submit', function (e) {
            e.preventDefault();
            $('.photo-error').hide();
            var action = $(this).data('action');
            var type = $(this).data('type');
            if (action === 'upload') {
                UploadAndUpdateBanner(type, $(this));
            } else if (action == 'update') {
                UpdateBanner(type, $(this));
            }
        });

        $('.photo').on('change', function (e) {
            var form = '#' + $(this).parent().parent().attr('id');
            var files = $(this)[0].files[0];
            var isValid = ValidatePhoto(files, $(this));
            if (!isValid) {
                CancelUploadHandler(form);
                return false;
            }
        
            var reader = new FileReader();
            reader.readAsDataURL(files);
            reader.onload = function (e) {
                $(form + ' .review_photo').attr('src', e.target.result);
                $(form).attr('data-action', 'upload');
                ChangePhotoHanlder(form);
            };
        });

        $('.cancel-upload').on('click', function () {
            var form = '#' + $(this).parent().parent().parent().attr('id');
            CancelUploadHandler(form);
            $(this).hide();
        });

        $('.list-banner').on('click', function () {
            var form = $(this).parent().parent().find('form').attr('id');
            $.ajax({
                type: 'POST',
                url: '/Admin/UploadManagement/ListBanner',
                success: function (res) {
                    $('#ListBannerModal .modal-body').html(res);
                    $('#ListBannerModal .modal-body').attr('data-form', form);
                    $('#ListBannerModal').modal('show');
                }
            });
        });

        $(document).on('click', '.crop', function () {
            var form = "#" + $(this).parent().parent().attr('data-form');
            var url = $(this).data('url');
            $(form + ' .review_photo').attr('src', url);
            $(form).attr('data-action', 'update');
            ChangePhotoHanlder(form);
            $('#ListBannerModal').modal('hide');
        });

        $('.input-banner-url').on('keyup', function(){
            var url = $(this).val();
            var form = "#" + $(this).parent().parent().find('form').attr('id');
            $(form + ' .review_photo').attr('src', url);
            $(form).attr('data-action', 'update');
            ChangePhotoHanlder(form);
        });
    };

    function ChangePhotoHanlder(form) {
        $(form + ' .review_photo').show();
        $(form + ' .photo-error').hide();
        $(form + ' .save-img').css('display', 'block');
        $(form + ' .txt-img').css('display', 'none');
        $(form + ' .cancel-upload').show();
    }

    function CancelUploadHandler(form) {
        $(form + ' .review_photo').attr('src', '');
        $(form + ' .review_photo').hide();
        $(form + ' .save-img').hide();
        $(form + ' .txt-img').css('display', 'flex');
        $(form + ' .cancel-upload').hide();
    }

    function UploadAndUpdateBanner(type, self) {
        var files = self.find('.photo')[0].files[0];
        var isValid = ValidatePhoto(files, self);
        if (!isValid) {
            return false;
        }

        var formData = new FormData();
        formData.append('file', files);
        formData.append('type', type);
        $.ajax({
            type: 'POST',
            url: "/Admin/BannerManagement/UploadBanner",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                if (res.isSuccessful) {
                    var msg = 'upload new banner Succesfully'
                    GetSuccessPopup('#NoticeModal', msg);
                } else {
                    GetErrorPopup('#NoticeModal', res.message);
                }
                $('#NoticeModal').bind('hidden.bs.modal', function () {
                    location.reload();
                });
            }
        });
    }

    function UpdateBanner(type, self) {
        var value = self.find('.review_photo').attr('src');
        if (value.trim() === '' || value.trim() === '#') {
            return false;
        }
        $.ajax({
            type: 'POST',
            url: '/Admin/BannerManagement/UpdateInfo',
            data: { value, type },
            success: function (res) {
                if (res.isSuccessful) {
                    var msg = 'upload new banner Succesfully'
                    GetSuccessPopup('#NoticeModal', msg);
                } else {
                    GetErrorPopup('#NoticeModal', res.message);
                }
                $('#NoticeModal').bind('hidden.bs.modal', function () {
                    location.reload();
                });
            }
        })
    }

    function RemoveBanner() {
        $('.remove').on('click', function () {
            var type = $(this).data("type");
            $('#ConfirmModal .confirm-action').data('type', type);
            $('#ConfirmModal .modal-body').html('Are you sure you want to remove this banner?');
            $('#ConfirmModal').modal('show');
        });

        $('.confirm-action').on('click', function () {
            $('#ConfirmModal').modal('hide');
            var type = $(this).data("type");
            if (type == null || type.trim() === "") {
                return false;
            }
            $.ajax({
                type: 'POST',
                url: '/Admin/BannerManagement/UpdateInfo',
                data: { type, value: "" },
                success: function (res) {
                    if (res.isSuccessful) {
                        var msg = 'remove banner succesfully';
                        GetSuccessPopup('#NoticeModal', msg);
                    } else {
                        GetErrorPopup('#NoticeModal', res.message);
                    }
                    $('#NoticeModal').bind('hidden.bs.modal', function () {
                        location.reload();
                    });
                }
            });
        });
    }

    function init() {
        UpdateBannerInfo();
        UploadBannerProcess();
        RemoveBanner();
    }
    return {
        init
    }
})(jQuery);


$(document).ready(function () {
    banner.init();
});
