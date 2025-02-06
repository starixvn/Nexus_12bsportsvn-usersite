
var edmDetail = (function ($) {
    var page = 1;
    var emailId = eId;
    var currentUserId = 0;
    var search = "";
    var filterClicked = -1;
    var status = -1;
    var pageSize = 10;

    function renderList() {
        $.ajax({
            url: '/Admin/Email/GetListEmailDetailData',
            type: 'POST',
            data: { emailId, page, search, filterClicked, status, pageSize },
            success: function (res) {
                $('.list_detail_content').html(res);
                HandleActionGridData();
            }
        });
    }

    function HandleSearch() {
        $('.search_email_detail').on('click', function () {
            search = $("input[name=search]").val();
            filterClicked = $("select[name=filterClicked]").val();
            status = $("select[name=status]").val();
            renderList();
        });
    }

    function HandleActionGridData() {
        $('.view_content').click(function () {
            var content = $(this).parent().find('.email_content').val();
            var title = $(this).parent().find('.email_title').val();
            $('#ViewEmailContent .modal-body').html(content);
            $('#ViewEmailContent .title').html(title);
            $('#ViewEmailContent').modal('show');
        });

        $('.paging').on('click', function () {
            page = $(this).data('page');
            renderList();

        });

        $('#page-size').on('change', function () {
            pageSize = $(this).val();
            page = 1;
            renderList();
        });

        $('.delete-detail').on('click', function () {
            emailId = $(this).data('emailid');
            currentUserId = $(this).data('userid');
            $('#ConfirmModal .modal-body').html('Are you sure you want to delete this email?');
            $('#ConfirmModal').modal('show');
            $('#ConfirmModal .confirm-action').data('action', 'delete');
        });

        $('.confirm-action').on('click', function () {
            $('#ConfirmModal').modal('hide');
            $.blockUI({ message: '<div class="loading"><div class="ring"></div></div>' });
            var action = $(this).data('action');
            if (action === "delete") {
                $.ajax({
                    url: "/Admin/Email/DeleteDetail",
                    type: "POST",
                    data: { emailId, userId: currentUserId },
                    success: function (res) {
                        $.unblockUI();
                        if (res.isSuccessful) {
                            GetSuccessPopup('#NoticeModal', 'Delete Email Successfully');
                        } else {
                            GetErrorPopup('#NoticeModal', 'An error occurred while delete email, please try again');
                        }
                    }
                });
            } 
        });

        $('.resend-email').on('click', function () {
            var userId = $(this).data('userid');
            $.blockUI({ message: '<div class="loading"><div class="ring"></div></div>' });
            $.ajax({
                url: "/Admin/Email/ResendEmail",
                type: "POST",
                data: { emailId, userId },
                success: function (response) {
                    $.unblockUI();
                    if (response.isSuccessful) {
                        GetSuccessPopup('#NoticeModal', 'Email has been sent successfully.');
                    } else {
                        GetErrorPopup('#NoticeModal', 'An error occurred while send email, please try again');
                    }
                }
            })
        });
    }

    function HandleResendAll() {
        $('.resend-all').on('click', function () {
            $.blockUI({ message: '<div class="loading"><div class="ring"></div></div>' });
            $.ajax({
                url: "/Admin/Email/ResendAll",
                type: "POST",
                data: { emailId },
                success: function (response) {
                    $.unblockUI();
                    var msg = response > 1 ? response + ' emails have' : 'Email has'
                    GetSuccessPopup('#NoticeModal', msg + ' been sent successfully.');
                    $('#NoticeModal').bind('hidden.bs.modal', function () {
                        location.reload();
                    });
                }
            });
        });
       
    }

    function CloseModalHandle() {
        $('#NoticeModal').on('hidden.bs.modal', function () {
            renderList();
        });
    }
 
    function init() {
        renderList();
        HandleSearch();
        HandleResendAll();
        CloseModalHandle();
    }

    return {
        init
    }

})(jQuery);


$(document).ready(function () {
    edmDetail.init();
});
