(function () {
    var b = function (a) {
        return "https://greenback.greenheartgames.com/api/{0}?code=aXxCQxF1HOwaElXscdr9hJ1/hTRfSPJaaQn5cexlXSjLOO71bGlFhQ==".format(a)
    };
    UI.uploadToCloud = function (a) {
        var b = $("#createShareCodeWindow").clone();
        d(b);
        var c = !1,
            g = b.find(".checkbox.legal");
        g.clickExcl(function (a) {
            Sound.click();
            c = !c;
            g.toggleClass("icon-check-empty", !c);
            g.toggleClass("icon-check", c);
            b.find(".uploadToCloudButton").toggleClass("disabled",
                !c)
        });
        b.find(".description").text("Upload your game to our servers and receive a short save-code which you can then use to continue playing on a different device.".localize());
        b.find(".page1").show();
        b.find(".legalCheck").show();
        b.find(".page2").hide();
        b.find(".page3").hide();
        b.find(".uploadToCloudButton").clickExcl(function () {
            Sound.click();
            $(this).hasClass("disabled") ? g.parent().effect("shake", {
                times: 2,
                distance: 5
            }, 50) : ($(this).unbind("click"), b.find(".page1").hide(), b.find(".legalCheck").hide(),
                b.find(".uploadToCloudButton").toggleClass("disabled", !0), b.find(".page2").show(), b.find(".description").text(""), b.find(".topPart").height("160px"), f(a, function (a) {
                    a = a.substring(4);
                    b.find(".page2").hide();
                    b.find(".page3").show();
                    b.find(".topPart").height("auto");
                    b.find(".description").text("Hooray! The servers have generated this beautiful save-code for you.".localize());
                    a = "GDT-" + a;
                    b.find(".sharecodeInput").val(a).focus().select();
                    var c = !1;
                    try {
                        if (PlatformShim.ISWIN8) {
                            var d = new Windows.ApplicationModel.DataTransfer.DataPackage;
                            d.setText(a);
                            Windows.ApplicationModel.DataTransfer.Clipboard.setContent(d);
                            c = !0
                        } else document.execCommand("copy") && (c = !0)
                    } catch (f) { }
                    c ? b.find(".copiedNotice").text("The save-code was copied to your clipboard.".localize()) : b.find(".copiedNotice").text("Please copy the save-code to your clipboard.".localize());
                    b.find(".sharecodeInput").width("290px");
                    b.find(".prefix").hide();
                    b.find(".uploadToCloudButton").toggleClass("disabled", !1).text("Close".localize()).clickExclOnce(function () {
                        Sound.click();
                        b.dialog("close");
                        UI.closeContextMenu()
                    })
                }, function (a) {
                    var b = a;
                    a.errorStatus && (b = a.errorStatus);
                    PlatformShim.alert(b, "Error".localize());
                    UI.closeAllLoadSaveViews()
                }))
        }).addClass("disabled");
        b.find(".externalLink").clickExcl(function () {
            Sound.click();
            var a = $(this).attr("href");
            a.startsWith("https://www.greenheartgames.com") && PlatformShim.openUrlExternal(a)
        });
        var k = b.find(".saveContainer"),
            l = GameManager.getSaveGames().first(function (b) {
                return null != b && b.slot == a
            }),
            l = UI._getElementForSaveGame(l, new Company("X"));
        l.find(".saveSlotOptions").hide();
        l.addClass("disabled");
        k.append(l);
        b.gdDialog({
            zIndex: 3E4,
            disableOverlayFix: !0,
            close: !0,
            popout: !0
        })
    };
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
    },
        f = function (a, d, f) {
            var g = {};
            DataStore.loadSlotAsync(a, function (k) {
                var m = JSON.parse(k),
                    n = null;
                m ? (m.company && m.company.uid && (n = m.company.uid), c(a, n, g.chosenMismatchStrategy, function (c) {
                    var g = new JSZip,
                        m = l(DataStore.getValue(a), k);
                    g.file("saveHeader", m);
                    g.file("saveFile", r(k));
                    for (var n in c) g.file(n, r(c[n]));
                    g.generateAsync({
                        type: "uint8array",
                        compression: "DEFLATE",
                        compressionOptions: {
                            level: 9
                        }
                    }).then(function (a) {
                        a = new Blob([a], {
                            type: "application/octet-stream"
                        });
                        var c = new FormData;
                        c.append("saveFile", a);
                        $.ajax({
                            type: "POST",
                            url: b("saves/share/gdt"),
                            data: c,
                            processData: !1,
                            contentType: !1,
                            success: d,
                            error: f
                        })
                    }, f)
                }, f)) : f("save not found")
            }, function (a) {
                f("failed to load save file:\n" + a)
            }, g)
        };
    UI.showSaveSlotContextMenu = function (a, b, c) {
        var d = [];
        c && d.push({
            label: "Upload".localize("menu item"),
            icon: "./images/context menu icons/icon_cloud_up.svg",
            action: function () {
                Sound.click();
                UI.uploadToCloud(b)
            }
        });
        "auto" != b && d.push({
            label: "Download".localize("menu item"),
            icon: "./images/context menu icons/icon_cloud_down.svg",
            action: function () {
                Sound.click();
                UI.downloadFromCloud(b)
            }
        });
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
    var d = function (a) {
        var b = "<span>I agree to the {0}</span>".localize("where parameter is save sharing policy").format('<a class="externalLink" href="https://www.greenheartgames.com/legal/game-data-policy">Game Data Policy</a>');
        a.find(".legal.label").append($(b))
    };
    UI.downloadFromCloud = function (a, b) {
        var c = $("#createShareCodeWindow").clone();
        d(c);
        var f = c.find(".sharecodeInput");
        f.attr("maxlength", 12);
        var l, n = function () {
            var a = r && l;
            c.find(".uploadToCloudButton").toggleClass("disabled", !a)
        };
        f.on("input", function () {
            var a = f.val().trim();
            a ? (a.startsWith("GDT-") && (a = a.substring(4), f.val(a)), l = 8 == a.length ? !0 : !1) : l = !1;
            n()
        });
        var r = !1,
            z = c.find(".checkbox");
        z.clickExcl(function (a) {
            Sound.click();
            r = !r;
            z.toggleClass("icon-check-empty", !r);
            z.toggleClass("icon-check", r);
            n()
        });
        c.find(".description").text("Enter a save-code to download the corresponding game into the selected save slot.".localize());
        c.find(".page1").hide();
        c.find(".legalCheck").show();
        c.find(".page2").hide();
        c.find(".page3").show();
        c.find(".copiedNotice").hide();
        c.find(".uploadToCloudButton").text("Download".localize());
        c.find(".windowTitle").text("Download".localize());
        var B = function (a) {
            a && a.responseText && (a = a.responseText);
            PlatformShim.alert(a.toString(), "Error".localize());
            c.dialog("close");
            UI.closeContextMenu()
        };
        c.find(".uploadToCloudButton").clickExcl(function () {
            Sound.click();
            if ($(this).hasClass("disabled")) r ? f.parent().effect("shake", {
                times: 2,
                distance: 5
            }, 50) : z.parent().effect("shake", {
                times: 2,
                distance: 5
            }, 50);
            else {
                $(this).unbind("click");
                c.find(".page3").hide();
                c.find(".page2").show();
                c.find(".legalCheck").hide();
                c.find(".description").text("");
                c.find(".uploadToCloudButton").toggleClass("disabled", !0);
                var b = "GDT-" + f.val().trim(),
                    d = c.find(".checkbox.achievement"),
                    l = !0;
                d.clickExcl(function () {
                    l = !l;
                    z.toggleClass("icon-check-empty", !l);
                    z.toggleClass("icon-check", l)
                });
                k(b, function (b, f, k) {
                    try {
                        f = g(f);
                        c.find(".page2").hide();
                        c.find(".legalCheck").hide();
                        c.find(".topPart").height("50px");
                        d.parent().show();
                        c.find(".uploadToCloudButton").removeClass("disabled").text("Import and load game".localize()).clickExclOnce(function () {
                            Sound.click();
                            m(a, b, f, k, !l, function () {
                                GameManager.reload(a, function () {
                                    Sound.playBackgroundMusic()
                                })
                            }, B)
                        });
                        var n = c.find(".saveContainer");
                        c.find(".flipContainer").height("130px");
                        var r = DataStore.getValue(a);
                        null != r && (r = SaveGameData.parseFromHeaderData(a, r), null != r && (c.find(".uploadToCloudButton").text("Replace and load game".localize()), n.append('<div class="saveReplaceLabel">{0}</div>'.format("Existing".localize())), s = UI._getElementForSaveGame(r, new Company("X")), s.addClass("disabled"), s.find(".saveSlotOptions").hide(), n.append(s), c.find(".flipContainer").height("300px"), n.append('<div class="saveReplaceLabel">{0}</div>'.format("New".localize()))));
                        var q = SaveGameData.parseFromHeaderData(a,
                            f),
                            s = UI._getElementForSaveGame(q, new Company("X"));
                        s.addClass("disabled");
                        s.find(".saveSlotOptions").hide();
                        n.append(s);
                        c.find(".page1").show()
                    } catch (t) {
                        B(t)
                    }
                }, B)
            }
        }).addClass("disabled");
        c.find(".externalLink").clickExcl(function () {
            Sound.click();
            var a = $(this).attr("href");
            a.startsWith("https://www.greenheartgames.com") && PlatformShim.openUrlExternal(a)
        });
        c.gdDialog({
            zIndex: 3E4,
            disableOverlayFix: !0,
            close: !0,
            popout: !0
        })
    };
    var k = function (a, c, d) {
        var f = new FormData;
        f.append("id", a);
        $.ajax({
            type: "POST",
            url: b("saves/load/gdt"),
            data: f,
            processData: !1,
            contentType: !1,
            success: function (a) {
                PlatformShim.ISWIN8 || (a = a.replace("https://", "http://"));
                var b = new XMLHttpRequest;
                b.open("GET", a, !0);
                b.responseType = "arraybuffer";
                b.onload = function (a) {
                    a = new Uint8Array(b.response);
                    (new JSZip).loadAsync(a).then(function (a) {
                        a.file("saveFile").async("string").then(function (b) {
                            a.file("saveHeader").async("string").then(function (d) {
                                var f = {},
                                    g = function (k) {
                                        if (5 == k) c(b, d, f);
                                        else {
                                            var l = "L" + k.toString(),
                                                m = a.file(l);
                                            m ? m.async("string").then(function (a) {
                                                f[l] =
                                                    a;
                                                g(++k)
                                            }, function () {
                                                g(++k)
                                            }) : g(++k)
                                        }
                                    };
                                g(1)
                            }, d)
                        })
                    }, d)
                };
                b.onerror = function (a) {
                    d(a)
                };
                b.send()
            },
            error: d
        })
    },
        m = function (a, b, c, d, f, g, k) {
            try {
                var l = JSON.parse(c);
                l.slot = a;
                b = n(b, a, f);
                for (var m in d) d[m] = n(d[m], a, f);
                var r = function (b) {
                    if (5 == b) DataStore.commit && DataStore.commit(), g();
                    else {
                        var c = "L" + b.toString(),
                            f = "";
                        d[c] && (f = d[c]);
                        DataStore.saveToSlotAsync(a + c, f, function () {
                            r(++b)
                        }, k)
                    }
                };
                DataStore.setValue(a, JSON.stringify(l));
                DataStore.saveToSlotAsync(a, b, function () {
                    r(1)
                }, k)
            } catch (E) {
                k(E)
            }
        },
        l = function (a, b) {
            var c =
                JSON.parse(a);
            c.companyName = c.name;
            delete c.name;
            c.saveTime = c.date;
            c.saveTimeIso = c.date;
            delete c.date;
            var d = JSON.parse(b);
            c.level = d.company.currentLevel;
            return JSON.stringify(c)
        },
        g = function (a) {
            a = JSON.parse(a);
            a.name = a.companyName;
            delete a.companyName;
            a.date = a.saveTimeIso;
            delete a.saveTime;
            delete a.saveTimeIso;
            delete a.level;
            return JSON.stringify(a)
        },
        n = function (a, b, c) {
            a = JSON.parse(a);
            SavegameConverter.fromMobileFormat(a);
            a.slot = b;
            a.company.slot = b;
            a.flags || (a.flags = {});
            a.flags.achievementsDisabled =
                c;
            return JSON.stringify(a)
        },
        r = function (a) {
            a = JSON.parse(a);
            a = SavegameConverter.toMobileFormat(a);
            return JSON.stringify(a)
        }
})();