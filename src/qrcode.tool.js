var QRCodeTool = function (canvas, input, options) {
    var myqrcontainer = document.createElement("span"); //.getElementById('tmpcanvas');
    document.body.appendChild(myqrcontainer);
    var cl = QRCode.CorrectLevel.H;
    var colorDark = options.color || "#000000";
    if (input.length>154) {
        cl = QRCode.CorrectLevel.L;
    }else if (input.length>100) {
        cl = QRCode.CorrectLevel.M;
    }
    if (options.qrcodeversion = 14) {
        // TODO :  为兼容LODOP实现，转成对应版本
      //,1,2,3,5,7,10,14,  
    }

    var qrcode = new QRCode(myqrcontainer, {
        text: input,
        width: options.width,
        height: options.height,
        colorDark : colorDark,
        colorLight : "#ffffff",
        correctLevel : cl
    });
    var newimg = myqrcontainer.querySelector('img');
    newimg.onload = function () {
        canvas.getContext("2d").drawImage(newimg, options.x, options.y, options.width, options.height);
        document.body.removeChild(myqrcontainer);
    };
}
export {QRCodeTool};