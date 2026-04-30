#target illustrator

if (app.documents.length > 0) {
    var doc = app.activeDocument;

    var win = new Window("dialog", "Illustrator Page Numbering Pro");
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];

    // ================= RANGE =================
    var panelRange = win.add("panel", undefined, "Range");
    panelRange.orientation = "row";

    panelRange.add("statictext", undefined, "From:");
    var txtStart = panelRange.add("edittext", undefined, 1);
    txtStart.characters = 4;

    panelRange.add("statictext", undefined, "To:");
    var txtEnd = panelRange.add("edittext", undefined, doc.artboards.length);
    txtEnd.characters = 4;

    // ================= NUMBERING =================
    var panelNum = win.add("panel", undefined, "Numbering");
    panelNum.orientation = "row";

    panelNum.add("statictext", undefined, "Start at:");
    var txtNumStart = panelNum.add("edittext", undefined, 1);
    txtNumStart.characters = 4;

    var chkSkipCover = panelNum.add("checkbox", undefined, "Skip cover");
    chkSkipCover.value = true;

    // ================= MODE =================
    var panelMode = win.add("panel", undefined, "Mode");
    panelMode.orientation = "row";

    var radSpread = panelMode.add("radiobutton", undefined, "Facing Pages");
    var radSingle = panelMode.add("radiobutton", undefined, "Single Pages");
    var radCenter = panelMode.add("radiobutton", undefined, "Centered");

    radSpread.value = true;

    // ================= MARGINS =================
    var panelMargins = win.add("panel", undefined, "Side Margins");
    panelMargins.orientation = "column";

    var grpEven = panelMargins.add("group");
    grpEven.add("statictext", undefined, "Even pages (← left):");
    var txtMarginEven = grpEven.add("edittext", undefined, 20);

    var grpOdd = panelMargins.add("group");
    grpOdd.add("statictext", undefined, "Odd pages (right →):");
    var txtMarginOdd = grpOdd.add("edittext", undefined, 20);

    // ================= VERTICAL =================
    var panelVertical = win.add("panel", undefined, "Vertical Position");
    panelVertical.orientation = "row";

    panelVertical.add("statictext", undefined, "Margin:");
    var txtMarginVertical = panelVertical.add("edittext", undefined, 20);

    panelVertical.add("statictext", undefined, "Offset:");
    var txtOffset = panelVertical.add("edittext", undefined, 0);

    // ================= TEXT =================
    var panelText = win.add("panel", undefined, "Text");
    panelText.orientation = "column";

    var grpSize = panelText.add("group");
    grpSize.add("statictext", undefined, "Size:");
    var txtSize = grpSize.add("edittext", undefined, 12);

    // FONT DROPDOWN
    var grpFont = panelText.add("group");
    grpFont.add("statictext", undefined, "Font:");

    var ddlFont = grpFont.add("dropdownlist", undefined, []);
    ddlFont.preferredSize.width = 260;

    for (var i = 0; i < app.textFonts.length; i++) {
        ddlFont.add("item", app.textFonts[i].name);
    }

    ddlFont.selection = 0;

    var chkBold = panelText.add("checkbox", undefined, "Bold");

    // ================= TEXT COLOR =================
    var panelColor = win.add("panel", undefined, "Text Color");
    panelColor.orientation = "row";

    var radBlack = panelColor.add("radiobutton", undefined, "Black");
    var radWhite = panelColor.add("radiobutton", undefined, "White");
    var radRGB = panelColor.add("radiobutton", undefined, "RGB");
    radBlack.value = true;

    var txtR = panelColor.add("edittext", undefined, 0);
    var txtG = panelColor.add("edittext", undefined, 0);
    var txtB = panelColor.add("edittext", undefined, 0);

    // ================= BACKGROUND =================
    var panelBg = win.add("panel", undefined, "Background");
    panelBg.orientation = "column";

    var chkBg = panelBg.add("checkbox", undefined, "Enable background");
    chkBg.value = true;

    var grpBgColor = panelBg.add("group");
    var radBgBlack = grpBgColor.add("radiobutton", undefined, "Black");
    var radBgWhite = grpBgColor.add("radiobutton", undefined, "White");
    var radBgHEX = grpBgColor.add("radiobutton", undefined, "HEX");
    radBgBlack.value = true;

    var txtHEX = panelBg.add("edittext", undefined, "#000000");

    var grpRadius = panelBg.add("group");
    grpRadius.add("statictext", undefined, "Corner radius:");
    var txtRadius = grpRadius.add("edittext", undefined, 6);

    var grpPadding = panelBg.add("group");
    grpPadding.add("statictext", undefined, "Padding:");
    var txtPadding = grpPadding.add("edittext", undefined, 8);

    // ================= CONTENT =================
    var panelFooter = win.add("panel", undefined, "Content");
    var txtFooter = panelFooter.add("edittext", undefined, "*page*");

    var chkOverwrite = win.add("checkbox", undefined, "Replace existing");
    chkOverwrite.value = true;

    var btn = win.add("button", undefined, "Generate");

    btn.onClick = function () {

        function num(v, def) {
            v = parseFloat(v);
            return isNaN(v) ? def : v;
        }

        function getBgColor() {
            var c = new RGBColor();

            if (radBgBlack.value) { c.red=0;c.green=0;c.blue=0; }
            else if (radBgWhite.value) { c.red=255;c.green=255;c.blue=255; }
            else {
                var hex = txtHEX.text.replace("#","");
                if (hex.length !== 6) {
                    alert("Invalid HEX. Use #RRGGBB");
                    return null;
                }
                c.red=parseInt(hex.substr(0,2),16);
                c.green=parseInt(hex.substr(2,2),16);
                c.blue=parseInt(hex.substr(4,2),16);
            }
            return c;
        }

        var startAB = Math.max(0, parseInt(txtStart.text) - 1);
        var endAB = Math.min(doc.artboards.length - 1, parseInt(txtEnd.text) - 1);
        var page = parseInt(txtNumStart.text) || 1;

        var marginEven = num(txtMarginEven.text, 20);
        var marginOdd = num(txtMarginOdd.text, 20);
        var marginVertical = num(txtMarginVertical.text, 20);
        var offset = num(txtOffset.text, 0);
        var size = num(txtSize.text, 12);

        var padding = num(txtPadding.text, 8);
        var radius = num(txtRadius.text, 6);

        var color = new RGBColor();
        if (radBlack.value) color.red=color.green=color.blue=0;
        else if (radWhite.value) color.red=color.green=color.blue=255;
        else {
            color.red=num(txtR.text,0);
            color.green=num(txtG.text,0);
            color.blue=num(txtB.text,0);
        }

        var layer;
        try { layer = doc.layers["Page Numbers"]; }
        catch(e){ layer=doc.layers.add(); layer.name="Page Numbers"; }

        if (chkOverwrite.value){
            while (layer.pageItems.length > 0){
                layer.pageItems[0].remove();
            }
        }

        for (var i=startAB;i<=endAB;i++){

            if (chkSkipCover.value && i===0) continue;

            var ab = doc.artboards[i];
            var rect = ab.artboardRect;
            var isEven = (page%2===0);

            var x = radCenter.value
                ? (rect[0]+rect[2])/2
                : (radSpread.value
                    ? (isEven ? rect[0]+marginEven : rect[2]-marginOdd)
                    : rect[2]-marginOdd);

            var y = rect[3] + marginVertical + offset;

            var txt = layer.textFrames.add();
            txt.contents = txtFooter.text.replace("*page*", page);

            var tr = txt.textRange;
            var attr = tr.characterAttributes;

            attr.size = size;
            attr.fillColor = color;

            try {
                var fontName = ddlFont.selection.text;
                if (chkBold.value && fontName === "ArialMT") {
                    fontName = "Arial-BoldMT";
                }
                attr.textFont = app.textFonts.getByName(fontName);
            } catch(e){}

            tr.paragraphAttributes.justification =
                radCenter.value ? Justification.CENTER :
                (radSpread.value && isEven ? Justification.LEFT : Justification.RIGHT);

            txt.position = [x,y];

            if (chkBg.value){
                var bgColor = getBgColor();
                if (!bgColor) return;

                var b = txt.visibleBounds;

                var rectBg = (radius>0)
                    ? layer.pathItems.roundedRectangle(
                        b[1]+padding, b[0]-padding,
                        (b[2]-b[0])+padding*2,
                        (b[1]-b[3])+padding*2,
                        radius, radius)
                    : layer.pathItems.rectangle(
                        b[1]+padding, b[0]-padding,
                        (b[2]-b[0])+padding*2,
                        (b[1]-b[3])+padding*2);

                rectBg.fillColor = bgColor;
                rectBg.stroked = false;
                rectBg.zOrder(ZOrderMethod.SENDTOBACK);
            }

            page++;
        }

        app.redraw();
        win.close();
    };

    win.center();
    win.show();

} else {
    alert("No document open.");
}