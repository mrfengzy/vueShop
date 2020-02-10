<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avator_box">
        <img src="../assets/logo.png">
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login('loginFormRef')">登录</el-button>
          <el-button type="info" @click="resetLoginForm('loginFormRef')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
     var checkPassword = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入密码'));
        }
        if (value) {
          callback();
        }
      };
      return {
        loginForm: {
          uasename: '',
          password: '',
        },
        loginFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'change' }
          ],
          password: { validator: checkPassword, trigger: 'blur' }
        
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      resetLoginForm(e){
        this.$refs[e].resetFields()
      },
      login(e){
        this.$refs[e].validate(async (valid)=>{
          if(!valid) return;
          const {data:res} = await this.$http.post('login',this.loginForm)
          if(res.meta.msg === '用户名不存在'){
            this.$notify.error({
              title: '登录失败',
              message: res.meta.msg,
            });
          }else{
            this.$notify({
              title: '登录成功',
              message: res.meta.msg,
              type: 'success'
            });
            window.sessionStorage.setItem('token',res.data.token)
            this.$router.push('/home')
          }
        })
      }
    }
}
</script>
<style lang="less" scoped>
  .login_container{
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avator_box{
      height: 130px;
      width: 130px;
      border:1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee
      }
    }
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
  .login_form{
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    bottom:0;
    padding: 0 20px;
  }
</style>