var single = (function ($) {
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

    function LoadBanner() {
        $("body").addClass("overflow-section");
        $.ajax({
            url: "/api/banner",
            type: "POST",
            success: function (res) {
                $("body").removeClass("overflow-section");
                GeneralBannerHtml(".banner-left", res.desktopLeftUrl, res.desktopLeftNavigationUrl, 910, 150, "Banner left");
                GeneralBannerHtml(".banner-right", res.desktopRightUrl, res.desktopRightNavigationUrl, 350, 490, "Banner right");
                GeneralBannerHtml(".banner-desktop-top", res.desktopTopUrl, res.desktopTopNavigationUrl, 320, 70, "Banner top");
                GeneralBannerHtml(".banner-desktop-center", res.desktopCenterUrl, res.desktopCenterNavigationUrl, "100%", "100%", "Banner center");
                GeneralBannerHtml(".banner-mobile-top", res.mobileTopUrl, res.mobileTopNavigationUrl, 375, 240, "Banner top");
                GeneralBannerHtml(".banner-mobile-center", res.mobileCenterUrl, res.mobileCenterNavigationUrl, 375, 240, "Banner center");
                GeneralBannerHtml(".banner-mobile-bottom", res.mobileBottomUrl, res.mobileBottomNavigationUrl, 375, 240, "Banner bottom");
                GeneralBannerHtml(".banner-post-mobile-top", res.postMobileTopUrl, res.postMobileTopNavigationUrl, "100%", "100%", "Banner top", true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus + ': ' + errorThrown);
            }
        });
    }

    function GeneralBannerHtml(bannerType, src, link, width, height, alt, isIntercroller = false) {
        var html = "";
        if (src !== "") {
            link = link === "" ? "javascript:;" : link;
            html += '<a href="' + link + '">';
            html += '<img loading="lazy" width="' + width + '" height="' + height + '" alt="' + alt + '" src="' + src + '"  class="img-res">';
            html += '</a>';
            $(bannerType).html(html);
        } else {
            $(bannerType).css("min-height", "unset");
        }
        if (isIntercroller && src !== "") {
            var interscrollerHtml = '';
            interscrollerHtml += '<div id="ir__wrap" class="show-mobile">';
            interscrollerHtml += '<div class="ir__slot">';
            interscrollerHtml += '<div class="ir__box">';
            interscrollerHtml += '<div class="ir__media banner-post-mobile-top">' + html + '</div>';
            interscrollerHtml += '</div>';
            interscrollerHtml += '</div>';
            interscrollerHtml += '</div>';
            html = interscrollerHtml;
            $(bannerType).html(html);
        }
    }

    function LoadBannerContent() {
        var html = $('.banner-content').html();
        var firstParagrapthContent = $('.content').find('p:not([class]');
        if (firstParagrapthContent.eq(1).html() !== '') {
            firstParagrapthContent.eq(1).after(html);
        } else {
            firstParagrapthContent.eq(2).after(html);
        }
    }

    function LoadSameCategoryPost() {
        if ($('.same-category-post').length == 0) {
            return false;
        }
        $.ajax({
            type: 'POST',
            url: '/Post/GetPostsSameCategory',
            data: { slug: window.cateSlug, postId: window.postId },
            success: function (res) {
                $('.same-category-post').html(res);
            }
        });
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
    function GetGuessSidebar() {
        if ($('#guess-section').length === 0) {
            return false;
        }
        var slug = $('#guess-section').data('slug');
        var limitItem = $('#guess-section').data('limit');
        $.ajax({
            type: 'POST',
            url: '/api/GetGuessSidebar',
            data: { slug, limitItem },
            success: function (res) {
                $('#guess-section').html(res);
            }
        })
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
        UpdatePostView();
        LoadBanner();
        ScrollItem();
        LoadBannerContent();
        LoadSameCategoryPost();
        getScrollTop();
        GetGuessSidebar();
        CreateTableOfContentArticle();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    single.init();
});





