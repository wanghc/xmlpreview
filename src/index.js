
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
function getTextHeight(text,fontsize) {
	// 创建一个临时的div元素
	var div = document.createElement('div');
	div.style.fontSize = fontsize;
	div.textContent = text;
	document.body.appendChild(div);
	var height = div.offsetHeight;
	document.body.removeChild(div);
	return height;
}
function getTextWidth(text,fontsize) {
	// 创建一个临时的div元素
	var div = document.createElement('div');
	div.style.fontSize = fontsize;
	div.textContent = text;
	document.body.appendChild(div);
	var w = div.offsetWidth;
	document.body.removeChild(div);
	return w;
}
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
		//var PXWidthObj = { 16: 1.475, 15: 1.47, 14: 1.461, 13: 1.46, 12: 1.444, 11: 1.43, 10: 1.429, 9: 1.42 };
		var PXWidthObj = { 16: 1.475, 15: 1.47, 14: 1.461, 13: 1.35, 12: 1.30, 11: 1.28, 10: 1.20, 9: 1.20, 8: 1.20, 7:1.1};
		var modulus = 1.48;
		//除数
		var num = 2;
		if (/^[\u4e00-\u9fa5]+$/.test(ch)) {
			num = 1; //中文
		}
		if ("ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ１２３４５６７８９０｀！＠＃＄％＾＆＊（）＿＋｜＼｛｝［］＂＇。《》／？：；￥｛｝，！、：，、！￥（）【】《》？".indexOf(ch)>-1) {
			num = 1; // 中文符号
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
		if (item["type"].toLowerCase() == "newpage") {
			DevObj.NewPage(); /*翻页*/
		} else if (item["type"].toLowerCase() == "img" || item["type"].toLowerCase() == "picdatapara") {
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

window.DHC_PreviewByCanvas = function (canvas, inpara, listpara, printjson, xmlflag, cfg) {
	this.curPageNo = 0;
	this.totalPageNo = 1;
	this.printInParaData = null;
	this.cfg = cfg;
	this.inparaJson = inpara2Obj(inpara);
	this.listparaJson = listpara2Obj(listpara);
	this.canvasTool = null;
	this.pageSizeWidth = 0;
	this.pageSizeHeight = 0;
	this.layoutContainerId = "XMLLayoutContainer";
	this.landscapeOrientation = "";
	this.init = function () {
		var _t = this;
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
				_t.landscapeOrientation = jsonData.appsetting.invoice["LandscapeOrientation"];
				var printInfo = _t._handerPrintJson(jsonData.appsetting.invoice, cfg);
				var d = printInfo.printInParaData;
				_t.printInParaData = d;
				_t.pageSizeWidth = d[0]['width'];
				_t.pageSizeHeight = d[0]['height'];
				for (var i = 0; i<_t.totalPageNo; i++){
					_t.drawByData(i);
				}
			}else{
				alert('print xml template structure error!');	
				return null;
			}
			return null;
		});
	}
	this.drawByData = function (pageNo) {
		var w = this.pageSizeWidth;
		var h = this.pageSizeHeight;
		var canvas = document.createElement("canvas");
		document.getElementById(this.layoutContainerId).appendChild(canvas);
		canvas.style.width = w;
		canvas.style.height = h;
		canvas.width = w * cfg.viewScale;
		canvas.height = h * cfg.viewScale;
		var c = new CanvasTool({canvas:canvas});
		var no = 0,pageNo = pageNo || 0;
		for (var i = 0; i < this.printInParaData.length; i++){
			var item = this.printInParaData[i];
			if (item["type"] == 'newpage') no++;
			if (no < pageNo) {
				if (no == 0 && pageNo!=0) { // 重打信息，在非第一页也需要重打
					if (item["RePrtHeadFlag"] == "Y") {
						PrintItem(c, item);
					}
				}
				continue;
			}
			if (no > pageNo) break;
			PrintItem(c, item);
		}
		this.curPageNo = pageNo;
		var that = this;
		// printInParaData.forEach(function (item) { if (item["type"]=='newpage') return false ; PrintItem(DevObj, item); });
		if (cfg.onCreateIMGBase64 || cfg.onCreatePDFBase64) {
			var intrCount = 0;
			window.intr = setInterval(function(){
				intrCount++;
				if (that.printImgCount == c.imgLoadComplete || intrCount > 20) {
					clearInterval(window.intr);
					var imgBase64Data = c.getImgBase64('image/jpeg', that.cfg.encoderOptions||0.92);  // 1 ->0.2 压缩
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
				}
			}, 100);
		}
	}
	this.nextPage = function() {
		if (this.curPageNo == this.totalPageNo) {
			return;
		}
		this.drawByData(this.curPageNo+1);
	}
	this.prePage = function() {
		if (this.curPageNo < 0) {
			return;
		}
		this.drawByData(this.curPageNo-1);
	}
	/**
	 * @param {*} inv 
	 * @param {Number} index 列元素在printData中的索引
	 * @param {Number} extHeight 整体向后移动的高度
	 */
	this._handleListPrintJson = function (inv, index, data, extHeight, cfg, printData, returnData, printListCount) {
		var _t = this;
		if (data == "") return 0; 
		var XMLOnePageShowRowNumber = inv.ListData.PageRows;
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
		var linePaddingWidth = parseInt(cfg.tableBorder || 0) + 2; /*为了让线与汉字间有间隙, 移动位置*/
		var curPageRowDetailsNumber=0,curPageNo=1;
		/* 打印列数据 ---- 开始 */
		data.forEach(function (rowVal, rowIndex) {
			// 下一行数据打印
			var rowMaxExtHeigth = 0,rowMaxItemrowNumber=1/*这大行中有多少小行*/;
			for (var plc = 0; plc < printListCount; plc++) { //列头
				if (rowVal.length - 1 < plc) break;
				var myColArr = [rowVal[plc]];
				if (cfg.rowContentFit) myColArr = splitDataByWidth(rowVal[plc], printData[index + plc].colWidth, printData[index + plc].fontsize);
				/* 行内明细最大单元格中行数 */
				if (rowMaxItemrowNumber < myColArr.length) rowMaxItemrowNumber = myColArr.length;
			}
			// 手工考虑插入换页
			if (curPageRowDetailsNumber + rowMaxItemrowNumber > XMLOnePageShowRowNumber) {
				returnData.push({ type: 'newpage' }); //向前一大行，写入换页命令
				curPageRowDetailsNumber = rowMaxItemrowNumber; /*从当前大行中数量开始*/
				_t.totalPageNo++;
				currentY = startY;
			} else {
				curPageRowDetailsNumber += rowMaxItemrowNumber;
			}
			
			// 打印列表中横线
			if (currentY==startY && cfg.tableBorder>0) {  // 行前只打印一次横线, 其它放到行后打印横线
				returnData.push({ type: 'line', BeginY: currentY, BeginX: startX-linePaddingWidth, EndY: currentY, EndX: endX, fontcolor: "#000000", lineWidth: cfg.tableBorder || 1 });
				currentY = parseFloat(currentY) + parseFloat((cfg.tableBorder || 1)) + 1; //打印线条后
				colExtHeight += parseFloat((cfg.tableBorder || 1));
			}
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
			// 打印列表当前行竖线
			if (cfg.tableBorder > 0) {
				for (var plc = 0; plc < printListCount; plc++) {
					returnData.push({
						type: 'line',
						BeginY: currentY-linePaddingWidth,
						BeginX: printData[index + plc].xcol - (cfg.tableBorder || 1) - 1,
						EndY: currentY + rowMaxExtHeigth + rowHeight ,
						EndX: printData[index + plc].xcol - (cfg.tableBorder || 1) - 1,
						fontcolor: "#000000", lineWidth: cfg.tableBorder || 1
					});
				}
			}
			currentY += rowMaxExtHeigth + rowHeight;
			colExtHeight += rowMaxExtHeigth;
			//打印列表中下横线
			if (cfg.tableBorder>0) {
				returnData.push({ type: 'line', BeginY: currentY-linePaddingWidth, BeginX: startX, EndY: currentY, EndX: endX, fontcolor: "#000000", lineWidth: cfg.tableBorder || 1 });
				currentY = parseFloat(currentY) + parseFloat((cfg.tableBorder || 1)) + 1; //打印线条后
				colExtHeight += parseFloat((cfg.tableBorder || 1));
			}
		});	
		// 打印列表中竖线 // 发现lodop的线条不能跨页打印
		// for (var plc = 0; plc < printListCount ; plc++) { //列头
		// 	if (cfg.tableBorder) {
		// 		returnData.push({ type: 'line', BeginY: startY, BeginX: printData[index + plc].xcol-(cfg.tableBorder|| 1)-1, EndY: currentY, EndX: printData[index + plc].xcol, fontcolor: "#000000", lineWidth: cfg.tableBorder || 1 });
		// 	}
		// }
		// 画处方斜线
		if (inv.ListData.BackSlashWidth > 0) {
			returnData.push({
				type: 'line', BeginY: startY+inv.ListData.PageRows*rowHeight, BeginX: startX,
				EndY: currentY, EndX: startX + (parseInt(inv.ListData.BackSlashWidth)*3.78)
			});
		}
		return colExtHeight;
	}
	this._handerPrintJson = function (inv, cfg) {
		var _t = this;
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
		_t.printImgCount = nodeToPxInsertArray(printData,inv.PICData,"PICdatapara",3.78*cfg.viewScale).printCount;
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
		// 2. 合并数据与XML模板,内容自适应高度处理
		var printInParaData = [];
		var extHeight = 0; //自适应后,整体扩展的行高
		printData.forEach(function(item,index){
			if (item.type == 'Listdatapara') {
				if (printListCount > 0) { //组织第一列时,把其它列数据也组织好
					var colExtHeight = _t._handleListPrintJson(inv, index, _t.listparaJson, extHeight, cfg, printData, printInParaData, printListCount);
					if (cfg.rowHeightExpand) extHeight += colExtHeight;
					printListCount = 0;
 				}
			}else{
				var d = _t.inparaJson[item.name]||item.defaultvalue||""; // 打印默认值
				if (d) { item.defaultvalue = d };
				if (item.isfollow=="true") { // 跟随时
					item.yrow = parseFloat(item.yrow) + extHeight;
				}
				if (item.type == "txtdatapara" && undefined == item.isqrcode && undefined == item.barcodetype && item.width) {
					var arr = d.split('\n');
					//if (item.contentFit) arr = splitDataByWidth(d, item.width, item.fontsize);
					// 如果有宽度则自动换行,此时高度为单行高度（不是元素区块高度） 20240926
					if (item.width) arr = splitDataByWidth(d, item.width, item.fontsize);
					var textHeight = getTextHeight("行高LineHeight"+arr[0],item.fontsize); // 第一行内容高度
					arr.forEach(function(v,i){
						var o = copy(item);
						o.height = parseFloat(textHeight)+2; // 行高补2
						o.yrow = parseFloat(item.yrow) + (parseInt(o.height)*i);
						if (o.heightExpand) extHeight += (parseInt(o.height)*i);
						o.defaultvalue = v;
						printInParaData.push(o);
					});
				}else{
					printInParaData.push(item);
				}
			}
		});
		if (printInParaData) {
			var lastItemyrow = 0;
			printInParaData.forEach(function (a) {
				if (a.type == 'invoice') return 1;
				if ("PLine" == a.type && lastItemyrow < a.BeginY) { lastItemyrow = a.BeginY; }
				if ("PLine" == a.type && lastItemyrow < a.EndY){lastItemyrow = a.EndY;}
				if (lastItemyrow < a.yrow) lastItemyrow = a.yrow;
			});
			/*底边留白高度 + 最后元素位置*/
			if (_t.landscapeOrientation=='Z') printData[0].height = inv['height']*37.8 + lastItemyrow;
		}
		
		return { printInParaData: printInParaData, printImgCount: _t.printImgCount,extHeight:extHeight};
	}
}

