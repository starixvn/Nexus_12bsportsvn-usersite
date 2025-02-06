var authReset = (function ($) {
    const PasswordEmptyErr = "Hãy nhập mật khẩu";
    const PasswordIsvalidErr = "Mật khẩu phải dài ít nhất 8 ký tự và bao gồm chữ cái viết hoa, số và ký tự đặc biệt";
    const ConfirmPasswordEmptyErr = "Hãy xác thực mật khẩu";
    const ConfirmPasswordIsvalidErr = "Mật khẩu không trùng khớp";
    var passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
    function HandleResetPassword() {
        const form = 'form#form-reset-password';
        $('form#form-reset-password .btn-resetpass').on('click', function() {
            var isValid = true;
            var password = $(form + " input[name=password]").val();
            var confirmPassword = $(form + " input[name=confirmPassword]").val();
            console.log(password, confirmPassword)
            $(form + " .validate-error").show();
            $(form + " .validate-error").html('');
            $(form + " .form-group-auth").removeClass('error');

            if (password === "" || !passwordFormat.test(password)) {
                isValid = false;
                var msg = password == "" ? PasswordEmptyErr : PasswordIsvalidErr;
                $(form + " .password .validate-error").html(msg);
                $(form + " .password").addClass('error');
            }
            if (confirmPassword === "" || password != confirmPassword) {
                isValid = false;
                var msg = confirmPassword === "" ? ConfirmPasswordEmptyErr : ConfirmPasswordIsvalidErr;
                $(form + " .new-password .validate-error").html(msg);
                $(form + " .new-password ").addClass('error');
            }

            if(!isValid) {
                return false;
            }
            $(this).prop('disabled', true);
            $(this).addClass('btn-disabled');

            $.ajax({
                url: '/Auth/ResetPassword',
                method: "POST",
                data: $(form).serialize(),
                success: function (res) {
                    if (res.isSuccessful) {
                        $('.reset-action').hide();
                        $('.reset-success').show();
                    } else {
                        $(form).find('.summary-eror').text(res.message);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + ': ' + errorThrown);
                }
            });

        });
    }

    function init() {
        HandleResetPassword();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    authReset.init();
})