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
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query">
          <el-button slot="append" icon="el-icon-search"  @click="getUserList">
          </el-button>
      </el-input>
        </el-col>
        <el-col :span="4">
           <el-button type="primary">添加用户</el-button>
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
              <el-button type="primary" @click="handleClick(scope.row)" icon="el-icon-edit" size="mini" ></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" ></el-button>
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
  </div>
</template>
<script>
export default {
  data(){
    return{
      //获取用户列表参数
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      userList:[],
      total:0
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
      console.log(row);
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