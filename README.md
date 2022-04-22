# XMLPreView
实现预览xml内容功能, 把xml及数据展示到Canvas上，此功能支持IE11及Chrome浏览器
```js
/***
 *  把模板打印到Canvas上
 *    canvas : HTMLDocument
 *    inpara : 与打印参数一致
 *    listpara : 与打印列表参数一致
 *    jsonArr : []
 *    flagName : xml模板名称， 如：DHCPresNo
 *    cfg:
        支持pdfDownload:boolean配置项,用于调试预览后得到pdf文件
        支持onCreatePDFBase64:function(pdfbase64){}配置项,用于生成pdf后回调
        tabelBroder:Number配置项,列表线条宽度
        rowContentFit:boolean 行内容自动换行
        rowHeightExpand:boolean 行内容自动换行后,是否把后面元素向后推动
*/
DHC_PreviewByCanvas(canvas,inpara,inlist,jsonArr,flagName,cfg)
```

### 20220422
- 增加global:false配置项，解决在某些IE下报无效访问 :bug:

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
