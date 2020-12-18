<template>
     <Modal
            width="400"
            class="visual-modal"
            v-model="visual"
            @on-ok="onModalOk"
            @on-cancel="onModalCancel">
                <h2  class="modal-title" slot="header">设置可见范围  
                    <Tooltip 
                        content="选择可以看到该图文素材的员工" 
                        placement="bottom-start"  
                        offset="-5"
                        theme="light">
                    <div class="help-icon-wrap">
                        <img class="help-icon" src="../../assets/icon/help-circle.svg" />
                    </div>
                    </Tooltip> 
                </h2>
                <div>
                   <div class="body-title-wrap">
                        <h3 class="body-title">组织架构</h3>
                   </div>
                <Tree 
                    ref="tree"
                    :data="treeData" 
                    @on-check-change="onCheckChange"
                    :render="renderTreeNode"
                    show-checkbox></Tree>
                    <Spin size="large" fix v-if="spinShow"></Spin>
                </div>
                <!-- <div class="split-line"></div>
                <div>
                    <p>已选择的部门、成员</p>
                    <Button v-for="item in visualList" :key="item">
                        {{item}}
                    </Button>
                </div> -->
        </Modal>
</template>
<script>
import{  getUserListAPI }from '../../service/api.js'
import{ getTreeData }from '../../utils/utils.js'
export default {
    name: 'SetVisualModal',
    props: {
            visual: {
            type: Boolean,
            default: false,
        },
        row: {},
        
    },
    data(){
        return {
            // visualModal: this.visual,
            tree: [],
            
            userMap: new Map(),
            spinTable: true,
            spinShow: false,
            treeData: [],
        }
    },
    methods: {
         handleSetVisualrange() {
                this.spinShow = true;
                this.tree = [];
                this.visualModal = true;
                getUserListAPI({
                    corpid: 'ww0b8772cfc1ed757c',
                }).then( res =>{
                 
                    const { departmentList } = res.data;
               
                    const { tree, userMap } = getTreeData(departmentList, this.row.visual_range);
                    this.treeData = JSON.parse( JSON.stringify(tree));
                    this.tree = tree;
                    this.userMap = userMap;
                    console.log(this.treeData, 'this.treeData')
                    console.log(this.userMap, 'this.userMap')
                    
                    setTimeout(() => {
                           this.spinShow = false;                       
                }, 0);
                    

                });
                
                
            },
            renderTreeNode(h, {  data }){
                if(data.type === 'person'){
                    return h('ww-open-data',{
                    attrs:{
                        type: 'userName',
                        openid: data.userid
                    }
                })
                }else {
                    return h('ww-open-data',{
                    attrs:{
                        type: 'departmentName',
                        openid: data.id,
                        }
                    })
                }
            },
            onCheckChange(nodeArr,curNode){

               function changePersonCheck(node){
                if( node.type === 'person'){
                    const mapValue = this.userMap.get(node.userid);
                    mapValue.forEach( item => {
                       item.checked = node.checked;
                    })
                }else{
                    node.children.forEach( child =>{
                        changePersonCheck.call(this,child);
                    })
                }
               }
               changePersonCheck.call(this, curNode);
                this.treeData = JSON.parse(JSON.stringify(this.tree));     

            },
          
            onModalOk(){
                const visualRange = []
                this.userMap.forEach( (value) =>{
                    if(value[0].checked){
                        visualRange.push({
                            userid: value[0].userid,
                            name: value[0].name,

                        })
                    }
                })
                this.$emit('set-visual-range',visualRange)

            },
            onModalCancel(){
                this.$emit('on-change-visual', false)
            },
          
    },
    watch:{
        visual(visual){
            if(visual){
                this.handleSetVisualrange();
            }
        }
    }
}
</script>
<style lang="less">
.visual-modal{
    .modal-title{
        font-size: 16px;
    }
     .help-icon-wrap{
        display: inline-block;
        overflow: hidden;
        margin-left: 9px;
         width: 18px;
        height: 18px;
        vertical-align: text-bottom;
        .help-icon{
        position: relative;
        left: 0;
        width: 100%;
        filter: drop-shadow(#2F7DCD 80px 0);
        }
      }
      
      .help-icon-wrap:hover{
          .help-icon{
              left: -80px;
          }
          
      } 
    .ivu-tooltip-inner{
        font-size: 12px;
        color: #646566;
        font-weight: normal;
    }
 .ivu-modal-body{
     height: 411px;
     overflow: auto;
     .body-title-wrap{
         border-bottom: 1px solid #EBEDF0;
         .body-title{
             width: 56px;
             font-size: 14px;
            padding-bottom: 4px;
             border-bottom: 3px solid #2F7DCD;
         }
     }
        // display: flex;
        // .split-line{
        //     width: 1px;
        //     height: 400px;
        //     color: #EBEDF0;
        // }
    }
}
</style>