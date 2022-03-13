# XMLPreView
实现预览xml内容功能, 把xml及数据展示到Canvas上，此功能支持IE11及Chrome浏览器

### 20220313
#### 1.0.2
- DHC_PrintByLodop(LODOP,inpara,inlist,jsonArr,flagName,{onCreatePDFBase64:function(base64){}})生成电子处方pdfbase64

### 20220312
#### 1.0.1
- 实现方法DHC_PreviewByCanvas(mycanvas,inpara,inlist,jsonArr,flagName,cfg);
- - cfg新配置项
- - 支持pdfDownload:boolean配置项,用于调试预览后得到pdf文件
- - 支持onCreatePDFBase64:function(pdfbase64){}配置项,用于生成pdf后回调
- - tabelBroder:Number配置项,列表线条宽度
- - rowContentFit:boolean 行内容自动换行
- - rowHeightExpand:boolean 行内容自动换行后,是否把后面元素向后推动
