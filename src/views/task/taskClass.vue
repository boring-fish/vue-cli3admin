<template>
    <div class="task-class">
        <div class="header">
            <h1>任务分类</h1>
            <div class="search-bar">
                <Button class="add-class-button" @click="handleOpenModal">
                    <img src="../../assets/icon/add.svg" /> 
                    <span>添加分类</span>
                </Button>
                <Input v-model="searchName" placeholder="根据分类名称搜索" @on-enter="handleSearch"/>
            </div>
        </div>
        <div class="task-class-content">
            <Table :columns="column" :data="tableData">
            <template slot-scope="{ row,column,index }" slot="action">
                <Button size="small" class="action-button action-button-edit " @click="handleOpenModal(row,index)">编辑</Button>
                 <Button size="small" class="action-button action-button-del" @click="handleDeleteTaskClass(row,index)">删除</Button>

            </template>
        </Table>
          <Spin size="large" fix v-if="spinTable"></Spin>
        <Page 
            :total="total" 
            :current.sync="page"
            :page-size="size"
            size="small"
            @on-change="getTaskClassList"
            show-sizer
            show-elevator />
        </div>
         <Modal
            width="400"
            class="add-class-modal"
            title="添加分类"
            ok-text="添加"
            v-model="addClassModal"
            @on-ok="onModalOk"
            @on-cancel="onModalCancel">
                <Form 
                    :model="formItem"
                    :rules="ruleValidate" 
                    label-position="top">
                    <FormItem label="分类名称" prop="title">
                        <Input v-model="formItem.name" placeholder="请输入分类名称" />
                    </FormItem>
                    <FormItem  label="排序" prop="order">
                       <Input v-model="formItem.order" placeholder="请输入整数" />
                    </FormItem>
                </Form>
        </Modal>
    </div>
</template>
<script>
import{ getTaskClassAPI,addTaskClassAPI, deleteTaskClassAPI }from '../../service/api.js'


export default {
    props: ['type', 'openid'],
    data(){
        return {
            page: 1,
            size: 20,
            total: 0,
            searchName: '',
            addClassModal: false,
            tree: [],
            row: {},
            index: -1,
            userMap: new Map(),
            spinTable: true,
            spinShow: false,
            column: [
                    {
                        title: '分类名称',
                        key: 'name',
                        minWidth: 231,
                    },
                    {
                        title: '排序',
                        key: 'order',
                        // sortable: true,
                        minWidth: 231,
                    },
                    {
                        title: '创建时间',
                        sortable: true,
                        key: 'create_time',
                        
                        minWidth: 231,
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 170,
                        align: 'center'
                    }
                ],
            tableData: [{
                title: '提醒任务',
                order: 2,
                create_time: '2020-09-01 18:30'
            },{
                title: '会员任务',
                order: 1,
                create_time: '2020-08-31 18:30'
            },],
            formItem: {
                
            },
             ruleValidate: {
                    title: [
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ],
             }
        }
    },
    
     methods: {
            handleOpenModal(row,index){
                this.formItem = row? row : {};
                this.index = index;
                this.addClassModal = true;    
            },
            getTaskClassList(){
                getTaskClassAPI({
                    page: this.page-1,
                    size: this.size,
                    name: this.searchName,
                }).then( res =>{
                    this.tableData = res.data.list;
                    this.total = res.data.total;
                    this.spinTable = false;
                })
            },
            handleSearch(){
                this.spinTable = true;
                this.getTaskClassList();
            },
            handleDeleteTaskClass(row,index){
                  this.$Modal.confirm({
                    title: '确定删除该条数据吗？',
                    content: '',
                    onOk: () => {
                        deleteTaskClassAPI({
                            id: row.id
                        }).then( () =>{
                            this.tableData.splice(index, 1);
                            this.$Message.success('删除成功！')
                        })
                            },
                  });
                
              
            },
          
            onModalOk(){
                addTaskClassAPI(this.formItem).then( res =>{
                    if(this.formItem.id){
                        this.tableData.unshift(res.data[0])
                    } else {
                        this.tableData.splice(this.index, 1, res.data[0])
                    }
                })
            },
            onModalCancel(){

            },
          
        
        },
        mounted(){
                // this.spinTable = true;
                // this.getTaskList();  
            const { modal} = this.$route.query;
            if(modal){
                this.handleOpenModal();
            }
            this.getTaskClassList();
            
        }
    

}
</script>
<style lang="less">
.task-class {
    margin: 0 20px 20px;
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center; 
        height: 64px;
        h1 {
            font-size: 20px;
            color: #323233;
            font-weight: 500;
            margin: 0 20px 0 10px;
        }
        .search-bar{
            display: flex;
            align-items: center;
            .add-class-button{
                width: 108px;
                height: 32px;
                color: #fff;
                background-color: #2F7DCD;
                border: none;
                border-radius: 4px;
                img{
                    width: 11px;
                    margin-right: 8px;
                    vertical-align: middle;
                }
                span{
                    font-size: 14px;
                    vertical-align: middle;
                }
            }
            .ivu-input-wrapper{
                width: 280px;
                margin-left: 12px;  
            }
        }
    }
    .ivu-table th {
        border: none;
        background-color: #F2F3F5;
    }
    .title-wrap{
        display: flex;
        padding: 20px 0;
         .table-img{
        width: 147px;
        height: 147px;
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
    
    .action-button{
        padding: 2 10px;
        color: #fff;
        border-radius: 4px;
        border: none;
        &-edit{
            margin-right: 10px;
            background-color: #2F7DCD;
        }
        &-del{
            background-color: #FF4444;
        }
    }
    .ivu-btn-primary{
            background-color: #2F7DCD;
            border-color: #2F7DCD;
        }
    
    .task-class-content{
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
.add-class-modal{
    .modal-title{
        font-size: 16px;
    }
    .ivu-modal-body{
        padding-bottom: 0;
        .ivu-form-item{
        margin-bottom: 20px;
        }
       
    }
     .ivu-btn-primary{
            background-color: #2F7DCD;
            border-color: #2F7DCD;
        }
    
    
}
</style>