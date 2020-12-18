<template>
      <!-- 二维码 -->
     <div class="preview">
        <Modal v-model="preview.previewStatus" width="360" :transfer="false" :mask-closable="false" @on-ok="close" @on-cancel="close">
        <p slot="header" >
            <span style="margin-left:10px">{{preview.title}}</span>
        </p>
         <p>图文地址：</p>
        <div class="previewLink"  ref="copy" data-clipboard-action="copy" :data-clipboard-text="preview.previewLink" @click="copy" >
           <span class="previewLinkSpan">{{preview.previewLink}}</span> 
          <!-- <Icon type="md-copy" size="18" style="margin:6px 2px 0px 0"></Icon> -->
          <Button type="primary" size="small">复制</Button>
       </div>
      
       <div class="formCode">
         <p>图文二维码：</p>
         <div ref="qrcode" class="qrcode"></div>
       </div>
    </Modal>
  </div>
   
</template>

<script>
// import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
// @Component({
//   components: {
//   },
// })
import QRCode from 'qrcodejs2'
import Clipboard from 'clipboard'


export default {
  name:'PageQrcode',
  props: {
    previews: {
      type: Object,
      default: () => {
          return   {
        previewStatus: false,
        previewLink: '',
        title: ''
        };
      }
    },
  },
 
  
  data(){
    return{
        QRCode,
        preview: {
          previewStatus: false,
          previewLink: ''
        },
    }
  },
 watch: {
          previews: {
               handler:function(newVal, oldVal){
                console.log("newVal:", newVal);
                 this.preview = newVal;
                console.log("newVal:", this.preview);
                this.preview.previewStatus? this.getQrcode() :'';
            },
            deep: true,
            immediate: true
        },
     
    },
  mounted() {
  },
 
  methods:{
    //复制到剪贴板
    copy () {
      let clipboard = new Clipboard('.previewLink');
      let _this = this;
      clipboard.on('success', function () {
         _this.$Message.info('已复制');
      });
      clipboard.on('error', function () {
         _this.$Message.info('该浏览器不支持自动复制');
      });
    },
    //生成二维码
     getQrcode () {
        this.$refs.qrcode.innerHTML = ''; //清除二维码 
        new this.QRCode(this.$refs.qrcode, {
          text: this.preview.previewLink,
          width: 124,
          height: 124,
          correctLevel: this.QRCode.CorrectLevel.H // 二维码容错级别 H M L
        });
    },
    close(){
      this.preview.previewStatus=false;
    }
  },
  
   
    
   
  created() {}
}
</script>

<style lang="less">
   .preview{
        .ivu-modal {
            width: 600px !important;
         }
          .ivu-modal-header {
             padding: 14px 0px;
            i{
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #8494A6;
              line-height: 17px;
            }
       }
       .previewLink{
        width: 560px;
        height: 32px;
        background: #F8F8F8;
        border-radius: 4px;
        border: 1px solid #D4DBE1;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #8494A6;
        line-height: 32px;
        padding-left:5px;
        margin-top:10px;
        .previewLinkSpan{
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              width: 485px;
              display: inline-block;
        }
        .ivu-btn {
         float: right;
         width: 60px;
         height: 32px;
         border-radius: 0px 4px 4px 0px;
        }
       }
       .formCode{
         margin-top:20px;
       }
       .qrcode {
        margin: 10px;
        display: flex;
        justify-content: center;
        -webkit-touch-callout: default;
        img{
          -webkit-touch-callout: default;
        }
      }
      }
</style>
