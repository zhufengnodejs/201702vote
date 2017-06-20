//偏移量
let offset = 0;
//每页的最大条数
let limit = 10;
$(function(){
    $.ajax({
        url:'/vote/index/data',
        type:'GET',
        data:{offset,limit},
        dataType:'json',
        success(result){//是一个结果
            console.log(result);
        }
    });
});
