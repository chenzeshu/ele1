<template>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper logo-hook animated">
            <!--购物车图标-->
            <div class="logo" :class="{ highlight:totalCount > 0 }">
              <span class="icon-shopping_cart" :class="{ highlight:totalCount > 0 }"></span>
            </div>
            <div class="num num-hook" v-show="totalCount">
              {{totalCount}}
            </div>
          </div>
            <!--配送费-->
          <div class="price" v-show="totalCount" :class="{ highlight:totalCount > 0 }">
            ￥{{totalPrice}}元
          </div>
          <div class="desc">
            另需配送费￥{{deliveryPrice}}元
          </div>
        </div>
        <div class="content-right" @click.stop="pay">
           <div class="pay" :class="payClass">
             {{payDesc}}
           </div>
        </div>
      </div>

      <div class="ball-container">
        <div v-for="ball in balls" v-show="ball.show"
             transition="drop" class="ball">
          <div class="inner inner-hook"></div>
        </div>
      </div>

      <div class="shopcart-list" v-show="listShow"
           transition="fold">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" v-el:list-content>
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span class="money-icon">￥</span><span class="money">{{food.count*food.price}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
        </div>
      </div>
    </div>
    <div class="list-mask"  @click="hideList" v-show="listShow"
         transition="fade"></div>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
 .shopcart
   position:fixed
   left:0
   bottom:0
   z-index 50
   width:100%
   height:48px
   .content
     display :flex
     background :#141d27
     color:rgba(255,255,255,0.4)
     .content-left
       flex 1
       font-size:0
       .logo-wrapper
         display inline-block
         vertical-align :top
         position:relative
         top:-10px
         /*设计图上左右体现了margin,上下体现了padding，所以不能直接margin:0 18px，应该二者结合起来更节省代码*/
         margin:0 12px
         padding: 6px
         /*ie盒模型=>做圆*/
         width:56px
         height:56px
         box-sizing:border-box
         border-radius: 50%
         background: #141d27
         .logo
           width:100%
           height:100%
           border-radius :50%
           text-align :center
           background:#2b343c
           &.highlight
             background:rgb(0,160,220)
           .icon-shopping_cart
             font-size:24px
             color:#80858a
             line-height:44px
             &.highlight
               color:#fff
         .num
           position:absolute
           top:0
           right:0
           width:24px
           height:16px
           line-height:16px
           text-align :center
           border-radius 12px
           font-size:9px
           font-weight:700
           color:#fff
           background:rgb(240,20,20)
           box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
       .price
         display inline-block
         vertical-align top
         line-height:24px
         margin-top:12px
         padding-right:12px
         box-sizing:border-box
         border-right:1px solid rgba(255,255,255,0.1)
         font-size:16px
         font-weight:700
         &.highlight
           color:#fff
         /*line-height不写48px撑满，而是24px+margin-top12px，是因为48px的话，右边的线也会撑满，不符合设计图与文字等高的需求*/
         /*
         自写样式 测试可行
         margin:12px 0 12px 0
         padding-right:12px
         font-size:16px
         font-weight :700px
         line-height:24px
         color:rgba(255,255,255,0.4)
         border-right:1px solid rgba(255,255,255,0.1)
         */
       .desc
         display inline-block
         vertical-align :top
         margin:12px 0 0 12px
         line-height:24px
         font-size:10px
         font-weight:400
     .content-right
       flex 0 0 105px
       width:105px
       &.success
         background :green
       .pay
         /*垂直水平居中*/
         height:48px
         line-height:48px
         text-align :center
         font-size:12px
         font-weight:700
         /*不需要margin:12px 8px 12px 12px，因为div的text-align center自动居中了,而height与lineheight使垂直居中
         另外，vertical-align是指多个div等的顶部对齐，有时还要伴随inline-block，而在这里，这单个的div统统不需要*/
         &.not-enough
           background :#2b343c
         &.enough
           background :#00b43c
           color:#fff
   .ball-container
      .ball
        /*最终落点位置*/
        position:fixed
        left:32px
        bottom: 22px
        z-index:200
        &.drop-transition
          transition:all 0.4s cubic-bezier(.49,-.29,.75,.41)
          .inner
            width:16px
            height:16px
            border-radius :50%  /*50%代表圆*/
            background :rgb(0,160,220)
            //x轴还是保持线性
            transition:all 0.4s linear
   .shopcart-list
     position:absolute
     left:0
     top:0
     z-index:-1
     width:100%
     &.fold-transition
       transition;all 0.5s
       transform :translate3d(0,-100%,0)  //y是个小技巧
     &.fold-enter,&.fold-leave
       transform :translate3d(0,0,0)
     .list-header
       height:40px
       line-height:40px
       padding:0 18px
       background:#f3f5f7
       border-bottom:1px solid rgba(7,17,27,0.1)
       .title
         float:left
         font-size:14px
         font-weight:200
         color:rgb(7,17,27)
       .empty
         float:right
         font-size:12px
         color:rgb(0,160,220)

     .list-content
       padding:0 18px
       max-height:217px
       overflow hidden
       background: #ffffff
       .food
         position:relative
         padding:12px 0
         box-sizing:border-box
         border-1px(rgba(7,17,27,0.1))
         .name
           line-height:24px
           font-size:14px
           color:rgb(7,17,27)
         .price
           position :absolute
           right:96px
           bottom:12px
           line-height:24px
           color:rgb(240,20,20)
           .money
             font-size:14px
             font-weight:700
           .money-icon
             font-size:8px
         .cartcontrol-wrapper
           position:absolute
           bottom:6px
           right:0

 .list-mask
   position:fixed
   top:0
   left:0
   width:100%
   height:100%
   z-index:40
   backdrop-filter:blur
   transition:all 0.5s
   &.fade-transition
     opacity :1
     background:rgba(7,17,27,0.6)
   &.fade-enter,&.fade-leave
     opacity :0
     background:rgba(7,17,27,0)
</style>

<script>
    import cartcontrol from 'components/cartcontrol/cartcontrol'
    import BScroll from "better-scroll"
    export default{
        props:{
          selectFoods:{
            type:Array,
            default(){
                return [
                  {
                    price:0,
                    count:0
                  }
                ];
            }
          },
          deliveryPrice:{
              type:Number,
              default:0
          },
          minPrice:{
              type:Number,
              default:0
          }
        },
        computed:{
          totalPrice(){
              let total = 0;
              this.selectFoods.forEach((v)=>{
                  total += v.price * v.count
              });
              return total
          },
          totalCount(){
            let count = 0;
            this.selectFoods.forEach((v)=>{
              count += v.count
            });
            return count
          },
          payDesc(){
            if(this.totalPrice === 0){
                return `￥${this.minPrice}元起送`
            }else if(this.totalPrice<this.minPrice){
                let diff = this.minPrice - this.totalPrice
                return `还差${diff}元起送`
            }else{
                return "去结算"
            }
          },
          payClass(){
            if(this.totalPrice<this.minPrice){
              return "not-enough"
            }else{
              return "enough"
            }
          },
          //自写逻辑=payDesc+payClass，配合CSS写样式可以一个函数解决
          leftPrice(){
              let left = this.minPrice;
              let totalP = 0;
              this.selectFoods.forEach((v)=>{
                  totalP += v.price
              });
              left = left - totalP;
              return left
          },
          listShow(){
              if (!this.totalCount){
                  this.fold = true
                return false
              }
              let show = !this.fold
              if(show){
                    this.$nextTick(()=>{
                        //todo 先判断是否已存在BScroll实例，避免重复实例化
                        //todo 不这样做的话，点击"+"，会随机增加数量……
                        if (!this.scroll){
                          this.scroll = new BScroll(this.$els.listContent,{
                            click:true   //prevent default BScroll的点击事件（拖动不prevent），使正常的点击可以执行
                          });
                        }else{
                            //todo BScroll的接口，可以重新计算
                            this.scroll.refresh();
                        }
                    })
              }
              return show
          }
        },
        data(){
            return{
                balls:[
                  {
                    show:false
                  },
                  {
                    show:false
                  },
                  {
                    show:false
                  },
                  {
                    show:false
                  },
                  {
                    show:false
                  },
                ],
              dropBall:[],
//              listShow:false
              fold:true
            }
        },
        methods:{
          drop(el){
            for(let i=0;i<this.balls.length;i++){
                let ball = this.balls[i]
                if(!ball.show){
                    ball.show = true
                    ball.el = el
                  this.dropBall.push(ball);
                    return;
                }
            }
          },
          toggleList(){
              if (!this.totalCount){
                  return;
              }
              this.fold = !this.fold
          },
          empty(){
              this.selectFoods.forEach((food)=>{
                 food.count = 0
              })
          },
          hideList(){
              this.fold = true
          },
          pay(){
              if(this.totalPrice<this.minPrice){
                  return;
              }
              window.alert(`支付￥${this.totalPrice}元`)
          }
        },
        transitions:{
          drop:{
            beforeEnter(el){
              let count = this.balls.length;
              while (count--){
                  let ball = this.balls[count]
                  if(ball.show){
                      //todo 获得元素相对于视口(原点为左上角(0,0))的位置的left 和 top(也就是偏移量）
                      let rect = ball.el.getBoundingClientRect();
                      let x = rect.left -32   //位置实时减去最终left的32px
                      let y = -(window.innerHeight - rect.top - 22) // 因为视口在左上角所以y为负值
                    //初始位置
                      el.style.display='';
                      el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                      el.style.Transform = `translate3d(0,${y}px,0)`;
                      let inner = el.getElementsByClassName('inner-hook')[0];
                      inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                      inner.style.Transform = `translate3d(${x}px,0,0)`;

                      let logo = document.getElementsByClassName('logo-hook')[0]
                      logo.className += ' animated pulse'

                  }
              }
            },
            enter(el){
              /* 浏览器重绘,否则enter的动画效果会失效 */
              let rf = el.offsetHeight
              this.$nextTick(()=>{
                el.style.webkitTransform = 'translate3d(0,0,0)';
                el.style.Transform = 'translate3d(0,0,0)';
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0,0,0)';
                inner.style.Transform = 'translate3d(0,0,0)';
              })
            },
            afterEnter(el){
              let ball = this.dropBall.shift(); //删除dropBall中第一个元素并将这个元素赋给ball
              if (ball){
                  ball.show = false
                  el.style.display = 'none'
              }
              let logo = document.getElementsByClassName('logo-hook')[0]
              logo.className = 'logo-wrapper logo-hook'
            }
          }
        },
        components:{
            cartcontrol
        }
    }
</script>




