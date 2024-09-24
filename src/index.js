/**
 * 把某输入框转换成验证用户密码的框
 * AES加密发送后台,得到成功与失败结果。成功后台写入session
 * slat为目标事件 - "",GetUserInfo,"
 */
import { AES ,enc,mode,pad} from 'crypto-js';
import myfun  from './test';
function e7(word, k, iv) {
    var rtn = "";
    var ind = 0;
    var str = word.slice(ind * 15, (ind + 1) * 15);
    while (str.length > 0) {
        rtn += e71(str, k, iv); ind++; str = word.slice(ind * 15);
    }
    return rtn;
}
function e71(word, k, i) {
    var key = enc.Utf8.parse(k);
    var iv = enc.Utf8.parse(i || "");
    var srcs = enc.Utf8.parse(word);
    var encrypted = AES.encrypt(srcs, key, { iv: iv, mode: mode.CBC, padding: pad.Pkcs7 });
    return encrypted.ciphertext.toString().toUpperCase();
}
window.valid = function (opt) {
    myfun.myfun();
    var obj = document.getElementById(opt.id);
    //obj.data('targetcode', opt.targetCode);
    if (obj.value != "") {
        var slat = opt.targetCode;
        var slatu = enc.Utf8.parse(slat);
        return e71(obj.value,"1234567890ABCDEF","1234567887654321");
    }
}
function copy(obj){
	var c = {};
	for (var a in obj){
		if (obj.hasOwnProperty(a)) c[a]=obj[a];
	}
	return c;
}
export default { valid };