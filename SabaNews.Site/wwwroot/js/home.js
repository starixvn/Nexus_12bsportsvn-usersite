var home = (function ($) {
    function HandleIframe() {
        //Desktop & Mobile
        $('.match-schedule iframe').css('width', '100%');
        $('.play_video iframe').attr('allow', 'autoplay');
        $('.btn-play-video').on('click', function () {
            var slide = $(this).parent().parent().parent();
            if (!slide.hasClass("active")) {
                $('.play_video').html('');
                $('.img-item').show();
                $('.box-play-video').removeClass("active");
                $('.slide-video .card-item').first().addClass("box-video");
                var iframe = $(this).parent().parent().parent().find("input[name=iframe_value]").val();
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

                $(this).parent().parent().parent().find('.play_video')[0].style.display = "block";
                $(this).parent().parent().parent().find('.play_video').html(iframe);
                $(this).parent().parent().hide();
                $(this).parent().parent().addClass('active');

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

        //Desktop
        $('.image-slider').on('click', function () {
            var id = $(this).data('id');
            $('.block-video .box-play-video').hide();
            var slide = $('#slide-' + id);
            slide.show();
            slide.find('.img-item').hide();
            $('.slide-video .card-item').removeClass("box-video");
            $(this).parent().addClass("box-video");

            if (!slide.hasClass("active")) {
                $('.play_video').html('');
                $('.box-play-video').removeClass("active");
                var iframe = slide.find("input[name=iframe_value]").val();
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
                slide.find('.play_video')[0].style.display = "block";
                slide.find('.play_video').html(iframe);

                if (id) {
                    $.ajax({
                        url: "/api/post/view-video",
                        method: "POST",
                        data: {
                            postId: id
                        },
                        success: function (response) {
                            if (response.IsSuccessful) {
                                $(this).removeAttr("post-id");
                            }
                        }
                    });
                }
            }
        });
    };
    function GetPollId() {
        var pollKey = $('.home-poll').data('id');
        if(pollKey <= 0) {
            return false;
        }
        GetPollDetail(pollKey);
    };
    function GetPollDetail(questId) {
        $.ajax({
            type:'POST',
            data: {questId: questId, themeId: 1},
            url: "/Post/GetPollData",
            success: function(res) {
                $('.home-poll').html(res);
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
            $.ajax({
                type: "POST",
                url: "/Post/VotePoll",
                data: { questId: questionId, answerId, themeId },
                success: function (res) {
                    if (typeof res.isSuccessful == "undefined") {
                        $('.home-poll').html(res);
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
            $('.vote-answer').removeClass('disabled');
            $(this).find(".radio-input").prop('checked', true);
        })


        $(document).on('change', '.radio-input', function () {
            $('.poll-element').removeClass('active');
            $(this).parent().addClass('active');
            $('.vote-answer').removeClass('disabled');
        });
    }

    function HandleLivescoreNav() {
        $(window).scroll(function () {
            if($(window).innerWidth() <= 768) {
                $('.home-nav-content').addClass('standing-fixture-mobile').removeClass('home-nav-content');
            } else {
                $('.standing-fixture-mobile').addClass('home-nav-content').removeClass('standing-fixture-mobile')
            }
        });
        $('.home-nav a').on('click', function() {
            $('.home-nav a').removeClass('active');
            $(this).addClass('active');
            var id = $(this).data('id');
            $('.home-nav-content .tab').removeClass('active');
            $('.home-nav-content ' + id).addClass('active');
        })
    }
    var toTop = 0;
    
    function HandleSlideLastestNews(){
        timer = setTimeout(function(){
            var row = document.getElementById('row');
            toTop = toTop - 30;
            if (toTop === - 150){
                toTop = 0;
                clearTimeout(timer);
            }
            row.style.marginTop = toTop +'px';
            HandleSlideLastestNews();
        }, 4500);
    }
    function init() {
        HandleIframe();
        GetPollId();
        UpdatePollData();
        HandleLivescoreNav();
        HandleSlideLastestNews();
    };
    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    home.init();
})



