<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click.stop="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i v-if="scope.row.cat_deleted == false" class="el-icon-success"></i>
          <i v-else class="el-icon-error"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-if="scope.row.cat_level === 1" size="mini" type="success"
            >二级</el-tag
          >
          <el-tag v-if="scope.row.cat_level === 2" size="mini" type="warning"
            >三级</el-tag
          >
        </template>
        <!-- 操作 -->
        <template v-slot:opt="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="primary" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 25]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50"
      @close="addCateDialogClosed"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="parentCateList"
            v-model="selectedKeys"
            @change="parentCateChanged"
            :props="cascaderProps"
            clearable
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, postCateItem } from "@/api/home";
export default {
  name: "Cate",
  data() {
    return {
      // 请求数据
      cateList: [],
      //查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      // 为table指定列的定义
      columns: [
        { label: "分类名称", prop: "cat_name" },
        { label: "是否有效", type: "template", template: "isok" },
        { label: "排序", type: "template", template: "order" },
        { label: "操作", type: "template", template: "opt" },
      ],
      // 添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // model
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      // 验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
      },
      // 添加对话框的级联
      parentCateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList({ params: this.queryInfo });
  },
  methods: {
    async getCateList(obj) {
      const data = await getCateList(obj);
      if (data.data) {
        let cateList = data.data;
        this.total = cateList.length;
        this.cateList = cateList.splice(0, 6);
      }
    },
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList(this.queryInfo);
    },
    // 监听pagenum改变

    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getCateList(this.queryInfo);
    },
    // 添加分类
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const data = await getCateList({ params: { type: 2 } });
      if (data.meta.status !== 200) return this.$message.error("获取数据失败");
      this.parentCateList = data.data;
    },
    // 选择发生变化
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1];
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 添加
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;

        const data = await postCateItem(this.addCateForm);
        if (data.meta.status !== 201) return this.$message.error("添加数据失败");
        this.$message.success("添加数据成功");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    // 监听框的关闭
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
  },
};
</script>

<style scoped></style>
