/**
 * Created by Administrator on 2019/2/26.
 */
window.addEventListener('DOMContentLoaded',function () {
    var mask = document.querySelector('#wrap #mask');
    var maskUp = document.querySelector('#wrap #mask .maskUp');
    var maskDown = document.querySelector('#wrap #mask .maskDown');
    var maskLine = document.querySelector('#wrap #mask .maskLine');
    var conWrap = document.getElementById('conWrap');
    var header = document.getElementById('header');
    var myMusic = document.querySelector('#header .headerMain .music');
    var myAudio = document.querySelector('#header .headerMain .music>audio');
    var conList = document.querySelector('#conWrap .conList');
    var conItems = document.querySelectorAll('#conWrap .conList .conItem');
    var arrow = document.querySelector('#header .headerMain .arrow');
    var ups = document.querySelectorAll('#header .headerMain .nav .liItem .up');
    var liItems = document.querySelectorAll('#header .headerMain .nav .navList .liItem');
    var homeIcons = document.querySelectorAll('#conWrap .conList .home .homeNav .homeIcon');
    var homeItems = document.querySelectorAll('#conWrap .conList .home .homeList .homeItem');
    var team3Items = document.querySelectorAll('#conWrap .conList .team .team3 .team3List .team3Item');
    var team3 = document.querySelector('#conWrap .conList .team .team3');
    var menuItems = document.querySelectorAll('#conWrap .menuList .menuItem');

    var index = 0;
    var oldIdex = 0; //第一屏小圆点切换索引
    var timer = null;
    var autoTimer = null;
    var isMoving = false;
    var myCanvas = null;
    var timer1 = null;
    var timer2 = null;

    //处理第一个up高亮
    ups[index].style.width = '100%';
    //初始化三角的位置
    arrow.style.left = liItems[index].getBoundingClientRect().left + liItems[index].offsetWidth/2+'px';

    //相应缩放逻辑
    window.onresize = function () {
        contBind();
        conMove(index);
    };

    //头部交互
    headerBind();
    function headerBind() {
        for (var i = 0; i < liItems.length; i++) {
            var item = liItems[i];
            item.index = i;
            //给每个导航加点击事件
            item.onclick = function () {
                animationArr[index].outAnimation();
                animationArr[this.index].inAnimation();
                index = this.index;
                conMove(this.index);
            }

        }
    }

    //屏幕切换逻辑
    function conMove(index) {
        //1、清除高亮样式
        for (var j = 0;j<ups.length;j++) {
            ups[j].style.width = '';
            menuItems[j].className = 'menuItem';
        }
        //2、点击那个up高亮
        ups[index].style.width = '100%';
        menuItems[index].className = 'menuItem active';
        //3、移动到当前位置
        arrow.style.left = liItems[index].getBoundingClientRect().left + liItems[index].offsetWidth/2+'px';
        //移动内容区
        conList.style.top = -index*(document.documentElement.clientHeight -header.offsetHeight)+'px';
    }

    //内容区域逻辑
    contBind();
    function contBind() {
        //设置承接内容盒子的高度
        conWrap.style.height = document.documentElement.clientHeight -header.offsetHeight + 'px';
        //给每一屏设置高度
        for (var i = 0; i < conItems.length; i++) {
            conItems[i].style.height = document.documentElement.clientHeight -header.offsetHeight + 'px';

        }
    }

    //鼠标滚轮逻辑
    mousewheel();
    function mousewheel() {
        //ie/chrome
        document.onmousewheel = function (event) {
            clearTimeout(timer);
            timer = setTimeout(function () {
                scrollMove(event);
            },200);
        };
        //firefox
        if(document.addEventListener){
            document.addEventListener('DOMMouseScroll',function (event) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    scrollMove(event);
                },200);
            });
        }
        function scrollMove(event) {
            event = event || window.event;
            var flag = '';
            if(event.wheelDelta){
                //ie/chrome
                if(event.wheelDelta > 0){
                    //上
                    flag = 'up';
                }else {
                    //下
                    flag = 'down'
                }
            }
            else if(event.detail){
                //firefox
                if(event.detail < 0){
                    //上
                    flag = 'up';
                }else {
                    //下
                    flag = 'down'
                }
            }
            //最终判断滚轮的方向
            switch (flag){
                case 'up':
                    //滚轮向上滚动
                    if(index>0){
                        animationArr[index].outAnimation();
                        index--;
                        animationArr[index].inAnimation();
                        conMove(index);
                    }
                    break;
                case 'down':
                    //滚轮向下滚动
                    if(index < liItems.length-1){
                        animationArr[index].outAnimation();
                        index++;
                        animationArr[index].inAnimation();
                        conMove(index);
                    }
                    break;
            }

            //取消默认行为
            event.preventDefault && event.preventDefault();
            return false;
        }
    }

    //第一屏点击切换
    homeClick();
    function homeClick() {
        for(var i=0;i<homeIcons.length;i++){
            var item = homeIcons[i];
            item.index = i;
            item.onclick = function () {
                //判断是否正在进行动画切换
                if(isMoving){
                    return;
                }
                isMoving = true;
                setTimeout(function () {
                    isMoving = false;
                },2000);
                clearInterval(autoTimer);

                //小圆点切换
                for(var j=0;j<homeIcons.length;j++){
                    homeIcons[j].className = 'homeIcon';
                }
                this.className = 'homeIcon active';
                //页面切换
                if(oldIdex<this.index){
                    homeItems[oldIdex].className = 'homeItem leftHide';
                    homeItems[this.index].className = 'homeItem rightShow';
                }else if(oldIdex>this.index){
                    homeItems[oldIdex].className = 'homeItem rightHide';
                    homeItems[this.index].className = 'homeItem leftShow';
                }
                oldIdex = this.index;
                auto();
            }
        }
    }
    //自动轮播
    auto();
    function auto() {
        autoTimer = setInterval(function () {
            //判断是否正在进行动画切换
            if(isMoving){
                return;
            }
            isMoving = true;
            setTimeout(function () {
                isMoving = false;
            },2000);

            //小圆点切换
            for(var j=0;j<homeIcons.length;j++){
                homeIcons[j].className = 'homeIcon';
            }
            homeIcons[oldIdex+1>3?0:oldIdex+1].className = 'homeIcon active';
            //页面切换
            homeItems[oldIdex].className = 'homeItem leftHide';
            homeItems[oldIdex+1>3?0:oldIdex+1].className = 'homeItem rightShow';
            if(oldIdex<homeItems.length-1){
                oldIdex++;
            }else{
                oldIdex=0;
            }
        },3000)
    }

    //第五屏气泡逻辑
    team();
    function team() {
        for (var i = 0;i<team3Items.length;i++){
            var item = team3Items[i];
            item.onmouseenter = function () {
                for(var j=0;j<team3Items.length;j++){
                    team3Items[j].style.opacity = '0.5';
                }
                this.style.opacity = '1';
                if(!myCanvas){
                    myCanvas = document.createElement('canvas');
                    myCanvas.width = this.offsetWidth;
                    myCanvas.height = this.offsetHeight;
//                    myCanvas.style.background  = 'gray';
                    team3.appendChild(myCanvas);
                    addAnimation();
                }
                myCanvas.style.left = this.offsetLeft + 'px';
            }
        }
        team3.onmouseleave = function () {
            for (var i = 0;i<team3Items.length;i++){
                team3Items[i].style.opacity = '0.5';
            }
            myCanvas.remove();
            myCanvas = null;
            clearInterval(timer1);
            clearInterval(timer2);
        };
    }
    //给画布添加气泡动画
    function addAnimation() {
        var painting = myCanvas.getContext('2d');
        var arr = [];
        //放到画布上
        timer1 = setInterval(function () {
            painting.clearRect(0,0,myCanvas.width,myCanvas.height);
            //加工圆
            for(var j=0;j<arr.length;j++){
                var item = arr[j];
                item.deg++;
                item.x =item.startX + Math.sin(item.deg*Math.PI/180)*80;
                item.y = item.startY - (item.deg*Math.PI/180)*80;
                if(item.y+item.r <0 ){
                    arr.splice(j,1);
                }
            }

            //画圆
            for(var i=0;i<arr.length;i++){
                var item = arr[i];
                painting.beginPath();
                painting.arc(item.x,item.y,item.r,0,2*Math.PI);
                painting.fillStyle = 'rgba('+ item.red +','+ item.green +','+ item.blue +','+ item.a +')';
                painting.fill();
            }

        },16);
        //创建圆
        timer2 = setInterval(function () {
            var obj = {};
            obj.r = Math.floor(Math.random()*8 + 4);
            obj.x = Math.floor(Math.random()*myCanvas.width);
            obj.y = myCanvas.height + obj.r;
            obj.red = Math.floor(Math.random()*255);
            obj.green = Math.floor(Math.random()*255);
            obj.blue = Math.floor(Math.random()*255);
            obj.a = 1;
            arr.push(obj);
            obj.startX = obj.x;
            obj.startY = obj.y;
            obj.deg = 0;

        },16)
    }

    //左侧小圆点点击事件
    menuClick();
    function menuClick() {
        for (var i = 0; i < menuItems.length; i++) {
            var item = menuItems[i];
            item.index = i;
            item.onclick = function () {
//                for (var j=0;j<menuItems.length;j++){
//                    menuItems[j].className = 'menuItem';
//                }
//                this.className = 'menuItem active';
                //切换到点击的那一屏
                conMove(this.index);
                animationArr[index].outAnimation();
                animationArr[this.index].inAnimation();
                //维护鼠标滚轮计数器
                index = this.index;
            }

        }
    }

    //音乐
    myMusic.onclick = function () {
        if(myAudio.paused){
            myAudio.play();
            myMusic.style.backgroundImage = 'url("img/musicon.gif")';
        }else{
            myAudio.pause();
            myMusic.style.backgroundImage = 'url("img/musicoff.gif")';
        }
    };

    //出入场动画包裹容器
    var animationArr = [
        {
            inAnimation:function() {
                var homeList=document.querySelector('#conWrap .conList .home .homeList');
                var homeNav=document.querySelector('#conWrap .conList .home .homeNav');
                homeList.style.transform = 'translate(0,0)';
                homeList.style.opacity = '1';
                homeNav.style.transform = 'translate(0,0)';
                homeNav.style.opacity = '1';
            },
            outAnimation:function(){
                var homeList=document.querySelector('#conWrap .conList .home .homeList');
                var homeNav=document.querySelector('#conWrap .conList .home .homeNav');
                homeList.style.transform = 'translate(0,-200px)';
                homeList.style.opacity = '0.5';
                homeNav.style.transform = 'translate(0,200px)';
                homeNav.style.opacity = '0.5';
            }
        },
        {
            inAnimation:function() {
                var plane1=document.querySelector('#conWrap .conList .course .plane1');
                var plane2=document.querySelector('#conWrap .conList .course .plane2');
                var plane3=document.querySelector('#conWrap .conList .course .plane3');
                plane1.style.transform = 'translate(0,0)';
                plane2.style.transform = 'translate(0,0)';
                plane3.style.transform = 'translate(0,0)';
            },
            outAnimation:function(){
                var plane1=document.querySelector('#conWrap .conList .course .plane1');
                var plane2=document.querySelector('#conWrap .conList .course .plane2');
                var plane3=document.querySelector('#conWrap .conList .course .plane3');
                plane1.style.transform = 'translate(-200px,-200px)';
                plane2.style.transform = 'translate(-200px,200px)';
                plane3.style.transform = 'translate(200px,-200px)';
            }
        },
        {
            inAnimation:function() {
                var pencel1=document.querySelector('#conWrap .conList .works .pencel1');
                var pencel2=document.querySelector('#conWrap .conList .works .pencel2');
                var pencel3=document.querySelector('#conWrap .conList .works .pencel3');
                pencel1.style.transform = 'translate(0,0)';
                pencel2.style.transform = 'translate(0,0)';
                pencel3.style.transform = 'translate(0,0)';
            },
            outAnimation:function(){
                var pencel1=document.querySelector('#conWrap .conList .works .pencel1');
                var pencel2=document.querySelector('#conWrap .conList .works .pencel2');
                var pencel3=document.querySelector('#conWrap .conList .works .pencel3');
                pencel1.style.transform = 'translate(0,-40px)';
                pencel2.style.transform = 'translate(0,200px)';
                pencel3.style.transform = 'translate(200px,200px)';
            }
        },
        {
            inAnimation:function() {
                var box1=document.querySelector('#conWrap .conList .about .about3 .about3Item:nth-child(1)');
                var box2=document.querySelector('#conWrap .conList .about .about3 .about3Item:nth-child(2)');
                box1.style.transform = 'rotate(0)';
                box2.style.transform = 'rotate(0)';
            },
            outAnimation:function(){
                var box1=document.querySelector('#conWrap .conList .about .about3 .about3Item:nth-child(1)');
                var box2=document.querySelector('#conWrap .conList .about .about3 .about3Item:nth-child(2)');
                box1.style.transform = 'rotate(-30deg)';
                box2.style.transform = 'rotate(30deg)';
            }
        },
        {
            inAnimation:function() {
                var team1=document.querySelector('#conWrap .conList .team .team1');
                var team2=document.querySelector('#conWrap .conList .team .team2');
                team1.style.transform = 'translate(0,0)';
                team2.style.transform = 'translate(0,0)';
            },
            outAnimation:function(){
                var team1=document.querySelector('#conWrap .conList .team .team1');
                var team2=document.querySelector('#conWrap .conList .team .team2');
                team1.style.transform = 'translate(-200px,0)';
                team2.style.transform = 'translate(200px,0)';
            }
        }
    ];
    //默认都是出场
    for(var i=0;i<animationArr.length;i++){
        animationArr[i].outAnimation();
    }
    //临时控制第一屏入场
//        setTimeout(function () {
//            animationArr[0].inAnimation();
//        },2000);

    //开机动画
    var arr = ['bg1.jpg','bg2.jpg','bg3.jpg','bg4.jpg','bg5.jpg','about1.jpg','about2.jpg','about3.jpg','about4.jpg','worksimg1.jpg','worksimg2.jpg','worksimg3.jpg','worksimg4.jpg','team.png','greenLine.png'];
    var loaded = 0;
    for(var j = 0;j<arr.length;j++){
        var myImage = new Image();
        myImage.src = 'img/'+arr[j];
        myImage.onload = function () {
            loaded++;
            maskLine.style.width = loaded/arr.length*100+'%';
        }
    }
    maskLine.addEventListener('transitionend',function () {
        maskUp.style.height = '0px';
        maskDown.style.height = '0px';
        maskLine.remove();
        animationArr[0].inAnimation();
    });
    maskUp.addEventListener('transitionend',function () {
        mask.remove();
    });

})