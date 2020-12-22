(function(templateData
          /**/) {
    var template_array = [];var fn = (function (data) {var template_key = '';for (var k in data) {template_key += ('var ' + k + ' = data[' + k + '];');}eval(template_key);template_array.push("' + dealTpl(str) + '");template_key = null;})(templateData);fn = null;return template_array.join('');
});


