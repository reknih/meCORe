    "use strict";
    var callI = 0;
    var TimeToFade = 1000.0;
    var timeout;

    function anyPictureLoader() {
        if (callI % 2 == 0) {
            //console.log("new Pictures1")
            any_picture(1);
        } else {
            //console.log("new Pictures2")
            any_picture(4);
            //console.log("fading");
        }
        callI++;
    };
        //Mit einer Funktion wesentlich besser zu warten!
function abc(width, height, maxSideLength, maxSideWidth) {
            if (!width || !height || !maxSideLength || !maxSideWidth) { return false };
            //if (width > height) {
            var scaleFactor = maxSideLength / Math.max(width, height);
            //} else {
            //var scaleFactor = maxSideWidth / Math.max(width, height);
            //}
            var dimensions = {};

            if (scaleFactor >= 1) {
                dimensions.width = width;
                dimensions.height = height;
            } else {
                dimensions.width = Math.floor(width * scaleFactor);
                dimensions.height = Math.floor(height * scaleFactor);
            }

            return dimensions;
        }

        function any_picture(instAP) {
    if (instAP !== 1 && instAP !== 2 && instAP !== 3 && instAP !== 4 && instAP !== 5 && instAP !== 6) return false;
            var picStr = "picture" + instAP;
            var number = Math.floor(Math.random() * globalPics.length); 
            try {
                openPic(globalPics[number], document.getElementById(picStr), true, instAP).then(function (ImageProperties) {
                    metaCase(ImageProperties, instAP, picStr);
                });
                picObj2[instAP] = globalPics[number];
            }
    catch (err) { }
          
        }

        function metaCase(ImageProperties, instMC, picStr) {
            if (callI !== 0) {
                fade("picture4");
        fade("picture5");
        fade("picture6");
            }
            try {
                var height = ImageProperties.height;
                //console.log("height: " + height);
                var width = ImageProperties.width;
                //console.log("width: " + width);
                var toSwitch = instMC;
                switch (instMC) {
                    case 4: toSwitch = 1; break;
                    case 5: toSwitch = 2; break;
                    case 6: toSwitch = 3; break;
                }
                switch (toSwitch) {
                    case 1:
                            //if (width > height) {
                            var scaleFactor = document.getElementById("col1").clientHeight / Math.min(width, height);
                            //} else {
                            //var scaleFactor = maxSideWidth / Math.max(width, height);
                            //}
                            var dimensions = {};

                            if (scaleFactor >= 1) {
                                dimensions.width = width;
                                dimensions.height = height;
                            } else {
                                dimensions.width = Math.floor(width * scaleFactor);
                                dimensions.height = Math.floor(height * scaleFactor);
                            }

                            //console.log("Hoch!");
                            document.getElementById("picture" + instMC).height = dimensions.height;
                            document.getElementById("picture" + instMC).width = dimensions.width;
                            if (!(document.getElementById("picture" + instMC).clientHeight > document.getElementById("col1").clientHeight) || !(document.getElementById("picture" + instMC).clientHeight == document.getElementById("col1").clientHeight)) {
                                document.getElementById("picture" + instMC).style.minHeight = "100%"
                            }
                            if (!(document.getElementById("picture" + instMC).clientWidth > document.getElementById("col1").clientWidth) || !(document.getElementById("picture" + instMC).clientHeight == document.getElementById("col1").clientWidth)) {
                                document.getElementById("picture" + instMC).style.minHeight = "100%"
                            }
                            break;
                    default:
                        if (height > width) {
                            //if (width > height) {
                            var scaleFactor = document.getElementById("col2").clientWidth / Math.max(width, height);
                            //} else {
                            //var scaleFactor = maxSideWidth / Math.max(width, height);
                            //}
                            var dimensions = {};

                            if (scaleFactor >= 1) {
                                dimensions.width = width;
                                dimensions.height = height;
                            } else {
                                dimensions.width = Math.floor(width * scaleFactor);
                                dimensions.height = Math.floor(height * scaleFactor);
                            }

                            document.getElementById("picture" + instMC).height = dimensions.height;
                            document.getElementById("picture" + instMC).width = dimensions.width;
                        } else {
                            var scaleFactor = document.getElementById("col2").clientHeight / Math.max(width, height);
                            //} else {
                            //var scaleFactor = maxSideWidth / Math.max(width, height);
                            //}
                            var dimensions = {};

                            if (scaleFactor >= 1) {
                                dimensions.width = width;
                                dimensions.height = height;
                            } else {
                                dimensions.width = Math.floor(width * scaleFactor);
                                dimensions.height = Math.floor(height * scaleFactor);
                            }

                            document.getElementById("picture" + instMC).height = dimensions.height;
                            document.getElementById("picture" + instMC).width = dimensions.width;

                        }
                        break;
                }
            } catch (err) {
                //console.log(err)
            }
        }
        function fade(eid) {
            var element = document.getElementById(eid);
            if (element == null)
                return;

            if (element.FadeState == null) {
                if (element.style.opacity == null
                    || element.style.opacity == ''
                    || element.style.opacity == '1') {
                    element.FadeState = 2;
                }
                else {
                    element.FadeState = -2;
                }
            }

            if (element.FadeState == 1 || element.FadeState == -1) {
                element.FadeState = element.FadeState == 1 ? -1 : 1;
                element.FadeTimeLeft = TimeToFade - element.FadeTimeLeft;
            }
            else {
                element.FadeState = element.FadeState == 2 ? -1 : 1;
                element.FadeTimeLeft = TimeToFade;
                setTimeout("animateFade(" + new Date().getTime() + ",'" + eid + "')", 33);
            }
        }
        function animateFade(lastTick, eid) {
            var curTick = new Date().getTime();
            var elapsedTicks = curTick - lastTick;

            var element = document.getElementById(eid);

            if (element.FadeTimeLeft <= elapsedTicks) {
                element.style.opacity = element.FadeState == 1 ? '1' : '0';
                element.style.filter = 'alpha(opacity = '
                    + (element.FadeState == 1 ? '100' : '0') + ')';
                element.FadeState = element.FadeState == 1 ? 2 : -2;
                return;
            }

            element.FadeTimeLeft -= elapsedTicks;
            var newOpVal = element.FadeTimeLeft / TimeToFade;
            if (element.FadeState == 1)
                newOpVal = 1 - newOpVal;

            element.style.opacity = newOpVal;
            element.style.filter = 'alpha(opacity = ' + (newOpVal * 100) + ')';

            setTimeout("animateFade(" + curTick + ",'" + eid + "')", 33);
        }