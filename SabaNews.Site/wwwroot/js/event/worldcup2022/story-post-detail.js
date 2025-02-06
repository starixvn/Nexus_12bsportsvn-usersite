var storyPostDetail = (function ($) {
    function HandleGetImages() {
        var images = [];
        var imgBlocks = $('.story-data .wp-block-image');
        imgBlocks.map(value => {
            var image = $(value).find('img').attr("src");
            var title = $(value).find('figcaption').html();
            var block = { image, title };
            images.push(block);
        });
        var html = '<amp-story-page id="page-cover" auto-advance-after="10s" class="amp-story-page__full page-cover">'
            += '<amp-story-grid-layer template="fill">'
            += '<amp-img src="https://vncdn.sabasports.com/2022/08/tottenam-quan-tam-daniel-james.jpg"width="1151" height="1535" layout="responsive">'
            += '</amp-img>'
            += '</amp-story-grid-layer>'
            += '<amp-story-grid-layer template="vertical">'
            += '<h1>Hello World</h1>'
            += '<p>This is an AMP Story.</p>'
            += '</amp-story-grid-layer>'
            += '</amp-story-page>';
        $('amp-story').html(html);
        console.log($('html'));
        console.log(images);
        
    }
    function init() {
        //HandleGetImages();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    storyPostDetail.init();
});
