var comment = (function ($) {
    var postID = $('input[name=postID]').val();
    var filterType = 'like';
    function RenderListComment(postID, page, filterType, getMore = false) {
        $.ajax({
            type: "GET",
            url: "/comments",
            data: { postID: postID, page: page, filterType: filterType, getMore: getMore },
            success: function (response) {
                $('#comment').html(response);
                HandlePaging();
                HandleGetMore();
                HandleFilter();
                HandleShowChildrenComment();
            }
        });
    };

    function HandleGetMore() {
        $('.show_get_more_comment').on('click', function () {
            $('.get_more').removeClass('get_more');
            $(this).addClass('get_more');
        });
    };

    function HandlePaging() {
        $('.comment-pagination').on('click', function () {
            var self = $(this);
            var page = self.data("page");
            RenderListComment(postID, page, filterType);
            $('html,body').animate({
                scrollTop: $("#comment").offset().top
            }, 'slow');
        });

        $('.type_page').on('keypress', function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode === 13) {
                var current = parseInt($(this).parent().data('current'));
                var total = parseInt($(this).parent().data('total'));
                var value = $(this).val();
                if (Math.floor(value) == value && $.isNumeric(value) && value != current && value >= 1 && value <= total) {
                    var page = value;
                    RenderListComment(postID, page, filterType);
                    $('html,body').animate({
                        scrollTop: $("#comment").offset().top
                    }, 'slow');
                }
            }
        });
    };

    function HandleFilter() {
        $('.filter_comment a').on('click', function () {
            var self = $(this);
            filterType = self.data('type');
            if (!self.hasClass('active')) {
                RenderListComment(postID, 1, filterType, true)
            }
        });
    };

    function HandleShowChildrenComment() {
        $('.view_all_reply').on('click', function () {
            var self = $(this)
            var commentID = self.data('cmtid');
            self.parent().parent().parent().find('.group-sub-comment').html('');
            $.ajax({
                type: "GET",
                url: "/comments/getchildren",
                data: { postID: postID, commentID: commentID },
                dataType: "json",
                success: function (response) {
                    self.parent().hide();
                    var data = response.data;
                    var html = '';
                    $.each(data, function (i, val) {
                        html += RenderSubComment(val);
                    });
                    self.parent().parent().parent().find('.group-sub-comment').append(html);
                    validate_image();
                }
            });
        });
    };

    function HandleCreateComment() {
        //show sub reply form process
        $(document).on('click', '.reply-comment a', function () {
            var checkSubCmt = $(this).parent().parent().parent().parent().parent();
            var Subcmt = '';
            if (checkSubCmt.hasClass('comment_item')) {
                Subcmt = checkSubCmt.find('.group-sub-comment');
                if (Subcmt.find('.comment_reply_wrapper.rep_parent').length === 0) {
                    $('.comment_reply_wrapper').remove();
                    Subcmt.prepend(RenderReplyForm('rep_parent'));

                } else {
                    if (Subcmt.find('.comment_reply_wrapper').is(':visible')) {
                        Subcmt.find('.comment_reply_wrapper').hide();
                    } else {
                        Subcmt.find('.comment_reply_wrapper').show();
                    }
                }
            } else {
                Subcmt = $(this).parent().parent();
                if (Subcmt.find('.comment_reply_wrapper').length === 0) {
                    $('.comment_reply_wrapper').remove();
                    Subcmt.append(RenderReplyForm);
                } else {
                    if (Subcmt.find('.comment_reply_wrapper').is(':visible')) {
                        Subcmt.find('.comment_reply_wrapper').hide();
                    } else {
                        Subcmt.find('.comment_reply_wrapper').show();
                    }
                }
            }
        });

        //show limit of comment value
        $(document).on('keyup', 'textarea[name=comment_value]', function () {
            var valLength = $(this).val().length;
            var noteTextCount = $(this).parent().find('.note-text-count');
            if (valLength > 0) {
                noteTextCount.show();
                noteTextCount.find('.counter_word').html(valLength);
            } else {
                noteTextCount.hide();
                noteTextCount.find('.counter_word').html(0);
            }
        });

        $(document).on('click', 'textarea[name=comment_value]', function () {
            var isLogin = (data.isLogin.toLowerCase() === 'true');
            if (!isLogin) {
                auth.GetModalLogin();
            }
        });

        $(document).on('click', '.add_comment', function () {
            var self = $(this);
            var rex = /(<([^>]+)>)/ig;
            var commentContent = self.parent().find("textarea[name=comment_value]").val();
            commentContent = commentContent.replace(rex, "");
            commentContent = commentContent.replace(/\n\r?/g, '<br />');
            if ($.trim(commentContent) === "") {
                self.parent().find("textarea[name=comment_value]").focus();
                return false;
            }
            if (commentContent.length >= 1500) {
                return false;
            }
            if (self.hasClass('error-comment')) {
                self.removeClass('error-comment');
                return false;
            }
            
            $.ajax({
                type: "POST",
                url: "/comments/create",
                data: { postID: postID, parent: 0, commentContent: commentContent },
                success: function (response) {
                    if (response.isSuccessful) {
                        var comment = response.comment;
                        var html = "";
                        var liked = comment.isLiked ? 'active-like' : '';
                        var likeCount = comment.commentLikeCount > 0 ? '<span class="total_like">' + comment.commentLikeCount + "</span>" : "";
                        var photo = '<span>' + comment.commentAuthor.substr(0, 1) + '</span>';
                        if (comment.photo !== null) {
                            if (comment.photo.indexOf("https://") >= 0 || comment.photo.indexOf("http://") >= 0) {
                                photo = '<span><img class="profile_image" src="' + comment.photo + '" width="50" data-name="' + comment.commentAuthor.substr(0, 1) + '" /></span>'
                            } else {
                                photo = '<span><img  class="profile_image"  src="/uploads/' + comment.photo + '" width="50"  data-name="' + comment.commentAuthor.substr(0, 1) + '" /></span>'
                            }
                        }

                        html += '<div class="comment_item">';
                        html += '<div class="group-comment">';
                        html += '<div class="avatar">';
                        html += photo
                        html += '</div>';
                        html += '<div class="user-comment">';
                        html += '<span class="nick-name"><a href="javascript:;">' + comment.commentAuthor + '</a></span>';
                        html += '<span class="txt-comment">' + comment.commentContent + '</span>';
                        html += '<p class="controls">';
                        html += '<span class="controls-comment toggle-like like-comment ' + liked + '"  data-commentid="' + comment.commentID + '"><a href="javascript:;">' + likeCount + ' <i class="icon-like"></i></a></span>';
                        html += '<span class="controls-comment reply-comment"  data-id="' + comment.commentID + '" data-parent="' + comment.commentID + '"><a href="javascript:;">Trả lời</a></span>';
                        html += '<span class="controls-comment time-comment"><a href="javascript:;">1 giây trước</a></span>';
                        html += '</p>';
                        html += '<div class="group-sub-comment">';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';

                        $('.list_comments').prepend(html);
                        self.parent().find("textarea[name=comment_value]").val('');
                        self.parent().find('.comment-content-box').find('.note-text-count').hide();
                        validate_image();
                    }
                }
            });
        });

        //add sub comment
        $(document).on('click', '.add_sub_comment', function () {
            var self = $(this);
            var commentContent = self.parent().find("textarea[name=comment_value]").val();
            var rex = /(<([^>]+)>)/ig;
            commentContent = commentContent.replace(rex, "");
            commentContent = commentContent.replace(/\n\r?/g, '<br />');
            if ($.trim(commentContent) === "") {
                self.parent().find("textarea[name=comment_value]").focus();
                return false;
            }
            if (commentContent.length >= 1500) {
                return false;
            }
            if (self.hasClass('error-comment')) {
                self.removeClass('error-comment');
                return false;
            }
            var repForm = self.parent().parent();
            var parent = 0;
            var isParent = repForm.hasClass('rep_parent');
            if (isParent) {
                parent = repForm.parent().parent().parent().find('.controls').find('.reply-comment').data('parent');
            } else {
                parent = repForm.parent().find('.reply-comment').data('parent');
            }
            $.ajax({
                type: "POST",
                url: "/comments/create",
                data: { postID: postID, parent: parent, commentContent: commentContent },
                success: function (response) {
                    if (response.isSuccessful) {
                        var html = RenderSubComment(response.comment);
                        if (isParent) {
                            repForm.parent().append(html);
                        } else {
                            repForm.parent().parent().parent().parent().append(html);
                        }
                        $('.comment_reply_wrapper').remove();
                        self.parent().find("textarea[name=comment_value]").val('');
                        validate_image();
                    }
                }
            });
        });
    };

    function HandleLikeComment() {
        $(document).on('click', '.like-comment a', function () {
            var isLogin = (data.isLogin.toLowerCase() === 'true');
            if (!isLogin) {
                $('#requestLogin').modal('show');
                return false;
            }
            var self = $(this);
            var cmtID = $(this).parent().data('commentid');
            var total_like = self.find('.total_like').html();
            var type = 'like';
            if ($(this).parent().hasClass('active-like')) {
                type = 'unlike';
                total_like = parseInt(total_like) - 1;
            } else {
                if (typeof total_like === 'undefined') {
                    total_like = 1;
                } else {
                    total_like = parseInt(total_like) + 1;
                }
            }
            $.ajax({
                type: "POST",
                url: "/comments/like",
                data: { commentID: cmtID, type: type },
                dataType: 'json',
                success: function (response) {
                    if (response.isSuccessful) {
                        var html = '<span class="total_like">' + total_like + '</span>';
                        if (typeof self.find('.total_like').html() === 'undefined') {
                            self.prepend(html);
                        } else {
                            self.find('.total_like').html(total_like);
                        }

                        if (type === 'like') {
                            self.parent().addClass('active-like');
                        } else {
                            self.parent().removeClass('active-like');
                        }
                    }
                }
            });
        });
    };

    function RenderSubComment(val) {
        var html = "";
        var liked = val.isLiked ? 'active-like' : '';
        var commentTime = typeof val.commentTime === "undefined" ? "1 giây trước" : val.commentTime;
        var likeCount = val.commentLikeCount > 0 ? '<span class="total_like">' + val.commentLikeCount + "</span>" : "";
        var photo = '<span>' + val.commentAuthor.substr(0, 1) + '</span>';
        if (val.photo !== null) {
            if (val.photo.indexOf("https://") >= 0 || val.photo.indexOf("http://") >= 0) {
                photo = '<span><img class="profile_image" src="' + val.photo + '" alt="Đang tải ảnh đại diện" width="50" data-name="' + val.commentAuthor.substr(0, 1) + '" /></span>'
            } else {
                photo = '<span><img class="profile_image" src="/uploads/' + val.photo + '" alt="Đang tải ảnh đại diện" width="50"data-name="' + val.commentAuthor.substr(0, 1) + '" /></span>'
            }

        }
        html += '<div class="child-comment">';
        html += '<div class="avatar">';
        html += photo;
        html += '</div>';
        html += '<div class="sub-comment">';
        html += '<span class="nick-name"><a href="javascript:;">' + val.commentAuthor + '</a></span>';
        html += '<span class="txt-comment">' + val.commentContent + '</span>';
        html += '<p class="controls">';
        html += '<span class="controls-comment toggle-like like-comment ' + liked + '"  data-commentid="' + val.commentID + '"><a href="javascript:;">' + likeCount + ' <i class="icon-like"></i></a></span>';
        html += '<span class="controls-comment reply-comment"  data-id="' + val.commentID + '" data-parent="' + val.commentParent + '"><a href="javascript:;">Trả lời</a></span>';
        html += '<span class="controls-comment time-comment"><a href="javascript:;">' + commentTime + '</a></span>';
        html += '</p>';
        html += '</div>';
        html += '</div>';

        return html;
    };

    function RenderReplyForm(type = 0) {
        var isLogin = (data.isLogin.toLowerCase() === 'true');
        var html = '';
        var replySubmit = '';
        if (isLogin) {
            replySubmit = '<input type="button" name="add_comment" class="add_sub_comment" value="Gửi" />';
        }
        html += '<div class="comment_reply_wrapper ' + type + '">';
        html += '<form>';
        html += '<div class="comment-content-box">';
        html += '<textarea rows="3" name="comment_value" id="comment_value" placeholder=" Ý kiến của bạn"></textarea>';
        html += '<span class="note-text-count" style="transform-origin: 0px 0px; opacity: 1; transform: scale(1, 1);"><span class="counter_word">0</span> / 1500 ký tự</span>';
        html += '</div>';
        html += '<p class="error"></p>';
        html += replySubmit
        html += '</form>';
        html += '</div>';
        return html;
    };

    function validate_image() {
        $('img.profile_image').on('error', function () {
            if (typeof $(this).data('name') !== "undefined") {
                $(this).parent().html($(this).data('name'));
                $(this).remove();
            }
        });
    }

    function init() {
        RenderListComment(postID, 1, filterType, true);
        HandleCreateComment();
        HandleLikeComment();
    }

    return {
        init
    }
})(jQuery);

$(document).ready(function () {
    comment.init();
});
