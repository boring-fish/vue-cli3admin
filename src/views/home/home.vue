<template>
    <div class="dashboard">
        <div class="card-margin"></div>
                    <Card>
                        <p slot="title">今日招募人数</p>
                        <div class="content-wrap">
                            <img src="../../assets/images/img-kb-jrzm.png" /> 
                            <div>
                                <span class="number">{{todayNum}}</span>
                                <span class="unit">人</span>
                                <Spin size="large" fix v-if="spinShow"></Spin>
                            </div>
                        </div>
                    </Card>
        <div class="card-margin"></div>
                    <Card >
                        <p slot="title">累计招募人数</p>
                        <div class="content-wrap">
                            <img src="../../assets/images/img-kb-ljzm.png" /> 
                            <div>
                                <span class="number">{{totalNum}}</span>
                                <span class="unit">人</span>
                                <Spin size="large" fix v-if="spinShow"></Spin>
                            </div>
                        </div>
                    </Card>
           <div class="card-margin"></div>
    </div>
</template>
<script>
import { getRecuitNumberAPI } from '../../service/api.js'
export default {
    name: 'home',
    data(){
        return {
            todayNum: null,
            totalNum: null,
            spinShow: true,
        }
    },
    mounted(){
         console.time('dashboard')

        getRecuitNumberAPI({
            corpid: this.$corpid,
        }).then( res => {
            this.todayNum = res.data.todayNum;
            this.totalNum = res.data.totalNum;
            this.spinShow = false;
             console.timeEnd('dashboard')

        })
    }
}
 </script>
 <style lang="less">
 .dashboard{
     display: flex;
    //  justify-content:space-around;
     padding: 11.80% 0 ;
     
     .card-margin{
         flex: 1;
     }
     .ivu-card{
         min-width: 378px;
         height: 188px;
         width: 20%;
         .ivu-card-body{
             flex: 1 0 auto;
            //  height: 100%;
             padding: 30px;
             .content-wrap{
                 display: flex;
                 align-items: center;
                 height: 72px;
             }
             img{
                width: 72px;
                height: 72px;
             }
             .number{
                 font-size: 64px;
                 color: #323233;
                 font-weight: 500;
                 margin-left: 48px;
                 margin-right: 10px;
                //  vertical-align: middle;
             }
             .unit{
                 font-size: 18px;
                 color: #C8C9CC
             }
         }

     }
    .ivu-card:hover{
        box-shadow: 0 4px 20px -4px rgba(0,0,0,.1);
    }
 }
 </style>
