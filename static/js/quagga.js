

function eanCheckDigit(s) {
    if ('number' === typeof s)
        s = s.toString()
    let result = 0;
    for (counter = s.length - 1; counter >= 0; counter--) {
        result = result + parseInt(s.charAt(counter)) * (1 + (2 * (counter % 2)));
    }
    return (10 - (result % 10)) % 10 === 0;
}


function quagga(initCb, detectionCb) {

    let App = {
        init: function () {
            let self = this;

            Quagga.init(this.state, function (err) {
                if (err) {
                    initCb(err)
                    return self.handleError(err);
                }
                // let drawingCtx = Quagga.canvas.ctx.overlay,
                // drawingCanvas = Quagga.canvas.dom.overlay;
                // //Quagga.registerResultCollector(resultCollector);
                // Quagga.ImageDebug.drawPath([{x: -2, y: 640}
                //     ,{x: 722, y: 640}], {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 10});

                App.attachListeners();
                App.checkCapabilities();
                Quagga.start();
                initCb()


            });
        },
        handleError: function (err) {
            console.log(err);
        },
        checkCapabilities: function () {
            let track = Quagga.CameraAccess.getActiveTrack();
            let capabilities = {};
            if (typeof track.getCapabilities === 'function') {
                capabilities = track.getCapabilities();
            }
            this.applySettingsVisibility('zoom', capabilities.zoom);
            this.applySettingsVisibility('torch', capabilities.torch);
        },
        updateOptionsForMediaRange: function (node, range) {
            console.log('updateOptionsForMediaRange', node, range);
            let NUM_STEPS = 6;
            let stepSize = (range.max - range.min) / NUM_STEPS;
            let option;
            let value;
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            for (let i = 0; i <= NUM_STEPS; i++) {
                value = range.min + (stepSize * i);
                option = document.createElement('option');
                option.value = value;
                option.innerHTML = value;
                node.appendChild(option);
            }
        },
        applySettingsVisibility: function (setting, capability) {
            // depending on type of capability
            if (typeof capability === 'boolean') {
                let node = document.querySelector('input[name="settings_' + setting + '"]');
                if (node) {
                    node.parentNode.parentNode.parentNode.style.display = capability ? '' : 'none';
                    node.parentNode.style.display = '';

                }
                return;
            }
            if (window.MediaSettingsRange && capability instanceof window.MediaSettingsRange) {
                let node = document.querySelector('select[name="settings_' + setting + '"]');
                if (node) {
                    this.updateOptionsForMediaRange(node, capability);
                    node.parentNode.style.display = '';
                    node.parentNode.parentNode.parentNode.style.display = '';
                }
                return;
            }
        },
        initCameraSelection: function () {
            let streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

            return Quagga.CameraAccess.enumerateVideoDevices()
                .then(function (devices) {
                    function pruneText(text) {
                        return text.length > 30 ? text.substr(0, 30) : text;
                    }
                    let $deviceSelection = document.getElementById("deviceSelection");
                    while ($deviceSelection.firstChild) {
                        $deviceSelection.removeChild($deviceSelection.firstChild);
                    }
                    devices.forEach(function (device) {
                        let $option = document.createElement("option");
                        $option.value = device.deviceId || device.id;
                        $option.appendChild(document.createTextNode(pruneText(device.label || device.deviceId || device.id)));
                        $option.selected = streamLabel === device.label;
                        $deviceSelection.appendChild($option);
                    });
                });
        },
        attachListeners: function () {
            let self = this;

            self.initCameraSelection();
            // $(".controls").on("click", "button.stop", function (e) {
            //     e.preventDefault();
            //     Quagga.stop();
            //     self._printCollectedResults();
            // });

            $(".reader-config-group").on("change", "input, select", function (e) {
                e.preventDefault();
                let $target = $(e.target),
                    value = $target.attr("type") === "checkbox" ? $target.prop("checked") : $target.val(),
                    name = $target.attr("name"),
                    state = self._convertNameToState(name);

                console.log("Value of " + state + " changed to " + value);
                self.setState(state, value);
            });
        },
        _convertNameToState: function (name) {
            return name.replace("_", ".").split("-").reduce(function (result, value) {
                return result + value.charAt(0).toUpperCase() + value.substring(1);
            });
        },
        detachListeners: function () {
            // $(".controls").off("click", "button.stop");
            $(".reader-config-group").off("change", "input, select");
        },
        applySetting: function (setting, value) {
            let track = Quagga.CameraAccess.getActiveTrack();
            if (track && typeof track.getCapabilities === 'function') {
                switch (setting) {
                    case 'zoom':
                        return track.applyConstraints({
                            advanced: [{
                                zoom: parseFloat(value)
                            }]
                        });
                    case 'torch':
                        return track.applyConstraints({
                            advanced: [{
                                torch: !!value
                            }]
                        });
                }
            }
        },
        setState: function (path, value) {
            let self = this;

            if (typeof accessByPath(self.inputMapper, path) === "function") {
                value = accessByPath(self.inputMapper, path)(value);
            }

            if (path.startsWith('settings.')) {
                let setting = path.substring(9);
                return self.applySetting(setting, value);
            }
            accessByPath(self.state, path, value);

            console.log(JSON.stringify(self.state));
            App.detachListeners();
            Quagga.stop();
            App.init();
        },
        inputMapper: {
            inputStream: {
                target: '#interactive',
                constraints: function (value) {
                    if (/^(\d+)x(\d+)$/.test(value)) {
                        let values = value.split('x');
                        return {
                            width: {
                                min: 800
                            },
                            height: {
                                min: 600
                            }
                        };
                    }
                    return {
                        deviceId: value
                    };
                }
            },
            numOfWorkers: function (value) {
                return parseInt(value);
            },
            decoder: {
                readers: function (value) {
                    if (value === 'ean_extended') {
                        return [{
                            format: "ean_reader",
                            config: {
                                supplements: [
                                    'ean_5_reader', 'ean_2_reader'
                                ]
                            }
                        }];
                    }
                    return [{
                        format: value + "_reader",
                        config: {}
                    }];
                }
            }
        },
        state: {
            inputStream: {
                type: "LiveStream",
                target: '#interactive',
                constraints: {
                    width: 1080,
                    height: 1080,
                    facingMode: "environment",
                    aspectRatio: {
                        min: 0.5,
                        max: 0.5
                    }
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: 4,
            frequency: 10,
            decoder: {
                readers: [{
                    format: "ean_reader",
                    config: {}
                }],
                // debug: {
                //     showCanvas: true,
                //     showPatches: true,
                //     showFoundPatches: true,
                //     showSkeleton: true,
                //     showLabels: true,
                //     showPatchLabels: true,
                //     showRemainingPatchLabels: true,
                //     boxFromPatches: {
                //         showTransformed: true,
                //         showTransformedBox: true,
                //         showBB: true
                //     }
                // }
            },
            locate: true,
            debug: false
        },
        lastResult: null
    };

    App.init();

    Quagga.onProcessed(function (result) {
        let drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            const canvasHeight = parseInt(drawingCanvas.getAttribute("height")),
                canvasWidth = parseInt(drawingCanvas.getAttribute("width"))
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, canvasWidth, canvasHeight);

                // result.boxes.filter(function (box) {
                //     return box !== result.box;
                // }).forEach(function (box) {
                //     Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                // });
            }
            const $videoNode = $('video')
            const videoHeight = $videoNode.height(),
                videoWidth = $videoNode.width()


            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box.map(point => {
                    const [x, y] = point
                    return [(videoWidth / canvasWidth) * x, (videoHeight / canvasHeight) * y]
                }), {
                    x: 0,
                    y: 1
                }, drawingCtx, {
                    color: "#00F",
                    lineWidth: 2
                });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line.map(point => {
                    const {
                        x,
                        y
                    } = point
                    return {
                        x: (videoWidth / canvasWidth) * x,
                        y: (videoHeight / canvasHeight) * y
                    }
                }), {
                    x: 'x',
                    y: 'y'
                }, drawingCtx, {
                    color: 'red',
                    lineWidth: 2
                });
            }
        }
    });

    
    Quagga.onDetected((result) => {
        const code = result.codeResult.code;

        console.log(code)

        if (!eanCheckDigit(code)) {
            console.warn('wrong code format')
            return
        }

        detectionCb(result)
    });



};

// 