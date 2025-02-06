var edmCreate = (function ($) {
    var form = 'form#form-sendmail';
    function ConfigCkeditorContent() {
        CKEDITOR.replace('emailContent', {
            fullPage: true,
            autoGrow_onStartup: true,
            allowedContent: true,
            height: 1000,
            filebrowserUploadUrl: '/Admin/UploadManagement/UploadImageSendMail',
            filebrowserUploadMethod: 'form',
            filebrowserBrowseUrl: '/Admin/UploadManagement/FileBrowse'
        });

        CKEDITOR.on('instanceReady', function (ev) {
            var editor = ev.editor,
                dataProcessor = editor.dataProcessor,
                htmlFilter = dataProcessor && dataProcessor.htmlFilter;

            htmlFilter.addRules({
                elements: {
                    $: function (element) {
                        // Output dimensions of images as width and height attributes on src
                        if (element.name == 'img') {
                            var style = element.attributes.style;
                            if (style) {
                                // Get the width from the style.
                                var match = /(?:^|\s)width\s*:\s*(\d+)px/i.exec(style),
                                    width = match && match[1];

                                // Get the height from the style.
                                match = /(?:^|\s)height\s*:\s*(\d+)px/i.exec(style);
                                var height = match && match[1];
                                element.attributes['width'] = width;
                                element.attributes['height'] = height;
                            }
                        }
                    }
                }
            });
        });
    }
    function HandleValidate() {
        var isValid = true;
        var users = $("#users").val();
        if (CKEDITOR.instances.emailContent.getData().trim() === "") {
            $('.email_content .help-block').html('Email Content is required');
            isValid = false;
        }
        if ($('input[name="emailTitle"]').val() === "") {
            $('input[name="emailTitle"]').addClass('has-error');
            $('.email_title .help-block').html('Subject is required');
            isValid = false;
        }
        if (typeof users !== "undefined" && users.length === 0) {
            $('.users-block .help-block').html('Select users to send');
            isValid = false;
        }
        return isValid;
    }

    function HandleProcessForm() {
        $('#users').multiselect({
            includeSelectAllOption: true, // add select all option as usual
            filterPlaceholder: 'Search',
            enableCaseInsensitiveFiltering: true,
            enableFiltering: true,
            maxHeight: 200,
            buttonWidth: '80rem',
            buttomPadding: '10rem',
            numberDisplayed: 6
        });
        $('input[name="emailTitle"], input[name="emailReturnLink"]').on('keyup', function () {
            $(this).parent().find('.help-block').html('');
            $(this).removeClass('has-error');
            $('.email_content .help-block').html('');
        });


        $('input[name=emailReturnLink]').on('keyup', function () {
            var value = $(this).val();
            var baseUrl = $('#baseUrl').val();
            var rawLink = baseUrl + '&returnUrl=' + value;
            $('#embeddedLink').val(rawLink);
            $('.raw_link').html(rawLink);
            if (value !== "") {
                $('.group_raw_link').show()
            } else {
                $('.group_raw_link').hide()
            }
        });

        $('.copy-link').on("click", function () {
            var self = $(this);
            var dummy = document.createElement('input'),
                text = $('#embeddedLink').val();

            console.log(text);
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            $(this).parent().find('.tip').show();
            setTimeout(function () {
                self.parent().find('.tip').hide();
            }, 1000);
        });
    }

    function HandleClick() {
        var saveAndSendUrl = "";
        $('.btn-send-mail').on('click', function (e) {
            e.preventDefault();
            saveAndSendUrl = "/Admin/Email/SaveAndSendCreate";
            var isValid = HandleValidate();
            if (isValid) {
                $('#ConfirmModal .modal-body').html('Are you sure you want to send this email to all members?');
                $('#ConfirmModal').modal('show');
            }
        });

        $('.btn-save-as-draft').on('click', function (e) {
            e.preventDefault();
            HandleSubmit("/Admin/Email/SaveCreate");
        });

        $('.btn-send-mail-edit').on('click', function (e) {
            e.preventDefault();
            var isValid = HandleValidate();
            saveAndSendUrl = "/Admin/Email/SaveAndSendEdit";
            if (isValid) {
                $('#ConfirmModal .modal-body').html('Are you sure you want to send this email to all members?');
                $('#ConfirmModal').modal('show');
            }
        });

        $('.btn-save-as-draft-edit').on('click', function (e) {
            e.preventDefault();
            HandleSubmit("/Admin/Email/SaveEdit");
        });

        $('.btn-save-as-edit').on('click', function (e) {
            e.preventDefault();
            HandleSubmit("/Admin/Email/SaveEdit");
        });

        $('.btn-save-edit-detail').on('click', function (e) {
            e.preventDefault();
            HandleSubmit("/Admin/Email/SaveEditDetail");
        });

        $('.btn-save-and-send-edit-detail').on('click', function (e) {
            e.preventDefault();
            HandleSubmit("/Admin/Email/SaveAndSendEditDetail");
        });


        $('.confirm-action').on('click', function () {
            $('#ConfirmModal').modal('hide');
            HandleSubmit(saveAndSendUrl);
        });
    }

    function HandleSubmit(url) {
        var isValid = HandleValidate();
        if (!isValid) return false;
        var data = $(form).serialize();
        var emailContent = CKEDITOR.instances.emailContent.getData();
        data += "&emailContent=" + encodeURIComponent(emailContent);
        $('.button').prop('disabled', true);
        $.blockUI({ message: '<div class="loading"><div class="ring"></div></div>' });
        var users = $("#users").val();
        if (typeof users !== "undefined") {
            data += "&users=" + users.toString();
        }
        
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            success: function (res) {
                $.unblockUI();
                result = res.result;
                html = "";
                if (result.isSuccessful && res.userNumber != null) {
                    var msg = res.userNumber > 1 ? res.userNumber + ' emails have' : 'Email has'
                    html = msg + ' been sent successfully.';
                    GetSuccessPopup('#NoticeModal', html);
                } else if (result.isSuccessful) {
                    html = 'Email has been saved successfully.';
                    GetSuccessPopup('#NoticeModal', html);
                   
                } else {
                    GetErrorPopup('#NoticeModal', result.message);
                }
                $('#NoticeModal').bind('hidden.bs.modal', function () {
                    if (typeof res.redirectLink !== "undefined") {
                        window.location.href = res.redirectLink;
                    } else {
                        location.reload();
                    }
                });

               
                
                $('.group_raw_link').hide();
            },

        });
    }

    function HandleTestSendEmail() {
        $('.btn-test').on('click', function () {
            var isValid = HandleValidate();
            if (isValid) {
                $('#TestSendEmail').modal('show');
            }
        });


        $('input[name=sendTo]').on('change', function () {
            var type = $(this).val()
            if (type === "email") {
                $('.user_list').hide();
            } else {
                $('.user_list').show();
            }
        });

        $('.user').on('change', function () {
            var email = $(this).find(':selected').data('email');
            $('#email').val(email);
        })

        $('.submit-test-send-email').on('click', function () {
            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!regex.test($('input[name="emailAddress"]').val())) {
                $('input[name="emailAddress"]').addClass('has-error');
                $('.email .help-block').html('Please enter email format');
                return false;
            }
            $('#TestSendEmail').modal('hide');
            var data = $(form).serialize();
            data += "&emailContent=" + encodeURIComponent(CKEDITOR.instances.emailContent.getData());
            data += "&emailAddress=" + $('input[name=emailAddress]').val();
            $.ajax({
                url: "/Admin/Email/TestSendEmail",
                type: "POST",
                data: data,
                success: function (res) {
                    if (res.isSuccessful) {
                        var msg = 'Email has been sent successfully, please check your mailbox.';
                        GetSuccessPopup('#NoticeModal', msg);
                    } else {
                        var msg = 'An error occurred while send email, please try again';
                        GetErrorPopup('#NoticeModal', msg)
                    }
                    $('#NoticeModal').unbind('hidden.bs.modal');
                }
            });

        });
    }

    function init() {
        ConfigCkeditorContent();
        HandleProcessForm();
        HandleClick();
        HandleTestSendEmail();
    }

    return {
        init
    }
})(jQuery);


$(document).ready(function () {
    edmCreate.init();
});
