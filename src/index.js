import { XML } from "./ObjTree";
import { inpara2Obj, listpara2Obj } from "./xmlparam";
import { CanvasTool } from "./canvastool";
var DPIArr = (function js_getDPI() {
	var arrDPI = new Array();
	if (window.screen.deviceXDPI != undefined) {
		arrDPI[0] = window.screen.deviceXDPI;
		arrDPI[1] = window.screen.deviceYDPI;
	}
	else {
		var tmpNode = document.createElement("DIV");
		tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
		document.body.appendChild(tmpNode);
		arrDPI[0] = parseInt(tmpNode.offsetWidth);
		arrDPI[1] = parseInt(tmpNode.offsetHeight);
		tmpNode.parentNode.removeChild(tmpNode);
	}
	/*2 存 x 轴上 pt与 px的比*/
	arrDPI[2] = arrDPI[0] / 72;  // pt = 1/72 (英寸) px=1/dpi (英寸)
	/*2 存 x 轴上 pt与 px的比*/
	arrDPI[3] = arrDPI[1] / 72;  // pt = 1/72 (英寸) px=1/dpi (英寸)
	return arrDPI;
})();
/**
 * 
 * @param {String} val 文本内容
 * @param {Number} colWidth 列宽
 * @param {Number} fontsize 字体大小 pt 
 * @returns Array
 * 按照字体大小，通过列宽把文本分成多行，如果有\n会自动换行
 */
function splitDataByWidth(val, colWidth,fontsize) {
	var arr = [];
	var line = "", cwidth = 0;
	for (var i = 0; i < val.length; i++){
		var ch = val.charAt(i); 
		if (ch != '\n') {
			line += ch;
			cwidth += _getPTCharWidth(fontsize, ch);
		}
		if (cwidth > colWidth || ch=='\n') {
			arr.push(line);	
			line = "",cwidth=0;
		}
	}
	if(line!="") arr.push(line);
	return arr;
	function _getPTCharWidth(fs, ch) {
		return _getPXCharWidth(fs, ch) * DPIArr[2];
	}
	//根据字体大小得到一个字符的宽度
	function _getPXCharWidth(fontSize, ch) {
		var PXWidthObj = { 16: 1.475, 15: 1.47, 14: 1.461, 13: 1.46, 12: 1.444, 11: 1.43, 10: 1.429, 9: 1.42 };
		var modulus = 1.48;
		//除数
		var num = 2;
		if (/^[\u4e00-\u9fa5]+$/.test(ch)) {
			num = 1;
		}
		if (fontSize == null && fontSize == "") {
			fontSize = 15;
		}
		if (typeof (fontSize) == "string") {
			fontSize = fontSize.replace("px", "");
		}
		modulus = PXWidthObj[fontSize];
		return fontSize / num * modulus;
	}

}
function PrintItem(DevObj, item){
	var height = parseFloat(item.height)||20, width =parseFloat(item.width)||20;
	var x = item.x||item.xcol||0, y = item.y||item.yrow||0, value = item.value||item.defaultvalue||"";
	var fname = item.fname||item.fontname||"宋体", fbold = item.fbold||item.fontbold||"false";
	var fsize = item.fsize||item.fontsize||12,fcolor=item.fcolor||item.fontcolor||"";
	var rePrtHeadFlag = item.rePrtHeadFlag || "N";
	var barcodetype = item.barcodetype||null, isqrcode = item.isqrcode||null;
	var qrcodeversion=item.qrcodeversion||"Auto";
	var isshowtext = item.isshowtext||"Y", angle=item.angle||0;
	
	if(item["type"]){
		if (item["type"].toLowerCase()=="img" || item["type"].toLowerCase()=="picdatapara"){
				if (value!=""){
					DevObj.ADD_PRINT_IMAGE(x,y,width,height,value);
				}
		}else if (item["type"].toLowerCase()=="line" || item["type"].toLowerCase()=="pline"){
			DevObj.ADD_PRINT_LINE(item["BeginY"], item["BeginX"], item["EndY"], item["EndX"], {color:item["fontcolor"],lineWidth:item["lineWidth"]||1}); //0=实线,1=线宽
			if (fcolor!="") DevObj.SET_PRINT_STYLEA(0,"FontColor", fcolor);
		}else{ /*txt*/
			if ('string'==typeof barcodetype){
				if (barcodetype=="128C") value = value.replace(/\D/gi,function(word){return "";})
				DevObj.ADD_PRINT_BARCODE(x, y, width, height, barcodetype, value, {
					showText: isshowtext != "N",
					color:fcolor
				});
			}else if('string'==typeof isqrcode ){
				if (isqrcode=="true"){
					DevObj.ADD_PRINT_BARCODE(x, y, width, height, "QRCode", value, {
						qrcodeversion: qrcodeversion,
						color:fcolor

					});
				}
			}else{ /*label*/
				DevObj.ADD_PRINT_TEXT(y,x,width, height, value,{color:fcolor,size:fsize,name:fname,bold:fbold});
			}
		}
		DevObj.SET_PRINT_STYLEA(0,"Angle",0);
		if (angle>0) DevObj.SET_PRINT_STYLEA(0,"Angle",angle);
		if (rePrtHeadFlag=="Y") DevObj.SET_PRINT_STYLEA(0,"ItemType",1); //1=页眉页脚
	}
};
function nodeToPxInsertArray(arr , node ,subNodeName,transUnit) {
	return nodeInsertArray(arr, node, subNodeName, function (item) {
		if (item.xcol) item.xcol *= transUnit;
		if (item.yrow) item.yrow *= transUnit;
		if (item.fontsize) item.fontsize *= transUnit/3.78;
		if (item.width) item.width *= transUnit;
		if (item.height) item.height *= transUnit;
		if (item.BeginX) item.BeginX *= transUnit;
		if (item.BeginY) item.BeginY *= transUnit;
		if (item.EndX) item.EndX *= transUnit;
		if (item.EndY) item.EndY *= transUnit;
		return item;
	});
}
/**
 * 
 * @param {Array} arr 
 * @param {Node} node 
 * @param {String} subNodeName 
 * @param {Function} callback 每一个元素会调用一次
 * 把node节点中subNodeName的值写入arr数组中
 */
function nodeInsertArray(arr, node, subNodeName, cb) {
	let printCount = 0;
	var count = 0;
	if (node){
		var myarr = node;
		if (node.RePrtHeadFlag){myarr = [node];}
		myarr.forEach(function(item){
			if (item[subNodeName]){
				if (item[subNodeName].length){ //一个元素
					item[subNodeName].forEach(function(sub){
						sub.RePrtHeadFlag = item.RePrtHeadFlag;
						sub.type = subNodeName;
						if (sub.defaultvalue) printCount++;
						count++;
						arr.push(cb(sub));
					});
				}else{
					item[subNodeName].RePrtHeadFlag =  item.RePrtHeadFlag;
					item[subNodeName].type = subNodeName;
					if (item[subNodeName].defaultvalue) printCount++;
					count++;
					arr.push(cb(item[subNodeName]));
				}
			}
		});
	}
	return { printCount :printCount,count:count};
}
function copy(obj){
	var c = {};
	for (var a in obj){
		if (obj.hasOwnProperty(a)) c[a]=obj[a];
	}
	return c;
}

window.DHC_PreviewByCanvas = function(canvas, inpara, listpara, printjson, xmlflag, cfg) {
	var inparaJson = inpara2Obj(inpara);
	var listparaJson = listpara2Obj(listpara);
	XML.ObjTree.prototype.attr_prefix = "";
	$cm({
		ClassName:'web.DHCXMLPConfig',
		MethodName:'ReadXmlByName',
		Name:xmlflag,
		dataType:'text',
		global:false /*跨界面调用时，有些IE会报，无效访问*/
	},function(xml){
		var xotree = new XML.ObjTree();
		var inputdata = $.trim(xml);
		var jsonData = xotree.parseXML(inputdata);
		if (jsonData.appsetting) {
			var printInfo = _handerPrintJson(jsonData.appsetting.invoice, cfg);
			var printInParaData = printInfo.printInParaData;
			//console.log(printInParaData);
			canvas.style.width = printInParaData[0]['width'];
			canvas.style.height = printInParaData[0]['height'];
			canvas.width = printInParaData[0]['width'] * cfg.viewScale;
			canvas.height = printInParaData[0]['height'] * cfg.viewScale;
			var DevObj = new CanvasTool({canvas: canvas});
			printInParaData.forEach(function (item) { PrintItem(DevObj, item); });
			if (cfg.onCreateIMGBase64 || cfg.onCreatePDFBase64) {
				var intrCount = 0;
				window.intr = setInterval(function(){
					intrCount++;
					if (printInfo.printImgCount == DevObj.imgLoadComplete || intrCount > 20) {
						console.log(intrCount);
						clearInterval(window.intr);
						var imgBase64Data = DevObj.getImgBase64('image/jpeg', 1);
						if (cfg.onCreateIMGBase64) {
							cfg.onCreateIMGBase64.call(this,imgBase64Data);
						}
						if (cfg.onCreatePDFBase64) {
							var doc = null;
							if (canvas.width > canvas.height) {
								doc = new jsPDF('l', 'mm', [canvas.width * 0.225, canvas.height * 0.225]);
							} else {
								doc = new jsPDF('p', 'mm', [canvas.width * 0.225, canvas.height * 0.225]);
							}
							doc.addImage(imgBase64Data, 'jpeg', 0, 0, canvas.width * 0.225, canvas.height * 0.225);
							if(cfg.pdfDownload) doc.save(xmlflag+'.pdf');
							var basePDFString = doc.output("datauristring");
							cfg.onCreatePDFBase64.call(this, basePDFString);
						}
						//console.log(str);
					}
				}, 100);
			}
			
		}else{
			alert('打印模板结构错误!');	
		}
	});
	/**
	 * @param {*} inv 
	 * @param {Number} index 列元素在printData中的索引
	 * @param {Number} extHeight 整体向后移动的高度
	 */
	var _handleListPrintJson = function (inv, index, data, extHeight, cfg, printData, returnData, printListCount) {
		if (data == "") return 0; 
		
		var rowHeight = (3.78 * inv.ListData.YStep);
		var startY = printData[index].yrow + rowHeight + extHeight;
		var startX = printData[index].xcol;
		var endX = printData[index + printListCount - 1].xcol;
		var currentY = startY;
		var colExtHeight = rowHeight;  //列表内容，自适应后，整体扩展的行高，列表内容所有数据都向下移了rowHeight
		/* 计算列宽 */
		for (var plc = 0; plc < printListCount - 1; plc++) { //列头
			printData[index + plc].colWidth = printData[index + plc + 1].xcol - printData[index + plc].xcol;
		}
		// 最后一列的宽：取到纸张右边宽
		var lastColWidth = printData[0].width - printData[index + printListCount - 1].xcol;
		printData[index + printListCount - 1].colWidth = lastColWidth > 0 ? lastColWidth : 100;
		// 计算列宽结束----

		/* 打印列数据 ---- 开始 */
		data.forEach(function (rowVal, rowIndex) {
			// 打印列表中横线
			if (cfg.tabelBroder) returnData.push({type:'line',BeginY:currentY,BeginX:startX,EndY: currentY,EndX: endX ,fontcolor: "#000000",lineWidth:cfg.tabelBroder||1});
			// 下一行数据打印
			var rowMaxExtHeigth = 0;
			for (var plc = 0; plc < printListCount; plc++) { //列头
				if (rowVal.length - 1 < plc) break;
				var myColArr = [rowVal[plc]];
				if (cfg.rowContentFit) myColArr = splitDataByWidth(rowVal[plc], printData[index + plc].colWidth, printData[index + plc].fontsize);
				// 单元格数据打印, 且自动换行
				myColArr.forEach(function (col, subIndex) {
					var defCell = copy(printData[index + plc]);
					defCell.defaultvalue = col;
					defCell.yrow = currentY + (rowHeight * subIndex);
					returnData.push(defCell);
					
				});
				/* 行的最大扩展高度 */
				if (rowMaxExtHeigth < (rowHeight * myColArr.length)) rowMaxExtHeigth = (rowHeight * (myColArr.length - 1));
			}
			currentY += rowMaxExtHeigth + rowHeight;
			colExtHeight += rowMaxExtHeigth;
			//打印列表中下横线
			if (cfg.tabelBroder) returnData.push({type:'line', BeginY: currentY, BeginX: startX, EndY: currentY ,EndX: endX ,fontcolor: "#000000",lineWidth:cfg.tabelBroder||1});
		});	
		// 打印列表中竖线
		for (var plc = 0; plc < printListCount ; plc++) { //列头
			if (cfg.tabelBroder) returnData.push({type:'line',BeginY: startY,BeginX: printData[index+plc].xcol,EndY: currentY,EndX: printData[index+plc].xcol,fontcolor: "#000000",lineWidth:cfg.tabelBroder||1});
		}
		// 画处方斜线
		if (inv.ListData.BackSlashWidth > 0) {
			returnData.push({
				type: 'line', BeginY: startY+inv.ListData.PageRows*rowHeight, BeginX: startX,
				EndY: currentY, EndX: startX + (parseInt(inv.ListData.BackSlashWidth)*3.78)
			});

		}
		return colExtHeight;
	}
	var _handerPrintJson = function(inv,cfg){
		var printData = [];
		printData.push({
			type:"invoice",
			LandscapeOrientation: inv["LandscapeOrientation"],
			PageFooter:inv["PageFooter"],
			PaperDesc:inv["PaperDesc"],
			PrtDevice:inv["PrtDevice"],
			PrtDirection:inv["PrtDirection"],
			PrtPape:inv["PrtPape"],
			PrtPaperSet:inv["PrtPaperSet"],
			height:inv['height']*37.8, // cm => px
			width:inv['width']*37.8
		});
		nodeToPxInsertArray(printData,inv.PLData,"PLine",3.78*cfg.viewScale);
		var printImgCount = nodeToPxInsertArray(printData,inv.PICData,"PICdatapara",3.78*cfg.viewScale).printCount;
		nodeToPxInsertArray(printData,inv.TxtData,"txtdatapara",3.78*cfg.viewScale);
		var printListCount = nodeToPxInsertArray(printData,inv.ListData,"Listdatapara",3.78*cfg.viewScale).count;
		// 1. y轴从小到大输出
		printData.sort(function(a,b){
			if (a.type=='invoice') return -1;
			if (b.type=='invoice') return 1;
			if ("PLine"==a.type){a.yrow = a.BeginY;}
			if ("PLine"===b.type){b.yrow = b.BeginY;}
			return parseInt(a.yrow)-parseInt(b.yrow);
		});
		//console.log(printData);
		// 2. 合并数据与XML模板,内容自适应高度处理
		var printInParaData = [];
		var extHeight = 0; //自适应后,整体扩展的行高
		printData.forEach(function(item,index){
			if (item.type == 'Listdatapara') {
				if (printListCount > 0) { //组织第一列时,把其它列数据也组织好
					var colExtHeight = _handleListPrintJson(inv, index, listparaJson, extHeight, cfg, printData, printInParaData, printListCount);
					if (cfg.rowHeightExpand) extHeight += colExtHeight;
					printListCount = 0;
 				}
			}else{
				var d = inparaJson[item.name]||"";
				if (d){item.defaultvalue = d };
				item.yrow = parseFloat(item.yrow) + extHeight;
				if (item.type == "txtdatapara" && undefined == item.isqrcode && undefined == item.barcodetype && item.width) {
					var arr = d.split('\n');
					if (item.contentFit) arr = splitDataByWidth(d, item.width, item.fontsize);
					arr.forEach(function(v,i){
						var o = copy(item);
						o.yrow = parseFloat(item.yrow) + (parseInt(item.height)*i);
						if (o.heightExpand) extHeight += (parseInt(item.height)*i);
						o.defaultvalue = v;
						printInParaData.push(o);
					});
				}else{
					printInParaData.push(item);
				}
			}
		});
		return { printInParaData: printInParaData, printImgCount: printImgCount };
	}
	
}
