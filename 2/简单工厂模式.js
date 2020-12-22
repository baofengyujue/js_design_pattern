var PopFactory = function (name) {
    switch (name) {
        case 'alert':
            return new LoginAlert('login pop');
        case 'confirm':
            return new LoginConfirm('confirm pop');
        case 'prompt':
            return new LoginPrompt('prompt pop','prompt closeInfo');
    }
};

var LoginAlert = function (text) {
    this.content = text;
};
LoginAlert.prototype = {
    pop: function () {
        console.log(this.content);
    }
};
var LoginConfirm = function (text) {
    this.content = text;
};
LoginConfirm.prototype = {
    pop: function () {
        console.log(this.content);
    }
};
var LoginPrompt = function (text,closeInfo) {
    this.content = text;
    this.closeInfo = closeInfo;
};
LoginPrompt.prototype = {
    pop: function () {
        console.log(this.content);
        return this;
    },
    close: function () {
        console.log(this.closeInfo);
        return this;
    }
};

//------------------
var prompt = PopFactory('prompt');
prompt.close().pop();
