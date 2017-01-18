<template>
    <div class="ratingselect">
      <div class="rating-type border-1px">
        <span class="block positive" :class="{'active':selectType===2}" @click="select(2,$event)">{{desc.all}}<span class="count">{{positives.length+negatives.length}}</span></span>
        <span class="block positive" :class="{'active':selectType===0}" @click="select(0,$event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
        <span class="block negative" :class="{'active':selectType===1}" @click="select(1,$event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
      </div>
      <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
        <span class="icon-check_circle"></span>
        <span class="text">只看有内容的评价</span>
      </div>
    </div>
</template>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
  .ratingselect
    .rating-type
      padding 18px 0
      margin 0 18px  /*不能直接写18px的padding，因为后面还有一条线，都padding,则线贴住了内容*/
      border-1px(rgba(7,17,27,0.1))
      font-size 0
      .block
        display inline-block
        padding:8px 12px
        font-size:12px
        line-height:16px
        font-size:12px
        border-radius 1px
        margin-right 8px
        color rgb(77,85,93)
        &.active
          color #fff
        .count
          font-size:8px
          line-height:16px
          vertical-align bottom
          margin-left 2px
        &.positive
          background: rgba(0,160,220,0.2)
          &.active
            background rgb(0,160,220)
        &.negative
          background: rgba(77,85,93,0.2)
          &.active
            background rgb(77,85,93)
    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7,17,27,0.1)
      color rgb(147,153,159)
      &.on
        .icon-check_circle
          color #00c850
    .icon-check_circle
      display inline-block
      vertical-align top
      margin-right 4px
      font-size 24px
    .text
      font-size:12px

</style>

<script>
  //selectType 选择样式
    const POSITIVE = 0
    const NEGATIVE = 1
    const ALL = 2

    export default{
        props:{
            ratings:{
                type:Array,
                default(){
                    return []
                }
            },
            selectType:{
                type:Number,
                default:ALL
            },
            onlyContent:{
                type:Boolean,
                default:false
            },
            desc:{
                type:Object,
                default(){
                    return {
                        all:'全部',
                        positive:'满意',
                        negative:'不满意'
                    }
                }
            }
        },
        data(){
            return{

            }
        },
        computed:{
            //todo ratings是props，而rating仅仅是一个形参，filter(xx),xx表示标准，可以是字符串，也可以是function
            //todo 这里的filter((rating)=>{return rating.rateType === POSIVE}) ，暗含了遍历，即遍历this.ratings数组，符合rating.rateType === 0的都会被筛选出来
          positives(){
              return this.ratings.filter((rating)=>{
                  return rating.rateType === POSITIVE
              })
          },
          negatives(){
            return this.ratings.filter((rating)=>{
              return rating.rateType === NEGATIVE
            })
          }
        },
        methods:{
          select(type,event){
            if (!event._constructed){
                return;
            }
            this.selectType = type
            this.$dispatch('ratingtype.select',type);
          },
          toggleContent(event){
            if (!event._constructed){
              return;
            }
            this.onlyContent = !this.onlyContent
            this.$dispatch('content.toggle',this.onlyContent);
          }
        },
        components:{
        }
    }
</script>




