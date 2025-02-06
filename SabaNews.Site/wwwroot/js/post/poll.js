var poll = (function ($) {
    function CheckAndInsertPoll() {
        var pollKeyword = 'wpdevart_pol'
        var re = new RegExp(pollKeyword, 'gi');
        var postContent = $('.content').html();
        var results = new Array();
        while (re.exec(postContent)) {
            results.push(re.lastIndex);
        }
        $.each(results, function (index, value) {
            var endPoll = postContent.indexOf("]", value);
            var str = postContent.substring(value - pollKeyword.length - 1, endPoll + 1);
            var attrs = str.split('"');
            if (attrs.length >= 5) {
                var attrClass = typeof attrs[5] != "undefined" ? attrs[5] : "";
                $.ajax({
                    type: "POST",
                    url: "/Post/GetPollData",
                    data: { questID: attrs[1], themeID: attrs[3] },
                    success: function (res) {
                        var content = $('.content').html();
                        var html = '<div class="pollevent ' + attrClass + ' question-' + attrs[1] + '" data-theme="' + attrs[3] + '" data-class="' + attrClass + '">';
                        html += res;
                        html += "</div>";
                        $('.content').html(content.replace(str, html));
                    }
                })
            }
        });
    }

    function UpdatePollData() {
        $(document).on('click', '.vote-answer', function () {
            var questionId = $(this).data('questid');
            var checked = $('input[name="poll-radio-' + questionId + '"]:checked');
            if (questionId <= 0 || checked.length <= 0) {
                $('#announcement .content').html('Bạn chưa chọn câu trả lời!');
                $('#announcement').modal('show');
                return false;
            }
            var answerId = checked.val();
            var themeId = $('.question-' + questionId).data('theme');
            $.ajax({
                type: "POST",
                url: "/Post/VotePoll",
                data: { questId: questionId, answerId, themeId },
                success: function (res) {
                    if (typeof res.isSuccessful == "undefined") {
                        $('.question-' + questionId).html(res);
                    } else {
                        $('#announcement .content').html('Đã có lỗi xảy ra, vui lòng thử lại!');
                        $('#announcement').modal('show');
                    }
                }
            });
        });

        $(document).on('click', '.view-result', function () {
            var questionId = $(this).data('questid');
            $('.poll-main-div-' + questionId).hide();
            $('.poll-result-' + questionId).show();
        });

        $(document).on('click', '.vote-section', function () {
            var questionId = $(this).data('questid');
            $('.poll-main-div-' + questionId).show();
            $('.poll-result-' + questionId).hide();
        });
        $(document).on('click', '.polllabel', function () {
            $(this).parent().parent().find(".poll-inputs").prop('checked', true);
        });

        $(document).on('click', '.poll-element', function () {
            $('.poll-element').removeClass('checked');
            $(this).find(".radio-input").prop('checked', true);
        })


        $(document).on('change', '.radio-input', function () {
            $('.poll-element').removeClass('active').removeClass('checked');
            $(this).parent().addClass('active');
        });
    }

    function init() {
        CheckAndInsertPoll();
        UpdatePollData();
    }

    return {
        init
    }
    
})(jQuery);

$(document).ready(function () {
    poll.init();
});



