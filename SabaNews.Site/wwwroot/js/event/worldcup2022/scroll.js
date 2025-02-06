var scroll = (function ($) {
    var paging = window.paging;
    var pageSize = paging.pageSize;
    var page = paging.page;
    var currentscrollHeight = 0;
    var isLoadData = true;
    var isVideo = window.isVideo;
    var slug = window.slug;
    var type = window.type;


    function GetDataGrid(page) {
        if (page > paging.totalPages) {
            isLoadData = false;
            $('.lds-ellipsis').hide();
            return false;
        }

        var url = '/WorldCup2022/GetNewsGrid';
        var data = { slug, page, pageSize, isVideo };
        if (type === 'story_post') {
            var url = '/WorldCup2022/GetStoryPostGrid';
            var data = { slug, page, pageSize };
        }

        $.ajax({
            url: url,
            type: 'POST',
            data: data
        }).done(function (data) {
            if (!data) {
                isLoadData = false;
                $('.lds-ellipsis').hide();
            } else {
                $('.ajax-load').hide();
                $('#news-grid').append(data);

                $('.btn-play-orthers').on('click', function () {
                    var url = $(this).data('url');
                    window.location = url;
                });
                $('.play-orthers').on('click', function () {
                    var url = $(this).data('url');
                    window.location = url;
                });

                if (page === 5 && page < paging.totalPages) {
                    const loadMoreHtml = '<div class="load-more-page"><button>Hiển thị thêm</button></div>';
                    $('#loading-page').append(loadMoreHtml);
                    isLoadData = false;
                    $('.lds-ellipsis').hide();
                }
            }
        })
            .fail(function (jqXHR, ajaxOptions, thrownError) {
                console.log('server not responding...');
            });
    }

    function InfiniteScroll() {
        $(window).on("scroll", function () {
            const scrollHeight = $(document).height();
            const scrollPos = Math.floor($(window).height() + $(window).scrollTop());
            const isBottom = scrollHeight - $('.footer').innerHeight() < scrollPos;
            if (isBottom && currentscrollHeight < scrollHeight && isLoadData && page < 50) {
                page++;
                GetDataGrid(page);
                currentscrollHeight = scrollHeight;
            }
        });

        $(document).on('click', '.load-more-page', function () {
            $(this).hide();
            page++;
            GetDataGrid(page);
            $('.lds-ellipsis').show();
            currentscrollHeight = $(document).height();
            isLoadData = true;
        });
    }

    function GetVideo() {
        $.ajax({
            url: '/WorldCup2022/GetNewsGrid',
            type: 'POST',
            data: { slug, page, pageSize, isVideo }
        }).done(function (data) {
            $('#news-grid').html(data);
            var numNews = parseInt(window.loading);
            if (numNews > 11) {
                $('.lds-ellipsis').show();
            } else {
                $('.lds-ellipsis').hide();
            }

        })
            .fail(function (jqXHR, ajaxOptions, thrownError) {
                console.log('server not responding...');
            });
    }

    function dataInit() {
        page = 1;
        isLoadData = true;
        currentscrollHeight = 0;
        GetVideo();
    }

    function HandleBtn() {
        $(document).on('click', '#btn-showall', function () {
            var activeSlug = $(this).data('slug');
            if (slug != activeSlug) {
                $('#btn-showhighlight').removeClass("active");
                $('#btn-showguess').removeClass("active");
                $("#btn-showall").addClass("active");
                slug = activeSlug;
                dataInit();
            }
        });
        $(document).on('click', '#btn-showhighlight', function () {
            var activeSlug = $(this).data('slug');
            if (slug != activeSlug) {
                $('#btn-showhighlight').addClass("active");
                $('#btn-showguess').removeClass("active");
                $("#btn-showall").removeClass("active");
                slug = activeSlug;
                dataInit();
            }
        });
        $(document).on('click', '#btn-showguess', function () {
            var activeSlug = $(this).data('slug');
            if (slug != activeSlug) {
                $('#btn-showhighlight').removeClass("active");
                $('#btn-showguess').addClass("active");
                $("#btn-showall").removeClass("active");
                slug = activeSlug;
                dataInit();
            }
        });
    }

    function init() {
        InfiniteScroll();
        HandleBtn();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    scroll.init();
});
