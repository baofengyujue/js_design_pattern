var Human = function (info) {
    this.skill = info && info.skill || '保密';
    this.hobby = info && info.hobby || '保密';
};
Human.prototype = {
    getSkill: function () {
        return this.skill;
    },
    getHobby: function () {
        return this.hobby;
    }
};

var Name = function (name) {
    (function (name, self) {
        self.wholeName = name;
        var idx = name.indexOf(' ');
        if (idx > -1) {
            self.firstName = name.slice(0,idx);
            self.lastName = name.slice(idx);
        }
    })(name, this);
};
var Work = function (work) {
    (function (work, self) {
        switch (work) {
            case 'code':
                self.name = '工程师';
                self.descr = '每天沉醉于编程';
                break;
            case 'UI':
            case 'UX':
                self.name = '设计师';
                self.descr = '设计更是一种艺术';
                break;
            case 'teach':
                self.name = '教师';
                self.descr = '分享也是一种快乐';
                break;
            default:
                self.name = work;
                self.descr = '对不起，我们还不清楚您所选职位的相关描述';
        }
    })(work, this);
};
Work.prototype = {
    changeWork: function (work) {
        this.name = work;
    },
    changeDescr: function (descr) {
        this.descr = descr;
    }
};

var Person = function (name, work, info) {
    var _person = new Human(info);
    _person.name = new Name(name);
    _person.work = new Work(work);
    return _person;
};

//-----------------
var p1 = new Person('xiao ming','code');
console.log(p1.skill);
console.log(p1.name.wholeName);
console.log(p1.name.firstName);
console.log(p1.work.name);
console.log(p1.work.descr);
p1.work.changeDescr('更改了职位描述！');
console.log(p1.work.descr);
console.log('-------------');
var p2 = new Person('si xuan','UX',{ hobby: '旅游' });
console.log(p2.skill);
console.log(p2.hobby); //要想hobby不能被直接访问，可利用闭包实现
console.log(p2.getHobby());
console.log(p2.work.descr);