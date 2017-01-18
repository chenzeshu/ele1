<template>
   <div class="goods">
     <div class="menu-wrapper" v-el:menu-wrapper>
       <ul>
         <li v-for="item in goods" class="menu-item" :class="{'current':currentIndex === $index }"
             @click="selectMenu($index,$event)">
           <span class="text border-1px">
             <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
           </span>
         </li>
       </ul>
     </div>
     <div class="foods-wrapper" v-el:foods-wrapper>
       <ul>
         <li v-for="item in goods" class="food-list food-list-hook">
           <h1 class="title">{{item.name}}</h1>
           <ul>
             <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item">
               <div class="icon">
                 <img :src="food.icon" width="57" height="57">
               </div>
               <div class="content">
                 <h2 class="name">{{food.name}}</h2>
                 <p class="desc">{{food.description}}</p>
                 <div class="extra">
                   <span class="count">月售{{food.sellCount}}份</span>
                   <span>好评率:{{food.rating}}%</span>
                 </div>
                 <div class="price">
                   <span class="now">￥{{food.price}}</span><span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                 </div>
                 <div class="cartcontrol-wrapper">
                   <cartcontrol :food="food"></cartcontrol>
                 </div>
               </div>
             </li>
           </ul>
         </li>
       </ul>
     </div>
     <shopcart v-ref:shopcart
               :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
   </div>
   <food :food="selectedFood" v-ref:food></food>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display:flex
    position:absolute
    top: 174px
    bottom:46px
    width 100%
    overflow: hidden
    .menu-wrapper
      flex:0 0 80px
      width:80px  /*不写宽度，安卓会出问题*/
      background #f3f5f7
      .menu-item  /*垂直居中经典写法：多行文字也垂直居中*/
        display :table
        height:54px
        width:56px
        line-height:14px
        padding:0 12px
        &.current
          /*向上1像素的偏移，盖住顶部的1px*/
          position:relative
          margin-top:-1px
          z-index:10
          background: #ffffff
          font-weight :700
          .text
            border-none()
        .icon
          display:inline-block
          width:12px
          height:12px
          vertical-align :top
          margin-right:2px
          background-size:12px 12px
          background-repeat :no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display :table-cell
          width:56px
          vertical-align :middle
          border-1px(rgba(7,17,27,0.1))
          font-size:12px
    .foods-wrapper
      flex:1
      .title
        padding-left 14px
        height:26px
        line-height:26px
        border-left:2px solid #d9dde1
        font-size:12px
        color:rgb(147,153,159)
        background: #f3f5f7
      .food-item
        display:flex
        font-size:12px
        margin:18px
        padding-bottom: 18px  /*2个item的上下margin会重合，18+18=18px,所以要加个padding*/
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom:0
        .icon
          flex:0 0 57px
          margin-right:10px
        .content
          flex:1
          .name
            margin:2px 0 8px 0
            height:14px
            line-height:14px
            font-size:14px
            color:rgb(7,17,27)
            font-weight:bold
          .desc,.extra
            font-size:10px
            color:rgb(147,153,159)
            line-height:10px
          .desc
            margin-bottom:8px
            line-height:12px
          .extra
            &.count
              margin-right:12px
          .price
            font-weight :700
            line-height:24px
            .now
              margin-right:8px
              font-size:14px
              color:rgb(240,20,20)
            .old
              font-size:10px
              text-decoration:line-through
              color:rgb(147,153,159)
          .cartcontrol-wrapper
            position:absolute
            right:0
            bottom:12px
</style>

<script>
  import shopcart from "components/shopcart/shopcart"
  import BScroll from "better-scroll"
  import cartcontrol from "components/cartcontrol/cartcontrol"
  import food from "components/food/food"
  const ERR_OK = 0
  export default{
      props:{
          seller:{
              type:Object
          }
      },
      created(){
          this.classMap = ['decrease','discount','special','invoice','guarantee']
          this.$http.get('/api/goods').then((response)=>{
              response = response.body;
              if (response.errno=== ERR_OK ){
                  this.goods = response.data;
                  this.$nextTick(()=>{
                    this._initScroll();
                    this._calculateHeight();
                  });//vue是异步更新dom的，所以必须要$nextTick()才能正确计算dom的高度
              }
          })
      },
      methods:{
        selectMenu(index,event){
//            event是原生没有的，所以当event.constructed不存在，即原生监听时，return，而vue自定义派发时，正常输出
          if (!event._constructed){
              return
          }
          let foodlist = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
          let el = foodlist[index]
          this.foodsScroll.scrollToElement(el,300)   //(要滚动到的dom,动画时间)

        },
        selectFood(food,event){
          if (!event._constructed){
            return;
          }
          this.selectedFood = food;
          this.$refs.food.show();
        },
        _drop(target){
            //todo 访问子组件this.$refs.shopcart而访问其的drop方法就是加.drop
          //用$nextTick()异步执行动画，减少并发运算，优化体验(因为同时会有shopcart弹出球+小球2个动画)
          this.$nextTick(()=>{
            this.$refs.shopcart.drop(target)
          })

        },
        _initScroll(){
//           html用"-"，js接收用驼峰--》vue怎么接收dom对象之'v-el:'与'.$els'
//           BScroll(dom对象，json object)
            this.menuScroll = new BScroll(this.$els.menuWrapper,{
                click:true   //prevent default BScroll的点击事件（拖动不prevent），使正常的点击可以执行
            });
            this.foodsScroll = new BScroll(this.$els.foodsWrapper,{
                click:true,  //prevent default 阻止BScroll的点击事件（拖动不prevent），使正常的点击可以执行
                probeType:3  //滚动的时候告诉实时的位置,相当于一个探针
            });

            this.foodsScroll.on('scroll',(pos)=>{
                this.scrollY = Math.abs(Math.round(pos.y))  //.abs() 返回绝对值,.round()返回四舍五入为整数
            })
        },
        //拿高度的思路：1、拿到所有food-list的高度的数组集合=》2、实时得到当前滚动的高度=》3、用实时高度去对比高度数组集合=》4、绑定对应高亮class
        _calculateHeight(){
          let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook') //所有的food-list的数组集合,每个food-list包括标题和内容
          let height = 0;
          this.listHeight.push(height);
          for(let i = 0;i<foodList.length;i++){
              let item = foodList[i];
              height += item.clientHeight; //拿到"新高度"
              this.listHeight.push(height);
          }
        }
      },
      data(){
          return{
              goods:[],
              classMap:[],
              listHeight:[],
              scrollY:0,
              selectedFood:{}
          }
      },
      computed:{
        currentIndex(){
            for(let i = 0;i<this.listHeight.length;i++){
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i+1];
                if (!height2||this.scrollY >= height1&&this.scrollY<height2){
                    return i;
                }
            }
          return 0; //超出底部时
        },
        selectFoods(){
          let foods =[];
          //如果food.count存在（大于0），那么就可以把这个food传给foods数组，最后foods数组保存了所有被选中商品的信息（food对象+数量），从而可以算钱等
          this.goods.forEach((good)=>{
            good.foods.forEach((food)=>{
              if(food.count){
                  foods.push(food);
              }
            });
          });
          return foods;
        }
      },
    events:{
//          todo 跨组件事件传递：事件由cartcontrol组件派发，一旦事件派发，cart.add(target)执行
//      那么,_drop()方法，在methods里定义就行
      'cart.add'(target){
          this._drop(target)
      }
    },
    components:{
          shopcart,cartcontrol,food
    }
  }
</script>




