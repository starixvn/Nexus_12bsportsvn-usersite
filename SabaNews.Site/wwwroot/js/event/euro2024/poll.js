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
                    url: "/Euro2024/GetArticlePollData",
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


    function init() {
        CheckAndInsertPoll();
    }

    return {
        init
    }
    
})(jQuery);

$(document).ready(function () {
    poll.init();
});



