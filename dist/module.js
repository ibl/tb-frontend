(function () {
    if (!IPE) {
        console.error("This module is meant for use in IPE: https://github.com/ibl/IPE");
    } else {
        IPE.ui.registerTab({
            id: "mtb",
            title: "Molecular Tumor Boards",
            content: "<iframe width=\"800\" height=\"600\" src=\"http://ibl.github.io/tb-frontend/#/\" frameborder=\"0\"></iframe>",
            switchTab: true
        });
    }
})();
