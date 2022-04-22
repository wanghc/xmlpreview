import { code128Auto } from './barcode128';
import { QRCodeTool } from './qrcode.tool';
function CanvasTool(options) {
    this.imgLoadComplete = 0;
    if (options.id) {
        this.mycanvas = document.getElementById(options.id);
    } else {
        this.mycanvas = options.canvas;
    }
    this.mycontext = this.mycanvas.getContext("2d");
    this.mycontext.imageSmoothingEnabled = false;
    this.mycontext.webkitImageSmoothingEnabled = false;
    this.mycontext.webkitImageSmoothingEnabled = false;

    //this.mycontext.scale(getDPR(),getDPR());
    //this.mycanvas.width=800,this.mycanvas.height=600;
    //this.mycontext.clearRect(0,0,this.mycanvas.width,this.mycanvas.height);
    /*给画布全屏白底*/
    this.mycontext.rect(0,0,this.mycanvas.width,this.mycanvas.height);
    this.mycontext.fillStyle="#ffffff";
    this.mycontext.fill();
    this.ADD_PRINT_LINE = function(sy,sx,ey,ex,lineStyle){
        //console.log(sy,sx,ey,ex);
        this.mycontext.strokeStyle = lineStyle.color || "#000000";
        this.mycontext.lineWidth = lineStyle.lineWidth||1;
        this.mycontext.beginPath();
        this.mycontext.moveTo(sx,sy);
        this.mycontext.lineTo(ex,ey);
        this.mycontext.stroke();
    }
    this.SET_PRINT_STYLEA = function(){
    }
    this.ADD_PRINT_TEXT = function(y,x,width,height,value,style){
        this.mycontext.font = "normal normal "+(style.bold==='true'?'bold':'normal')+" "+style.size+"pt "+style.name;		
        this.mycontext.fillStyle = style.color || "#000000";
        this.mycontext.textBaseline = 'top';
        this.mycontext.fillText(value, x,y); //,maxWidth	
    }
    this.ADD_PRINT_IMAGE = function (x,y,width,height,value,callback){
        if (value.indexOf("http")==0 || value.indexOf("data:")==0){
            var newimg = new Image();
            newimg.style.width = width+'px';
            newimg.style.height = height + 'px';
            newimg.crossOrigin = "anonymous";
            newimg.src = value; 
            var _t = this;
            newimg.onload = function() {
                _t.mycontext.drawImage(newimg,x,y,width,height);
                _t.imgLoadComplete++;
                //callback();
            };
        }
    };
    this.ADD_PRINT_BARCODE = function (x, y, width, height, barcodetype, value, opt) {
        if ("QRCode" == barcodetype) {
            QRCodeTool(this.mycanvas,value,{
                width: width,
                height: height,
                color:opt.color,
                x: x,
                y: y
            });
        } else {
            code128Auto(this.mycanvas, value, {
                //unitWidth:unitWidth,
                width: width,
                height: height,
                showText: opt.showText,
                color:opt.color,
                x: x,
                y: y
            });
        }
    };
    this.getImgBase64 = function (type,qu){
        //this.mycontext.scale(0.79,0.79);
        //this.mycontext.scale(0.79,0.79);
        return this.mycanvas.toDataURL(type,qu);
        var resizedCanvas = document.createElement("canvas");
        var resizedContext = resizedCanvas.getContext("2d");
        resizedCanvas.width = w;
        resizedCanvas.height = h;
        resizedCanvas.style.width = w/1.5;
        resizedCanvas.style.height = h/1.5;
        //var canvas = document.getElementById("original-canvas");
        resizedContext.drawImage(this.mycanvas, 0, 0, w, h);
        var myResizedData = resizedCanvas.toDataURL(type,qu);
        return myResizedData;	
        //return this.mycanvas.toDataURL({format:type,quality:qu,width:200,height:200});
    }
}
export { CanvasTool};