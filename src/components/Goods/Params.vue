<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-alert
      show-icon
      title="注意！只允许为第三季分类设置相关参数"
      type="warning"
      :closable="false">
    </el-alert>
    <el-row :gutter="24"  class="cat_opt">
      <el-col :span="18">
        <span style="margin-right:10px;">选择商品分类:</span>
        <el-cascader
          :options="catList"
          v-model="checkedCacader"
          @change="cascaderChange"
          :props="cascaderProps"
          clearable
          style="width:38%"
          >
        </el-cascader>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
      </el-tab-pane>
    </el-tabs>
    <!-- 动态表格 -->
    <el-table
     v-if="activeName == 'many'"
      :data="manyDataSource"
      border
      stripe>
      <el-table-column
        type="expand">
      </el-table-column>
      <el-table-column
        label="#"
        type="index">
      </el-table-column>
      <el-table-column
        label="参数名称"
        prop="attr_name">
      </el-table-column>
      <el-table-column
        label="操作"
        prop="attr_name">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑按钮</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除按钮</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 静态表格 -->
    <el-table
      v-else
      :data="onlyDataSource"
      border
      stripe>
      <el-table-column
        type="expand">
      </el-table-column>
      <el-table-column
        type="index"
        label="#">
      </el-table-column>
      <el-table-column
        label="属性名称"
        prop="attr_name">
      </el-table-column>
      <el-table-column
        label="操作"
        prop="attr_name">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑按钮</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除按钮</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddDialog">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="editFormrules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return{
      catList:[],
      checkedCacader:[],
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children',
        expandTrigger: 'hover'
      },
      activeName:'many',
      manyDataSource:[],
      onlyDataSource:[],
      addDialogVisible:false,
      addForm:{
        attr_name:''
      },
      addFormrules:{
        attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
      },
      editDialogVisible:false,
      editForm:{
        attr_name:''
      },
      editFormrules:{
        attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}]
      }
    }
  },
  created(){
    this.getCatList()
  },
  methods:{
    async getCatList(){
      const {data : res } = await this.$http.get(`categories`)
      if(res.meta.status !== 200){
        return this.$mesaage.error('获取分类失败')
      }
      this.catList = res.data
      console.log(this.catList,'this.catList')
    },
    cascaderChange(){
      this.getTabData()
    },
    handleTabClick(){
      console.log(this.activeName)
      this.getTabData()
    },
    async getTabData(){
      if(this.checkedCacader.length !== 3){
        return this.checkedCacader = []
      }
      //根据所选分类id和当前tab获取对应数据
      const {data:res}= await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
      if(res.meta.status !==200){
        return this.$message.error('获取面板数据失败')
      }
      if(this.activeName ==='many'){
        this.manyDataSource = res.data
      }else{
        this.onlyDataSource = res.data
      }
        
    },
    addDialogClose(){
      this.$refs['addFormRef'].resetFields()
    },
    submitAddDialog(){
      this.$refs['addFormRef'].validate(async valid =>{
        if(!valid){
          return
        }
        const{data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName})
        if(res.meta.status !==201){
          return this.$message.error('添加参数失败')
        }
          this.$message.success('添加参数成功')
          this.addDialogVisible = false;
          this.getTabData()
      })
      
    },
    async showEditDialog(e){
      const{data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${e}`,{params:{attr_sel:this.activeName}})
      if(res.meta.status !== 200){
        return this.$message.error('获取信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClose(){
      this.$refs['editFormRef'].resetFields();
    },
    submitEditDialog(){
      this.$refs['editFormRef'].validate(async valid =>{
        if(!valid){
          return
        }
        const{data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.activeName})
        if(res.meta.status !==200){
          return this.$message.error('修改参数失败')
        }
          this.$refs['editFormRef'].resetFields();
          this.$message.success('修改参数成功')
          this.editDialogVisible = false;
          this.getTabData()
      })
      
    },
    async removeParams(e){
      const result = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      if(result !== 'confirm'){
        return this.$message.info('已取消删除操作')
      }
      const {data : res} = await this.$http.delete(`categories/${this.cateId}/attributes/${e}`)
      if(res.meta.status !== 200){
        return this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getTabData()

    }
  },
  computed:{
    isBtnDisabled(){
      if(this.checkedCacader.length !== 3){
        return true
      }
      return false
    },
    //三级分类id
    cateId(){
      if(this.checkedCacader.length ===3){
        return this.checkedCacader[2]
      }
      return null
    },
    //判断标题文本
    titleText(){
      if(this.activeName === 'many'){
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt{
  margin:15px 0;
}
</style>