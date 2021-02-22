<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            class="input-with-select"
            clearable
            @clear="getUserList(queryInfo)"
          >
            <el-button
              @click.stop="getUserList(queryInfo)"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click.stop="addDialogVisible = !addDialogVisible"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch
              @change="userStateChange(scope.row)"
              v-model="scope.row.mg_state"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click.stop="editDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click.stop="removeUserById(scope.row.id)"
            ></el-button>

            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                @click.stop="setRole(scope.row)"
                type="warning"
                size="mini"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click.stop="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form ref="editForm" :rules="editFormRules" :model="editForm" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click.stop="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="editUserInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色对话框 -->
    <el-dialog
      title="角色分配"
      :visible.sync="setRoleDialogVisible"
      width="50"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          新角色
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <div slot="footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="saveRoleInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  putUserList,
  postUserList,
  getUserId,
  putUserItem,
  delUserItem,
  getRole,
  putRoleItem,
} from "@/api/home";
export default {
  name: "Users",
  data() {
    // 手机规则
    let checkMobile = (rule, value, cb) => {
      const regMobile = /^1[3|5|8]\d{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入正确的手机号"));
    };
    return {
      queryInfo: {
        query: "",
        // 页数
        pagenum: 1,
        // 当前页显示多少条数据
        pagesize: 5,
      },
      userList: [],
      total: 0,
      // 对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加表单验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] },
        ],
        mobile: [
          { required: true, message: "请输入用户手机", trigger: "blur" },
          { validator: checkMobile, message: "请输入正确的手机", trigger: "blur" },
        ],
      },
      // 修改对话框的显示与隐藏
      editDialogVisible: false,
      // 修改对话框的数据
      editForm: {},
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入用户手机", trigger: "blur" },
          { validator: checkMobile, message: "请输入正确的手机", trigger: "blur" },
        ],
      },
      // 角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 分配的角色
      userInfo: {},
      roleList: [],
      // 已选中的角色Id值
      selectedRoleId: "",
    };
  },
  created() {
    this.getUserList(this.queryInfo);
    // console.log(this.editForm);
  },
  methods: {
    //-------------------网络请求--------------------
    async getUserList(data) {
      const { data: res } = await getUserList(data);
      if (res) {
        this.userList = res.users;
        this.total = res.total;
      }
    },

    //-------------------自定义--------------------
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList(this.queryInfo);
    },
    // 页码值发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList(this.queryInfo);
    },
    // 监听switch状态的改变
    async userStateChange(userInfo) {
      const data = await putUserList(`users/${userInfo.id}/state/${userInfo.mg_state}`);
      if (data.meta.status === 200) {
        this.$message.success("设置状态成功");
      } else {
        userInfo.mg_state = !userInfo.mg_state;
        this.$message.error("设置状态失败");
      }
    },
    // 添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return false;
        const data = await postUserList(this.addForm);
        if (data.meta.status !== 201) this.$message.error("添加用户失败");
        this.$message.success("添加用户成功");
        this.addDialogVisible = false;
        this.getUserList(this.queryInfo);
      });
    },
    // 修改用户
    async editDialog(id) {
      // console.log(id);
      const data = await getUserId(`users/${id}`);
      this.editForm = data.data;
      this.editDialogVisible = true;
    },
    // 修改用户对话框的关闭事件 reset
    editDialogClose() {
      this.$refs.editForm.resetFields();
    },
    // 修改用户信息并验证
    editUserInfo() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return false;
        const data = await putUserItem(`users/${this.editForm.id}`, {
          username: this.editForm.username,
          mobile: this.editForm.mobile,
        });
        if (data.meta.status !== 200) this.$message.error("修改失败");
        this.editDialogVisible = false;
        this.$message.success("修改成功");
        this.getUserList(this.queryInfo);
      });
    },
    async removeUserById(id) {
      const confirm = await this.$confirm("确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning",
      }).catch((err) => {
        return err;
      });
      if (confirm == "cancel") {
        return this.$message.info("已取消");
      }
      const data = await delUserItem(id);
      if (data.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.getUserList(this.queryInfo);
      this.$message.success("删除成功");
    },
    // 展示角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo;
      this.setRoleDialogVisible = true;
      const data = await getRole();
      this.roleList = data.data;
    },
    // 修改角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) return;
      const data = await putRoleItem(this.userInfo.id, { rid: this.selectedRoleId });
      if (data.meta.status == 200) this.$message.success("修改成功");
      this.setRoleDialogVisible = false;
      this.getUserList(this.queryInfo);
    },
    // 监听分配角色框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = {};
    },
  },
};
</script>

<style scoped>
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
</style>
