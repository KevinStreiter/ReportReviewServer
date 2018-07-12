$(function () {
    if ('treeMap' === $('body').data('page')) {
        selectionHandler();
        drawColorScale();
    }
});

function treeMapModuleLoaded() {
    com.macrofocus.treemap.TreeMap.setLicenseKey("Kevin Streiter",
        "TG2GS-W57BU-4CLVB-866AK-QQFBT-DGV3W");
    treeMap = new com.macrofocus.treemap.TreeMap("treeMap");
    treeMap.loadJavaScriptArray(rows);
    var selection = $('#selectValue option:selected');
    treeMap.setColorByName(selection.val());
    $('#colorScaleLabelValue').text("[" + selection.text() + "]:");
}

function treeMapModelLoaded() {
    treeMap.setToolTipByNames("untart_name", "schreiber", "freigeber", "befund_freigabe", "jaccard_s_f", "jaccard_g_f",
        "words_added_relative_s_f", "words_added_relative_g_f", "words_deleted_relative_s_f", "words_deleted_relative_g_f");
    treeMap.setRendering(com.macrofocus.treemap.RenderingFactory.FLAT_NO_BORDER);
    treeMap.getView().getToolTip().setPreferredWidth(350);
    var treeMapModel = treeMap.getModel();
    var treeMapSettings = treeMapModel.getSettings();
    treeMapSettings.setShowPopup(treeMap.getModel().getTreeMapField(), true);
    treeMapSettings.getFieldSettings(treeMap.getModel().getTreeMapField()).setShowLabel(true);
    var fieldSettings = treeMapSettings.getDefaultFieldSettings();
    fieldSettings.setBorderThickness(0.5);
    fieldSettings.setLabelingMinimumCharactersToDisplay(3);
    fieldSettings.setAlgorithm(com.macrofocus.treemap.AlgorithmFactory.SQUARIFIED);
    setGroupByByNames();
    clickHandler(treeMapModel);
}

function clickHandler(treeMapModel) {

    var treeMap = $("#treeMap");

    treeMap.contextmenu(function () {

        var node = treeMapModel.getProbing()["a"],
            befund_schluessel = treeMapModel.getValueAt(node, "befund_schluessel");

        if (befund_schluessel != null) {
            $(document).contextmenu(function () {
                return false;
            });
            window.location = "diff/" + befund_schluessel;
        }
    });
}

function selectionHandler() {
    $('#selectValue').change(function () {
        var selection = $("#selectValue option:selected"),
            selectionValue = selection.val();
        treeMap.setColorByName(selectionValue);
        $('#colorScaleLabelValue').text("[" + selection.text() + "]");
    });
    $('#selectGroup').change(function () {
        setGroupByByNames();
    });
}

function setGroupByByNames() {
    var selection = $("#selectGroup option:selected").val(),
        selectionParts = selection.split(",", 3);
    selectionParts = selectionParts.map(function (part) {
        return part.trim();
    });

    switch (selectionParts.length) {
        case 0:
            break;
        case 1:
            treeMap.setGroupByByNames(selectionParts[0]);
            break;
        case 2:
            treeMap.setGroupByByNames(selectionParts[0], selectionParts[1]);
            break;
        case 3:
            treeMap.setGroupByByNames(selectionParts[0], selectionParts[1], selectionParts[2]);
    }
}