//偏移量
let offset = 0;
//每页的最大条数
let limit = 10;
voteFn = {
    formatUser(user){
        return (
            `
             <li>        
                        <div class="head">
                           <a href="detail.html">
                              <img src="${user.head_icon}" alt="">
                           </a>
                        </div>
                        <div class="up">
                           <div class="vote">
                              <span>${user.vote}票</span>
                           </div>
                           <div class="btn">
                              投TA一票
                           </div>
                        </div>
                        <div class="descr">
                           <a href="detail.html">
                             <div>
                                <span>${user.username}</span>
                                <span>|</span>
                                <span>编号#${user.id}</span>
                              </div>
                              <p>${user.description}</p>
                           </a>
                        </div>     
                    </li>
            `
        )
    }
}
$(function(){
    $.ajax({
        url:'/vote/index/data',
        type:'GET',
        data:{offset,limit},
        dataType:'json',
        success(result){//是一个结果
          offset += limit;//在加载一页成功之后改变offset值
          $('.coming').html(result.data.objects.map(user=>voteFn.formatUser(user)).join(''));
        }
    });
    window.onscroll = function(){
      //一屏的高度
      let clientHeight = document.documentElement.clientHeight||document.body.clientHeight;
      //当前内容向上卷去的高度
      let scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
      //这是内容的高度
      let contentHeight = document.documentElement.scrollheight || document.body.scrollHeight;
      if(clientHeight+scrollTop>=contentHeight){
          $.ajax({
              url:'/vote/index/data',
              type:'GET',
              data:{offset,limit},
              dataType:'json',
              success(result){//是一个结果
                  offset+=limit;
                  $('.coming').append(result.data.objects.map(user=>voteFn.formatUser(user)).join(''));
              }
          });
      }

    }

});
