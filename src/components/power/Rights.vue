<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsList" style="width: 100%" border>
        <el-table-column type="index" />
        <el-table-column prop="authName" label="权限名称" />
        <el-table-column prop="path" label="路径" />
        <el-table-column prop="level" label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level == '0'">一级权限</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == '1'">二级权限</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level == '2'">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "@/api/home";
export default {
  name: "Rights",
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    //-------------------网络请求-------------------
    async getRightsList() {
      const data = await getRightsList();
      if (data.meta.status !== 200) return this.$message.error("获去权限列表失败");
      this.rightsList = data.data;
    },
    //-------------------自定义-------------------
  },
};
</script>

<style></style>
