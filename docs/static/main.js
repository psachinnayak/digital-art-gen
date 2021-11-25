(function (document, window) {

    let cnvsDrawing, btnExecute, btnClear, btnSave, txtFunctionBody;

    function addListeners() {
        btnExecute.addEventListener("click", executeDrawing);
        btnClear.addEventListener("click", clearDrawing);
        btnSave.addEventListener("click", () => { alert("We will get there") });
    }

    function bootstrap() {
        cnvsDrawing = document.getElementById("cnvsDrawing");
        txtFunctionBody = document.getElementById("txtFunctionBody");
        btnExecute = document.getElementById("btnExecute");
        btnClear = document.getElementById("btnClear");
        btnSave = document.getElementById("btnSave");



        addListeners();

        let ctx = cnvsDrawing.getContext('2d');
        ctx.font = '16px serif';
        ctx.fillText('Put the function body and click Execute', 10, 50);
    }

    function createFunction(functionBodyContents) {


        // Function should accept a parameter called 
        // x -> the x co-ordinate

        let functionBody = `
            let y = null, r=0, g=0, b=0;
            // this is in case we want to put any wrapper around the function. 

            // THIS SPACE is in case we want to do anything before calling their function
            ${functionBodyContents}
            // THIS SPACE is in case we want to do anything after calling their function

            return { r, g, b, y};
        `;

        console.log("Creating function ", functionBody);

        // We will also hard code window, document, canvas to empty objects to prevent  to prevent them from being misused. 
        // Thus creating a sand box inside which the function works. We dont want somebody to misuse the window and document objects.
        let func = new Function("window", "document", "canvas", "alert", "x", "previousY", functionBody);
        func = func.bind(null, {}, {}, {}, {});
        return func;
    }

    window.addEventListener("load", function () {
        bootstrap();
    })


    function executeDrawing() {
        let drawerFunction = null;
        try {
            drawerFunction = createFunction(txtFunctionBody.innerHTML);
        }
        catch (err) {
            console.error("Error creating function ", err);
            alert("There are compilation errors in the code written. Errors are available in the Debug Console of the browser.");
        }

        if (drawerFunction) {
            // We will clear the canvas before drawing.
            clearDrawing();
            let prevY = -1;


            let pixelsToDraw = [];

            for (let x = 0; x < 100; x++) {
                let { r, g, b, y } = drawerFunction(x, prevY);
                prevY = y;
                // drawPixel(x, y, r, g, b, 255);
                pixelsToDraw.push({ x, r, g, b, y });
            }
            drawOnCanvas(pixelsToDraw);

        }
    }


    function drawOnCanvas(pixelsToDraw) {

        // Inspired from https://stackoverflow.com/questions/7812514/drawing-a-dot-on-html5-canvas
        let ctx = cnvsDrawing.getContext("2d");
        let canvasData = ctx.getImageData(0, 0, cnvsDrawing.width, cnvsDrawing.height);
        function drawPixel(x, y, r, g, b) {
            var index = (x + y * cnvsDrawing.width) * 4;
            canvasData.data[index + 0] = r;
            canvasData.data[index + 1] = g;
            canvasData.data[index + 2] = b;
            canvasData.data[index + 3] = 255; // Alpha of 255 so that zero opacity.
        }
 
        // We ll later on put it one dot at a time, to make it look animated. Now we ll just draw the points with no timegap between each point.
        pixelsToDraw.forEach(({ x, y, r, g, b }) => {
            console.log("Drawing Pixel at ", x, y, r, g, b, 255)
            drawPixel(x, y, r, g, b);
        });

        ctx.putImageData(canvasData, 0, 0);
    }

    function clearDrawing() {
        let ctx = cnvsDrawing.getContext("2d");
        ctx.clearRect(0, 0, cnvsDrawing.width, cnvsDrawing.height);
    }


})(document, window);