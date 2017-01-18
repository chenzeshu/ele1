<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item"><a v-link="{path:'/goods'}">商品</a></div>
      <div class="tab-item"><a v-link="{path:'/ratings'}">评论</a></div>
      <div class="tab-item"><a v-link="{path:'/seller'}">商家</a></div>
    </div>
    <router-view :seller="seller" keep-alive></router-view>
  </div>
</template>

<script>
  import header from "components/header/header.vue"
  import {urlParse} from 'common/js/util'

  const ERR_OK = 0;   //对应dev-server.js中的errno

  export default{
    data(){
        return{
          seller:{id: (()=>{
                  let queryParam = urlParse();
                  return queryParam.id
              })()},
        }
    },
    created(){
      this.$http.get('/api/seller?id='+this.seller.id).then((response)=>{
        response = response.body;
        if (response.errno === ERR_OK){
//          this.seller = response.data;
          this.seller =Object.assign({},this.seller,response.data)  //将参数2扩展的方式扩增进参数3，然后一起赋值给参数1返回给左边
          //这样就不会把原先有id的this.seller覆盖掉
        }
      })
    },
    components:{
      'v-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/mixin.styl"
  .tab
     display:flex
     width:100%
     height:40px
     line-height:40px
     border-1px(rgba(7,17,27,0.1))
     .tab-item
       flex:1
       text-align:center
       &:active
         background:#999
       & > a
         display :block
         font-size:14px
         color: rgb(77,85,93)
         &.active
           color:rgb(240,20,20)
</style>
