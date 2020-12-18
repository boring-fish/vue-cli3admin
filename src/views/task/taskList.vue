<template>
    <div class="task-list">
        <div class="header">
            <h1>任务列表</h1>
            <div class="search-bar">
                <Button class="add-class-button" inline @click="handleEditTask(undefined)">
                    <img src="../../assets/icon/add.svg" /> 
                    <span>创建任务</span>
                </Button>
                <Input v-model="searchName" placeholder="根据任务名称搜索" @on-enter="handleSearch"/>
            </div>
        </div>
        <div class="task-list-content">
            <Table :columns="column" :data="tableData">
                 <template slot-scope="{ row }" slot="state">
                      <Tag 
                        type="border"
                        class="state-tag"
                        :class="{'state-tag-active': row.state === '已发布'}"
                        >{{row.state}}</Tag>
                 </template>
                <template slot-scope="{ row }" slot="visualrange">
                 <div class="visual-button-wrap" v-if="row.visual_range.length">
                      <Tag 
                        type="border"
                        v-for="item in row.visual_range.slice(0,7)"
                        class="visual-button"
                        :key="item.name"
                        style="margin-right: 5px" 
                    > <img class="visual-icon" src="../../assets/icon/person.svg"/>
                    <ww-open-data type="userName" :openid="item.userid"></ww-open-data>
                    </Tag>
                    <Tag 
                        type="border"
                        v-if="row.visual_range.length>7"
                        class="visual-button"
                        >...</Tag>
                 </div>
                 <p class="visual-blank" v-else>无</p>

                </template>
                <template slot-scope="{ row,column,index }" slot="action">
                    <Button size="small" class="action-button action-button-edit " @click="handleEditTask(row)">编辑</Button>
                    <Button size="small" class="action-button action-button-del" @click="handleDeleteTask(row,index)">删除</Button>

                </template>
        </Table>
          <Spin size="large" fix v-if="spinTable"></Spin>
        <Page 
            :total="total" 
            :current.sync="page"
            :page-size="size"
            size="small"
            @on-change="getTaskList"
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
                        <Input v-model="formItem.title" placeholder="请输入分类名称" />
                    </FormItem>
                    <FormItem  label="排序" prop="order">
                       <Input v-model="formItem.order" placeholder="请输入整数" />
                    </FormItem>
                </Form>
        </Modal>
    </div>
</template>
<script>
import{ getTaskListAPI, deleteTaskAPI }from '../../service/api.js'


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
            userMap: new Map(),
            spinTable: true,
            spinShow: false,
            column: [
                    {
                        title: '任务名称',
                        key: 'name',
                        minWidth: 227,
                    },
                    {
                        title: '分类',
                        key: 'taskClass',
                        minWidth: 114,
                    },
                     {
                        title: '状态',
                        slot: 'state',
                        // sortable: true,
                        minWidth: 114,
                    },
                    {
                        title: '可见范围',
                        slot: 'visualrange',
                        minWidth: 240,
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
            tableData: [],
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
            handleEditTask(row){
                localStorage.setItem( 'taskRule', row? JSON.stringify(row) : '{"visual_range":[]}')
                this.$router.push('taskRule')          
            },
            getTaskList(){
                getTaskListAPI({
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
                this.getTaskList();
            },
            handleDeleteTask(row,index){
                  this.$Modal.confirm({
                    title: '确定删除该条数据吗？',
                    content: '',
                    onOk: () => {
                       deleteTaskAPI({
                            id: row.id
                        }).then(  () =>{
                            this.tableData.splice(index, 1);
                            this.$Message.success('删除成功！')
                        })
                    },
                  });
               
            },
          
            onModalOk(){
                // const visualRange = []
                // this.userMap.forEach( (value) =>{
                //     if(value[0].checked){
                //         visualRange.push({
                //             userid: value[0].userid,
                //             name: value[0].name,

                //         })
                //     }
                // })
                // this.row.visual_range = visualRange;
                // setVisualRange(JSON.stringify({
                //     id: this.row.id,
                //     title: this.row.title,
                //     visualRange,           
                // })).then( () => {
                //     this.$Message.sucess('设置成功！');
                //     console.log(this.row.id, this.visualRange, 'visualRange')
                // })

            },
            onModalCancel(){

            },
          
        
        },
        mounted(){
                this.getTaskList();  
                
        },
        activated(){
                this.getTaskList();  
                
        }
    

}
</script>
<style lang="less">
.task-list {
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
    .state-tag {
        width: 56px;
        height: 24px;
        background: #DCDEE0 !important;
        border-radius: 12px;
        border: 1px solid #DCDEE0;
        text-align: center;
        .ivu-tag-text{
            color: #969799;
        }
        &-active{
            
            background: rgba(25, 190, 107, 0.1) !important;
            border: 1px solid #19BE6B;
            .ivu-tag-text{
            color: #19BE6B;
        }
        }
    }
    
    .action-button{
        height: 24px;
        padding: auto 10px;
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
    
    .task-list-content{
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
    .visual-blank {
        font-size: 12px;
        color: #C8C9CC;
    }
    }
   
   
   
}
.add-class-modal{
    .modal-title{
        font-size: 16px;
    }
}
</style>