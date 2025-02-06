$(document).ready(function () {
    var activeMenu = $('input[name="activeMenu"]').val();
    $('.menu-item').each(function (i, e) {
        if ($(e).find('a').text() === activeMenu) {
            $(e).addClass('active');
        }
    });

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
    });


    $('.action').click(function (e) {
        e.preventDefault();
        if ($(this).parent().hasClass('box-control')) {
            $(this).parent('.box-control').next().toggleClass('toggle-active-form');
        } else {
            $(this).parent().parent().parent('.box-control').next().toggleClass('toggle-active-form');
        }
        
    })

    $('.close-edit').click(function (e) {
        e.preventDefault();
        $(this).parent().removeClass('toggle-active-form');
    })
});