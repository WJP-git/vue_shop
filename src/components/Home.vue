<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="left">
        <img src="../assets/img/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isToggle ? '64px' : '200px'">
        <div class="toggle-button" @click.stop="toggle">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isToggle"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from "@/api/home";
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      //侧边栏图标
      icons: {
        125: "el-icon-s-custom",
        103: "el-icon-s-tools",
        101: "el-icon-s-goods",
        102: "el-icon-circle-plus",
        145: "el-icon-s-fold",
      },
      // 菜单的折叠与展开
      isToggle: false,
      // 二级菜单高亮显示
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    //---------------------网络请求---------------------
    async getMenuList() {
      const data = await getMenuList();
      if (data.meta.status != 200) return this.message.error(data.meta.msg);
      this.menuList = data.data;
    },
    //---------------------自定义---------------------

    // 退出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 菜单的折叠与展开
    toggle() {
      this.isToggle = !this.isToggle;
    },
    // 链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header .left {
  /* width: 50px; */
  display: flex;
  align-items: center;
}
.el-header .left img {
  width: 50px;
  margin-right: 15px;
}
.el-aside {
  background: #373d41;
}
.el-aside .el-menu {
  border-right: 0;
}
.el-main {
  background: #eaedf1;
}
.toggle-button {
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.5em;
  cursor: pointer;
}
</style>
