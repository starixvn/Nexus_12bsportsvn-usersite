var euro2024 = (function ($) {
    function GetPollDetail() {
        if($('.euro-poll').length == 0)
        {
            return false;
        }
        $.ajax({
            type:'POST',
            url: "/Euro2024/GetPollData",
            success: function(res) {
                $('.euro-poll').html(res);
            }
        })
    };
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
            var themeId = 1;
            var mainPollClass = $(this).parent().parent().parent().parent().attr('class');
            var isHome = mainPollClass == "euro-poll";
            var bodyClass = isHome ? "euro-poll" : "question-" + questionId;
            $.ajax({
                type: "POST",
                url: "/Euro2024/VotePoll",
                data: { questId: questionId, answerId, themeId, isHome },
                success: function (res) {
                    if (typeof res.isSuccessful == "undefined") {
                        $('.' + bodyClass).html(res);
                    } else {
                        $('#announcement .content').html('Đã có lỗi xảy ra, vui lòng thử lại!');
                        $('#announcement').modal('show');
                    }
                }
            });
        });

        $(document).on('click', '.view-result', function () {
            $('.poll-main').hide();
            $('.poll-result').show();
        });

        $(document).on('click', '.vote-section', function () {
            $('.poll-main').show();
            $('.poll-result').hide();
        });
        $(document).on('click', '.polllabel', function () {
            $(this).parent().parent().find(".poll-inputs").prop('checked', true);
        });

        $(document).on('click', '.poll-element', function () {
            $('.poll-element').removeClass('checked');
            $(this).addClass('checked');
            $('.vote-answer').removeClass('disabled');
            $(this).find(".radio-input").prop('checked', true);
        })
    }

    function GetTopScorerData()
    {
        if($('.euro-top-scorer').length == 0)
        {
            return false;
        }
        $.ajax({
            url: '/Euro2024/GetTopScorers',
            type: 'POST',
        }).done(function (data) {
            $('.euro-top-scorer').html(data);
        })
    }

    function getStandings() {
        if($('.euro-top-standing').length === 0) {
            return false;
        }
        $.ajax({
            url: '/Euro2024/GetStandings',
            type: 'GET',
            beforeSend: function() {
            },
        }).done(function (data) {
            $('.euro-top-standing').html(data);
        })
    }
    function HandleStandingTab () {
        $(document).on('click', '.nav-tab-js li', function(){
            console.log( $(this).attr('data-id'));
            $('.nav-tab-js li').removeClass('active');
            $(this).addClass('active');
            let currentTab = $(this).attr('data-id');
            $('.tab-content .wc-table-body').hide();
            $('.' + currentTab).show();
            return false;
        });
    }

    function HandleVideo() {
        $('.euro-play-video').on('click', function () {
            var slide = $(this).parent().parent();
            if (!slide.hasClass("active")) {
                $('.play_video').html('');
                $('.img-item').show();
                $('.swiper-slide').removeClass("active");
                $('.slide-video .card-item').first().addClass("active");
                var iframe = $(this).parent().parent().find("input[name=iframe_value]").val();
                var found = $.parseHTML(iframe);
                if (typeof found[2] === "undefined") { return false; }
                iframe = $(($.parseHTML(found[2].outerHTML)));
                iframe.attr('allow', 'autoplay');
                var src = iframe.attr('src');
                var autoplay = src.indexOf("autoplay");
                if (autoplay > -1) {
                    src = src.replace("autoplay=0", "autoplay=1");
                    src = src.replace("autoplay=1", "autoplay=1");
                }
                else {
                    var symbol = src.indexOf("?") > -1 ? "&" : "?";
                    src = src + symbol + "autoplay=1"
                }

                iframe.attr('src', src);

                $(this).parent().parent().find('.play_video')[0].style.display = "block";
                $(this).parent().parent().find('.play_video').html(iframe);
                $(this).parent().hide();
                $(this).parent().addClass('active');

                const $btn = $(this);
                var postId = $btn.attr("post-id");
                if (postId) {
                    $.ajax({
                        url: "/api/post/view-video",
                        method: "POST",
                        data: {
                            postId
                        },
                        success: function (response) {
                            if (response.IsSuccessful) {
                                $btn.removeAttr("post-id");
                            }
                        }
                    });
                }
            }
        });
    }
    function init() {
        GetPollDetail();
        UpdatePollData();
        GetTopScorerData();
        getStandings();
        HandleStandingTab();
        HandleVideo();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    euro2024.init();
});