var win = window,
    doc = document,
    br = win["BAIRONG"] = win["BAIRONG"] || {},
    s = doc.createElement("script"),
    url = '//static.100credit.com/ifae/js/braf-v3.min.js?v=2.7.0';
s.type = "text/javascript";
s.charset = "utf-8";
s.src = url;
br.client_id = "4000068";//apiCode 线上
// br.client_id = "444333";//apiCode  测试

//============= ��ѡ =============
br.config = {
    timeout: 3000
}
doc.getElementsByTagName("head")[0].appendChild(s);
br.onload = function () {
    console.log('script load end');
}
br.BAIRONG_INFO = {
    "app": "antifraud",
    "event": ""//ע�᣺register����lend����¼��login�����֣�cash
}
window.GetSwiftNumber = function (data) { //�ص�
    console.log(data)
}