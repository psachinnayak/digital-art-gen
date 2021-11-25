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
            for (let x = 0; x < 100; x++) {
                let { r, g, b, y } = drawerFunction(x, prevY);
                prevY = y;
                console.log(x,y);
            }


        }
    }

    function clearDrawing() {

    }


})(document, window);