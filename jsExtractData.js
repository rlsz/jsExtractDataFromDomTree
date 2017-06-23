;
$.fn.extractData = (function () {
    function addItemToObject(obj, key, value) {
        if (value != undefined) {
            if (obj[key] != undefined) {
                if (!obj[key].push) {
                    obj[key] = [obj[key]];
                }
                obj[key].push(value);
            } else {
                obj[key] = value;
            }
        }
    };
    var htmlValueTag = ["label", "span", "div", "h1", "h2", "h3", "h4", "h5", "h6", "p"];
    function getValue(element) {
        var o;
        var tagName = element.prop('tagName').toLowerCase();
        if (htmlValueTag.indexOf(tagName) >= 0) {
            o = element.html();
        } else if (element.prop('type') == 'checkbox') {
            o = element.prop('checked');
        } else {
            o = element.val();
        }
        return o;
    };
    var valueMap = {
        JArray:function(){
            let o = [];
            $.each(this.children(), function () {
                if ($(this).attr("data-type") == undefined) {
                    o = o.concat($(this).extractData("JArray"));
                } else {
                    var temp = $(this).extractData();
                    if (temp != undefined) {
                        o.push(temp);
                    }
                }
            });
            return o;
        },
        JObject: function (){
            let o = {};
            $.each(this.children(), function () {
                if ($(this).attr("type") == "radio" && $(this).prop("checked") == false) {
                    return true;
                }
                if ($(this).attr("name") != undefined && $(this).attr("name") != '') {
                    addItemToObject(o, $(this).attr("name"), $(this).extractData());
                }
                if ($(this).attr("data-name") != undefined) {
                    addItemToObject(o, $(this).attr("data-name"), $(this).extractData());
                }

                if ($(this).attr("name") == undefined && $(this).attr("data-name") == undefined) {
                    var tempObj = $(this).extractData("JObject");
                    for (var name in tempObj) {
                        addItemToObject(o, name, tempObj[name]);
                    }
                }
            });
            return o;
        },
        JCheckbox: function (){
            if ($(this).prop("checked")) {
                return this.val();
            }
        },
        JNumber: function (){
            return Number(getValue(this));
        },
        JValue: function (){
            return getValue(this);
        },
    };
    var returnFunc = function (type) {
        if (type == undefined) {
            type = this.attr("data-type") || "JValue";
        }
        if (!valueMap[type]) {
            console.error("unknow data type:" + type);
            return null;
        } else {
            return valueMap[type].call(this, this);
        }
    }
    returnFunc.type = valueMap;
    return returnFunc;
})();