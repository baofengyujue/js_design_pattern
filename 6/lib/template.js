F.module('lib/template', function () {
    var tplEngine = function (str, data) {
        if (data instanceof Array) {
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html += getTpl(str)(data[i]);
            }
            return html;
        } else {
            return getTpl(str)(data);
        }
    };
    
    var getTpl = function (str) {
        var el = document.getElementById(str);
        if (el) {
            var html = /^(textarea|input)$/i.test(el.nodeName) ? el.value : el.innerHTML;
            return compileTpl(html);
        } else {
            return compileTpl(str);
        }
    };
    
    var dealTpl = function (str) {
        var
            left = '{%',
            right = '%}';

        debugger;

        return String(str)
            .replace(/&gt;?/g, '>')
            .replace(/&lt;?/g, '<')
            .replace(/[\r\t\n]/g, '')
            .replace(new RegExp(left + '=(.*?)' + right, 'g'), "', $1 ? $1 : '', '")
            .replace(new RegExp(left, 'g'), "');")
            .replace(new RegExp(right, 'g'), "template_array.push('");
    };
    
    var compileTpl = function (str) {
        var fnBody = "var template_array = [];var fn = (function (data) {var template_key = '';for (var k in data) {template_key += ('var ' + k + ' = data[\"' + k + '\"];');}debugger;eval(template_key);template_array.push('" + dealTpl(str) + "');template_key = null;})(templateData);fn = null;return template_array.join('');";
        return new Function('templateData', fnBody);

        // var template_array = [];
        // var fn = (function (data) {
        //     var template_key = '';
        //     for (var k in data) {
        //         template_key += ('var ' + k + ' = data[\'' + k + '\'];');
        //     }
        //     eval(template_key);
        //     template_array.push("' + dealTpl(str) + '");
        //     template_key = null;
        // })(templateData);
        // fn = null;
        // return template_array.join('');
        
    };
    
    return tplEngine;
});