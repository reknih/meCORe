;
var navigate;
var items;
var calls = 0;
var globalPics = new Array();
var subFolders;
var timesListPicture = 0;
var listwhattodo;
var timeron = false;
var timeToReload;
var timer;
var timeout_pictureloader;
var time;
var picObj2 = {};
var server;
var picindb;
var runTime = 0;
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var timeout_pictureloader;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: Diese Anwendung wurde neu eingeführt. Die Anwendung
                // hier initialisieren.
            } else {
                // TODO: Diese Anwendung war angehalten und wurde reaktiviert.
                // Anwendungszustand hier wiederherstellen.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    WinJS.UI.Pages.define("default.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Resources.processAll();
            navigate = 1;
            document.getElementById("refresh").onclick = anyPictureLoader;
            document.getElementById("picture1").addEventListener("click", function () { details(1) });
            document.getElementById("picture4").addEventListener("click", function () { details(4) });
            //initDB();
            listPictures(false, "anyPictureLoader");
            document.getElementById("settime").onclick = setTime;
            WinJS.Application.onsettings = function (e) {
                e.detail.applicationcommands = {
                    "data": { title: WinJS.Resources.getString("privacy").value },
                    "copy": { title: WinJS.Resources.getString("copyright").value },
                    "settings": { title: WinJS.Resources.getString("settings").value }
                };
                WinJS.UI.SettingsFlyout.populateSettings(e);
            };
            if (timeout_pictureloader) {
                clearInterval(timeout_pictureloader);
            }

        }
    });

    app.oncheckpoint = function (args) {
        // TODO: Diese Anwendung wird gleich angehalten. Jeden Zustand,
        // der über Anhaltevorgänge hinweg beibehalten muss, hier speichern. Dazu kann das
        // WinJS.Application.sessionState-Objekt verwendet werden, das automatisch
        // über ein Anhalten hinweg gespeichert und wiederhergestellt wird. Wenn ein asynchroner
        // Vorgang vor dem Anhalten der Anwendung abgeschlossen werden muss,
        // args.setPromise() aufrufen.
    };

    app.start();




})()
function details(inst) {
    //dumpPicture(picObj2[inst]);
    //window.location = "details.html"
}
function setIntervallatstart() {
    if (time == false || !time) {
        time = 15000;
    }
    timeout_pictureloader = setInterval(anyPictureLoader, Number(time));
    document.getElementById("range").value = Number(time) / 1000
}

function setTime() {
    WinJS.UI.SettingsFlyout.show();
    timeToReload = document.getElementById("range").value * 1000;
    if (timeout_pictureloader) {
        clearInterval(timeout_pictureloader);
    }
    //writeSettings("timeToReload", 'settings', timeToReload);
    timeout_pictureloader = setInterval(anyPictureLoader, timeToReload)
}
function initDB() {
    db.open({
        server: 'meCORe',
        version: 1,
        schema: {
            settings: {
                key: { keyPath: 'id', autoIncrement: false },
                // Optionally add indexes
                indexes: {
                    setting: {},
                    value: { unique: true }
                }
            },
            objects: {
                key: { keyPath: 'id', autoIncrement: false },
                // Optionally add indexes
                indexes: {
                    pic: {},
                    picObj: { unique: true }
                }
            }
        }
    }).done(function (s) {
        server = s
        readSettings("settings", "settings", "timeout_pictureloader");
        var picindb = readSettings("objects", "pic", "allPicture")
        if (!picindb) {
            listPictures(false, "anyPictureLoader");
        }
        else {
            globalPics = picindb;
            anyPictureLoader();
        }
    });
}
function checkDB() {
    if (server !== undefined) { return true } else { setTimeout(checkDB, 100); }
}
function writeSettings(nametowrite, db, contenttowrite) {
    return false;
    checkDB();
    if (db == 'settings') {
        server.settings.remove(0).done(function (key) {
            server.settings.remove(1).done(function () {
                server.settings.add({
                    id: 0,
                    setting: nametowrite,
                    value: contenttowrite
                });
            });
        });
    } else if (db == 'objects') {
        server.objects.remove(0).done(function (key) {
            server.objects.remove(1).done(function () {
                //pobleme beim speichern von array
                server.objects.add({
                    id: 0,
                    pic: nametowrite,
                    value: contenttowrite
                });
            });
            console.log();
        });
    };
};
function dumpPicture(pic) {
    writeSettings("pic1", "objects", pic)
}
function readSettings(dbName, col, nametowrite) {
    return false;
    if (dbName == "settings") {
        query = server.settings.query().filter(col, nametowrite).execute()
          .done(function (results) {
              try {
                  console.log("Results.value" + results[0].value);
                  document.getElementById("range").value = results[0].value / 1000
                  if (timeout_pictureloader) { clearInterval(timeout_pictureloader) }
                  timeout_pictureloader = setInterval(anyPictureLoader, results[0].value)
              } catch (err) {
                  if (timeout_pictureloader) { clearInterval(timeout_pictureloader) }
                  timeout_pictureloader = setInterval(anyPictureLoader, 5000)
              }
          });
    }
    if (dbName == "objects") {
        try {
            query = server.objects.query(col, nametowrite).execute()
                .progress(function (results) {
                    try {
                        picindb[0].value = results;
                        globalPics = picindb;
                        anyPictureLoader();
                        return true;
                    } catch (err) {
                        listPictures(false, "anyPictureLoader");
                        return false;
                    }
                }).fail(function () {
                    listPictures(false, "anyPictureLoader")
                })
        } catch (err) {
            listPictures(false, "anyPictureLoader");
            return false;
        }
    };
}
function link(site) {
    switch (navigate) {
        case 1:
            window.location = "details.html";
            break;
        default:
            window.location = "default.html";
            break;
    }

}

function listPictures(objectURL, whatToDo) {
    var pictures = new Array();
    var folders = new Array();
    if (objectURL) {
        var picturesLibrary = objectURL;
        subFolders++;
    } else if (calls < 1) {
        var picturesLibrary = Windows.Storage.KnownFolders.picturesLibrary;
        calls++;
    } else { return false; }

    picturesLibrary.getItemsAsync().then(function (items) {
        if (items.size == 0) { return };
        if (objectURL) {
            for (var i2 = 0; i2 < items.size; i2++) {
                if (items[i2].isOfType(Windows.Storage.StorageItemTypes.file)) {
                    if (filetype(items[i2].name) == true) {
                        pictures.push(items[i2]);
                    }
                }
                else { folders.push(items[i2]) }

            }
        }
        else {
            for (var i = 0; i < items.size; i++) {
                if (items[i].isOfType(Windows.Storage.StorageItemTypes.file)) {
                    if (filetype(items[i].name) == true) {
                        pictures.push(items[i]);
                    }
                }
                else { folders.push(items[i]) }

            }
        }
        pictures = pictures.concat(globalPics);
        globalPics = pictures;
        if (objectURL) {
            for (var i = 0; i < folders.length ; i++)

                listPictures(folders[i], false);
        }
        else {
            for (var i = 0; i < folders.length ; i++) {

                listPictures(folders[i], false);
            }
        }

        items = pictures;
        timesListPicture++;
        if (!objectURL) {
            listwhattodo = whatToDo;
        }
        wait();

    });
}
function wait() {
    if (timeron == true) {
        window.clearTimeout(timer);
    }
    timer = setTimeout(waitready, 500)
    timeron = true;
}
function waitready() {
    timeron = false;
    runTime++;
    //if (runTime > 1) return false;
    writeSettings("allPicture", "objects", globalPics);
    //if (listwhattodo == "anyPictureLoader") {
    //    anyPictureLoader();
    //}
    //else if (listwhattodo == "choose") {
    //    writeTab();
    //}
}
function openPic(file, element, double, inst) {

    var check = filetype(file.name);
    if (check == true) {
        var objectURL = window.URL.createObjectURL(file, { oneTimeOnly: true });
        //if (double == true) {
        //    if (doublecheck(inst, objectURL) == true)
        //    { return false; }
        //}
        element.src = objectURL;
        return file.properties.getImagePropertiesAsync();
    }
    else {
        return false;
    }

}
function doublecheck(inst, toCompare) {
    switch (inst) {
        case 1: if (toCompare == document.getElementById("picture2").src || toCompare == document.getElementById("picture3").src) {
            any_picture(inst);
            return true;
        }
            break;
        case 2: if (document.getElementById("picture1").src == toCompare || toCompare == document.getElementById("picture3").src) {
            //any_picture(inst);
            //return true;
        }
            break;
        case 3: if (toCompare == document.getElementById("picture2").src || document.getElementById("picture1").src == toCompare) {
            //any_picture(inst);
            //return true;
        }
        case 4: if (toCompare == document.getElementById("picture5").src || toCompare == document.getElementById("picture6").src) {
            any_picture(inst);
            return true;
        }
            break;
        case 5: if (toCompare == document.getElementById("picture4").src || toCompare == document.getElementById("picture6").src) {
            //any_picture(inst);
            //return true;
        }
            break;
        case 6: if (toCompare == document.getElementById("picture5").src || toCompare == document.getElementById("picture4").src) {
            //any_picture(inst);
            //return true;
        }
            break;
    }
    return false;
}

function filetype(name) {
    var index_of_dot = name.lastIndexOf(".");
    var filetype = name.substring(index_of_dot, (name.length + 1))
    filetype = filetype.toLowerCase()

    //erlaubte Dateitypen!!
    if (filetype == ".jpg" || filetype == ".tif" || filetype == ".bmp" || filetype == ".jpeg") {
        return (true)
    }

    else {
        return (false);
    }
}