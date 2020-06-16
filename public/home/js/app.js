var Demo = {};

Demo.App = function () {
    this.controllers = {};
};

Demo.App.prototype.get = function(controller) {
    return this.controllers[controller];
};

// 自动运行每个对象内的相应方法
Demo.App.prototype.execute = function() {
    for (var className in Demo) {
        if (className !== "App") {
            var controller = new Demo[className](this);
            this.controllers[className] = controller;

            if (typeof controller.execute === "function") {
                controller.execute();
            }

            if (typeof controller.listen === "function") {
                controller.listen();
            }

            if (typeof controller.focus === "function") {
                controller.focus();
            }

            // 快捷键操作(键盘操作)
            if (typeof controller.keyboardShortcuts === "function") {
                var topDocument = document;
                if (window.self != window.top) {
                    topDocument = window.parent.document;
                }
                topDocument.onkeyup = document.onkeyup = function (e) {
                    e = e || window.event;
                    controller.keyboardShortcuts(e);
                };
            }

            // 执行每个模块中以init开头的初始化函数
            if (typeof this.controllers[className].init != 'undefined') {
                for (var initName in this.controllers[className].init) {
                    this.controllers[className].init[initName]();
                }
            }

        }
    }
};