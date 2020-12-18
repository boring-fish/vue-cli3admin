import{ getSignatureAPI }from '../service/api.js'


export function getTreeData( departmentList, visualRange){
    const visualMap = new Map();
    visualRange.forEach( item =>{
        visualMap.set( item.userid, true)
    });

    const map = new Map();
    const userMap = new Map();
    departmentList.forEach( item => {
        item.expand = true;
        item.title = item.name;
        item.type = 'department';
        item.children.forEach( child =>{
            child.title = child.name;
            child.type = 'person';
            child.checked = visualMap.get(child.userid)? true : false;
            let userValue = userMap.get( child.userid);
            if(userValue){
                userValue.push( child )
            }else{
                userValue = [];
                userValue.push( child );
            }
            userMap.set(child.userid, userValue);
        })
      const mapChild =  map.get(item.parentid);
      if( mapChild){
        mapChild.push( item )
        map.set(item.parentid, mapChild)
      } else {
        map.set( item.parentid, [ item ])
      }
    });
    console.log(map)
    let tree = [{

    }];
    departmentList.forEach(item =>{
      if( item.id === 1){
        tree[0]= item; 
      }else if ( !map.get( item.parentid)){
        tree[0].children = tree[0].children || [];
        tree[0].children.push ( item );
      }
      const children = map.get(item.id);
      console.log(children)
      if( children ){
        item.children = item.children || [];
        item.children.push(...children);
      } 
    });
    if( !tree[0].id){
        tree[0].id = 1;
    }
    return {tree, userMap};
  }

  export function bindWxOpenData(corpid, agentid){
    const WWOpenData = window.WWOpenData;
    const wx = window.wx;
    console.log(wx, 'wx')
    console.log(WWOpenData,'window.WWOpenData')
      if (WWOpenData.checkSession) {
            WWOpenData.checkSession({
                success() {
                    console.info('open-data 登录态校验成功')
                },
                fail() {
                    console.error('open-data 登录态过期')
                },
            })
        }
    WWOpenData.bindAll(document.querySelectorAll('ww-open-data'))
    console.log(location.href, 'location.href')  
    getSignatureAPI({
        corpid,
        url: location.href.split("#")[0],
        type: 'agentConfig'
    }).then( res => {
        console.log(res)
        const {timestamp, nonceStr, signature} = res.data;
        wx.agentConfig({
            debug: false,
            corpid: corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid, // 必填，企业微信的应用id （e.g. 1000247）
            timestamp, // 必填，生成签名的时间戳
            nonceStr, // 必填，生成签名的随机串
            signature,// 必填，签名，见附录-JS-SDK使用权限签名算法
            jsApiList: ['selectExternalContact'], //必填
            success: function(msg) {
                console.log('agentConfig成功',msg)
            },
            fail: function(msg) {
                console.log(msg, 'msg')
                if(msg.errMsg.indexOf('function not exist') > -1){
                    alert('版本过低请升级')
                }
            }
        });
    })
}


export function getQueryString(key) {
  var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}