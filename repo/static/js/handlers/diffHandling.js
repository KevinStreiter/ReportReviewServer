$(function () {
    if ('diff' === $('body').data('page')) {
        diff();
    }

    function diff() {
        var writing = $('#writing').text();
        var final = $('#final').text();
        var diff = JsDiff.diffWords(writing, final);
        var display = $('#diff').get(0);
        while (display.firstChild) {
            display.removeChild(display.firstChild);
        }
        var fragment = document.createDocumentFragment();

        diff.forEach(function (part) {
            // green for additions, red for deletions
            // grey for common parts
            color = part.added ? 'green' :
                part.removed ? 'red' : 'grey';
            span = document.createElement('span');
            span.style.color = color;
            if (part.removed === true) {
                span.className = "strike";
            }
            span.appendChild(document.createTextNode(part.value));
            fragment.appendChild(span);
        });
        display.appendChild(fragment);
    }

    $('input[type=radio][name=befund_text]').change(function () {
        var writing = $('#writing');
        var x = document.getElementById(this.value).textContent;
        writing.text(x);
        diff();
        if (this.value === 'befund_s') {
            $('#words_added_g_f').addClass('dn');
            $('#words_deleted_g_f').addClass('dn');
            $('#jaccard_g_f').addClass('dn');
            $('#words_added_s_f').removeClass('dn');
            $('#words_deleted_s_f').removeClass('dn');
            $('#jaccard_s_f').removeClass('dn')
        } else if (this.value === 'befund_g') {
            $('#words_added_g_f').removeClass('dn');
            $('#words_deleted_g_f').removeClass('dn');
            $('#jaccard_g_f').removeClass('dn');
            $('#words_added_s_f').addClass('dn');
            $('#words_deleted_s_f').addClass('dn');
            $('#jaccard_s_f').addClass('dn')
        }
    });
});