//封装将用户输入内容转换为对象的方法


function serializeToJson(form) {
    var result = {};



    var f = form.serializeArray();
    //将数组转换为对象的方法
    f.forEach(function(item) {
        //result.email
        result[item.name] = item.value;
    });
    return result;

}