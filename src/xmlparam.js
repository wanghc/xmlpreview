function inpara2Obj(inpara){
	var c2 = String.fromCharCode(2);
	var arr = inpara.split('^');
	var obj = {};
	arr.forEach(function(item){
		var arr = item.split(c2);
		obj[arr[0]] = arr[1];
	});
	return obj;
}
/**
 * 
 * @param {String} listpara 列表数据
 * col11^col12^col13 C2 
 * col21^col22^col23 C2
 * col31^col32^col33
 * @returns 返回的是二维数据
 */
function listpara2Obj(listpara){
	var c2 = String.fromCharCode(2);
	var arr = listpara.split(c2);
	var obj = [];
	arr.forEach(function(item){
		var itemArr = item.split('^');
		obj.push(itemArr);
	});
	return obj;
}
export { inpara2Obj,listpara2Obj};