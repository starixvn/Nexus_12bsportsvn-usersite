var loginCaptcha;
var registerCaptcha;
var onloadCallback = function() {
    registerCaptcha = grecaptcha.render('register-captcha', {
      'sitekey' : '6Lc_0iIqAAAAABwLiZGn7mLKk955WasDv7nf4sT4'
    });

    loginCaptcha = grecaptcha.render('login-captcha', {
        'sitekey' : '6Lc_0iIqAAAAABwLiZGn7mLKk955WasDv7nf4sT4'
    });
  };

var auth = (function ($) {
    var mailFormat = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    var passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
    const EmailEmptyErr = "Hãy nhập email";
    const EmailIsValidErr = "Email không hợp lệ";
    const EmailExistedErr = "Email này đã tồn tại";
    const NameEmptyErr = "Hãy nhập tên";
    const PasswordEmptyErr = "Hãy nhập mật khẩu";
    const PasswordIsvalidErr = "Mật khẩu phải dài ít nhất 8 ký tự và bao gồm chữ cái viết hoa, số và ký tự đặc biệt";
    const ConfirmPasswordEmptyErr = "Hãy xác thực mật khẩu";
    const ConfirmPasswordIsvalidErr = "Mật khẩu không trùng khớp";
    const PhoneEmptyErr = "Hãy nhập số điện thoại";
    const PhoneIsvalidErr = "Số điện thoại không hợp lệ";
    var modal = "#modal-login";
    var returnUrl = "";
    let countPass = 1;

    function GetModalLogin(Url, openForm) {
        returnUrl = Url;
        $('.authModal').modal('hide');
        modal = openForm == 'login' ? '#modal-login' : '#modal-register';
        $('.summary-eror').hide();
        $('#form-login .captcha').hide();
        $(modal).modal('show');
    }

    function HandleAuth() {
        $(document).on('click', '.auth-input .auth-login', function (e) {
            e.preventDefault();
            grecaptcha.reset(loginCaptcha);
            returnUrl = $(this).data('returnurl');
            GetModalLogin(returnUrl, 'login');
        });
        $(document).on('click', '.register-form-open', function (e) {
            e.preventDefault();
            grecaptcha.reset(registerCaptcha);
            $('#form-register').trigger('reset');
            $('#form-register .submit-register').prop('disabled', false);
            returnUrl = $(this).data('returnurl');
            GetModalLogin(returnUrl, 'register');
        })

    }

    function HandleValidate() {
        $('input[name=email]').on('change', function () {
            let email = $(this).val();
            let err = GetErrorElement($(this));
            if (email === "") {
                SetErrorElement(err, EmailEmptyErr)
            } else if (!mailFormat.test(email)) {
                SetErrorElement(err, EmailIsValidErr)
            }
        });

        $('#form-register input[name=phone]').on('keypress', function (e) {
            let val = $(this).val();
            $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
            if ((e.which != 46 || val.indexOf('.') != -1 || val > max) && (e.which < 48 || e.which > 57)) {
                e.preventDefault();
            }
        });

        $('#form-register input[name=phone]').on('change', function () {
            let err = GetErrorElement($(this));
            let val = $(this).val();
            if (val === "") {
                SetErrorElement(err, PhoneEmptyErr)
            } else if(!val.startsWith("0") || val.length != 10) {
                SetErrorElement(err, PhoneIsvalidErr);
            }
        });


        $('#form-login input[name=password]').on('change', function () {
            let err = GetErrorElement($(this));
            let val = $(this).val();
            if (val === "") {
                let message = PasswordEmptyErr;
                SetErrorElement(err, message)
            } 
        });

        $('#form-register input[name=name]').on('change', function () {
            let err = GetErrorElement($(this));
            let val = $(this).val();
            if (val === "") {
                let message = NameEmptyErr;
                SetErrorElement(err, message)
            } 
        });

        $('#form-register input[name=password]').on('change', function () {
            let err = GetErrorElement($(this));
            let val = $(this).val();
            var resetPassword = $('#form-register input[name=confirmPassword]').val();
            var message = "";
            if (val === "") {
                message = PasswordEmptyErr;
            } else if(!passwordFormat.test(val)) {
                message = PasswordIsvalidErr;
            }
            if (message !== "") {
                SetErrorElement(err, message)
            }
            if (val !== resetPassword && resetPassword != "") {
                $('#form-register .confirm-password-group').addClass('error');
                $('#form-register .confirm-password-group .validate-error').html(ConfirmPasswordIsvalidErr);
            } else {
                $('#form-register .confirm-password-group').removeClass('error');
                $('#form-register .confirm-password-group .validate-error').html('');
            }
        });

        $('#form-register input[name=confirmPassword]').on('change', function () {
            let err = GetErrorElement($(this));
            let val = $(this).val();
            let password = $('#form-register .password-group').find('input[name=password]').val();
            let message = "";
            if (val === "") {
                message = ConfirmPasswordEmptyErr;
            } else if(val != password) {
                message = ConfirmPasswordIsvalidErr
            }
            if (message !== "") {
                SetErrorElement(err, message);
            }
        });

        function GetErrorElement(self) {
            let err = self.parent().parent();
            err.removeClass('error');
            err.find('.validate-error').html('');
            return err;
        }

        function SetErrorElement(err, mess) {
            err.addClass('error');
            err.find('.validate-error').html(mess);
        }
    }


    function HandleLogin() {
        $('#form-login .submit-login').on('click', function (e) {
            e.preventDefault();
            var email = $("#form-login  input[name=email]").val();
            var password = $("#form-login  input[name=password]").val();
            var isValid = true;
            var captcha = grecaptcha.getResponse(loginCaptcha);
            $("#form-login .form-group-auth").removeClass('error');
            $("#form-login .validate-error").html('');
            var self = $(this);

            if (!mailFormat.test(email) || email === "") {
                isValid = false
                var message = email === "" ? EmailEmptyErr : EmailIsValidErr;
                $("#form-login .email .validate-error").html(message);
                $("#form-login .email").addClass("error");
            }

            if (password === "" && $("#password-error").length == 0) {
                isValid = false
                $("#form-login .password .validate-error").html(PasswordEmptyErr);
                $("#form-login .password").addClass("error");
            }
            if($('.summary-eror').text() !== ''){
                countPass++;
                if(countPass >= 10){
                    $('#form-login .captcha').show();
                    if(captcha == '') {
                        isValid = false;
                        $('#form-login .captcha .validate-error').html('Xác nhận captcha');
                    }
                }
            }
            
            if (!isValid) {
                return false;
            }
            self.prop('disabled', true);

            $.ajax({
                url: '/Auth/Login',
                method: "POST",
                data: { email, password },
                success: function (res) {
                    console.log(res)
                    if (res.isSuccessful) {
                        if (typeof returnUrl === "undefined") {
                            location.reload();
                        } else {
                            location.href = returnUrl;
                        }
                    }
                    else {
                        $('.summary-eror').show();
                        $('.summary-eror').text(res.message);
                        self.prop('disabled', false);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + ': ' + errorThrown);
                }
            });
        })
    }

    function HandleRegister() {
        $('#form-register .submit-register').on('click', function (e) {
            e.preventDefault();
            var name = $("#form-register input[name=name]").val();
            var email = $("#form-register input[name=email]").val();
            var password = $("#form-register input[name=password]").val();
            var confirmPassword = $("#form-register input[name=confirmPassword]").val();
            var yearOfBirth = $('#form-register select[name=yearOfBirth]').val();
            var phone = $('#form-register input[name=phone]').val();
            var captcha = grecaptcha.getResponse(registerCaptcha);
            var self = $(this);
            let isValid = true;


            $('#form-register .form-group-auth').removeClass('error');
            $('#form-register  .validate-error').html('');
            if (name === "") {
                isValid = false;
                ShowErrHandle($("#form-register .name-group"), NameEmptyErr);
            }

            if (phone === '') {
                isValid = false;
                ShowErrHandle($("#form-register .phone-group"), PhoneEmptyErr);
            } else if (!phone.startsWith("0") || phone.length != 10) {
                isValid = false;
                ShowErrHandle($("#form-register .phone-group"), PhoneIsvalidErr);
            }

            if (!mailFormat.test(email) || email === "") {
                isValid = false;
                var msg = email === "" ? EmailEmptyErr : EmailIsValidErr;
                ShowErrHandle($("#form-register .email-group"), msg);
            }

            if (password === "" || !passwordFormat.test(password)) {
                isValid = false;
                var msg = password == "" ? PasswordEmptyErr : PasswordIsvalidErr;
                ShowErrHandle($("#form-register .password-group"), msg);
            }
            if (confirmPassword === "" || password != confirmPassword) {
                isValid = false;
                var msg = confirmPassword === "" ? ConfirmPasswordEmptyErr : ConfirmPasswordIsvalidErr;
                ShowErrHandle($("#form-register .confirm-password-group"), msg);
            }
            if(captcha == "") {
                isValid = false;
                $('.captcha .validate-error').html('Xác nhận captcha');
            }
            if (isValid) {
                self.prop('disabled', true);
                self.addClass('btn-disabled');
                $.ajax({
                    url: '/Auth/Register',
                    method: "POST",
                    data: { name, phone, yearOfBirth, email, password, confirmPassword },
                    success: function (res) {
                        if (res.isSuccessful) {
                            const html = _htmlResource.ButtonCloseModal + _htmlResource.RegisterSuccessfully + _htmlResource.RemindCheckMail;
                            const bodyModal = formatString(html, email, window.location.origin);
                            HandleNotificationPopup(bodyModal);
                        } else if(res.code == 2) {
                            const html = _htmlResource.ButtonCloseModal + _htmlResource.RegisterOldEmailNotConfirm + _htmlResource.RemindCheckMail;
                            const bodyModal = formatString(html, email, window.location.origin);
                            HandleNotificationPopup(bodyModal);
                        }
                         else {
                            $('.summary-eror').show();
                            $('.summary-eror').text(res.message);
                            self.prop('disabled', false);
                            self.removeClass('btn-disabled');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus + ': ' + errorThrown);
                    }
                });
            }
        })

        function ShowErrHandle(group, mess) {
            group.addClass('error');
            group.find('.validate-error').html(mess);
        }

    }

    function HandleCloseModal() {
        $('.authModal').on('hidden.bs.modal', function () {
            $('.auth-form .validate-error').html('');
            $('.auth-form').find('.form-group-auth').removeClass('error');
        });
    }

    function HandleForgotPassword() {
        $('#forgot-password').on('click', function (e) {
            e.preventDefault();
            $('.authModal').modal('hide');
            $('#modal-forgotpassword').modal('show');
            $("#form-forgot-password  .btn-resetpass").on('click', (e) => {
                e.preventDefault();
                HandleSubmitForgotPassword();
            });
        });
    }

    function HandleSubmitForgotPassword() {
        var email = $("#form-forgot-password input[name=email]").val();
        var isValid = true
        if (!mailFormat.test(email) || email == "") {
            isValid = false;
            var msg = email === "" ? EmailEmptyErr : EmailIsValidErr;
            $('#form-forgot-password .forgot-email').addClass('error');
            $('#form-forgot-password .validate-error').html(msg);
        }

        if(!isValid) {
            return false;
        }
        $("#form-forgot-password .btn-resetpass").prop('disabled', true);
        $("#form-forgot-password .btn-resetpass").addClass('btn-disabled');
        $.ajax({
            url: '/Auth/ForgotPassword',
            method: "POST",
            data: { email },
            success: function (res) {
                if (res.isSuccessful) {
                    const html = _htmlResource.ForgotPassword;
                    const bodyModal = formatString(html, email, email);
                    HandleNotificationPopup(bodyModal);
                } else {
                    $('.summary-eror').show();
                    $('.summary-eror').text(res.message);
                }
                $("#modal-forgotpassword .btn-resetpass").prop('disabled', false);
                $("#modal-forgotpassword .btn-resetpass").removeClass('btn-disabled');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus + ': ' + errorThrown);
            }
        });
    }

    function HandleResendConfirmEmail() {
        $('#modal-noti').find('.summary-eror').hide();
        $('#modal-noti').find('.summary-success').hide();
        $(document).on('click', '.resend-email' , function () {
            var self = $(this);
            var email = $(this).data('email');
            self.prop('disabled', true)
            self.addClass('btn-disabled');
            $.ajax({
                url: '/Auth/SendEmailConfirm',
                type: "POST",
                data: {email},
                success: function (res) {
                    if (!res.isSuccessful) {
                        if(res.code === 2) {
                            $('#modal-noti').find('.summary-success').show();
                            $('#modal-noti').find('.summary-success').text(res.message);
                        } else {
                            $('#modal-noti').find('.summary-eror').show();
                            $('#modal-noti').find('.summary-eror').text('Không thể gửi lại. Vui lòng thử lại sau!');
                            countdown(self);
                        }
                    } else {
                        self.prop('disabled', false);
                        self.removeClass('btn-disabled');
                        countdown(self);
                        
                    }
                    
                }
            });
        });
    }

    function HandleNotificationPopup(body) {
        $('.authModal').modal('hide');
        $('#modal-noti .summary-eror').hide();
        $('#modal-noti .noti-body').html(body);
        $('#modal-noti').modal('show');
    }

    function HandleModal(openForm) {
        if (openForm === 'register') {
            $('.nav-title').removeClass('active');
            $('#nav-register-tab').addClass('active');
            $('#nav-register').addClass('active');
            $('#nav-login').removeClass('active')
        } else {
            $('.nav-title').removeClass('active');
            $('#nav-register').removeClass('active');
            $('#nav-login').addClass('active')
            $('#nav-login-tab').addClass('active');
        }
        $('.nav-title').on('click', function () {
            var self = $(this);
            if (!self.hasClass('active')) {
                $('.nav-title').removeClass('active');
                $(this).addClass('active');
                if (self.attr('id') === 'nav-login-tab') {
                    $('#nav-login').addClass('active')
                    $('#nav-register').removeClass('active')
                } else {
                    $('#nav-register').addClass('active')
                    $('#nav-login').removeClass('active')
                }
            }
        });
    }

    $('.select-auth').on('change' , function () {
        $(this).addClass('change-color');
        if($(this).val()){
            $(this).addClass('change-color');
        }else{
            $(this).removeClass('change-color');
        }
    });

    function countdown(button) {
        timing = 60;
        $(button).html(`${timing}s`);
        $(button).prop('disabled', true);
        myTimer = setInterval(function() {
          --timing;
          $(button).html(`${timing}s`);
          if (timing <= 0) {
            clearInterval(myTimer);
            $(button).prop('disabled', false);
            $(button).html('Gửi lại');
          }
        }, 1000);
     }


    function init() {
        HandleAuth();
        HandleLogin();
        HandleRegister();
        HandleValidate();
        HandleForgotPassword();
        HandleResendConfirmEmail();
        HandleModal();
        HandleCloseModal();
    }

    return {
        init,
        GetModalLogin
    }
})(jQuery);

$(document).ready(function () {
    auth.init();
})

