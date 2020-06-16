Demo.WordCountControl = function(app) {
    this.app = app;
};

// 获取顶层文档
// 如果在iframe中需要获取顶层文档则将注释去掉.
var topDocument = document;
// if (window.self != window.top) {
//     topDocument = window.parent.document;
// }

// 初始化对象
Demo.WordCountControl.prototype.init = {};

// 自定义距离文本域底部多高
Demo.WordCountControl.prototype.mTop = 2;
// 自定义距离文本域右边框部多远
Demo.WordCountControl.prototype.mLeft = 5;
// 自定义距离最大字数多少时触发提示
Demo.WordCountControl.prototype.willFullLength = 20;

Demo.WordCountControl.prototype.listen = function() {
    var wordCountDomList = document.querySelectorAll('.word-count textarea');
    for (var i = 0; i < wordCountDomList.length; i++) {
        wordCountDomList[i].oninput = function() {
            var sourceText = this.value;
            var filterText = sourceText.trim();
            var maxLength = this.parentNode.getAttribute('data-max-length');
            var willFullLength = this.parentNode.getAttribute('data-will-full');
            var nowLength = maxLength <= sourceText.length ? maxLength : sourceText.length;
            var nowLengthDom = this.parentNode.querySelector('.word-count-view-now');

            if (nowLength >= maxLength) {
                nowLengthDom.innerHTML = maxLength;
            } else {
                nowLengthDom.innerHTML = nowLength;
            }

            Demo.WordCountControl.prototype.willFullLength = willFullLength == null ? Demo.WordCountControl.prototype.willFullLength : willFullLength;
            if (maxLength - nowLength <= Demo.WordCountControl.prototype.willFullLength) {
                nowLengthDom.classList.add('count-will-full');
            } else {
                nowLengthDom.classList.remove('count-will-full');
            }

            if (this.parentNode.getAttribute('text-not-extend') != 1) {
                this.style.height = 'auto';
                if (this.scrollHeight <= 100) {
                    this.style.height = '100px';
                } else {
                    this.style.height = this.scrollHeight + 'px';
                }
            }

            // 变更字数统计容器位置
            var wordCountView = this.parentNode.querySelector('.word-count-view-box');
            var marginTop = this.offsetTop + this.offsetHeight - wordCountView.offsetHeight - Demo.WordCountControl.prototype.mTop;
            var marginLeft = this.offsetLeft + this.offsetWidth - wordCountView.offsetWidth - Demo.WordCountControl.prototype.mLeft;
            wordCountView.style.cssText += 'top: ' + marginTop + 'px; left: ' + marginLeft + 'px';
        }
    }
}

// 初始化CSS
Demo.WordCountControl.prototype.init['Css'] = function() {
    var headDom = topDocument.querySelector('head');
    var wordCountCss = topDocument.createElement('link');
    wordCountCss.setAttribute('rel', 'stylesheet');
    wordCountCss.href = './css/word-count-control.css';
    headDom.appendChild(wordCountCss);
}

// 生成字数统计容器
Demo.WordCountControl.prototype.init['WordCount'] = function() {
    var wordCountDomList = document.querySelectorAll('.word-count');
    for (var i = 0; i < wordCountDomList.length; i++) {
        var textDom = wordCountDomList[i].querySelector('textarea');
        var maxLength = wordCountDomList[i].getAttribute('data-max-length');

        textDom.setAttribute('maxLength', maxLength);

        // 使用数组 - 对象的形式创建DOM
        // var wordCountViewArgs = [
        //     {
        //         nodeType: 'span',
        //         innerHTML: [
        //             {
        //                 innerText: '0',
        //                 nodeType: 'span',
        //                 class: 'word-count-view-now'
        //             },
        //             {
        //                 nodeType: 'span',
        //                 innerText: ' / '
        //             },
        //             {
        //                 nodeType: 'span',
        //                 innerText: maxLength,
        //                 class: 'word-count-view-max'
        //             },
        //             {
        //                 nodeType: 'span',
        //                 innerText: ' 字'
        //             }
        //         ],
        //         class: 'word-count-view-box'
        //     }
        // ];
        // var wordCountView = createDom(wordCountViewArgs);
        // for (var item in wordCountView) {
        //     wordCountDomList[i].appendChild(wordCountView[item]);
        // }

        // 使用字符串的形式创建DOM.
        var wordCountViewStr = '<span class="word-count-view-box"><span class="word-count-view-now">0</span> / <span class="word-count-view-max">' + maxLength + '</span> 字</span>';
        var wordCountView = strToDom(wordCountViewStr);
        wordCountDomList[i].appendChild(wordCountView);
    }
}

// 初始化字数统计容器位置
Demo.WordCountControl.prototype.init['WordCountPosition'] = function() {
    document.onreadystatechange = function() {
        if (this.readyState == 'complete') {
            var wordCountDomList = document.querySelectorAll('.word-count');
            for (var i = 0; i < wordCountDomList.length; i++) {
                var textDom = wordCountDomList[i].querySelector('textarea');
                var wordCountView = wordCountDomList[i].querySelector('.word-count-view-box');
                var marginTop = textDom.offsetTop + textDom.offsetHeight - wordCountView.offsetHeight - Demo.WordCountControl.prototype.mTop;
                var marginLeft = textDom.offsetLeft + textDom.offsetWidth - wordCountView.offsetWidth - Demo.WordCountControl.prototype.mLeft;
                wordCountView.style.cssText += 'top: ' + marginTop + 'px; left: ' + marginLeft + 'px';
            }
        }
        this.onreadystatechange = null;
    }
}




/**
 * 传入字符串可以将字符串转换为DOM对象
 *
 * 形如: '<div><span></span></div>'
 * 
 * @param domStr;
 * 
 * @return resDom;
 */
function strToDom(domStr) {
    var tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = domStr;
    var resDom = tmpDiv.children[0];
    return resDom;
}

/**
 * 传入一个构造好的对象/数组
 *
 * 
 * 
 * @param domList 传入一个数组形似:
 * 
 * @return buildDom 返回一个DOM对象.
 * 
 */
function createDom(domList) {
    var buildDom = Array();
    for (var item in domList) {
        var dom = document.createElement(domList[item]['nodeType']);
        if (typeof domList[item]['nodeType'] != 'undefined') {
            for (var attr in domList[item]) {
                if (attr == 'nodeType') {
                    continue;
                } else if (attr.toLocaleLowerCase() == 'innerhtml') {
                    var resDom = this.createDom(domList[item][attr]);
                    for (var domItem in resDom) {
                        dom.appendChild(resDom[domItem]);
                    }
                } else if (attr.toLocaleLowerCase() == 'innertext') {
                    var textNode = document.createTextNode(domList[item][attr]);
                    dom.appendChild(textNode);
                } else {
                    dom.setAttribute(attr, domList[item][attr]);
                }
            }
            buildDom.push(dom);
        }
    }
    return buildDom;
}