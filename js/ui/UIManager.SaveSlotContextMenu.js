(function () {
    var c = function (a, b, d, f, g) {
        var k = {};
        if ("auto" == a) DataStore.loadSlotAsync(a, function (a) {
            a = JSON.parse(a).slot;
            "auto" == a ? g("not supported") : c(a, b, d, f, g)
        }, g);
        else {
            var l = d;
            l || (l = SaveMismatchStrategy.UseLocal);
            var m = function (b) {
                5 <= b ? f(k) : n(a + "L" + b, b, l)
            },
                n = function (a, c, d) {
                    DataStore.loadSlotAsync(a, function (a) {
                        if (a) {
                            var d = JSON.parse(a);
                            if (!d || !d.company || d.company.uid != b) {
                                m(++c);
                                return
                            }
                        }
                        a && "" != a && (k["L" + c.toString()] =
                            a);
                        m(++c)
                    }, function () {
                        m(++c)
                    }, {
                        mismatchStrategy: d
                    })
                };
            m(1)
        }
    }
    UI.showSaveSlotContextMenu = function (a, b, c) {
        var d = [];
        c && "auto" != b && d.push({
            label: "Delete".localize("menu item"),
            icon: "./images/context menu icons/icon_save_delete.svg",
            action: function () {
                Sound.click();
                UI.deleteSaveSlot(b)
            }
        });
        UI.showContextMenu(d, {
            x: a.clientX,
            y: a.clientY
        }, {
            position: "rightStack"
        })
    };
})();