var euro2024_single = (function ($) {

    function LoadRelatedPosts() {
        var block = $("body").find(".euro-related-posts");
        if(block.length === 0) {
            return false;
        }
        var postID = block.data("postid");
        var cateSlug = block.data("cateslug");
        $.ajax({
            url: "/euro2024/related-posts",
            type: "POST",
            data: { postID, cateSlug },
            success: function (res) {
                block.html(res);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus + ': ' + errorThrown);
            }
        });
    }

    function LoadMostViewPosts() {
        var block = $("body").find(".euro-most-view-posts");
        if(block.length === 0) {
            return false;
        }
        var postID = block.data("postid");
        var cateSlug = block.data("cateslug");
        $.ajax({
            url: "/euro2024/most-view-posts",
            type: "POST",
            data: { postID, cateSlug },
            success: function (res) {
                block.html(res);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus + ': ' + errorThrown);
            }
        });
    }

    function UpdatePostView() {
        $(window).on("load", function () {
            var postId = $("#postID").val();
            var isVideo = ($("#isVideo").val().toLowerCase() === 'true');
            $.ajax({
                url: "/api/post/update-post-view",
                type: "POST",
                data: { postId, isVideo },
                success: function (res) {
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + ': ' + errorThrown);
                }
            });
        });
    }

    function ScrollItem() {
        if (location.hash) {
            setTimeout(function () {

                window.scrollTo(0, 0);
            }, 1);
        }
        //detail scroll click list
        var menuItems = $("#list-place").find("a"),
            topMenuHeight = $('.header-controls').outerHeight(),
            socialHeight = $('.main-social').outerHeight();
        var fixtureHeight = $('.wc-bg-overflow').length > 0 ? $('.wc-bg-overflow').outerHeight() : 0;
        var tabId = location.hash;
        var offsTop = $(tabId).offset();
        if (typeof offsTop !== "undefined") {
            $('html, body').animate({
                scrollTop: offsTop.top - fixtureHeight
            }, 800);
        }

        if ($(window).innerWidth() > 1024) {
            $(document).on('click', '#list-place a, .list-place a', function (e) {
                var href = $(this).attr("href");
                var offsetTop = href === "#" ? 0 : $(href).offset().top - 110;
                if ($(window).scrollTop() > 120) {
                    offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight;
                }
                $('html, body').stop().animate({
                    scrollTop: offsetTop
                }, 800);
                e.preventDefault();
            });
        } else {
            $(document).on('click', '#list-place a, .list-place a', function (e) {
                var href = $(this).attr("href");
                var offsetTop = href === "#" ? 0 : $(href).offset().top - 50;
                if ($(window).scrollTop() > 0) {
                    offsetTop = href === "#" ? 0 : $(href).offset().top - socialHeight;
                }
                $('html, body').stop().animate({
                    scrollTop: offsetTop
                }, 800);
                e.preventDefault();
            });
        }

    }

    function getScrollTop(isMobile, href, scrollTop) {
        var offsetTop = 0;
        if (isMobile) {
            var offsetTop = $(href).offset().top - 50;
            if ($(window).scrollTop() > 0) {
                offsetTop = $(href).offset().top - socialHeight;
            } else {
                $(href).offset().top - 110
            }
        }
    }

    function CreateTableOfContentArticle() {
        var $content = $('.content');
        var $sectionTitles = $content.find('h2, h3');
        var html = '<div class="toc-heading">' +
            '<div class="toc-sub"><p>Nội dung</p><i class="icon-chevron-up"></i></div>' +
            '<div class="list-title">';
        var $excerpt = $content.children(":first");
        var listCount = 0;

        $sectionTitles.each(function (index, element) {
            var $val = $(element);
            var text = $val.text();

            if ($excerpt.text() === text) {
                return;
            }

            listCount++;
            var tagTitle = $val.prop("tagName");
            var section = "section-" + index;
            var titleClass = tagTitle === "H2" ? "h2" : "h3";
            $val.attr('id', section);
            html += `<div class="toc-heading ${titleClass}-toc-heading"><a href="#${section}">${text}</a></div>`;
        });

        html += '</div>';

        if (listCount > 0) {
            $('.list-place').append(html);
        } else {
            $('.list-place').hide();
        }
        $(document).on('click', '.icon-chevron-down', function () {
            $(this).removeClass('icon-chevron-down').addClass('icon-chevron-up');
            $(this).parent().parent().find('.list-title').slideToggle(300);
        })
        $(document).on('click', '.icon-chevron-up', function () {
            $(this).removeClass('icon-chevron-up').addClass('icon-chevron-down');
            $(this).parent().parent().find('.list-title').slideToggle(300);
            $('.list-place').css('min-height' , 'auto');
        })
    }

    function init() {
        LoadRelatedPosts();
        LoadMostViewPosts();
        UpdatePostView();
        ScrollItem();
        getScrollTop();
        CreateTableOfContentArticle();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    euro2024_single.init();
});