//今日头条特定代码
(function (root) {
    var typeArr = window.location.href.split('?')[1];
    var qsobj = {};
    if (typeArr) {
        typeArr = typeArr.replace(/#/g, '');
        var pairs = typeArr.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            qsobj[pair[0]] = pair[1];
        }
    };
    var channel = qsobj['c'] || '';
    var isChangeF = qsobj['f'] || '';
    if (new RegExp(/^jrttcy/g).test(channel)) {
        var convert_id = '';
        if (channel == 'jrttcy1') {
            convert_id = '63263214809'
        } else if (channel == 'jrttcy2') {
            convert_id = '92659554316'
        } else if (channel == 'jrttcy3') {
            convert_id = '92660044236'
        } else if (channel == 'jrttcy4') {
            convert_id = '92660120797'
        } else if (channel == 'jrttcy5') {
            convert_id = '92660216853'
        } else if (new RegExp(/^jrttcy([7-9])|(1[0-1])$/g).test(channel)) {
            convert_id = "92906977053";
        } else if (new RegExp(/^jrttcy(1[2-6])$/g).test(channel)) {
            if (isChangeF === '1') {
                convert_id = "93872644153";
            } else {
                convert_id = "93238932955";
            }
        }else if (channel === 'jrttcy17' ) {
            convert_id = "92963500869";
        }else if (channel === 'jrttcy18' || channel === 'jrttcy19' || channel === 'jrttcy20'|| 
        channel === 'jrttcy24'|| channel === 'jrttcy21'|| channel === 'jrttcy22'|| channel === 'jrttcy23') {
            convert_id = "93238427422";
        }else if (channel === 'jrttcy25' || channel === 'jrttcy26') {
            convert_id = "93872644153";
        }else if (channel === 'jrttcy27' || channel === 'jrttcy28') {
            convert_id = "93873002730";
        }else if (channel === 'jrttcy29' || channel === 'jrttcy30') {
            convert_id = "93872894338";
        }
        root._tt_config = true;
        var ta = document.createElement('script'); ta.type = 'text/javascript'; ta.async = true;
        ta.src = document.location.protocol + '//' + 's3.pstatp.com/bytecom/resource/track_log/src/toutiao-track-log.js';
        ta.onerror = function () {
            var request = new XMLHttpRequest();
            var web_url = window.encodeURIComponent(window.location.href);
            var js_url = ta.src;
            var url = '//ad.toutiao.com/link_monitor/cdn_failed?web_url=' + web_url + '&js_url=' + js_url + '&convert_id=' + convert_id;
            request.open('GET', url, true);
            request.send(null);
        }
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ta, s);
    }
})(window);