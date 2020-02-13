<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table
        stripe
        :data="rightsList"
        border
        style="width: 100%">
         <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data(){
    return{
      rightsList:[]
    }
  },
  created(){
    this.getRightsList(0)
  },
  methods:{
    async getRightsList(){
      const {data : res} = await this.$http.get('rights/list')
      if(res.meta.status === 200){
        this.rightsList = res.data
      }else{
        this.$notify.error({
              message: res.meta.msg,
            });
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>