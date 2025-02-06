var membershipEvent = (function ($) {
    var isLogin = typeof checkLogin != 'undefined' ? checkLogin.toLowerCase() === 'true' : false;
    function HandleSubmitNumber() {
        $('#membership-event-form').on('submit', function (e) {
            e.preventDefault();
            var number1 = $('#number1').val();
            var number2 = $('#number2').val();
            var number3 = $('#number3').val();
            var isValid = ValidateFormEnterLuckynumber(number1, number2, number3);
            if (!isValid) {
                return false;
            }
            var luckyNumber = number1 + number2 + number3;
            $.ajax({
                method: 'POST',
                url: '/MemberEvent/CreateMembershipEventData',
                data: { luckyNumber },
                success: function (res) {
                    if (res.isSuccessful) {
                        $('#success').bind('hidden.bs.modal', function () {
                            location.reload();
                        });
                        $('#success').modal('show');
                    } else {
                        $('#notice .modal-body  .text-event-modal').html(res.message);
                        $('#notice').unbind('hidden.bs.modal');
                        $('#notice').modal('show');
                    }
                }
            });
        });

        $('.btn-submit-number').on('click', function () {
            var number1 = $('#number1').val();
            var number2 = $('#number2').val();
            var number3 = $('#number3').val();
            var isValid = ValidateFormEnterLuckynumber(number1, number2, number3);
            if (!isValid) {
                return false;
            }
            var html = "<li>" + number1 + "</li>";
            html += "<li>" + number2 + "</li>";
            html += "<li>" + number3 + "</li>";
            $('#register .review-number').html(html);
            $('#register').modal('show');
        });
        $('#register .btn-accept').on('click', function () {
            $('#membership-event-form').submit();
        });
       
        $(".input-event-number").keydown(function (e) {
            if (e.key === "Tab") {
                var numAttr = $(this).attr('id');
                var num = parseInt(numAttr[numAttr.length - 1]);
                if (num == 3) {
                    $('#number1').focus();
                    e.preventDefault();
                }
            }
        });
        $('.input-event-number').on('keypress', function (e) {
            $(this).val($(this).val().replace(/[^0-9\.]/g, ''));
            if ((e.which != 46 || $(this).val().indexOf('.') != -1) && (e.which < 48 || e.which > 57)) {
                e.preventDefault();
            }
        });

        $('.input-event-number').on("input", function () {
            if ($(this).val().length == $(this).attr("maxlength")) {
                $(this).next().focus();
            }
        });


        $('.input-event-number').on("click focus", function () {
            $(this).select();
        });

        $('.btn-reset-number').on('click', function () {
            $('.input-event-number').val('');
            $('#number1').focus();
        });


    }

    function ValidateFormEnterLuckynumber(number1, number2, number3) {
        var luckyNumber = number1 + number2 + number3;
        if (!isLogin) {
            $('#notice .modal-body  .text-event-modal').html("Vui lòng đăng nhập để tham gia sự kiện!");
            $('#notice').unbind('hidden.bs.modal');
            $('#notice').modal('show');
            return false;
        }
        if (!$.isNumeric(number1) || !$.isNumeric(number2) || !$.isNumeric(number3) || !$.isNumeric(luckyNumber)) {
            $('#notice .modal-body  .text-event-modal').html("Số may mắn không hợp lệ, vui lòng kiểm tra lại!");
            $('#notice').unbind('hidden.bs.modal');
            $('#notice').modal('show');
            return false;
        }
        if (luckyNumber < 0 && luckyNumber > 999) {
            $('#notice .modal-body  .text-event-modal').html("Số may mắn phải là số nằm trong khoảng từ 000 đến 999!");
            $('#notice').unbind('hidden.bs.modal');
            $('#notice').modal('show');
            return false;
        }
        return true;
    }

    function HandleUI() {
        $('.toggle-mobile-event').click(function () {
            $('.header-nav-event,.wrapper-menu-event').toggleClass('active')
        })
        $('.header-nav-event li a, .wrapper-menu-event').click(function () {
            $('.header-nav-event,.wrapper-menu-event').removeClass('active')
        })
        $('#btn-register').on('click', function () {
            $('#register').modal('show');
        })
        $('#btn-guide').on('click', function () {
            $('#guide').modal('show');
        })

        $(".btn-accept ").click(function () {
            $('html, body').animate({
                scrollTop: $("#field-number-event").offset().top
            }, 500);
        });


        $('.click-number-event').click(function () {
            const windowHeight = window.innerHeight;
            const blockNumber = $('.field-number');
            const blockNumberHeight = blockNumber.innerHeight();
            const heightElement = windowHeight / 2 - blockNumberHeight / 3;
            $('html, body').animate({
                scrollTop: blockNumber.offset().top - heightElement
            } , 500)
        })



        $('.click-list-rigister').click(function () {
            $('html, body').animate({
                scrollTop: $("#list-rigister-event").offset().top
            }, 500);
        })

        $('.header-control ul li a').click(function () {
            $('.header-control ul li a').removeClass("active");
            $(this).addClass("active");
        });

        $('.btn-accept,.btn-outline-event').click(function () {
            $('#register').modal('hide');
        })

        $('.btn-home').click(function () {
            $('html, body').animate({ scrollTop: 0 }, 1000);
        });

        $('.auth-section').click(function (e) {
            $('.profile-login').toggleClass('active-login-review');

        });

        $(window).click(function (e) {
            var elmAuth = $(e.target).parent().parent();
            if (!elmAuth.is('.after-login') && !elmAuth.is('.auth-section')) {
                if ($('.profile-login').hasClass('active-login-review')) {
                    $('.profile-login').removeClass('active-login-review');
                }
            }
        });
    }

    var page = 1;
    var pageSize = 10;
    function GetDataMembershipEvent() {
        $.ajax({
            type: "GET",
            url: "/MemberEvent/GetMembershipEventData",
            data: { page, pageSize },
            success: function (res) {
                $('.data-grid').html(res);
                initPaging();
            }
        });
    }

    function initPaging() {
        $('.paging').on('click', function () {
            page = $(this).data('page');
            GetDataMembershipEvent();
        });
    }

    function init() {
        HandleUI();
        HandleSubmitNumber();
        GetDataMembershipEvent();
    }

    return {
        init
    }

})(jQuery);


$(document).ready(function () {
    membershipEvent.init();
});