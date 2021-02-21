<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/logo.png" alt="" />
      </div>

      <el-form
        ref="loginFormRef"
        label-width="0"
        :rules="loginFormRules"
        :model="loginForm"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-s-custom"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="el-icon-s-release"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click.stop="login">登录</el-button>
          <el-button @click.stop="resetLoginForm" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from "@/api/login";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      //表单的验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 5, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    // 重置
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return false;
        let data = await login(this.loginForm);
        if (data.meta.status !== 200) {
          this.$message({
            message: "恭喜你，登录失败",
            type: "error",
          });
        } else {
          this.$message({
            message: "很遗憾，登录成功了",
            type: "success",
          });
          window.sessionStorage.setItem("token", data.data.token);
          this.$router.push("/home");
        }
      });
    },
  },
};
</script>
<style scoped>
.login {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login_box .avatar_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
}
.login_box .avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #eee;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
