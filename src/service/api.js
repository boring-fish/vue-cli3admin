import Vue from 'vue'
import { APP_KEY, APP_SECRET } from '../const/const'


//获取登录用户信息
export function getUserInfoAPI( params ){
  const url = '/test/getAuthoInfo';
  return Vue.axios.get(url, {
            params,
          })
}

//获取agentid
export function getAgentidAPI( params ){
  const url = '/test/getAgentid';
  return Vue.axios.get(url, {
            params,
          })
}


//获取签名
export function getSignatureAPI( params ){
  const url = '/test/getSignature';
  return Vue.axios.get(url, {
            params,
          })
}

//获取招募人数
export function getRecuitNumberAPI( params ){
    const url = '/test/getRecuitNumber';
    return Vue.axios.get(url, {
              params,
            })
}
export function getMaterialAPI( params ){
  const url = '/material/materiallist';
  return Vue.axios.get(url, {
            params,
          })
}
//添加素材
export function addMaterialAPI( data ){
  const url = '/material/materialsign';
  return Vue.axios.post(url, data)
}
//删除素材
export function delMaterialAPI( data ){
  const url = '/material/delmateriallist';
  return Vue.axios.post(url, data)
}

//获取部门和用户列表
export function getUserListAPI( params ){
    const url = '/test/getUserList';
    return Vue.axios.get(url, {
              params,
            })
}

//设置可见范围
export function setVisualRangeAPI( data ){
  const url = '/test/setVisualRange';
  return Vue.axios.post(url, data)
}

//新建/编辑任务分类
export function addTaskClassAPI( data ){
  const url = '/test/addTaskClass';
  return Vue.axios.post(url, data)
}

//发布/保存任务规则
export function addTaskAPI( data ){
  const url = '/test/addTask';
  return Vue.axios.post(url, data)
}


//获取任务规则列表（分页）
export function getTaskListAPI( params ){
  const url = '/test/getTaskList';
  return Vue.axios.get(url, {
            params,
          })
}

//获取任务分类（分页）
export function getTaskClassAPI( params ){
  const url = '/test/getTaskClass';
  return Vue.axios.get(url, {
            params,
          })
}

//获取任务分类
export function getAllTaskClassAPI(){
  const url = '/test/getAllTaskClass';
  return Vue.axios.get(url)
}

//删除任务规则
export function deleteTaskAPI( params ){
  const url = '/test/deleteTask';
  return Vue.axios.get(url, {
            params,
          })
}

//删除任务分类
export function deleteTaskClassAPI( params ){
  const url = '/test/deleteTaskClass';
  return Vue.axios.get(url, {
            params,
          })
}

// //获取素材列表
// export function getExternalAPI( params ){
//     const url = 'https://service-rjctasfc-1300644403.gz.apigw.tencentcs.com/test/getExternalList';
//     return Vue.axios.get(url, {
//               params,
//             })
// }

// //获取用户信息和招募人数
// export function getUserInfoAPI( params ){
//     const url = 'https://service-rjctasfc-1300644403.gz.apigw.tencentcs.com/test/getUserInfo';
//     return Vue.axios.get(url, {
//               params,
//             })
// }


// ——————————— linkflow API ————————————

//获取 Access Token
export function get_lf_accesstoken(){
  const url = '/linkflow/token';
  return Vue.axios.get(url, {
            headers: {
              'X-OpenApi-Key': APP_KEY,
              'X-OpenApi-Secret': APP_SECRET,
              },
            // params,
          }) 
        }

//查询标签组
export function get_lf_groups(params){
  const url = '/linkflow/v2/groups';
  return Vue.axios.get(url,{
    params,
  }) 
  
}


