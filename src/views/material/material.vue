<template>
    <div class="material">
        <div class="header">
            <h1>图文素材</h1>
            <div class="search-bar">
                <!-- <div></div> -->
                <Button type="primary"  icon="md-add" @click="addMaterial">新建素材</Button>
                <Input v-model="searchTitle" placeholder="根据图文标题搜索" @on-enter="handleSearch"/>
            </div>
        </div>
        <div class="material-content">
            <Table :columns="column" :data="tableData" max-height="540">
            <template slot-scope="{ row }" slot="title">
                <div class="title-wrap">
                        <img class="table-img" :src="row.thumb" />  
                    <p class="table-title">{{ row.title }}</p>
                </div>
            </template>
             <template slot-scope="{ row }" slot="visualrange">
                 <!-- 去掉了length -->
                 <div class="visual-button-wrap" v-if="row.visual_range.length">
                      <Tag 
                        type="border"
                        v-for="item in row.visual_range.slice(0,10)"
                        class="visual-button"
                        :key="item.name"
                        style="margin-right: 5px" 
                    > <img class="visual-icon" src="../../assets/icon/person.svg"/>
                    <ww-open-data type="userName" :openid="item.userid"></ww-open-data>
                    </Tag>
                    <Tag 
                        type="border"
                        v-if="row.visual_range.length>10"
                        class="visual-button"
                        >...</Tag>
                 </div>
                 <p class="visual-blank" v-else>无</p>
               

            </template>
            <template slot-scope="{ row }" slot="action">
                  <Tooltip placement="top" content="设置可见范围" >
                    <Button type="primary"  class="set-visual-button" @click="handleSetVisualrange(row)">
                         <img src="../../assets/icon/setting-fill.svg" /> 
                    </Button>
                </Tooltip>
                 <Tooltip placement="top" content="预览" >
                    <Button type="primary"  class="set-visual-button" @click="handlePreview(row)">
                         <img src="../../assets/icon/eye-fill.svg" /> 
                    </Button>
                </Tooltip>
                 <Tooltip placement="top" content="删除" >
                    <Button type="error" size="small"  class="set-visual-button" @click="handleDelete(row)">
                      <img src="../../assets/icon/delete-fill.svg" /> 
                      <!-- <span>添加分类</span> -->
                    </Button>
                </Tooltip>

            </template>
        </Table>
          <Spin size="large" fix v-if="spinTable"></Spin>
        <Page 
            :total="total" 
            :current.sync="page"
            :page-size="size"
            @on-page-size-change="pageSizeChange"
            size="small"
            @on-change="getMaterialList"
            show-sizer 
            show-elevator />
        </div>
         <Modal
            width="400"
            class="visual-modal"
            v-model="visualModal"
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
        <add-material :material="material" @addSuccessStatus='addSuccessStatus'></add-material>
        <page-qrcode :previews="preview"></page-qrcode>

    </div>
</template>
<script>
import{ getMaterialAPI, getUserListAPI, setVisualRangeAPI, delMaterialAPI }from '../../service/api.js'
import{ getTreeData }from '../../utils/utils.js'
import PageQrcode from '../../components/add-material/page-qrcode'
import AddMaterial from '../../components/add-material/add-material'

export default {
    props: ['type', 'openid'],
    components:{
       AddMaterial,
       PageQrcode
    },
    data(){
        return {
            page: 1,
            size: 20,
            total: 0,
            searchTitle: '',
            visualModal: false,
            tree: [],
            row: {},
            userMap: new Map(),
            spinTable: true,
            spinShow: false,
            column: [
                    {
                        title: '图文名称',
                        slot: 'title',
                        minWidth: 480,
                    },
                    {
                        title: '更新时间',
                        key: 'updatetime',
                        sortable: true,
                        minWidth: 160,
                    },
                    {
                        title: '可见范围',
                        slot: 'visualrange',
                        minWidth: 300,
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        minWidth: 170,
                        align: 'center'
                    }
                ],
            tableData: [],
                 treeData: [],
                // visualList: [],
            material:  {
            materialStatus: false,

            // title:'添加图文'
            },
            preview: {
                previewStatus: false,
                previewLink: '',
                title: '图文预览'
            },
        }
    },
    
     methods: {
            addSuccessStatus(data){
                this.getMaterialList();
            },
            pageSizeChange(data){
                  this.size=data;
                this.getMaterialList();
            },
            getMaterialList(){
                console.log(this.page,this.size);
                getMaterialAPI({
                    page: this.page-1,
                    size: this.size,
                    title: this.searchTitle,
                }).then( res =>{
                     this.tableData = res.data.queryResult;
                    console.log( this.tableData);
                    this.total = res.data.total;
                    this.spinTable = false;
                })
            },
            addMaterial(){
                  this.material={
                      materialStatus:true,
                      articleContent:{
                      title:'',
                      thumb:'',
                      detail:'',
                      link:'',
                   }
                  }
            },
            handleSearch(){
                this.spinTable = true;
                this.getMaterialList();
            },
           
            handleSetVisualrange (row) {
                // this.spinShow = true;//todo
                this.row = row;
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
             handlePreview(data){
                 this.preview={
                    previewStatus: true,
                    previewLink: data.link,
                    title: '图文预览'
                };
                 console.log(this.material);
               console.log(this.preview);
            //    window.open(data.link);
            },
            handleDelete(data){
                console.log(data);
                 this.$Modal.confirm({
                    title: '确定删除该条图文素材吗？',
                    content: '',
                    onOk: () => {
                        let params={
                            id: data.id,
                        }
                        console.log(params);
                            delMaterialAPI(params).then( res =>{
                                if(res.status== 200){
                                    this.getMaterialList();
                                    this.$Message.success('图文素材删除成功');
                                }
                            console.log(res);                   
                        });
                            },
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
                console.log(this.row.visual_range,visualRange);
                this.row.visual_range = visualRange;
                setVisualRangeAPI(JSON.stringify({
                    id: this.row.id,
                    title: this.row.title,
                    visualRange,           
                })).then( () => {
                    this.$Message.success('设置成功！');
                    console.log(this.row.id, this.visualRange, 'visualRange')
                })

            },
            onModalCancel(){

            },
          
        
        },
        mounted(){
                // this.spinTable = true;
                this.getMaterialList();  
            
            
        }
    

}
</script>
<style lang="less">
.material {
    margin: 0 20px 20px;
    .set-visual-button {
    padding: 0 !important; 
    width: 32px;
    height: 32px;
    img{
        vertical-align: middle;
    }
   }
    .ivu-tooltip {
        margin-left: 10px;
    }
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center; 
        height: 64px;
        .search-bar{
            display: flex;
            align-items: center;
            .ivu-input-wrapper{
                width: 280px;
                margin-left: 12px;  
            }
             .ivu-btn{
               line-height:32px; 
            }
        }
    }
    .ivu-table th {
        border: none;
    }
    .title-wrap{
        display: flex;
        padding: 20px 0;
         .table-img{
        // width: 147px;
        // height: 147px;
         width: 88px;
        height: 88px;
        object-fit: cover;
        margin-right: 16px;
        }
        .table-title {
            // max-width: 305px;
            font-weight: 500;
            color: #646566;
            font-size: 14px;
        }
        
    }
    .visual-button-wrap{
        margin: 20px 0 12px;
        
        .visual-button{
            margin: 0 8px 8px 0;
            font-size: 12px;
            .visual-icon{
                vertical-align: text-bottom;
                margin-right: 4px;
            }
        }
    }
    .set-visual-button{
        padding: 0 16px;
    }
    .ivu-btn-primary{
            background-color: #2F7DCD;
            border-color: #2F7DCD;
        }
    .visual-blank {
        font-size: 12px;
        color: #C8C9CC;
    }
    
    .material-content{
        position: relative;
        padding: 16px 16px 50px;
        background-color: #fff;
         .ivu-page{
        position: absolute;
        right: 16px;
        bottom: 0;
        height: 50px;
        display: flex;
        align-items: center;
        border-radius:4px;
    }
    }
   
   
   
}
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