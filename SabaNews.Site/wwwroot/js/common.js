var _viewResource = {
    ConfirmPasswordEqualTo: 'Xác thực mật khẩu sai',
    ConfirmPasswordRequired: 'Hãy xác thực mật khẩu',
    EmailInvalid: 'Email không có thật',
    EmailRequired: 'Hãy nhập email',
    NameRequired: 'Hãy nhập tên',
    PasswordMinLength: 'Mật khẩu ít nhất 6 kí tự',
    PasswordRequired: 'Hãy nhập mật khẩu'
};
var _htmlResource = {
    ButtonCloseModal: '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
    ForgotPassword: '<div class="check-email"><div class="heading-noti">Thông báo</div>Hãy kiểm tra email <b>{0}</b> để xem hướng dẫn tạo mật khẩu mới.</div>',
    RegisterSuccessfully: '<h3 class="modal-title">Xác thực tài khoản</h3><div class="content-noti">Vui lòng kiểm tra email <b>{0}</b>  để xác thực và hoàn tất bước đăng ký tài khoản. Đừng quên kiểm tra cả thư mục spam/junk nhé!</div>',
    RegisterOldEmailNotConfirm: '<h3 class="modal-title">Xác thực tài khoản</h3><div class="content-noti">Email này đã đăng ký nhưng chưa được xác thực. Vui lòng kiểm tra email <b>{0}</b>  để xác thực và hoàn tất bước đăng ký tài khoản. Đừng quên kiểm tra cả thư mục spam/junk nhé!</div>',
    RemindCheckMail: '<div class="content-noti">Nếu bạn không tìm thấy email xác thực, nhấn <span>"Gửi lại"<span></div><div class="submit-auth"><button class="submit submit-noti resend-email"  data-email="{0}">Gửi lại</button></div>',
    ResetPasswordSuccessfully: '<h3>Đổi mật khẩu thành công</h3>',
    ResetButtonLogin: '<div class="auth-input">Bấm vào <span style="color:rgb(0,0,255); cursor: pointer; text-decoration:underline" class="auth-login" data-returnUrl="/">đây</span> để đăng nhập</div>'
};

function GetErrorPopup(popupId, msg) {
    $(popupId + ' .modal-title').removeClass('title-success').addClass('title-error');
    $(popupId + ' .title').html('<i class="icon-title icon-error-admin"></i> Error');
    $(popupId + ' .modal-body').html(msg);
    $(popupId).modal('show');
}

function GetSuccessPopup(popupId, msg) {
    $(popupId + ' .modal-title').removeClass('title-error').addClass('title-success');
    $(popupId + ' .title').html('<i class="icon-title icon-success-admin"></i> Successful');
    $(popupId + ' .modal-body').html(msg);
    $(popupId).modal('show');
}

function formatString(...args) {
    let text = args[0];
    for (let i = 1; i < args.length; i++) {
        let regEx = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        text = text.replace(regEx, args[i]);
    }
    return text;
};