<template>
     <div class="field">
    <Modal v-model="material.materialStatus" width="360" :transfer="false" >
       <p slot="header" >
            <span style="margin-left:10px">新建素材</span>
        </p>
         <Form label-position="top" ref="articleContent" :model="articleContent" :rules="ruleValidate">
           <FormItem label="图文标题" prop="title" >
            <Input
              v-model="articleContent.title"
              placeholder="请输入图文标题"
            />
          </FormItem>
          <FormItem label="图文描述" prop="detail" class="norequire">
            <Input
              v-model="articleContent.detail"
              placeholder="请输入图文描述"
            />
          </FormItem>
           <FormItem label="封面图" prop="thumb" class="upload-form">
              <p class="authorizations">要求大小为200*200像素，不大于xMB</p>
            <Upload
              v-model="articleContent.thumb"
              type="drag"
              accept=".png,.jpg,.jpeg"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :show-upload-list="false"
              :before-upload="onBeforeUpload"
               :on-success="handleSuccess"
              v-show="!coverImgUrl"
              action="https://wk-1258302538.cos.ap-nanjing.myqcloud.com">
              <div class="upload-box">
                   <img  src="../../assets/images/cloud-upload.png" /> 
                <!-- <Icon style='opacity:0.9;color: #8494A6;' type="ios-cloud-upload-outline" size="42"></Icon> -->
              </div>
            </Upload>
            
            <div class="cover-preview" v-show="coverImgUrl">
              <img :src="coverImgUrl" alt="">
              <div class="cover-preview-mask">
                <Icon type="ios-trash-outline" @click.native="delCover"></Icon>
              </div>
            </div>
           
          </FormItem>
            <FormItem label="外部链接" prop="link">
            <Input
              v-model="articleContent.link"
              placeholder="请输入外部链接地址"
            />
          </FormItem>
      
          </Form>
          <div slot="footer">
    <Button type="text" size="large" @click="cancel">取消</Button>
    <Button type="primary" size="large"  @click='submit'>确定</Button>
</div>
    </Modal>
     <page-qrcode :previews='preview'></page-qrcode>
  </div>
   
</template>

<script>
import PageQrcode from './page-qrcode'
import{ addUploadAPI,getMaterialAPI,addMaterialAPI }from '../../service/api.js'

export default {
  name:'AddMaterial',
  components:{
       PageQrcode
    },
   props: {
    material: {
      type: Object,
      default: () => {
          return    {
            materialStatus: false,
            // fieldLink: ''
        };
      }
    },
  },
   watch: {
          material: {
               handler:function(newVal, oldVal){
                 if(newVal){
                    // this.articleContent=this.material.articleContent;
                    // console.log(this.articleContent);
                    this.coverImgUrl='';
                    this.$refs['articleContent'].resetFields();
                    console.log(this.articleContent);

                 }
                   
            },
            // deep: true,
            // immediate: true
        },
     
    },
  data(){
    return{
       articleContent:{
         title:'',
         thumb:'',
         detail:'',
         link:'',

       },
         ruleValidate: {
                    title: [
                        { required: true, message: '必填'}
                    ],
                    detail: [
                        { required: false, message: '不必填'},
                    ],
                    thumb: [
                        { required: true, message: '必填' }
                    ],
                    link: [
                        { required: true, message: '必填' }
                    ],
                  
                },
       coverImg : '',
       coverImgUrl: '',
       preview: {
        previewStatus: false,
        previewLink: 'http://host.leadswarp.com/page/8aecd18c-468f-48af-9e71-1033f28eebd5',
        title: '发布成功'
        },
    }
  },
 methods:{
   cancel(){
       this.material.materialStatus= false;
   },
    submit() {
    //  this.preview.previewStatus= true;
     console.log(this.preview);
     console.log(this.articleContent);
     this.$refs.articleContent.validateField('thumb',(res)=>{
       console.log(res);
     });
      this.$refs['articleContent'].validate((valid) => {
            if (valid) {
                let params={
                   title: this.articleContent.title,
                   thumb:  this.articleContent.thumb ,
                   detail: this.articleContent.detail,
                   link:  this.articleContent.link,
                   visual_range:'[]'
                }
                console.log(params);
                addMaterialAPI(params).then((res)=> {
                  if(res.status===200){
                    this.preview= {
                        previewStatus: true,
                        previewLink: this.articleContent.link,
                        title: '发布成功'
                    };
                    
                    this.$emit("addSuccessStatus",true);
                  }
                  })
                  .catch(function(error) {
                    console.log(error);
                  });
                  this.material.materialStatus= false;
                    } 
                })
    
     
    },
    uploadImg(fileObject){
      var COS = require('cos-js-sdk-v5');
      var cos = new COS({
          SecretId: 'AKIDEPAfusYATr5SYNrIUP2OTLzQwjLfIJir',
          SecretKey: '3khaO1O7Znso79uO0MV5PVJr8h05vUnu',
      });
      cos.putObject({
          Bucket: 'media-1302382638', /* 必须 */
          Region: 'ap-guangzhou',     /* 存储桶所在地域，必须字段 */
          Key: fileObject.name,              /* 必须 */
          StorageClass: 'STANDARD',
          Body: fileObject, // 上传文件对象
          onProgress: function(progressData) {
              console.log(JSON.stringify(progressData));
          }
      }, (err, data) =>{
        if(data.statusCode===200){
          this.articleContent.thumb ='https://'+data.Location;
        }
          console.log(err || data);

      });
    },
    onBeforeUpload(file) {
      this.coverImg = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
      this.uploadImg(file);
      this.coverImgUrl = reader.result;
      this.articleContent.coverImg= file;
      };
      return false;
  },
  handleSuccess( response, file, fileList){
  //  console.log( response, file, fileList);
  //   this.articleContent.coverImg= file;
  //   this.$refs.xxx.clearValidate();
  //   console.log(this.articleContent);
  },
  delCover() {
    this.coverImg = '';
    this.coverImgUrl = '';
  }
 },
  
 
  mounted() {
  },
  created() {}
}
</script>

<style lang="less">
   .field{
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
       .upload-form{
           .cover-preview{
          width: 80px;
          height: 80px;
          border-radius:2px;
          // margin-top: 12px;
          position: relative;
          overflow: hidden;
          .cover-preview-mask{
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,.6);
            text-align: center;
            line-height: 80px;
            i{
              font-size: 22px;
              cursor: pointer;
              color: #fff;
              vertical-align: middle;
            }
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
         .authorizations{
           margin-top: -3px;
          font-size: 12px;
          font-weight: 400;
          color: #969799;
        }
        .cover-preview:hover .cover-preview-mask{
          display: block;
        }
        .ivu-upload{
          width: 80px;
          height: 80px;
          border-radius:2px;
          overflow: hidden;
          .upload-box{
            width: 80px;
            height: 80px;
            line-height: 120px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
       }
      }
</style>
