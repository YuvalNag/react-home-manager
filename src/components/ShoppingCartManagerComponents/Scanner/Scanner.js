import React, { useEffect } from 'react'
import Quagga from 'quagga'
const config = {
    inputStream: {
        type: "LiveStream",
        target: '#interactive',
        constraints: {
            width: 350,
            height: 350,
            facingMode: "environment",
            aspectRatio: {
                min: 0.5,
                max: 0.5
            }
        }
    },
    locator: {
        halfSample: true,
        patchSize: "medium", // x-small, small, medium, large, x-large
        debug: {
            showCanvas: false,
            showPatches: false,
            showFoundPatches: false,
            showSkeleton: false,
            showLabels: false,
            showPatchLabels: false,
            showRemainingPatchLabels: false,
            boxFromPatches: {
                showTransformed: false,
                showTransformedBox: false,
                showBB: false
            }
        }
    },
    numOfWorkers: navigator.hardwareConcurrency,
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
}
const Scanner = props => {
    const boxingProcess = (result) => {
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
            const videoNode = document.getElementsByTagName('video')[0]
            const videoHeight = videoNode.videoHeight,
                videoWidth = videoNode.videoWidth


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
    }
    const initCallback = (err) => {

        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        document.getElementsByClassName('drawingBuffer')[0].style.position = 'absolute'
        document.getElementsByClassName('drawingBuffer')[0].style.top = 0
        document.getElementsByClassName('drawingBuffer')[0].style.left = 0
        Quagga.start();
    }
    const _onDetected = (result) => {
        props.onDetected(result.codeResult.code);
    }
    useEffect(() => {
        Quagga.init(config, initCallback)
        Quagga.onProcessed(boxingProcess)
        Quagga.onDetected(_onDetected)
        console.log('effect');

        return () => {
            //cleanup
            Quagga.offProcessed(boxingProcess)
            Quagga.offDetected(_onDetected)
            Quagga.stop()

        }
    }, [])

    return <div id="interactive" className="viewport" style={{
        width: '360px',
        height: '180px'
    }} />
}
export default Scanner
