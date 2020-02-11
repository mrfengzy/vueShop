<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
          <el-button slot="append" icon="el-icon-search"  @click="getUserList">
          </el-button>
      </el-input>
        </el-col>
        <el-col :span="4">
           <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- table -->
        <el-table
          stripe="true"
          :data="userList"
          border
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="职位">
          </el-table-column>
          <el-table-column
            prop="username"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="日期">
          </el-table-column>
          <el-table-column
            label="状态">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state" @change="userstateChanged(scope)">
                </el-switch>
              </template>
          </el-table-column>
          <el-table-column
            width="180"
            fixed="right"
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleClick(scope.row)" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="delateClick(scope.row)"></el-button>
              <el-tooltip effect="light" content="分配权限" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 4, 6, 8]"
          :page-size="2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>
    <!-- user modal -->
    <el-dialog title="新增用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addUserForm" ref="addForm" :rules="addUserRuleList">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
         <el-input v-model="addUserForm.username" placeholder="请输入用户名" style="width:60%"></el-input>
        </el-form-item>
         <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addUserForm.password" placeholder="请输入密码" style="width:60%" type="password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
         <el-input v-model="addUserForm.mobile" placeholder="请输入手机号" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
         <el-input v-model="addUserForm.email" placeholder="请输入邮箱" style="width:60%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUserDialog('addForm')">取 消</el-button>
        <el-button type="primary" @click="submitUserDialog('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--edit user modal -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editUserForm" ref="editForm" :rules="editUserRuleList">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
         <el-input v-model="editUserForm.username" placeholder="请输入用户名" style="width:60%" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
         <el-input v-model="editUserForm.mobile" placeholder="请输入手机号" style="width:60%"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
         <el-input v-model="editUserForm.email" placeholder="请输入邮箱" style="width:60%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditUserDialog('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    let email = (rule,value,callback)=>{
      let reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if(!reg.test(value)){
         return callback(new Error('邮箱格式填写不正确'));
      }else{
        callback();
      }
    }
    return{
      //获取用户列表参数
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      userList:[],
      total:0,
      addDialogVisible:false,
      addUserForm:{
        password:'',
        username:'',
        mobile:'',
        email:'',
      },
      formLabelWidth: '120px',
      addUserRuleList: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator:email, trigger: 'change' }
        ]
      },
      editDialogVisible:false,
      editUserForm:{
        username:'',
        mobile:'',
        email:'',
      },
      editUserRuleList: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator:email, trigger: 'change' }
        ]
      },
    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList(){
     const{data:res} = await this.$http.get('users',{ params:this.queryInfo})
     if(res.meta.status === 200){
       this.userList = res.data.users;
       this.total = res.data.total
     }
    },
    handleClick(row) {
      this.editDialogVisible = true;
      this.editUserForm.username = row.username;
      this.editUserForm.mobile = row.mobile;
      this.editUserForm.email = row.email;
      this.editUserForm.id = row.id
      // console.log(row);
    },
    // 监听pagesizr
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize;
      this.getUserList()
    },
    //监听页码改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage;
      this.getUserList()
    },
    // 修改userstate
    async userstateChanged(e){
     const {data : res} = await this.$http.put(`users/${e.row.id}/state/${e.row.mg_state}`)
      console.log(res,'res')
     if(res.meta.status != 200){
       e.mg_state = !e.mg_state
       return this.$notify.error({
              message: res.meta.msg,
            });
     }
     this.$notify.success({
              message: res.meta.msg,
            });
    },
    // submit dialog user
    submitUserDialog(e){
      this.$refs[e].validate(async (valid) => {
          if (valid) {
           const {data:res} = await this.$http.post('users',this.addUserForm)
           if(res.meta.status !== 201) return this.$notify.error({message:'添加用户失败'})
            this.$notify.success({message:res.meta.msg})
            this.addDialogVisible=false;
            this.getUserList();
          } else {
            this.addDialogVisible=true;
            return false;
          }
        });
    },
    closeUserDialog(e){
        this.addDialogVisible=false;
        this.$refs[e].resetFields()
    },
    addDialogClose(){
      this.$refs['addForm'].resetFields()
    },
    editDialogClose(){
      this.$refs['editForm'].resetFields()
    },
    submitEditUserDialog(e){
      this.$refs[e].validate(async (valid)=>{
        if(valid){
          const {data : res} = await this.$http.put(`users/${this.editUserForm.id}`,{mobile:this.editUserForm.mobile,email:this.editUserForm.email})
          if(res.meta.status !== 200) {return this.$notify.error({message:'修改用户失败'})}
            this.editDialogVisible=false;
            this.getUserList();
            this.$notify.success({message:res.meta.msg})
        }else{
          return
        }
      })
    },
    async delateClick(e){
      const confirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult === 'confirm'){
       const {data : res } = await this.$http.delete(`users/${e.id}`)
       if(res.meta.status == 200){
         this.$message({type:'success',message:'删除成功'})
         this.getUserList()
       }else{
         this.$message({type:'error',message:'删除失败'})
       }
      }else{
        this.$message({type:'info',message:'已取消删除'})
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>