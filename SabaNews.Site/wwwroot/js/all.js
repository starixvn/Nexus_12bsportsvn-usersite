var all = (function ($) {
    function LoadMenuHeaderMobile () {
        //button show menu mobile 
        $('.button-mobile').click(function () {
            if ($(window).innerWidth() <= 1024) {
                $('.main-menu-mobile').toggleClass('active-main-menu');
                $('.nav-menu').toggleClass('active-nav');
                $(this).toggleClass('open');
                $('body').toggleClass('hidden-body');
                $('.has-sub ul').hide();
                $(".submenu-button").removeClass('submenu-opened');
            }
        });
        
        // button show menu mobile single page 
        $('.button-detail-page').click(function () {
            if ($(window).innerWidth() <= 1024) {
                $(this).toggleClass('open');
                $('body').toggleClass('hidden-detail');
            }
        });
        // click scroll left menu on mobile
        $('.scroll-mobile-menu').on('click', function () {
            var leftPos = $('.main-child-menu').scrollLeft();
            $(".main-child-menu").animate({
                scrollLeft: leftPos + 200
            }, 300);
        });

        $.fn.menumaker = function (options) {
            var cssmenu = $(this), settings = $.extend({
                format: "dropdown",
                sticky: false
            }, options);
            cssmenu.find('li ul').parent().addClass('has-sub');
            multiTg = function () {
                cssmenu.find(".has-sub").prepend('<span class="submenu-button"> <i class="icon-chevron-down"></i> </span>');
                cssmenu.find('.submenu-button').on('click', function () {
                    $(this).toggleClass('submenu-opened');
                    if ($(this).siblings('ul').hasClass('open')) {
                        $(this).siblings('ul').removeClass('open').slideToggle();
                    }
                    else {
                        $(this).siblings('ul').addClass('open').slideToggle();
                    }
                });
            };
            if (settings.format === 'multitoggle') multiTg()
            else cssmenu.addClass('dropdown')
            resizeFix = function () {
            };
        }
        $(".main-menu-mobile,.main-menu-pc").menumaker({
            format: "multitoggle"
        });
        $('.menu-item ul li a').hover(function () {
            $(this).siblings('span').toggleClass('active-arrow')
        })
    }

    function scrollBackTop() {
        $(window).scroll(function () {
            if ($(window).scrollTop() > 100) {
                $('.back-to-top').fadeIn();
            } else {
                $('.back-to-top').fadeOut();
            }
        });
        $('.back-to-top').click(function () {
            $('html, body').animate({ scrollTop: 0 }, 300);
        });
    }

    function CheckActiveFixed () {
        if (document.querySelector('.wapper') != null) {
            var checkScrollHome = function () {
                var main = document.querySelector('.wapper');
                var heightSection = $(".header-controls").innerHeight();
                var top_of_window = window.scrollY;
                const { scrollHeight, clientHeight } = document.documentElement;
                const canScrollHeight = scrollHeight - clientHeight;
                if (top_of_window > heightSection && canScrollHeight > 150) {
                    main.classList.add('active-fixed');
                } else {
                    main.classList.remove('active-fixed');
                }
            }
            window.addEventListener('scroll', function () { checkScrollHome() })
        }
    }

    function ResizeGeneralInfo () {
        $(window).on("resize", function (e) {
            var widthContainer = $('.livescore-soccer-main').innerWidth();
            $('.detail-fixed').css("width", widthContainer);
        });
    }

    function CopyContextMenu () {
        $('#detail-page').bind("cut copy paste contextmenu", function (e) {
            e.preventDefault();
        });
    }

    function LoadDetailPage () {
        if ($('body').find('#detail-page').length !== 0) {
            $(document).keydown(function (e) {
                if ((e.ctrlKey || e.metaKey) && e.keyCode === 65) {
                    e.preventDefault();
                }
                if (e.keyCode === 27) {
                    $('.modal').modal('hide');
    
                }
            });
        }
    }

    function ProfileUser () {
        $('img.profile_image').on('error', function () {
            if (typeof $(this).data('name') !== "undefined") {
                $(this).parent().html($(this).data('name'));
                $(this).remove();
            }
        });
        $(document).on('click', '.toggle-pass .icon-form', function () {
            if ($(this).hasClass('icon-show')) {
                $(this).parent().parent().find('input').attr('type', 'text');
                $(this).hide();
                $(this).parent().find('.icon-hide').show();
            } else {
                $(this).parent().parent().find('input').attr('type', 'password');
                $(this).hide();
                $(this).parent().find('.icon-show').show();
            }
        });



        $('.auth-input').click(function (e) {
            $('.box-auth').toggleClass('active-box-auth');
    
        });
    }

    function SearchAndChooseLang () {
        $('.language-select').click(function () {
            $(this).siblings('.languages-list').toggleClass('active')
        });

        $('.button-social-menu').click(function () {
            $('body').addClass('hidden-body');
            $('.mb-singe-page').addClass('active-mb-social')
        })
        $('.close-socical').click(function () {
            $('body').removeClass('hidden-body');
            $('.mb-singe-page').removeClass('active-mb-social')
        })
        $(window).click(function (e) {
            var elmClass = e.target.className;
    
            var elmAuth = $(e.target).parent().parent();
            if (!elmAuth.is('.auth-provider') && !elmAuth.is('.auth-input')) {
                if ($('.box-auth').hasClass('active-box-auth')) {
                    $('.box-auth').removeClass('active-box-auth');
                }
            }
    
            if (elmClass !== 'country' && elmClass !== 'language-select' && elmClass !== 'flag flag-vn') {
                if ($('.languages-list').hasClass('active')) {
                    $('.languages-list').removeClass('active');
                }
            }
            if (elmClass !== 'icon-search' && elmClass !== 'keyword-input') {
                var searchbox = $('.search-box');
                if (searchbox.hasClass('active-input')) {
                    searchbox.removeClass('active-input');
                    $('input[name=keyword]').val('');
                }
            } else {
                $('input[name=keyword]').focus();
            }
        });
        $('.search-input button').on('click', function (e) {
            e.preventDefault();
            var input = $(this).parent().find('.keyword-input');
            var form = $(this).parent();
            var keyword = $.trim(input.val());
            keyword = keyword.replaceAll('"','');
            if (keyword === '') {
                input.focus();
            } else {
                form.trigger("reset");
                window.location.href = '/Search/' + keyword
            }
        });
    }

    function Modal () {
        $(document).keyup(function (e) {
            if (e.keyCode === 27) {
                $('.modal').modal('hide');
            }
        });
        $(document).on('shown.bs.modal', '.modal', function (e) {
            $('body').addClass('overflow-modal');
        })
        $(document).on('hidden.bs.modal', '.modal', function (e) {
            $('body').removeClass('overflow-modal');
        })
    
    }
    function getFavouriteMatchCount() {
        let matchIds = localStorage.getItem('favourite-matches');
        if (!matchIds) {
            matchIds = [];
        } else {
            matchIds = JSON.parse(matchIds.toString());
            matchIds = matchIds.filter(match => match !== null);
        }
    
        const count = matchIds.length;
        const favMatch = $('.mobile-fav');
        if (favMatch) {
            if (count > 0) {
                favMatch.addClass('number-count-fav');
                favMatch.html(count);
            } else {
                favMatch.removeClass('number-count-fav');
                favMatch.html('');
            }
        }
    }

    function MenuPopupHeaderPC () {
        $('.open-menu-popup,.close-popup').click(function () {
            $('.menu-popup,.main-menu-pc .menu-item a').toggleClass('hide-popup');
        });
        $('.block-menu-list').each(function () {
            var lengthLi = $(this).find('li').length;
            if(lengthLi > 4) {
                $('li' , this).eq(3).nextAll().hide().addClass('toggleable');
                $(this).append('<li class="more">Xem thêm</li>');  
            }
        })
        $('.block-menu-list').on('click','.more', function(){
            if($(this).hasClass('less')){
                $(this).text('Xem thêm').removeClass('less');    
            }else{
                $(this).text('Thu gọn').addClass('less'); 
              }
              $(this).siblings('li.toggleable').toggle(); 
        });
    }
    //change domain show popup
    function toggleChangeDomainPopup() {
        var popupKey = 'hide-popup';

        var hidePopupEvent = localStorage.getItem(popupKey);
        if (hidePopupEvent !== "1") {
            $('#main-popup').modal('show');
        }
        $('#isHidePopupChangeDomain').on('change', function () {
            if ($(this).is(':checked')) {
                localStorage.setItem(popupKey, "1");
                $('#main-popup').modal('hide');
            } else {
                localStorage.setItem(popupKey, "0");
            }
        });
    }

    function CountBannerClick()
    {
        $(document).on('click', '.show-pc.banner-left, .show-mobile.banner-mobile-top', function(e){
            var src = $(this).find('img').attr('src');
            $.ajax({
                type: 'POST',
                url: '/api/CountBanner',
                success: function(res)
                {
                }
            })
        })
    }

    function HandleQueryStringAction() {
        var param = ParseQueryString(location.search);
        if(param.action == 'login' || param.action == 'register') {
            auth.GetModalLogin("/", param.action);
        }
    }

    function ParseQueryString(queryString) {
        const queryObj = {};
        const params = queryString.substring(1).split('&'); // Remove '?' and split into key-value pairs

        params.forEach(param => {
            const [key, value] = param.split('='); // Destructure key-value pair
            queryObj[key] = value;
        });

        return queryObj;
    }
    function init() {
        LoadMenuHeaderMobile();
        scrollBackTop();
        CheckActiveFixed();
        ResizeGeneralInfo();
        CopyContextMenu();
        LoadDetailPage();
        ProfileUser();
        SearchAndChooseLang();
        Modal();
        getFavouriteMatchCount();
        MenuPopupHeaderPC();
        // toggleChangeDomainPopup();
        CountBannerClick();
        HandleQueryStringAction();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    all.init();
    $("img.lazy").lazyload({
        effect : "show",
        threshold : 150,
    });
});
