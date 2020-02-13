<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
       border
       stripe
       :data="rolesList"
      >
      <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id + i1" :class="['bdbottom','vcenter',i1 === 0 ? 'bdtop' : '']">
              <!-- yiji -->
              <el-col :span="5">
                <el-tag  closable   @close="removeById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- erji sanji -->
              <el-col :span="19">
                <el-row  v-for="(item2,i2) in item1.children" :key="item2.id + i2" :class="[i2 === 0 ? '' : 'bdtop','vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable   @close="removeById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-row v-for="(item3,i3) in item2.children" :key="item3.id + i3" :class="[i3 === 0 ? '' : 'bdtop']">
                      <el-col>
                        <el-tag closable  type="warning" @close="removeById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- //quanxian -->
    <el-dialog
      @close="setRightDialogClosed"
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%">
      <el-tree ref="rightsTree" default-expand-all show-checkbox :data="rightsList" :props="treeProps" node-key="id"
      :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return{
      rolesList:[],
      setRightDialogVisible:false,
      rightsList:[],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys:[],
      roleId:''
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    async getRolesList(){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status != 200) return this.$notify.error({message:res.meta.msg})
      this.rolesList = res.data

    },
    async removeById(role,rightsId){
      //弹框确认是否删除
     const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult != 'confirm'){
          return this.$message.info('取消了删除')
        }
       const {data : res } = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
       
       if(res.meta.status != 200){
         return this.$message.info('删除权限失败')
       }
       role.children = res.data
    },
    //展示分配权限对话框
    async showSetRightDialog(role){
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status !== 200){
        return this.$message.info('获取权限失败')
      }
      this.roleId = role.id
      this.rightsList = res.data;
      //递归获取三级节点
      this.getLeafKeys(role,this.defKeys)
      this.setRightDialogVisible = true
      
    },
    //通过递归获取三级权限id保存数组中
    getLeafKeys(node,arr){
      //如果当前node不包含children属性则为三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item,arr))
    },
    setRightDialogClosed(){
      this.defKeys = []
    },
    async allotRights(){
      const keys = [
        ...this.$refs['rightsTree'].getCheckedKeys(),
        ...this.$refs['rightsTree'].getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.meta.status !== 200){
        return this.$message.info('更新权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>