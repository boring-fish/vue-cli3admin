
<template>
  <div class="login">
    <div class="login-con">
      <div class="login-con-logo">
                    <img src="../../assets/images/logo-white.png"/>
      </div>
      <Card icon="log-in" title="欢迎登录 导购助手管家后台" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <!-- <p class="login-tip">输入任意用户名和密码即可</p> -->
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/login-form/login-form'
// import { loginAPI } from '../../service/api.js'
export default {
  components: {
    LoginForm
  },
  methods: {
    handleSubmit ({ username, password }) {
      // loginAPI({ username, password }).then(res => {
      //     if(res){
      //           // this.$bus.$emit('userInfo',res.data)
      //            this.router.push('home')
      //     }
       
      // })
      if( username === 'cms'&& password === '!QAZ2wsx3edc' ){
         this.$router.push('home')
      }else {
        this.$Message.error('账号或密码错误');
      }
    }
  }
}
</script>

<style lang="less">
.login{
    width: 100%;
    height: 100%;
    background-image: url('../../assets/images/login-bg@2x.png');
    background-size: cover;
    background-position: center;
    position: relative;
    &-con{
        position: absolute;
        right: 50%;
        top: 40%;
        transform: translate(150px,-60%);
        width: 300px;
        &-logo{
          width: 150px;
          margin: 40px auto;
          img{
            width: 100%;
          }
        }
        &-header{
            font-size: 16px;
            font-weight: 300;
            text-align: center;
            padding: 30px 0;
        }
        .form-con{
            padding: 10px 0 0;
        }
        .login-tip{
            font-size: 10px;
            text-align: center;
            color: #c3c3c3;
        }
    }
}

</style>
