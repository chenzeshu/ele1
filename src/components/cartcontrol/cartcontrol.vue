<template>
    <div class="cartcontrol">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart"
           transition="move">
        <span class="inner icon-remove_circle_outline"></span>
      </div>

      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
      <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"
           transtion="move"></div>
    </div>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size:0
    .cart-decrease
      display:inline-block
      padding:6px
      transition:all 0.3s linear
      &.move-transition
        opacity :1
        transform:translate3d(0,0,0)  /*开启硬件加速，让动画更流畅*/
      .inner
        line-height:24px
        font-size:24px
        color:rgb(0,160,220)
      &.move-enter,&.move-leave
        opacity :0
        transform:translate3d(24px,0,0)
    .cart-count
      display:inline-block
      vertical-align :top
      width:12px
      padding:6px
      line-height:24px
      text-align :center
      font-size:10px
      color:rgb(147,153,159)
    .cart-add
      display:inline-block
      padding:6px
      line-height:24px
      font-size:24px
      color:rgb(0,160,220)
</style>

<script>
    import Vue from 'vue'
    export default{
        props:{
            food:{
                type:Object  //接受自父组件，在处理后传回（影响）父组件，让父组件给shopcart来联动
            }
        },
      methods:{
        addCart(event){
          if (!event._constructed){
              return;
          }   //event是vue独有，如果event_constructed不存在，就是PC浏览器提交，阻止PC浏览器提交导致2次提交

          if (!this.food.count){
              //todo 不能给对象直接增赋值，要增赋值，就需要Vue.set()的接口
              Vue.set(this.food,'count',1);  //给this.food增加一个'food'的属性，初始值为1
          }else{
              this.food.count++
          }
//        todo 派发事件一，将event.target作为cart.add事件的对象给传入
          this.$dispatch('cart.add',event.target)
        },
        decreaseCart(){
          if (!event._constructed){
            return;
          }   //event是vue独有，如果event_constructed不存在，就是PC浏览器提交，阻止PC浏览器提交导致2次提交
          if (this.food.count){
            this.food.count--
          }
          console.log(this.food.count)
        }
      },
        data(){
            return{
                cartnum:0
            }
        },
        components:{
        }
    }
</script>




