var pollAdmin = (function ($) {
    var id = 0;
    
    function GetDataGrid() {
        $('.poll-list').select2();
        $('.poll-list').on('change', function(){
            var question = $(this).find(':selected').data('question');
            $('.poll-question').html(question);
            $(this).parent().parent().find('.poll-id').val($(this).val());
        })

        $('.poll-id').on('change', function() {
            var id = $(this).val();
            $('.poll-list').val(id).change();
        });

        $('.btn-save-poll').on('click', function() {
            var pollId = $('.poll-list').find(':selected').val();
            var self = $(this);
            self.prop('disabled', true);
            if(pollId <= 0) {
                return null;
            }
            $.ajax({
                type: 'POST',
                data:{ pollId },
                url: "/Admin/HomepageManagement/UpdatePoll",
                success: function(res) {
                    if (res.isSuccessful) {
                        GetSuccessPopup('#NoticeModal', 'Poll was successfully changed!');
                        setTimeout(function () {
                            $('#NoticeModal').modal('hide');
                            GetDataGrid();
                        }, 1000);
                    } else {
                        self.prop('disabled', false);
                        var mess = response.message == '' ? 'An error occurred while add league, please try again' : response.message;
                        GetErrorPopup('#NoticeModal', mess);
                    }
                    self.prop('disabled', false);

                }
            })
        });
    };

    function init() {
        GetDataGrid();
    }

    return {
        init
    }
})(jQuery);



$(document).ready(function () {
    pollAdmin.init();
});