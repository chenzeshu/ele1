export function saveToLocal(id,key,value) {
  let seller = localStorage.__seller__;//私有存储空间
  if (!seller){
    seller = {};
    seller[id] = {};  //第一级key是id
  }else{
    seller = JSON.parse(seller)   //因为localStoreage存储的是字符串，所以这里要转为JSON对象
    if (!seller[id]){
      seller[id] ={}
    }
  }
  //总之就是1、有没有seller ->2、造出seller[id]，若原来就有，那如下直接用
  seller[id][key] = value  //第二级key是key用来这个ID下的所有数据的值
  //todo 注意,nodejs是没有localStorage的，所以要标注window来适应浏览器环境
  window.localStorage.__seller__ = JSON.stringify(seller)  //转为字符串存储

};


export function loadFromLocal(id,key,def) {
  //todo 注意,nodejs是没有localStorage的，所以要标注window来适应浏览器环境
  let seller = window.localStorage.__seller__;
  //todo 若完全没有存储过
  if(!seller){
    return def
  }
  //todo 若存储过，但为空
  seller = JSON.parse(seller)[id];
  if (!seller){
     return def
  }
  //todo seller[id]若存储过且不为空，那么接下来就是判断__seller__[id][key]
  let ret = seller[key]  //这个seller在上面已经定义过是__seller__[id]
  return ret || def;  //若ret不存在则返回def

};


//def means default
