var editorValue;
//call configCkeditor.configContentForm('#emailContent', '/Admin/Email/UploadImageSendMail');
var configCkeditor = (function ($) {
    var url = "";
    function configContentForm(element, urlUpload) {
        url = urlUpload;
        ClassicEditor
            .create(document.querySelector(element), {
                extraPlugins: [CustomUpload],
                inlineStyles: true,
                autoParagraph: false,
                enterMode: 2,
                toolbar: {
                    items: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'alignment',
                        'outdent',
                        'indent',
                        '|',
                        'imageInsert',
                        'blockQuote',
                        'insertTable',
                        'redo',
                        'undo',
                        'fontBackgroundColor',
                        'fontColor',
                        'fontSize',
                        'sourceEditing'
                    ]
                },
                fontSize: {
                    options: [
                        9,
                        11,
                        13,
                        'default',
                        17,
                        19,
                        21,
                        23,
                        25,
                        27
                    ],
                    supportAllValues: true
                },
                fontBackgroundColor: {
                    colors: [
                        { color: 'hsl(6, 54%, 95%)', label: ' ' }, { color: 'hsl(6, 54%, 89%)', label: ' ' }, { color: 'hsl(6, 54%, 78%)', label: ' ' }, { color: 'hsl(6, 54%, 68%)', label: ' ' }, { color: 'hsl(6, 54%, 57%)', label: ' ' }, { color: 'hsl(6, 63%, 46%)', label: ' ' }, { color: 'hsl(6, 63%, 41%)', label: ' ' }, { color: 'hsl(6, 63%, 35%)', label: ' ' }, { color: 'hsl(6, 63%, 29%)', label: ' ' }, { color: 'hsl(6, 63%, 24%)', label: ' ' }, { color: 'hsl(6, 78%, 96%)', label: ' ' }, { color: 'hsl(6, 78%, 91%)', label: ' ' }, { color: 'hsl(6, 78%, 83%)', label: ' ' }, { color: 'hsl(6, 78%, 74%)', label: ' ' }, { color: 'hsl(6, 78%, 66%)', label: ' ' }, { color: 'hsl(6, 78%, 57%)', label: ' ' }, { color: 'hsl(6, 59%, 50%)', label: ' ' }, { color: 'hsl(6, 59%, 43%)', label: ' ' }, { color: 'hsl(6, 59%, 37%)', label: ' ' }, { color: 'hsl(6, 59%, 30%)', label: ' ' }, { color: 'hsl(283, 39%, 95%)', label: ' ' }, { color: 'hsl(283, 39%, 91%)', label: ' ' }, { color: 'hsl(283, 39%, 81%)', label: ' ' }, { color: 'hsl(283, 39%, 72%)', label: ' ' }, { color: 'hsl(283, 39%, 63%)', label: ' ' }, { color: 'hsl(283, 39%, 53%)', label: ' ' }, { color: 'hsl(283, 34%, 47%)', label: ' ' }, { color: 'hsl(283, 34%, 40%)', label: ' ' }, { color: 'hsl(283, 34%, 34%)', label: ' ' }, { color: 'hsl(283, 34%, 28%)', label: ' ' }, { color: 'hsl(282, 39%, 95%)', label: ' ' }, { color: 'hsl(282, 39%, 89%)', label: ' ' }, { color: 'hsl(282, 39%, 79%)', label: ' ' }, { color: 'hsl(282, 39%, 68%)', label: ' ' }, { color: 'hsl(282, 39%, 58%)', label: ' ' }, { color: 'hsl(282, 44%, 47%)', label: ' ' }, { color: 'hsl(282, 44%, 42%)', label: ' ' }, { color: 'hsl(282, 44%, 36%)', label: ' ' }, { color: 'hsl(282, 44%, 30%)', label: ' ' }, { color: 'hsl(282, 44%, 25%)', label: ' ' }, { color: 'hsl(204, 51%, 94%)', label: ' ' }, { color: 'hsl(204, 51%, 89%)', label: ' ' }, { color: 'hsl(204, 51%, 78%)', label: ' ' }, { color: 'hsl(204, 51%, 67%)', label: ' ' }, { color: 'hsl(204, 51%, 55%)', label: ' ' }, { color: 'hsl(204, 64%, 44%)', label: ' ' }, { color: 'hsl(204, 64%, 39%)', label: ' ' }, { color: 'hsl(204, 64%, 34%)', label: ' ' }, { color: 'hsl(204, 64%, 28%)', label: ' ' }, { color: 'hsl(204, 64%, 23%)', label: ' ' }, { color: 'hsl(204, 70%, 95%)', label: ' ' }, { color: 'hsl(204, 70%, 91%)', label: ' ' }, { color: 'hsl(204, 70%, 81%)', label: ' ' }, { color: 'hsl(204, 70%, 72%)', label: ' ' }, { color: 'hsl(204, 70%, 63%)', label: ' ' }, { color: 'hsl(204, 70%, 53%)', label: ' ' }, { color: 'hsl(204, 62%, 47%)', label: ' ' }, { color: 'hsl(204, 62%, 40%)', label: ' ' }, { color: 'hsl(204, 62%, 34%)', label: ' ' }, { color: 'hsl(204, 62%, 28%)', label: ' ' }, { color: 'hsl(168, 55%, 94%)', label: ' ' }, { color: 'hsl(168, 55%, 88%)', label: ' ' }, { color: 'hsl(168, 55%, 77%)', label: ' ' }, { color: 'hsl(168, 55%, 65%)', label: ' ' }, { color: 'hsl(168, 55%, 54%)', label: ' ' }, { color: 'hsl(168, 76%, 42%)', label: ' ' }, { color: 'hsl(168, 76%, 37%)', label: ' ' }, { color: 'hsl(168, 76%, 32%)', label: ' ' }, { color: 'hsl(168, 76%, 27%)', label: ' ' }, { color: 'hsl(168, 76%, 22%)', label: ' ' }, { color: 'hsl(168, 42%, 94%)', label: ' ' }, { color: 'hsl(168, 42%, 87%)', label: ' ' }, { color: 'hsl(168, 42%, 74%)', label: ' ' }, { color: 'hsl(168, 42%, 61%)', label: ' ' }, { color: 'hsl(168, 45%, 49%)', label: ' ' }, { color: 'hsl(168, 76%, 36%)', label: ' ' }, { color: 'hsl(168, 76%, 31%)', label: ' ' }, { color: 'hsl(168, 76%, 27%)', label: ' ' }, { color: 'hsl(168, 76%, 23%)', label: ' ' }, { color: 'hsl(168, 76%, 19%)', label: ' ' }, { color: 'hsl(145, 45%, 94%)', label: ' ' }, { color: 'hsl(145, 45%, 88%)', label: ' ' }, { color: 'hsl(145, 45%, 77%)', label: ' ' }, { color: 'hsl(145, 45%, 65%)', label: ' ' }, { color: 'hsl(145, 45%, 53%)', label: ' ' }, { color: 'hsl(145, 63%, 42%)', label: ' ' }, { color: 'hsl(145, 63%, 37%)', label: ' ' }, { color: 'hsl(145, 63%, 32%)', label: ' ' }, { color: 'hsl(145, 63%, 27%)', label: ' ' }, { color: 'hsl(145, 63%, 22%)', label: ' ' }, { color: 'hsl(145, 61%, 95%)', label: ' ' }, { color: 'hsl(145, 61%, 90%)', label: ' ' }, { color: 'hsl(145, 61%, 80%)', label: ' ' }, { color: 'hsl(145, 61%, 69%)', label: ' ' }, { color: 'hsl(145, 61%, 59%)', label: ' ' }, { color: 'hsl(145, 63%, 49%)', label: ' ' }, { color: 'hsl(145, 63%, 43%)', label: ' ' }, { color: 'hsl(145, 63%, 37%)', label: ' ' }, { color: 'hsl(145, 63%, 31%)', label: ' ' }, { color: 'hsl(145, 63%, 25%)', label: ' ' }, { color: 'hsl(48, 89%, 95%)', label: ' ' }, { color: 'hsl(48, 89%, 90%)', label: ' ' }, { color: 'hsl(48, 89%, 80%)', label: ' ' }, { color: 'hsl(48, 89%, 70%)', label: ' ' }, { color: 'hsl(48, 89%, 60%)', label: ' ' }, { color: 'hsl(48, 89%, 50%)', label: ' ' }, { color: 'hsl(48, 88%, 44%)', label: ' ' }, { color: 'hsl(48, 88%, 38%)', label: ' ' }, { color: 'hsl(48, 88%, 32%)', label: ' ' }, { color: 'hsl(48, 88%, 26%)', label: ' ' }, { color: 'hsl(37, 90%, 95%)', label: ' ' }, { color: 'hsl(37, 90%, 90%)', label: ' ' }, { color: 'hsl(37, 90%, 80%)', label: ' ' }, { color: 'hsl(37, 90%, 71%)', label: ' ' }, { color: 'hsl(37, 90%, 61%)', label: ' ' }, { color: 'hsl(37, 90%, 51%)', label: ' ' }, { color: 'hsl(37, 86%, 45%)', label: ' ' }, { color: 'hsl(37, 86%, 39%)', label: ' ' }, { color: 'hsl(37, 86%, 33%)', label: ' ' }, { color: 'hsl(37, 86%, 27%)', label: ' ' }, { color: 'hsl(28, 80%, 95%)', label: ' ' }, { color: 'hsl(28, 80%, 90%)', label: ' ' }, { color: 'hsl(28, 80%, 81%)', label: ' ' }, { color: 'hsl(28, 80%, 71%)', label: ' ' }, { color: 'hsl(28, 80%, 61%)', label: ' ' }, { color: 'hsl(28, 80%, 52%)', label: ' ' }, { color: 'hsl(28, 74%, 46%)', label: ' ' }, { color: 'hsl(28, 74%, 39%)', label: ' ' }, { color: 'hsl(28, 74%, 33%)', label: ' ' }, { color: 'hsl(28, 74%, 27%)', label: ' ' }, { color: 'hsl(24, 71%, 94%)', label: ' ' }, { color: 'hsl(24, 71%, 88%)', label: ' ' }, { color: 'hsl(24, 71%, 77%)', label: ' ' }, { color: 'hsl(24, 71%, 65%)', label: ' ' }, { color: 'hsl(24, 71%, 53%)', label: ' ' }, { color: 'hsl(24, 100%, 41%)', label: ' ' }, { color: 'hsl(24, 100%, 36%)', label: ' ' }, { color: 'hsl(24, 100%, 31%)', label: ' ' }, { color: 'hsl(24, 100%, 26%)', label: ' ' }, { color: 'hsl(24, 100%, 22%)', label: ' ' }, { color: 'hsl(192, 15%, 99%)', label: ' ' }, { color: 'hsl(192, 15%, 99%)', label: ' ' }, { color: 'hsl(192, 15%, 97%)', label: ' ' }, { color: 'hsl(192, 15%, 96%)', label: ' ' }, { color: 'hsl(192, 15%, 95%)', label: ' ' }, { color: 'hsl(192, 15%, 94%)', label: ' ' }, { color: 'hsl(192, 5%, 82%)', label: ' ' }, { color: 'hsl(192, 3%, 71%)', label: ' ' }, { color: 'hsl(192, 2%, 60%)', label: ' ' }, { color: 'hsl(192, 1%, 49%)', label: ' ' }, { color: 'hsl(204, 8%, 98%)', label: ' ' }, { color: 'hsl(204, 8%, 95%)', label: ' ' }, { color: 'hsl(204, 8%, 90%)', label: ' ' }, { color: 'hsl(204, 8%, 86%)', label: ' ' }, { color: 'hsl(204, 8%, 81%)', label: ' ' }, { color: 'hsl(204, 8%, 76%)', label: ' ' }, { color: 'hsl(204, 5%, 67%)', label: ' ' }, { color: 'hsl(204, 4%, 58%)', label: ' ' }, { color: 'hsl(204, 3%, 49%)', label: ' ' }, { color: 'hsl(204, 3%, 40%)', label: ' ' }, { color: 'hsl(184, 9%, 96%)', label: ' ' }, { color: 'hsl(184, 9%, 92%)', label: ' ' }, { color: 'hsl(184, 9%, 85%)', label: ' ' }, { color: 'hsl(184, 9%, 77%)', label: ' ' }, { color: 'hsl(184, 9%, 69%)', label: ' ' }, { color: 'hsl(184, 9%, 62%)', label: ' ' }, { color: 'hsl(184, 6%, 54%)', label: ' ' }, { color: 'hsl(184, 5%, 47%)', label: ' ' }, { color: 'hsl(184, 5%, 40%)', label: ' ' }, { color: 'hsl(184, 5%, 32%)', label: ' ' }, { color: 'hsl(184, 6%, 95%)', label: ' ' }, { color: 'hsl(184, 6%, 91%)', label: ' ' }, { color: 'hsl(184, 6%, 81%)', label: ' ' }, { color: 'hsl(184, 6%, 72%)', label: ' ' }, { color: 'hsl(184, 6%, 62%)', label: ' ' }, { color: 'hsl(184, 6%, 53%)', label: ' ' }, { color: 'hsl(184, 5%, 46%)', label: ' ' }, { color: 'hsl(184, 5%, 40%)', label: ' ' }, { color: 'hsl(184, 5%, 34%)', label: ' ' }, { color: 'hsl(184, 5%, 27%)', label: ' ' }, { color: 'hsl(210, 12%, 93%)', label: ' ' }, { color: 'hsl(210, 12%, 86%)', label: ' ' }, { color: 'hsl(210, 12%, 71%)', label: ' ' }, { color: 'hsl(210, 12%, 57%)', label: ' ' }, { color: 'hsl(210, 15%, 43%)', label: ' ' }, { color: 'hsl(210, 29%, 29%)', label: ' ' }, { color: 'hsl(210, 29%, 25%)', label: ' ' }, { color: 'hsl(210, 29%, 22%)', label: ' ' }, { color: 'hsl(210, 29%, 18%)', label: ' ' }, { color: 'hsl(210, 29%, 15%)', label: ' ' }, { color: 'hsl(210, 9%, 92%)', label: ' ' }, { color: 'hsl(210, 9%, 85%)', label: ' ' }, { color: 'hsl(210, 9%, 70%)', label: ' ' }, { color: 'hsl(210, 9%, 55%)', label: ' ' }, { color: 'hsl(210, 14%, 39%)', label: ' ' }, { color: 'hsl(210, 29%, 24%)', label: ' ' }, { color: 'hsl(210, 29%, 21%)', label: ' ' }, { color: 'hsl(210, 29%, 18%)', label: ' ' }, { color: 'hsl(210, 29%, 16%)', label: ' ' }, { color: 'hsl(210, 29%, 13%)', label: ' ' }
                    ],
                    columns: 10
                },
                fontColor: {
                    colors: [
                        { color: 'hsl(6, 54%, 95%)', label: ' ' }, { color: 'hsl(6, 54%, 89%)', label: ' ' }, { color: 'hsl(6, 54%, 78%)', label: ' ' }, { color: 'hsl(6, 54%, 68%)', label: ' ' }, { color: 'hsl(6, 54%, 57%)', label: ' ' }, { color: 'hsl(6, 63%, 46%)', label: ' ' }, { color: 'hsl(6, 63%, 41%)', label: ' ' }, { color: 'hsl(6, 63%, 35%)', label: ' ' }, { color: 'hsl(6, 63%, 29%)', label: ' ' }, { color: 'hsl(6, 63%, 24%)', label: ' ' }, { color: 'hsl(6, 78%, 96%)', label: ' ' }, { color: 'hsl(6, 78%, 91%)', label: ' ' }, { color: 'hsl(6, 78%, 83%)', label: ' ' }, { color: 'hsl(6, 78%, 74%)', label: ' ' }, { color: 'hsl(6, 78%, 66%)', label: ' ' }, { color: 'hsl(6, 78%, 57%)', label: ' ' }, { color: 'hsl(6, 59%, 50%)', label: ' ' }, { color: 'hsl(6, 59%, 43%)', label: ' ' }, { color: 'hsl(6, 59%, 37%)', label: ' ' }, { color: 'hsl(6, 59%, 30%)', label: ' ' }, { color: 'hsl(283, 39%, 95%)', label: ' ' }, { color: 'hsl(283, 39%, 91%)', label: ' ' }, { color: 'hsl(283, 39%, 81%)', label: ' ' }, { color: 'hsl(283, 39%, 72%)', label: ' ' }, { color: 'hsl(283, 39%, 63%)', label: ' ' }, { color: 'hsl(283, 39%, 53%)', label: ' ' }, { color: 'hsl(283, 34%, 47%)', label: ' ' }, { color: 'hsl(283, 34%, 40%)', label: ' ' }, { color: 'hsl(283, 34%, 34%)', label: ' ' }, { color: 'hsl(283, 34%, 28%)', label: ' ' }, { color: 'hsl(282, 39%, 95%)', label: ' ' }, { color: 'hsl(282, 39%, 89%)', label: ' ' }, { color: 'hsl(282, 39%, 79%)', label: ' ' }, { color: 'hsl(282, 39%, 68%)', label: ' ' }, { color: 'hsl(282, 39%, 58%)', label: ' ' }, { color: 'hsl(282, 44%, 47%)', label: ' ' }, { color: 'hsl(282, 44%, 42%)', label: ' ' }, { color: 'hsl(282, 44%, 36%)', label: ' ' }, { color: 'hsl(282, 44%, 30%)', label: ' ' }, { color: 'hsl(282, 44%, 25%)', label: ' ' }, { color: 'hsl(204, 51%, 94%)', label: ' ' }, { color: 'hsl(204, 51%, 89%)', label: ' ' }, { color: 'hsl(204, 51%, 78%)', label: ' ' }, { color: 'hsl(204, 51%, 67%)', label: ' ' }, { color: 'hsl(204, 51%, 55%)', label: ' ' }, { color: 'hsl(204, 64%, 44%)', label: ' ' }, { color: 'hsl(204, 64%, 39%)', label: ' ' }, { color: 'hsl(204, 64%, 34%)', label: ' ' }, { color: 'hsl(204, 64%, 28%)', label: ' ' }, { color: 'hsl(204, 64%, 23%)', label: ' ' }, { color: 'hsl(204, 70%, 95%)', label: ' ' }, { color: 'hsl(204, 70%, 91%)', label: ' ' }, { color: 'hsl(204, 70%, 81%)', label: ' ' }, { color: 'hsl(204, 70%, 72%)', label: ' ' }, { color: 'hsl(204, 70%, 63%)', label: ' ' }, { color: 'hsl(204, 70%, 53%)', label: ' ' }, { color: 'hsl(204, 62%, 47%)', label: ' ' }, { color: 'hsl(204, 62%, 40%)', label: ' ' }, { color: 'hsl(204, 62%, 34%)', label: ' ' }, { color: 'hsl(204, 62%, 28%)', label: ' ' }, { color: 'hsl(168, 55%, 94%)', label: ' ' }, { color: 'hsl(168, 55%, 88%)', label: ' ' }, { color: 'hsl(168, 55%, 77%)', label: ' ' }, { color: 'hsl(168, 55%, 65%)', label: ' ' }, { color: 'hsl(168, 55%, 54%)', label: ' ' }, { color: 'hsl(168, 76%, 42%)', label: ' ' }, { color: 'hsl(168, 76%, 37%)', label: ' ' }, { color: 'hsl(168, 76%, 32%)', label: ' ' }, { color: 'hsl(168, 76%, 27%)', label: ' ' }, { color: 'hsl(168, 76%, 22%)', label: ' ' }, { color: 'hsl(168, 42%, 94%)', label: ' ' }, { color: 'hsl(168, 42%, 87%)', label: ' ' }, { color: 'hsl(168, 42%, 74%)', label: ' ' }, { color: 'hsl(168, 42%, 61%)', label: ' ' }, { color: 'hsl(168, 45%, 49%)', label: ' ' }, { color: 'hsl(168, 76%, 36%)', label: ' ' }, { color: 'hsl(168, 76%, 31%)', label: ' ' }, { color: 'hsl(168, 76%, 27%)', label: ' ' }, { color: 'hsl(168, 76%, 23%)', label: ' ' }, { color: 'hsl(168, 76%, 19%)', label: ' ' }, { color: 'hsl(145, 45%, 94%)', label: ' ' }, { color: 'hsl(145, 45%, 88%)', label: ' ' }, { color: 'hsl(145, 45%, 77%)', label: ' ' }, { color: 'hsl(145, 45%, 65%)', label: ' ' }, { color: 'hsl(145, 45%, 53%)', label: ' ' }, { color: 'hsl(145, 63%, 42%)', label: ' ' }, { color: 'hsl(145, 63%, 37%)', label: ' ' }, { color: 'hsl(145, 63%, 32%)', label: ' ' }, { color: 'hsl(145, 63%, 27%)', label: ' ' }, { color: 'hsl(145, 63%, 22%)', label: ' ' }, { color: 'hsl(145, 61%, 95%)', label: ' ' }, { color: 'hsl(145, 61%, 90%)', label: ' ' }, { color: 'hsl(145, 61%, 80%)', label: ' ' }, { color: 'hsl(145, 61%, 69%)', label: ' ' }, { color: 'hsl(145, 61%, 59%)', label: ' ' }, { color: 'hsl(145, 63%, 49%)', label: ' ' }, { color: 'hsl(145, 63%, 43%)', label: ' ' }, { color: 'hsl(145, 63%, 37%)', label: ' ' }, { color: 'hsl(145, 63%, 31%)', label: ' ' }, { color: 'hsl(145, 63%, 25%)', label: ' ' }, { color: 'hsl(48, 89%, 95%)', label: ' ' }, { color: 'hsl(48, 89%, 90%)', label: ' ' }, { color: 'hsl(48, 89%, 80%)', label: ' ' }, { color: 'hsl(48, 89%, 70%)', label: ' ' }, { color: 'hsl(48, 89%, 60%)', label: ' ' }, { color: 'hsl(48, 89%, 50%)', label: ' ' }, { color: 'hsl(48, 88%, 44%)', label: ' ' }, { color: 'hsl(48, 88%, 38%)', label: ' ' }, { color: 'hsl(48, 88%, 32%)', label: ' ' }, { color: 'hsl(48, 88%, 26%)', label: ' ' }, { color: 'hsl(37, 90%, 95%)', label: ' ' }, { color: 'hsl(37, 90%, 90%)', label: ' ' }, { color: 'hsl(37, 90%, 80%)', label: ' ' }, { color: 'hsl(37, 90%, 71%)', label: ' ' }, { color: 'hsl(37, 90%, 61%)', label: ' ' }, { color: 'hsl(37, 90%, 51%)', label: ' ' }, { color: 'hsl(37, 86%, 45%)', label: ' ' }, { color: 'hsl(37, 86%, 39%)', label: ' ' }, { color: 'hsl(37, 86%, 33%)', label: ' ' }, { color: 'hsl(37, 86%, 27%)', label: ' ' }, { color: 'hsl(28, 80%, 95%)', label: ' ' }, { color: 'hsl(28, 80%, 90%)', label: ' ' }, { color: 'hsl(28, 80%, 81%)', label: ' ' }, { color: 'hsl(28, 80%, 71%)', label: ' ' }, { color: 'hsl(28, 80%, 61%)', label: ' ' }, { color: 'hsl(28, 80%, 52%)', label: ' ' }, { color: 'hsl(28, 74%, 46%)', label: ' ' }, { color: 'hsl(28, 74%, 39%)', label: ' ' }, { color: 'hsl(28, 74%, 33%)', label: ' ' }, { color: 'hsl(28, 74%, 27%)', label: ' ' }, { color: 'hsl(24, 71%, 94%)', label: ' ' }, { color: 'hsl(24, 71%, 88%)', label: ' ' }, { color: 'hsl(24, 71%, 77%)', label: ' ' }, { color: 'hsl(24, 71%, 65%)', label: ' ' }, { color: 'hsl(24, 71%, 53%)', label: ' ' }, { color: 'hsl(24, 100%, 41%)', label: ' ' }, { color: 'hsl(24, 100%, 36%)', label: ' ' }, { color: 'hsl(24, 100%, 31%)', label: ' ' }, { color: 'hsl(24, 100%, 26%)', label: ' ' }, { color: 'hsl(24, 100%, 22%)', label: ' ' }, { color: 'hsl(192, 15%, 99%)', label: ' ' }, { color: 'hsl(192, 15%, 99%)', label: ' ' }, { color: 'hsl(192, 15%, 97%)', label: ' ' }, { color: 'hsl(192, 15%, 96%)', label: ' ' }, { color: 'hsl(192, 15%, 95%)', label: ' ' }, { color: 'hsl(192, 15%, 94%)', label: ' ' }, { color: 'hsl(192, 5%, 82%)', label: ' ' }, { color: 'hsl(192, 3%, 71%)', label: ' ' }, { color: 'hsl(192, 2%, 60%)', label: ' ' }, { color: 'hsl(192, 1%, 49%)', label: ' ' }, { color: 'hsl(204, 8%, 98%)', label: ' ' }, { color: 'hsl(204, 8%, 95%)', label: ' ' }, { color: 'hsl(204, 8%, 90%)', label: ' ' }, { color: 'hsl(204, 8%, 86%)', label: ' ' }, { color: 'hsl(204, 8%, 81%)', label: ' ' }, { color: 'hsl(204, 8%, 76%)', label: ' ' }, { color: 'hsl(204, 5%, 67%)', label: ' ' }, { color: 'hsl(204, 4%, 58%)', label: ' ' }, { color: 'hsl(204, 3%, 49%)', label: ' ' }, { color: 'hsl(204, 3%, 40%)', label: ' ' }, { color: 'hsl(184, 9%, 96%)', label: ' ' }, { color: 'hsl(184, 9%, 92%)', label: ' ' }, { color: 'hsl(184, 9%, 85%)', label: ' ' }, { color: 'hsl(184, 9%, 77%)', label: ' ' }, { color: 'hsl(184, 9%, 69%)', label: ' ' }, { color: 'hsl(184, 9%, 62%)', label: ' ' }, { color: 'hsl(184, 6%, 54%)', label: ' ' }, { color: 'hsl(184, 5%, 47%)', label: ' ' }, { color: 'hsl(184, 5%, 40%)', label: ' ' }, { color: 'hsl(184, 5%, 32%)', label: ' ' }, { color: 'hsl(184, 6%, 95%)', label: ' ' }, { color: 'hsl(184, 6%, 91%)', label: ' ' }, { color: 'hsl(184, 6%, 81%)', label: ' ' }, { color: 'hsl(184, 6%, 72%)', label: ' ' }, { color: 'hsl(184, 6%, 62%)', label: ' ' }, { color: 'hsl(184, 6%, 53%)', label: ' ' }, { color: 'hsl(184, 5%, 46%)', label: ' ' }, { color: 'hsl(184, 5%, 40%)', label: ' ' }, { color: 'hsl(184, 5%, 34%)', label: ' ' }, { color: 'hsl(184, 5%, 27%)', label: ' ' }, { color: 'hsl(210, 12%, 93%)', label: ' ' }, { color: 'hsl(210, 12%, 86%)', label: ' ' }, { color: 'hsl(210, 12%, 71%)', label: ' ' }, { color: 'hsl(210, 12%, 57%)', label: ' ' }, { color: 'hsl(210, 15%, 43%)', label: ' ' }, { color: 'hsl(210, 29%, 29%)', label: ' ' }, { color: 'hsl(210, 29%, 25%)', label: ' ' }, { color: 'hsl(210, 29%, 22%)', label: ' ' }, { color: 'hsl(210, 29%, 18%)', label: ' ' }, { color: 'hsl(210, 29%, 15%)', label: ' ' }, { color: 'hsl(210, 9%, 92%)', label: ' ' }, { color: 'hsl(210, 9%, 85%)', label: ' ' }, { color: 'hsl(210, 9%, 70%)', label: ' ' }, { color: 'hsl(210, 9%, 55%)', label: ' ' }, { color: 'hsl(210, 14%, 39%)', label: ' ' }, { color: 'hsl(210, 29%, 24%)', label: ' ' }, { color: 'hsl(210, 29%, 21%)', label: ' ' }, { color: 'hsl(210, 29%, 18%)', label: ' ' }, { color: 'hsl(210, 29%, 16%)', label: ' ' }, { color: 'hsl(210, 29%, 13%)', label: ' ' }
                    ],
                    columns: 10
                },
                language: 'en',
                image: {
                    resizeUnit: 'px',
                    toolbar: [
                        'imageTextAlternative',
                        'imageStyle:inline',
                        'imageStyle:block',
                        'imageStyle:side',
                        'linkImage'
                    ]
                },
                table: {
                    contentToolbar: [
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells'
                    ]
                },
                //enable edit with class and inline css in sourceEditing tool
                htmlSupport: {
                    allow: [
                        {
                            name: /.*/,
                            attributes: true,
                            classes: true,
                            styles: true
                        }
                    ]
                },
                licenseKey: '',

            })
            .then(editor => {
                editorValue = editor;
            })
            .catch(error => {
                console.error('Oops, something went wrong!');
                console.error('Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:');
                console.warn('Build id: fx26hugqrxhi-4uan9d1tcbpy');
                console.error(error);
            });
        return editorValue;
    }

    function CustomUpload(editor) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new MyUploadAdapter(loader);

        };
    }

    class MyUploadAdapter {
        constructor(loader) {
            // The file loader instance to use during the upload.
            this.loader = loader;
        }

        // Starts the upload process.
        upload() {
            return this.loader.file
                .then(file => new Promise((resolve, reject) => {
                    this._initRequest();
                    this._initListeners(resolve, reject, file);
                    this._sendRequest(file);
                }));
        }

        // Aborts the upload process.
        abort() {
            if (this.xhr) {
                this.xhr.abort();
            }
        }

        // Initializes the XMLHttpRequest object using the URL passed to the constructor.
        _initRequest() {
            const xhr = this.xhr = new XMLHttpRequest();

            // Note that your request may look different. It is up to you and your editor
            // integration to choose the right communication channel. This example uses
            // a POST request with JSON as a data structure but your configuration
            // could be different.
            xhr.open('POST', url, true);
            xhr.responseType = 'json';
        }

        // Initializes XMLHttpRequest listeners.
        _initListeners(resolve, reject, file) {
            const xhr = this.xhr;
            const loader = this.loader;
            const genericErrorText = `Couldn't upload file: ${file.name}.`;

            xhr.addEventListener('error', () => reject(genericErrorText));
            xhr.addEventListener('abort', () => reject());
            xhr.addEventListener('load', () => {
                const response = xhr.response;
                console.log(response);

                // This example assumes the XHR server's "response" object will come with
                // an "error" which has its own "message" that can be passed to reject()
                // in the upload promise.
                //
                // Your integration may handle upload errors in a different way so make sure
                // it is done properly. The reject() function must be called when the upload fails.
                if (!response || response.error !== "") {
                    return reject(response && response.error ? response.error : genericErrorText);
                }

                // If the upload is successful, resolve the upload promise with an object containing
                // at least the "default" URL, pointing to the image on the server.
                // This URL will be used to display the image in the content. Learn more in the
                // UploadAdapter#upload documentation.
                resolve({
                    default: response.url
                });
            });

            // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
            // properties which are used e.g. to display the upload progress bar in the editor
            // user interface.
            if (xhr.upload) {
                xhr.upload.addEventListener('progress', evt => {
                    if (evt.lengthComputable) {
                        loader.uploadTotal = evt.total;
                        loader.uploaded = evt.loaded;
                    }
                });
            }
        }

        // Prepares the data and sends the request.
        _sendRequest(file) {
            // Prepare the form data.
            const data = new FormData();

            data.append('file', file);

            // Important note: This is the right place to implement security mechanisms
            // like authentication and CSRF protection. For instance, you can use
            // XMLHttpRequest.setRequestHeader() to set the request headers containing
            // the CSRF token generated earlier by your application.

            // Send the request.
            this.xhr.send(data);
        }
    }


    
    function init() {
    }

    return {
        init,
        configContentForm
    }
})(jQuery);


$(document).ready(function () {
    configCkeditor.init();
});
