<template>
    <div class="seller" v-el:seller>
      <div class="seller-content">
        <div class="overview">
          <h1 class="title">{{seller.name}}</h1>
          <div class="desc border-1px">
            <div class="star">
              <star :size="36" :score="seller.score"></star>
              <span class="text">({{seller.ratingCount}})</span>
              <span class="text">月售{{seller.sellCount}}份</span>
            </div>
          </div>
            <ul class="remark">
              <li class="block">
                <h2>起送价</h2>
                <div class="content">
                  <span class="stress">{{seller.minPrice}}</span>元
                </div>
              </li>
              <li class="block">
                <h2>商家配送</h2>
                <div class="content">
                  <span class="stress">{{seller.deliveryPrice}}</span>元
                </div>
              </li>
              <li class="block">
                <h2>平均配送时间</h2>
                <div class="content">
                  <span class="stress">{{seller.deliveryTime}}</span>分钟
                </div>
              </li>
            </ul>
          <div class="favorite" @click="toggleFavorite">
            <span class="icon-favorite" :class="{'active':favorite}"></span>
            <span class="text">{{favoriteText}}</span>
          </div>
        </div>
        <split></split>
        <div class="bulletin">
          <h1 class="title">公告与活动</h1>
          <div class="content-wrapper border-1px">
            <p class="content">{{seller.bulletin}}</p>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item border-1px" v-for="item in seller.supports">
              <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
              <span class="text">{{seller.supports[$index].description}}</span>
            </li>
          </ul>
        </div>
        <split></split>
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <div class="pic-wrapper" v-el:pic-wrapper>
            <ul class="pic-list" v-el:pic-list>
              <li class="pic-item" v-for="pic in seller.pics">
                <img :src="pic" width="120" height="90">
              </li>
            </ul>
          </div>
        </div>
        <split></split>
        <div class="info">
          <h1 class="title border-1px">商家信息</h1>
          <ul>
            <li class="info-item" v-for="item in seller.infos">
              {{item}}
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .seller
    position:absolute
    top:174px
    bottom:0
    left 0
    width 100%
    overflow hidden
    .overview
      position relative
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px
      .desc
        padding-bottom 18px
        line-height 18px
        border-1px(rgba(7,17,27,0.1))
        font-size 0
        .star
          display inline-block
          vertical-align top
          margin-top 3px
          margin-right 8px
        .text
          display inline-block
          vertical-align top
          margin-right 12px
          line-height 25px
          font-size 10px
          color rgb(77,85,93)
      .remark
        display flex
        padding-top 18px
        .block
          flex:1
          text-align center
          border-right 1px solid rgba(7,17,27,0.1)
          &:last-child
            border none
          h2
            margin-bottom 4px
            line-height 10px
            font-size 10px
            color rgb(147,153,159)
          .content
            line-height 24px
            font-size 10px
            color rgb(7,17,27)
            .stress
              font-size 24px
      .favorite
        position absolute
        top 18px
        right 11px
        width 50px
        text-align center
        .icon-favorite
          display block
          margin-bottom 4px
          line-height 24px
          font-size 24px
          color #d4d6d9
          &.active
            color rgb(240,20,20)
        .text
          line-height 10px
          font-size 10px
          color rgb(77,85,93)
    .bulletin
      padding 18px 18px 0 18px
      .title
        margin-bottom 8px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px
      .content-wrapper
        padding 0 12px 16px 12px
        border-1px(rgba(7,17,27,0.1))
        .content
          line-height 24px
          font-size 12px
          font-weight 200
          color rgb(240,20,20)
      .supports
        .support-item
          padding 16px 12px
          font-size 0
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
          .icon
            display:inline-block
            width:16px
            height:16px
            vertical-align :top
            margin-right:6px
            background-size:16px 16px
            background-repeat :no-repeat
            &.decrease
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
            &.special
              bg-image('special_4')
          .text
            display inline-block
            line-height 16px
            font-size 12px
            color rgb(7,17,27)

    .pics
      padding:18px
      .title
        margin-bottom 12px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px
      .pic-wrapper
        //用来固定视口大小，用来做BScroll层，方便滚动和隐藏
        //而ul class=pic-list 则用来作为实际content宽度层
        width:100%
        overflow hidden
        white-space nowrap
        .pic-list
          font-size 0
          .pic-item
            display inline-block
            margin-right:6px
            width:120px
            height 90px
            &:last-child
              margin-right 0
    .info
      padding 18px 18px 0 18px
      color rgb(7,17,27)
      .title
        padding-bottom 12px
        line-height 14px
        border-1px(rgba(7,17,27,0.1))
        color rgb(7,17,27)
        font-size 14px
      .info-item
        padding 16px 12px
        line-height 16px
        border-1px(rgba(7,17,27,0.1))
        font-size 12px
        &:last-child
          border-none()
</style>

<script>
  import star from 'components/star/star'
  import split from 'components/split/split'
  import BScroll from 'better-scroll'
  import {saveToLocal,loadFromLocal} from 'common/js/store'
    export default{
        props:{
          seller:{
              type:Object
          }
        },
        data(){
            return{
                favorite: (()=>{
                    return loadFromLocal(this.seller.id,'favorite',false)
                })()  //缺陷：在商家页面刷新，因为先渲染DOM,导致数据没有跟上，第一次是默认false的
            }
        },
        created(){
          this.classMap = ['decrease','discount','special','invoice','guarantee'];

        },
        computed:{
          favoriteText(){
              return this.favorite?'已收藏':'收藏'
          }
        },
        watch:{
            //todo watch可以观察数据，一旦数据有变化，就执行对应方法（用数据名命名函数名）
            //但是-》你切到其他组件，切回来，DOM重新渲染而数据没有变化，这个时候又不能BScroll了
          'seller'(){
            this._initScroll()
            this._initPics()
          }
        },
        ready(){
          //todo DOM渲染完毕后开始执行，但是此时数据还没有拿到
          //注意：优先于watch执行，所以当跳到其他组件，切回来->ready()先渲染dom+_initScroll，而watch不变不执行_initScroll->
          // 这个时候，dom仍旧撑不开，仍旧不会有效果，所以要在_initScroll里加上else(this.scroll.refresh())
          this._initScroll()
          this._initPics()
        },
        methods:{
            toggleFavorite(event){
              if(!event._constructed){
                return;
              }
              this.favorite = !this.favorite
              saveToLocal(this.seller.id,'favorite',this.favorite)
              let id = this.seller.id
            },
            _initScroll(){
                if (!this.scroll){
                  this.scroll = new BScroll(this.$els.seller,{
                    click:true
                  })
                }else{
                    this.scroll.refresh()
                }
            },
            _initPics(){
              //todo 图片的BScroll
              if(this.seller.pics){
                //todo 有图片的时候，计算ul宽度
                let picWidth =120
                let margin = 6
                let width = (picWidth+margin)*this.seller.pics.length - margin
                this.$els.picList.style.width = width +'px'
                this.$nextTick(()=>{
                    if(!this.picScroll){
                      this.picScroll = new BScroll(this.$els.picWrapper,{
                        scrollX:true, //横向滚动，默认关闭
                        eventPassthrough:true  //这一层滚动时，忽略外层的滚动，不影响外层，不会斜划内外同时滚动
                      })
                    }else{
                        this.picScroll.refresh()
                    }
                })
              }
            },

        },
        components:{
            star,split
        }
    }
</script>




