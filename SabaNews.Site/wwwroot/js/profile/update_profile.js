var update_profile = (function ($) {
    const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
    const PasswordEmptyErr = "Hãy nhập mật khẩu";
    const PasswordIsvalidErr = "Mật khẩu phải dài ít nhất 8 ký tự và bao gồm chữ cái viết hoa, số và ký tự đặc biệt";
    const PhoneIsvalidErr = "Số điện thoại không hợp lệ";

    $('.validate-error').hide();

    function ToggleFormEdit() {
        $('.action').click(function (e) {
            e.preventDefault();
            $('.box-edit-form').removeClass('toggle-active-form')
            var formBox = $(this).parents('.group-table').find('.box-edit-form');
            formBox.addClass('toggle-active-form');
            formBox.find('input').not('input[type=radio]').val('');
            $('.validate-error').hide();
            $('.input-form').removeClass('error');
        })

        $('.close-edit').click(function (e) {
            e.preventDefault();
            $(this).parent().removeClass('toggle-active-form');
        })
    }
    function update_saved_post() {
        $('.remove_save_post').on('click', function () {
            var self = $(this);
            var pID = self.data('postid');
            $.ajax({
                type: "POST",
                url: "/Profile/SavePost",
                data: { postID: pID },
                success: function (response) {
                    if (response.isSuccessful) {    
                        self.parent().parent().parent().parent().parent().html('');
                    }
                }
            });
        });
    }

    function validate() {
        $('input[name=phone]').on('keyup', function () {
            var val = $(this).val();
            if (val.trim() === "") {
                DisabledButton('.btn-save-phone')
            } else {
                EnableButton('.btn-save-phone')
            }
        });

        $('input[name=name]').on('keyup', function () {
            var val = $(this).val();
            if (val.trim() === "") {
                DisabledButton('.btn-save-name')
            } else {
                EnableButton('.btn-save-name')
            }
        });

        $('input[name=gender]').on('click', function () {
            var val = $(this).val();
            if (val.trim() === "") {
                DisabledButton('.btn-save-gender')
            } else {
                EnableButton('.btn-save-gender')
            }
        });

        $('input[name=oldpassword], input[name=newpassword').on('keyup', function () {
            var oldPassword = $('input[name = oldpassword]').val();
            var newPassword = $('input[name=newpassword]').val();

            if (oldPassword === "" || newPassword === "") {
                DisabledButton('.btn-save-password')
            } else {
                EnableButton('.btn-save-password')
            }
        });
        $(".event-pass").on('click', function () {
            var self = $(this);
            if (self.hasClass('show-old-pass')) {
                self.hide();
                $('.hide-old-pass').show();
                $('input[name=oldpassword]').attr('type', 'text');
            } else if (self.hasClass('hide-old-pass')) {
                self.hide();
                $('.show-old-pass').show();
                $('input[name=oldpassword]').attr('type', 'password');
            }
            if (self.hasClass('show-new-pass')) {
                self.hide();
                $('.hide-new-pass').show();
                $('input[name=newpassword]').attr('type', 'text');
            } else if (self.hasClass('hide-new-pass')) {
                self.hide();
                $('.show-new-pass').show();
                $('input[name=newpassword]').attr('type', 'password');
            }
        });

    }

    function update_profile_info() {
        $('.btn-save-phone').on('click', function () {
            var phone = $('input[name=phone]').val();
            if (phone.trim() === "" || !phone.startsWith("0") || phone.length != 10) {
                ShowError('.phone-error', PhoneIsvalidErr)
                return false;
            }
            var currentPhone = $(this).data('phone');
            if (phone === currentPhone) {
                $('#form_update_phone').removeClass('toggle-active-form');
                return false;
            }

            UpdateInfoToDb('phone', phone, '#form_update_phone', '.phone-section')
        });

        $('.btn-save-name').on('click', function () {
            var name = $('input[name=name]').val();
            var currentName = $(this).data('name');
            if (name === currentName) {
                $('#form_update_name').removeClass('toggle-active-form');
                return false;
            }

            UpdateInfoToDb('name', name, '#form_update_name', '.name-section')

        });

        $('.btn-save-gender').on('click', function () {
            var gender = $('input[name=gender]:checked').val();
            if (gender.trim() === "") {
                $('.gender-error').show();
                return false;
            }
            var currentGender = $(this).data('gender');
            if (gender === currentGender) {
                $('#form_update_gender').removeClass('toggle-active-form');
                return false;
            }

            UpdateInfoToDb('gender', gender, '#form_update_gender', '.gender-section')
        });

        $('.btn-save-password').on('click', function () {
            var oldPassword = $('input[name =oldpassword]').val();
            var newPassword = $('input[name=newpassword]').val();
            ResetError('.old-password-error');
            ResetError('.new-password-error');
            var check = true;
            if (newPassword === "" || !passwordFormat.test(newPassword)) {
                check = false;
                var msg = newPassword == "" ? PasswordEmptyErr : PasswordIsvalidErr;
                ShowError('.new-password-error', msg)
            }
            if (!check) {
                return false;
            }

            $.ajax({
                type: 'POST',
                url: 'Profile/UpdateProfilePassword',
                data: { oldPassword: oldPassword, newPassword: newPassword },
                success: function (response) {
                    if (response.isSuccessful) {
                        $('#form_update_password').removeClass('toggle-active-form');
                    } else {
                        ShowError('.old-password-error', response.message)
                    }
                }
            });
        });

        $('.btn-save-yearOfBirth').on('click', function () {
            var yearOfBirth = $('select[name=yearOfBirth]').val();
            var current = $(this).data('year');
            if (yearOfBirth === current) {
                $('#form_update_yearOfBirth').removeClass('toggle-active-form');
                return false;
            }
            UpdateInfoToDb('year_of_birth', yearOfBirth, '#form_update_yearOfBirth', '.yearOfBirth-section')
        });

        $('#profile-forgot-password').on('click', function () {
            $.ajax({
                url: '/Auth/ForgotPassword',
                method: "POST",
                data: { email: email },
                success: function (res) {
                    if (res.isSuccessful) {
                        const html = '<div class="modal-title">Thông báo</div><div class="check-email">Hãy kiểm tra email <b>{0}</b> để xem hướng dẫn tạo mật khẩu mới.</div>';
                        const bodyModal = formatString(html, email, window.location.origin);
                        $('#resetPasswordSuccesful .modal-body').html(bodyModal);
                        $('#resetPasswordSuccesful').modal('show');
                    } 
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + ': ' + errorThrown);
                }
            });
        });

        $('#isSubscribe').on('change', function () {
            var value = $('#isSubscribe').is(":checked") ? 1 : 0;
            var currentValue = $('#current_subscribe').val();
            if (value == currentValue) {
                $('#resetPasswordSuccesful .modal-body').html("Cập nhật thông tin thành công!");
                $('#resetPasswordSuccesful').modal('show');
                return false;
            }
            $.ajax({
                type: 'POST',
                url: 'Profile/UpdateProfile',
                data: { type: 'subscribe', value: value },
                success: function (response) {
                    if (response.isSuccessful) {
                        var msg = '';
                        if (value === 1) {
                            msg = '<div class="modal-title">Thông báo</div><div class="check-email">Bạn đang theo dõi và nhận tin tức từ SABA Sports!</div>'
                        } else {
                            msg = '<div class="modal-title">Thông báo</div><div class="check-email">Bạn đã bỏ theo dõi thành công!</div>'
                        }
                        $('#current_subscribe').val(value);
                        $('#resetPasswordSuccesful .modal-body').html(msg);
                        $('#resetPasswordSuccesful').modal('show');
                    } else {
                        location.reload();
                    }

                }
            });

        });
    }


    function update_photo() {
        $('#uploadPhoto').on('submit', function (e) {
            e.preventDefault();
            $('.photo-error').hide();
            var files = $('input[name=photo]')[0].files[0];
            var isValid = validate_photo(files);
            if (!isValid) {
                return false;
            }

            var formData = new FormData();
            formData.append('file', files);
            $.ajax({
                type: 'POST',
                url: "Profile/UpdatePhoto",
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res.commandResult.isSuccessful) {
                        $('.photo-error').hide();
                        $('.save-img').hide();
                        $('.txt-img').css('display', 'flex');
                        $('#review_photo').attr('src', '');
                        $('#review_photo').hide();
                        $('.cancel-upload').hide();
                        $('.img-upload').hide();
                        $('.input-upload').show();
                        $('.controls__choose .profile').show();
                        $('.controls__choose .group-table').css('display' , 'flex');
                        $('input[name=photo]').val(null);
                        var html = '<img src="'+ res.linkPhoto +'"  width="300"/>';
                        $('.profile__avatar').html(html);
                        $('.profile__avatar').addClass('remove-bg');
                    } else {
                        location.reload();
                    }
                }
            });
        });

        $('input[name=photo]').on('change', function (e) {
            $('#review_photo').attr('src', '');
            $('#review_photo').hide();
            $('.cancel-upload').show();
            $('.img-upload').show();
            $('.controls__choose .profile').hide();
            $('.controls__choose .group-table').css('display' , 'block');
            var files = $('input[name=photo]')[0].files[0];
            var isValid = validate_photo(files);
            if (!isValid) {
                return false;
            }

            var reader = new FileReader();
            reader.readAsDataURL(files);
            reader.onload = function (e) {
                $('#review_photo').attr('src', e.target.result);
                $('#review_photo').show();
                $('.photo-error').hide();
            };
        });
        $('.cancel-upload').on('click', function () {
            $('input[name=photo]').val('');
            $('#review_photo').attr('src', '');
            $('#review_photo').hide();
            $('.cancel-upload').show();
            $('.save-img').hide();
            $('.input-upload').show();
            $('.img-upload').hide();
            $('.txt-img').css('display', 'flex');
            $('.controls__choose .profile').show();
            $('.controls__choose .group-table').css('display' , 'flex');
            $(this).hide();
        });

        $('.disconnect_social_login').on('click', function () {
            var id = $(this).data('id');
            var type = $(this).data('type');
            $.ajax({
                type: 'POST',
                data: { userId: id, type: type },
                url: 'Profile/SocialDisconnect',
                success: function (res) {
                    if (res.isSuccessful) {
                        $('#DisconnectSuccessful').find('.content').html("Ngắt liên kết thành công với "+ type);
                        $('#DisconnectSuccessful').modal('show');
                    }
                }
            });
        });
        $('#DisconnectSuccessful').on('hidden.bs.modal', function () {
            location.reload();
        });
       
        var errorConnect = typeof errorConnectSocial !== "undefined" && errorConnectSocial.toLowerCase() === 'true';
        if (errorConnect) {
            $('#ErrorConnectSocial').modal('show');
        }
    }

    function validate_photo(files) {
        var isValid = true;
        if (typeof files === "undefined") {
            $('.photo-error').html("Vui lòng chọn file trước!");
            $('.photo-error').show();
            return false;
        }
        var type_reg = /^image\/(jpg|png|jpeg|bmp|gif|ico)$/;
        var fsize = files.size,
            ftype = files.type,
            fname = files.name,
            fextension = fname.substring(fname.lastIndexOf('.') + 1);

        if (!type_reg.test(ftype)) {
            $('.photo-error').html("Kiểu file này được được phép!");
            $('.photo-error').show();
            return false;
        } else if (fsize > 3145728) {
            $('.photo-error').html("File quá lớn! Vui lòng chọn hình nhỏ hơn 3MB");
            $('.photo-error').show();
            return false;
        }
        $('.save-img').css('display', 'block');
        $('.txt-img').css('display', 'none');
        $('.input-upload').css('display' , 'none');

        return isValid;
    }

    function UpdateInfoToDb(type, value, form, section) {
        $.ajax({
            type: 'POST',
            url: 'Profile/UpdateProfile',
            data: { type: type, value: value },
            success: function (response) {
                if (response.isSuccessful) {
                    $(form).removeClass('toggle-active-form');
                    UpdateInfo(section,  value);
                } else {
                    location.reload();
                }
            }
        });
    }

    function ShowError(selector, msg) {
        $(selector).show();
        $(selector).html(msg);
        $(selector).parent().addClass('error');
    }

    function ResetError(selector) {
        $(selector).hide();
        $(selector).parent().removeClass('error');
    }

    function UpdateInfo(section, info) {
        $(section + ' .text-fill').html(info);
        $(section).parent().find('.social-action').html('Thay đổi');
    }

    function DisabledButton(element) {
        $(element).prop('disabled', true);
        $(element).addClass('btn-disabled');
    }

    function EnableButton(element) {
        $(element).prop('disabled', false);
        $(element).removeClass('btn-disabled');
    }


    function init() {
        ToggleFormEdit();
        update_saved_post();
        validate();
        update_profile_info();
        update_photo();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    update_profile.init();
});