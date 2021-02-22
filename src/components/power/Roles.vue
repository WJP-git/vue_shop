<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary" @click.stop="addUser">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              class="row"
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级菜单 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 搜索列 -->
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              @click.stop="editDialog(scope.row.id)"
              icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click.stop="deleteUser(scope.row.id)"
              >删除</el-button
            >
            <el-button
              @click.stop="showSetRightDialog(scope.row)"
              type="warning"
              size="mini"
              icon="el-icon-setting"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserValid">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改框 -->
    <el-dialog title="修改" :visible.sync="editDialogVisible" width="50">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserValid">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKets"
        ref="treeRef"
      >
      </el-tree>
      <div slot="footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="allotRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolesList,
  postRolesList,
  putRolesItem,
  getRolesItem,
  delRolesItem,
  delRolesLevelMenu,
  getAssignPermiss,
  postAssignPermiss,
} from "@/api/home";
export default {
  name: "Roles",
  data() {
    return {
      rolesList: [],
      // 分配权限的数据
      rightsList: [],
      // 权限的树状结构
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点id值
      defKets: [],
      // 添加框的显示与隐藏
      addDialogVisible: false,
      // 添加的规则
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 4, max: 15, message: "长度在 4 到 15 个字符", trigger: "blur" },
        ],
      },
      // 添加框的显示与隐藏

      editDialogVisible: false,
      //编辑用户
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 4, max: 15, message: "长度在 4 到 15 个字符", trigger: "blur" },
        ],
      },
      // 分配权限框的显示与隐藏
      setRightDialogVisible: false,
      // 当前即将分配权限的id
      role: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const data = await getRolesList();
      if (data.meta.status !== 200) return this.$message.error("获取角色列表失败");
      this.rolesList = data.data;
      // console.log(this.roleList);
    },

    // 添加用户
    addUser() {
      this.addDialogVisible = true;
    },
    // 验证
    addUserValid() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) this.$message.error("添加失败");
        const data = await postRolesList(this.addForm);
        if (data.meta.status != 201) this.$message.error("添加失败");
        this.$message.success("添加成功");
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },
    // 关闭添加框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 修改
    async editDialog(id) {
      const data = await getRolesItem(id);
      this.editForm = data.data;
      this.editDialogVisible = true;
    },
    // 修改验证
    editUserValid() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) this.$message.error("修改失败");
        this.$message.success("修改成功");
        const data = await putRolesItem(this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc,
        });
        if (data.meta.status !== 200) {
          this.$message.error("修改失败");
        }
        this.editDialogVisible = false;
        this.$message.success("修改成功");
        this.getRolesList();
      });
    },
    // 删除
    async deleteUser(id) {
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
      const data = await delRolesItem(id);
      if (data.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.getRolesList();
      this.$message.success("删除成功");
    },
    // 三级菜单根据对应的id删除权限
    async removeRightById(role, rightId) {
      const confirm = await this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancleButtonText: "取消",
        type: "warning",
      }).catch((err) => {
        return err;
      });
      if (confirm != "confirm") return this.$message.info("已取消");
      const data = await delRolesLevelMenu(role.id, rightId);
      if (data.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success("删除成功");
      role.children = data.data;
    },
    // 点击分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const data = await getAssignPermiss();
      if (data.meta.status !== 200) return this.$message.error("获取失败");
      // 请求的结果
      this.rightsList = data.data;
      this.getLeafKeys(role, this.defKets);
      this.setRightDialogVisible = true;
    },

    getLeafKeys(node, arr) {
      if (!node.children) return arr.push(node.id);
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    // 分配对话框的关闭
    setRightDialogClosed() {
      this.defKets = [];
    },
    // 为角色分配权限
    async allotRights() {
      // 选中的id
      let checkId = this.$refs.treeRef.getCheckedKeys();
      let halfId = this.$refs.treeRef.getHalfCheckedKeys();
      const keys = [...checkId, ...halfId];
      const rids = keys.join(",");
      const data = await postAssignPermiss(this.roleId, { rids });
      if (data.meta.status !== 200) {
        return this.$message.error("设置权限失败");
      }
      this.$message.success("设置权限成功");

      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>
