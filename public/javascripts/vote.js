//偏移量
let offset = 0;
//每页的最大条数
let limit = 10;
//取得当前路径名
let url = location.pathname;
//首页的正则
let indexReg = /\/vote\/index/;
//注册页的正则
let registerReg = /\/vote\/register/;
//个人主页的正则
let detailReg = /\/vote\/detail\/(\d+)/;
// fetch axios
voteFn = {
    formatUser(user){
        return (
            `
             <li>        
                        <div class="head">
                           <a href="/vote/detail/${user.id}">
                              <img src="${user.head_icon}" alt="">
                           </a>
                        </div>
                        <div class="up">
                           <div class="vote">
                              <span>${user.vote}票</span>
                           </div>
                           <div data-id="${user.id}" class="btn">
                              投TA一票
                           </div>
                        </div>
                        <div class="descr">
                           <a href="/vote/detail/${user.id}">
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
    },
    setItem(key,value){
        localStorage.setItem(key,value)
    },
    getItem(key){
        return localStorage.getItem(key);
    },
    getUser(){
        return voteFn.getItem('user')?JSON.parse(voteFn.getItem('user')):null;
    },
    setUser(user){//向localStorage中保存user对象
        voteFn.setItem('user',JSON.stringify(user));
    },
    clearUser(){
        localStorage.removeItem('user');
    },
    request({url,type='GET',data={},dataType='json',success}){
        $.ajax({url, type, data, dataType, success});
    },
    initIndex(){
        voteFn.request({
            url: '/vote/index/data',
            data: {offset, limit},
            success(result){//是一个结果
                offset += limit;//在加载一页成功之后改变offset值
                $('.coming').html(result.data.objects.map(user => voteFn.formatUser(user)).join(''));
            }
        });
        loadMore({
            callback(load){
                voteFn.request({
                    url: '/vote/index/data',
                    type: 'GET',
                    data: {offset, limit},
                    dataType: 'json',
                    success(result){//是一个结果
                        offset += limit;//在加载一页成功之后改变offset值
                        // 20  15
                        if (offset >= result.data.total) {
                            $('.coming').append(result.data.objects.map(user => voteFn.formatUser(user)).join(''));
                            load.complete();
                            setTimeout(function(){
                                load.reset();
                            },1000);
                        } else {
                            setTimeout(function () {
                                $('.coming').append(result.data.objects.map(user => voteFn.formatUser(user)).join(''));
                                load.reset();
                            }, 1000);
                        }

                    }
                });
            }
        });
        $('.sign_in').click(function(){
            $('.mask').show();
            $('.subbtn').click(function(){
                let id = $('.usernum').val();
                let password = $('.user_password').val();
                voteFn.request({
                    url:'/vote/index/info',
                    type:'POST',
                    data:{id,password},
                    success(result){ //成功的回调
                        voteFn.setUser(result.user);
                        alert(result.msg);
                        if(result.errno ==0){
                            location = '/vote/index';
                        }
                    }
                });
            });
        });
        let user = voteFn.getUser();
        if(user){
            $('.sign_in span').text('已登入');
            $('.register a').text('个人主页');
            $('.register a').attr('href',`/vote/detail/${user.id}`);
            $('.username').text(user.username);
            $('.no_signed').hide();
            $('.dropout').click(function(){
                voteFn.clearUser();
                location.reload();
            });
        }
        $('.coming').click(function(event){
            if(event.target.className == 'btn'){
                let voterId = user.id;//投票人ID
                let id = event.target.dataset.id;//被投票人ID
                voteFn.request({
                    url:'/vote/index/poll',
                    data:{id,voterId},
                    success(result){
                        alert(result.msg);
                        if(result.errno == 0){
                            let voteSpan = $(event.target).siblings('.vote').children('span');
                            voteSpan.text((parseInt(voteSpan.text())+1)+'票');
                        }
                    }
                });

            }
        });
        $('.search span').click(function(){
            let keyword = $('.search input').val();
            voteFn.setItem('keyword',keyword);
            location = '/vote/search';
        });
    },
    getRegisterUser(){
        let username = $('.username').val();
        if(!username || username.length==0){
            alert('用户名不能为空');
            return;
        }
        let initial_password = $('.initial_password').val();
        if(!/[0-9a-zA-Z]{1,10}/.test(initial_password)){
            alert('密码不合法,请重新输入');
            return;
        }
        let confirm_password = $('.confirm_password').val();
        if(initial_password!=confirm_password){
            alert('确认密码和密码不一致，请重新输入.');
            return;
        }
        let mobile = $('.mobile').val();
        if(!/1\d{10}/.test(mobile)){
            alert('手机号输入不正确，请重新输入');return;
        }
        let description =$('.description').val();
        if(!description || description.length>20){
            alert('描述输入不正确');return;
        }
        let gender = $("input[name='gender']:checked").val();
        return {
            username,
            password:initial_password,
            mobile,
            description,
            gender
        }
    },
    initRegister(){
      $('.rebtn').click(function(){
        let user = voteFn.getRegisterUser();
        if(user){
           voteFn.request({
               url:'/vote/register/data',
               type:'POST',
               data:user,
               success(result){
                   if(result.errno == 0){
                       user.id = result.id;
                       voteFn.setUser(user);
                       location = '/vote/index';
                       alert(result.msg);
                   }
               }
           })
        }
      });
    },
    formatUserDetail(user){
      return (
          `
          <div class="pl">
					<div class="head">
						<img src="${user.head_icon}" alt="">
					</div>
					<div class="p_descr">
						<p>${user.username}</p>
						<p>编号#${user.id}</p>
					</div>
				</div>
				<div class="pr">
					<div class="p_descr pr_descr">
						<p>${user.rank}名</p>
						<p>${user.vote}票</p>
					</div>
				</div>
				<div class="motto">
					${user.description}
				</div>
          `
      )
    },
    formatFriend(friend){
        return (
            `
            <li>
				    <div class="head">
				        <a href="#"><img src="${friend.head_icon}" alt=""></a>
				    </div>
				    <div class="up">
				    	<div class="vote">
				    		<span>投了一票</span>
				    	</div>
				    </div>
				    <div class="descr">
				        <h3>${friend.username}</h3>
				        <p>编号#${friend.id}</p>
				    </div>
				</li>
            `
        )
    },
    initDetail(){
        let result = url.match(detailReg);
        let id = result[1];
        voteFn.request({
            url:'/vote/all/detail/data',
            data:{id},
            success(result){
                let user = result.data;
                let html = voteFn.formatUserDetail(user);
                $('.personal').html(html);
                let friendHtml = user.vfriend.map(friend=>voteFn.formatFriend(friend)).join('');
                $('.vflist').html(friendHtml);
            }
        })
    }
}

$(function () {

    if(indexReg.test(url)){
        voteFn.initIndex();
    }else if(registerReg.test(url)){
        voteFn.initRegister();
    }else if(detailReg.test(url)){
        voteFn.initDetail();
    }


});
