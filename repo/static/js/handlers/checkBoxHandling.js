//Delete local Storage every time Dashboard reentered
$(".dashboardRow").on('click', function () {
    localStorage.clear();
});

function checkboxHandler() {
    var checkboxValues = JSON.parse(localStorage.getItem('checkBoxValues')) || {};
    $.each(checkboxValues, function (key, value) {
        $("#" + key).prop('checked', value);
    });

    var checkboxes = $('#checkboxes :checkbox');

    checkboxes.on('change', function () {
        var checkboxValueList = [];
        checkboxes.each(function () {
            checkboxValues[this.id] = this.checked;
            if (this.checked) {
                checkboxValueList.push(this.id);
                this.value = this.id;
            }
            else {
                this.value = null
            }
        });
        localStorage.setItem('checkBoxValues', JSON.stringify(checkboxValues));
        $('#checkboxes').val(checkboxValueList);
    });
}