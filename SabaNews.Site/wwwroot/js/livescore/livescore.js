var livescore = (function ($) {
    function RefreshFavMatch() {
        let matchIds = getFavouriteMatches();
        if (matchIds.length === 0) {
            return false;
        }
        matchIds = JSON.stringify(matchIds);
        $.ajax({
            type: "POST",
            url: "/soccer/GetMatchByIds",
            data: { matchIds },
            success: function (response) {
                const newIds = response.map(item => item.matchId);
                localStorage.setItem('favourite-matches', JSON.stringify(newIds));
                getFavouriteMatchCount(newIds);
            }
        });
    }

    function getFavouriteMatchCount(matchIds) {
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

    function getFavouriteMatches() {
        let matchIds = localStorage.getItem('favourite-matches');
        if (!matchIds) {
            matchIds = [];
        } else {
            matchIds = JSON.parse(matchIds.toString());
            matchIds = matchIds.filter(match => match !== null);
        }

        return matchIds;
    }

    function updateCurrentTime() {
        let nIntervId;
        
        let currentTime = window.currentTime;
        if (!nIntervId) {
            nIntervId = setInterval(function () {
                currentTime.setMinutes(currentTime.getMinutes() + 1);
                window.currentTime = currentTime;
            }, 60 * 1000);
        }
    }

    function scrollDetailPageLiveScore() {
        $(window).scroll(function () {
            var heightContainer = $('.sticky-header').outerHeight();
            var widthContainer = $('.livescore-soccer-main').innerWidth();
            $('.detail-fixed').css("width", widthContainer);
            if ($(this).scrollTop() > heightContainer) {
                $('.detail-fixed').addClass('active-scroll');
            }else {
                $('.detail-fixed').removeClass('active-scroll');
            }
            if($(window).scrollTop() > $('.footer').offset().top - 400) {
                $('.detail-fixed').removeClass('active-scroll');
            }
        });

        // var heightContainer = $('.sticky-header').outerHeight();
        // if ($(window).scrollTop() > heightContainer) {
        //     $('.detail-fixed').addClass('active-scroll');
        // } else {
        //     $('.detail-fixed').removeClass('active-scroll');
        // }

        // if($(window).scrollTop() > $('.footer').offset().top - 200) {
        //     $('.detail-fixed').removeClass('active-scroll');
        // }
    }

    function HandleScroll() {
        scrollDetailPageLiveScore();
       
    }

    function init() {
        updateCurrentTime();
        HandleScroll();
        //RefreshFavMatch();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    livescore.init();
});
