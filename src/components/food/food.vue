<template>
    <div v-show="showFlag" class="food" transition="move" v-el:food>
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span  class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <div class="buy" v-show="!food.count || food.count===0"
               @click.stop.prevent="addFirst($event)" transition="fade">加入购物车</div>
        </div>
        <split></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings &&food.ratings.length">
            <li class="rating-item" v-for="rating in food.ratings"
                v-show="needShow(rating.rateType,rating.text)">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img :src="rating.avatar" class="avatar" width="12" height="12">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    position fixed
    left 0
    top 0
    bottom 48px
    z-index 30
    width 100%
    background #fff
    /*从右向左飞入*/
    &.move-transition
      transition all 0.2s linear
      transform translate3d(0,0,0)
    &.move-enter,&.move-leave
      transform translate3d(100%,0,0)
    .image-header
      position:relative
      width:100%
      height:0   //技巧：防止图片未加载->加载完毕造成的DOM抖动
      padding-top:100%  //技巧：防止图片未加载->加载完毕造成的DOM抖动->padding-top设100%，会与width相同
      img
        position:absolute
        left 0
        top 0
        width:100%
        height:100%
      .back
        position:absolute
        top: 10px
        left 0
        .icon-arrow_lift
          display:block
          padding:10px
          font-size: 20px
          color:#fff
    .content
      position:relative
      padding: 18px
      .title
        line-height:14px
        margin-bottom 8px
        font-size:14px
        font-weight:700
        color:rgb(7,17,27)
      .detail
        margin-bottom 18px
        height:10px
        line-height:10px
        font-size:0
        color:rgb(147,153,159)
        .sell-count,.rating
          font-size:10px
        .sell-count
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
        right:12px
        bottom:12px
      .buy
        position:absolute
        right:18px
        bottom:18px
        z-index:10
        height:24px
        line-height:24px
        padding:0 12px
        box-sizing border-box
        border-radius:12px
        font-size:10px
        color:#fff
        background:rgb(0,160,220)
        &.fade-transition
          opacity 1
          transition:all 0.3s
        &.fade-enter,&.fade-leave
          opacity 0
    .info
      padding:18px
      .title
        line-height:14px
        margin-bottom 6px
        font-size:14px
        font-weight:600
        color:rgb(7,17,27)
      .text
        line-height:24px
        padding:0 8px
        font-size:12px
        font-weight:200
        color:rgb(77,85,93)

    .rating
      padding-top:18px
      .title
        line-height:14px
        margin-left 18px
        font-size:14px
        font-weight:600
        color:rgb(7,17,27)

    .rating-wrapper
      padding 0 18px
      .rating-item
        position: relative
        padding:16px 0
        color:rgb(147,153,159)
        border-1px(rgba(7,17,27,0.1))
        .user
          position:absolute
          right 0
          top 16px
          font-size:0
          line-height:12px
          .name,.avatar
            display :inline-block
          .name
            font-size:10px
            margin-right:6px
            vertical-align top
          .avatar
            border-radius 50%
        .time
          padding-bottom 6px
          font-size:10px
          line-height:12px
        .text
          font-size:12px
          line-height:16px
          color rgb(7,17,27)
          .icon-thumb_up,.icon-thumb_down
            line-height:24px
            margin-right:4px
          .icon-thumb_up
            color:rgb(0,160,220)
          .icon-thumb_down
            color:rgb(147,153,159)

      .no-rating
        padding:16px 0
        font-size 12px
        color rgb(147,153,159)
</style>

<script>
    import Vue from 'vue'
    import BScroll from "better-scroll"
    import {formatDate} from 'common/js/date'
    import cartcontrol from 'components/cartcontrol/cartcontrol'
    import split from 'components/split/split'
    import ratingselect from 'components/ratingselect/ratingselect'

    const POSITIVE = 0
    const NEGATIVE = 1
    const ALL = 2

    export default{
        props:{
          food:{
              type:Object
          }
        },
        methods:{
          show(){
              this.showFlag = true;
              this.selectType = ALL;
              this.onlyContent =false;
              this.$nextTick(()=>{
                  if(!this.scroll){
                      this.scroll = new BScroll(this.$els.food,{
                          click:true
                      })
                  }else{
                      this.scroll.refresh()
                  }
              })
          },
          hide(){
              this.showFlag = false
          },
          addFirst(event){
              if (!event._constructed){
                  return;
              }
//todo      派发事件
            this.$dispatch('cart.add',event.target)
              Vue.set(this.food,'count',1)
          },
          needShow(type,text){
              if (this.onlyContent && !text){
                  return false;
              }
              if (this.selectType ===ALL){
                  return true
              } else {
                  return type === this.selectType
              }
          },

        },
        events:{
          'ratingtype.select'(type){
              this.selectType = type
              this.$nextTick(()=>{
                this.scroll.refresh()
              })
//              let rf = el.offsetHeight
          },
          'content.toggle'(onlyContent){
              this.onlyContent = onlyContent
              this.$nextTick(()=>{
                this.scroll.refresh()
              })
          }
        },
        data(){
            return{
                showFlag:false,
                onlyContent:true,
                selectType:ALL,
                desc:{
                    all:'全部',
                  positive:'满意',
                  negative:'吐槽'
                }
            }
        },
        filters:{
          formatDate(time){
            let date = new Date(time)
            return formatDate(date,'yy-MM-dd hh:mm')
          }
        },
        components:{
            cartcontrol,split,ratingselect
        }
    }
</script>




