var edmList = (function ($) {
    var page = 1;
    var search = "";
    var fromDate = $('input[name=fromDate]').val();
    var toDate = $('input[name=toDate]').val();
    var status = -1;
    var createdBy = -1;
    var emailId = 0;
    var pageSize = 10;

    function renderListEmail() {
        $.ajax({
            url: "/Admin/Email/GetListEmailData",
            type: 'POST',
            data: { page, search, fromDate, toDate, status, createdBy, pageSize },
            success: function (res) {
                $('.list_email_block').html(res);
                HandleGridData();
            }
        });
    }

    function HandleSearch() {
        $('.search_list_email').on('click', function () {
            search = $('input[name=search]').val();
            fromDate = $('input[name=fromDate]').val();
            toDate = $('input[name=toDate]').val();
            status = $('select[name=status]').val();
            createdBy = $('select[name=createdBy]').val();
            page = 1;
            renderListEmail();
        });

      
    }

    function HandleGridData() {
        $('.view_content').click(function () {
            var content = $(this).parent().find('.email_content').val();
            var title = $(this).parent().find('.email_title').val();
            $('#ViewEmailContent .modal-body').html(content);
            $('#ViewEmailContent .title').html(title);
            $('#ViewEmailContent').modal('show');
        });

        $('.paging').on('click', function () {
            page = $(this).data('page');
            renderListEmail();

        });

        $('#page-size').on('change', function () {
            pageSize = $(this).val();
            page = 1;
            renderListEmail();
        });

        $('.delete-email').on('click', function () {
            emailId = $(this).data('emailid');
            $('#ConfirmModal .modal-body').html('Are you sure you want to delete this email?');
            $('#ConfirmModal').modal('show');
            $('#ConfirmModal .confirm-action').data('action', 'delete');
        });
       

        $('.send-email').on('click', function () {
            emailId = $(this).data('emailid');
            $('#ConfirmModal .modal-body').html('Are you sure you want to send this email to all members?');
            $('#ConfirmModal').modal('show');
            $('#ConfirmModal .confirm-action').data('action', 'send');
        });
    }

    function HandleModal() {
        $('.confirm-action').on('click', function () {
            $('#ConfirmModal').modal('hide');
            $.blockUI({ message: '<div class="loading"><div class="ring"></div></div>' });
            var action = $(this).data('action');
            if (action === "delete") {
                $.ajax({
                    url: "/Admin/Email/Delete",
                    type: "POST",
                    data: { emailId },
                    success: function (res) {
                        $.unblockUI();
                        if (res.isSuccessful) {
                            GetSuccessPopup('#NoticeModal', 'Delete Email Successfully');
                        } else {
                            GetErrorPopup('#NoticeModal', 'An error occurred while delete email, please try again');
                        }
                    }
                });
            } else if(action === "send") {
                $.ajax({
                    url: "/Admin/Email/SendEmail",
                    type: "POST",
                    data: { emailId },
                    success: function (res) {
                        $.unblockUI();
                        if (res.result.isSuccessful) {
                            var msg = res.userNumber > 1 ? res.userNumber + ' emails have' : 'Email has'
                            GetSuccessPopup('#NoticeModal', msg + ' been sent successfully.');
                        } else {
                            GetErrorPopup('#NoticeModal', 'An error occurred while send email, please try again');
                        }
                    }
                });
            }
        });

        $('#NoticeModal').on('hidden.bs.modal', function () {
            renderListEmail();
        });
    }

    function init() {
        HandleSearch();
        renderListEmail();
        HandleModal();
    }

    return {
        init
    }

})(jQuery);


$(document).ready(function () {
    edmList.init();
});
