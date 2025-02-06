var euro2024_scroll = (function ($) {
    var paging = window.paging;
    var pageSize = paging.pageSize;
    var page = paging.page;
    var currentscrollHeight = 0;
    var isLoadData = true;
    var isVideo = window.isVideo;
    var slug = window.slug;


    function GetDataGrid(page) {
        var url = '/Euro2024/GetNewsGrid';
        var data = { slug, page, pageSize, isVideo };

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
                if ($('#news-grid').find('.paging-' + page).length < pageSize) {
                    isLoadData = false;
                    $('.lds-ellipsis').hide();
                } else if (page === 3) {
                    const loadMoreHtml = '<div class="load-more-page"><button>Hiển thị thêm</button></div>';
                    $('.loading-page').append(loadMoreHtml);
                    isLoadData = false;
                    $('.lds-ellipsis').hide();
                }
                $('.btn-play-orthers').on('click', function () {
                    var url = $(this).data('url');
                    window.location = url;
                });
                $('.play-orthers').on('click', function () {
                    var url = $(this).data('url');
                    window.location = url;
                });
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
            const isBottom = scrollHeight - $('.footer-event').innerHeight() < scrollPos;
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


    function dataInit() {
        page = 1;
        isLoadData = true;
        currentscrollHeight = 0;
    }

    function HandleBtn() {
        $(document).on('click', '#btn-showall', function () {
            if (slug != 'video-world-cup-2022') {
                $('#btn-showhighlight').removeClass("active");
                $('#btn-showguess').removeClass("active");
                $("#btn-showall").addClass("active");
                slug = 'video-world-cup-2022';
                dataInit();
            }
        });
        $(document).on('click', '#btn-showhighlight', function () {
            if (slug != 'video-highlights-world-cup-2022') {
                $('#btn-showhighlight').addClass("active");
                $('#btn-showguess').removeClass("active");
                $("#btn-showall").removeClass("active");
                slug = 'video-highlights-world-cup-2022';
                dataInit();
            }
        });
        $(document).on('click', '#btn-showguess', function () {
            if (slug != 'video-du-doan-world-cup-2022') {
                $('#btn-showhighlight').removeClass("active");
                $('#btn-showguess').addClass("active");
                $("#btn-showall").removeClass("active");
                slug = 'video-du-doan-world-cup-2022';
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
    euro2024_scroll.init();
});
