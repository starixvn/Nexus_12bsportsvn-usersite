var component = (function ($) {
    function LoadRelatedPosts() {
        var block = $("body").find(".related-posts");
        if (block.length > 0) {
            var postID = block.data("postid");
            var cateSlug = block.data("cateslug");
            var title = block.data("title");
            $.ajax({
                url: "/api/post/related-posts",
                type: "POST",
                data: { postID, cateSlug, title },
                success: function (res) {
                    block.html(res);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + ': ' + errorThrown);
                }
            });
        }
    }

    function LoadRelatedWorldCupPosts() {
        var block = $("body").find(".relatedwc-posts");
        if (block.length > 0) {
            var postID = block.data("postid");
            var cateSlug = block.data("cateslug");
            $.ajax({
                url: "/world-cup-2022/related-posts",
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
    }

    function LoadSidebarPosts() {
        var block = $("body").find(".sidebar-posts");
        if (block.length > 0) {
            var postID = block.data("postid");
            var cateSlug = block.data("cateslug");
            var limitItem = block.data("limititem");
            $.ajax({
                url: "/api/post/sidebar-posts",
                type: "POST",
                data: { postID, cateSlug, limitItem },
                success: function (res) {
                    block.html(res);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + ': ' + errorThrown);
                }
            })
        }
    }

    function LoadSidebarWorldCupPosts() {
        var block = $("body").find(".sidebarwc-posts");
        if (block.length > 0) {
            var postID = block.data("postid");
            var cateSlug = block.data("cateslug");
            $.ajax({
                url: "/world-cup-2022/sidebar-posts",
                type: "POST",
                data: { postID, cateSlug },
                success: function (res) {
                    block.html(res);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + ': ' + errorThrown);
                }
            })
        }
    }

    function LoadBanner() {
        if($('.singe-page').length > 0) return  false;
        if (($('.banner-left').length > 0 && $('.banner-right').length > 0)
            || $('.banner-desktop-top').length > 0) {
            $("body").addClass("overflow-section");
            $.ajax({
                url: "/api/banner",
                type: "POST",
                success: function (res) {
                    $("body").removeClass("overflow-section");
                    GeneralBannerHtml(".banner-left", res.desktopLeftUrl, res.desktopLeftNavigationUrl, 910, 150, "Banner left");
                    GeneralBannerHtml(".banner-right", res.desktopRightUrl, res.desktopRightNavigationUrl, 300, 600, "Banner right");
                    GeneralBannerHtml(".banner-desktop-top", res.desktopTopUrl, res.desktopTopNavigationUrl, 320, 70, "Banner top");
                    GeneralBannerHtml(".banner-desktop-center", res.desktopCenterUrl, res.desktopCenterNavigationUrl, "100%", "100%", "Banner center");
                    GeneralBannerHtml(".banner-mobile-top", res.mobileTopUrl, res.mobileTopNavigationUrl, 375, 240, "Banner top");
                    GeneralBannerHtml(".banner-mobile-center", res.mobileCenterUrl, res.mobileCenterNavigationUrl, 375, 240, "Banner center");
                    GeneralBannerHtml(".banner-mobile-bottom", res.mobileBottomUrl, res.mobileBottomNavigationUrl, 375, 240 , "Banner bottom");
                    GeneralBannerHtml(".banner-post-mobile-top", res.postMobileTopUrl, res.postMobileTopNavigationUrl, "100%", "100%", "Banner top");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus + ': ' + errorThrown);
                }
            });
        }
    }


    function GeneralBannerHtml(bannerType, src, link, width, height, alt) {
        var html = "";
        if (src !== "") {
            link = link === "" ? "javascript:;" : link;
            html += '<a href="' + link + '">';
            html += '<img loading="lazy" alt="'+ alt +'" src="' + src + '" class="img-res"  width="' + width + '" height="' + height + '">';
            html += '</a>';
            $(bannerType).html(html);
        } else {
            $(bannerType).css("min-height" ,"unset");
        }
    }
    function init() {
        LoadRelatedPosts();
        LoadSidebarPosts();
        LoadSidebarWorldCupPosts();
        LoadRelatedWorldCupPosts();
        LoadBanner();
    }

    return {
        init
    }

})(jQuery);

$(document).ready(function () {
    component.init();
});

