/*
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:123, a:b}
 */
export function urlParse() {
    let url = window.location.search;
    let obj = {};
    let reg =/[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    if (arr){
      arr.forEach((item)=>{
        let tempArr = item.substring(1).split('=') //删除第一个字符，并用等号做implode分割
        let key = decodeURIComponent(tempArr[0]) //对URI进行解码
        let val = decodeURIComponent(tempArr[1])
        obj[key] = val
      })
    }
  return obj
}
