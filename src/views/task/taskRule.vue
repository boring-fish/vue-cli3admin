<template>
    <div class="task-rule">
        <div class="header">
            <h1>新建任务规则</h1>
            <Button class="back-button" @click="goBack"> <img src="../../assets/icon/arrow-left.svg" /> 返回列表</Button>
          
        </div>
        <div class="task-rule-content">
             <Form 
                    :model="formItem"
                    :rules="ruleValidate" 
                >   
                <Row lg="24">
                    <i-col span="7" class="form-label">
                        <span>任务名称</span>
                        <span class="icon-require">*</span>
                        </i-col>
                    <i-col span="12">
                        <FormItem prop="title">
                            <Input v-model="formItem.name" placeholder="请输入任务名称" maxlength="16" show-word-limit/>
                        </FormItem>
                    </i-col>
                    <i-col span="5"></i-col>
                </Row>
                <Row lg="24">
                    <i-col span="7" class="form-label">
                        <span>任务分类</span>
                        <span class="icon-require">*</span>
                        </i-col>
                    <i-col span="12">
                        <FormItem prop="class">
                            <Select v-model="formItem.taskClass" placeholder="请输入任务分类">
                            <Option v-for="item in classList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="5"  class="form-link">
                        <router-link :to="{ name: 'taskClass',query: { modal: true } }">去创建</router-link>
                    </i-col>
                </Row>
                <Row lg="24">
                    <i-col span="7" class="form-label">
                        <span>选择Linkflow标签组</span>
                        <span class="icon-require">*</span>
                        </i-col>
                    <i-col span="6">
                        <FormItem prop="groupType" class="form-tag-static">
                           <Select v-model="formItem.groupType" @on-change="onChangeGroupType">
                            <Option value="static" >静态标签组</Option>
                            <Option value="dynamic" >动态标签组</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="6">
                        <FormItem prop="groupId" class="form-tag-dynamic">
                           <Select v-model="formItem.groupId"  @on-change="handleGroupChange" label-in-value>
                            <Option v-for="item in groupList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </i-col>
                    <i-col span="5"></i-col>
                </Row>
                <Row lg="24">
                    <i-col span="7" class="form-label">
                        <span>设置可见范围</span>
                        <span class="icon-require">*</span>
                        </i-col>
                    <i-col span="12">
                        <FormItem prop="visual_range">
                         <Tag 
                            type="border"
                            v-for="item in formItem.visual_range"
                            class="visual-button"
                            :key="item.name"
                            style="margin-right: 5px" 
                        > 
                            <img class="visual-icon" src="../../assets/icon/person.svg"/>
                            <ww-open-data type="userName" :openid="item.userid"></ww-open-data>
                        </Tag>
                        <Button type="text" class="set-visual-button" @click="setVisualRange">修改</Button>
                        </FormItem>
                        
                    </i-col>
                </Row>
                <Row lg="24" class="form-commit">
                    <i-col span="7" class="form-label">
                        </i-col>
                    <i-col span="17">
                        <Button class="commit-button release-button" @click="handleSave('已发布')">
                            <img src="../../assets/icon/send.svg" />
                            发布</Button>
                        <Button class="commit-button save-button" @click="handleSave('未发布')">
                            <img src="../../assets/icon/save.svg" />
                            保存</Button>
                    </i-col>
                </Row>
             </Form>
        </div>
        <set-visual-modal 
            :row="formItem" 
            :visual="visual" 
            @set-visual-range="onVisualRangeChange"
            @on-change-visual="onChangeVisual">
        </set-visual-modal>
    </div>
</template>
<script>
import SetVisualModal from '../../components/set-visual-modal/set-visual-modal'
import{ get_lf_groups, getAllTaskClassAPI,addTaskAPI }from '../../service/api.js'


export default {
    props: ['type', 'openid'],
    components: {
        SetVisualModal,
    },
    data(){
        return {
            // addClassModal: false,
            // tree: [],
            // userMap: new Map(),
            // spinShow: false,
            visual: false,
            formItem: {
                visual_range: []
            },
            classList: [],
            groupList: [],
             ruleValidate: {
                    title: [
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ],
             }
        }
    },
    computed:{
        // groupListComputed(){
        //     return this.groupList.filter( item => {
        //         item.groupType === this.formItem.groupType;
        //     })
        // }
    },
     methods: {
            goBack(){
                this.$router.go(-1);
            },
            setVisualRange(){
                this.visual = true;
            },
            onChangeVisual(visual){
                this.visual = visual;
            },
            onVisualRangeChange(visual_range){
                this.formItem.visual_range = visual_range;
                this.visual = false;
            },
            onChangeGroupType(groupType){
                get_lf_groups({
                    groupType,
                }).then( res => {
                   this.groupList = res.data;
               })
            },
            handleGroupChange(group){
                this.formItem.groupName = group.label;
            },
            handleSave(state){
                this.formItem.state = state;
                console.log(this.formItem, 'this.formItem')
                addTaskAPI(this.formItem).then(() =>{
                    this.$router.go(-1);
                })
            },
          init(){
               this.formItem = JSON.parse(localStorage.getItem( 'taskRule'));
            console.log(this.formItem,'this.formItem')
            getAllTaskClassAPI().then( res => {
                this.classList = res.data;
                console.log(this.classList, 'classList');
            })
            this.onChangeGroupType();
           
          }
            
        
        },
        mounted(){
            this.init();
            
        },
        activated(){
            this.init();
        }
    

}
</script>
<style lang="less">
.task-rule {
    margin: 0 20px 20px;
    .header{
        height: 64px;
        display: flex;
        align-items: center;
        h1 {
            font-size: 20px;
            color: #323233;
            font-weight: 500;
            margin: 0 20px 0 10px;
        }
        .back-button{
            border: none;
            color: #646566;
            // vertical-align: middle;
            img {
                width: 14px;
                vertical-align: middle;
            }      
        }
    }
    
    .task-rule-content{
        position: relative;
        padding: 50px 16px 50px;
        background-color: #fff;
        .form-label{
            text-align: right;
            height: 32px;
            line-height: 32px;
            font-size: 14px;
            color: #323233;
           
            .icon-require{
                color: #FF4444;
                padding: 0 20px 0 6px;
            }
        
       
    }
     .ivu-input-word-count{
                color: #C8C9CC;
            }
     .form-link{
            a{
                display: block;
                height: 32px;
                line-height: 32px;
                margin-left: 10px;
            }
        }
    .form-tag-static{
        margin-right: 5px;
    }
    .form-tag-dynamic{
        margin-left: 5px;
    }
    .visual-button{
            margin: 0 8px 8px 0;
            font-size: 12px;
            .visual-icon{
                vertical-align: text-bottom;
                margin-right: 4px;
            }
    }
    .set-visual-button{
        color: #2F7DCD;
    }
    .form-commit{
        margin-top: 54px;
    .commit-button{
        width: 80px;
        height: 32px;
        border-radius: 4px;
        img{
            width: 14px;
            vertical-align: middle;
        }
        }
        .release-button{
            color: #fff;
            background: #2F7DCD;
            margin-right: 10px;
            border: 1px solid #2F7DCD;
        }
        .save-button{
            border-color: #C8C9CC;
            color: #646566;
        }
    }
    
}
   
   
   
}
.add-class-modal{
    .modal-title{
        font-size: 16px;
    }
}
</style>