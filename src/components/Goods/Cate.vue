<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-button type="primary" @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table class="tree-table" border index-text="#" show-index :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-row-hover="false">
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-circle-check" v-if="scope.row.cat_delete === false" style="color:green"></i>
          <i class="el-icon-circle-close" v-else style="color:red"></i>
        </template>
        <template v-slot:order="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template v-slot:act="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete"></el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类modal -->
    <el-dialog title="添加分类" :visible.sync="isCateDialogFormVisible" @close="closeCateDialogForm">
      <el-form :model="cateform" :rules="caterules" ref="cateForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateform.cat_name" autocomplete="off" style="width:80%"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader :options="parentsCateList" clearable style="width:80%" :props="catecascader" v-model="selectedKeys" @change="parentCateChange" change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isCateDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return{
      cateList:[],
      queryInfo:{
        pagenum:1,
        pagesize:3
      },
      total: 20,
      columns:[
        {
          label:'分类名称',
          prop:'cat_name',
        },
        {
          label:'是否有效',
          type:'template',
          template:'isOk'
        },
        {
          label:'排序',
          type:'template',
          template:'order'
        },
        {
          label:'操作',
          type:'template',
          template:'act'
        }
      ],
      isCateDialogFormVisible:false,
      cateform:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      caterules:{
        cat_name:[
          {required:true,message:'请输入分类名称',trigger:'blur'}
        ]
      },
      parentsCateList:[],
      catecascader:{
        value: 'cat_id',
        label:'cat_name',
        children:'children'
      },
      selectedKeys:[]
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList(){
      const {data : res} = await this.$http.get('categories',this.queryInfo)
      if(res.meta.status !== 200){
        return this.$message.error('获取分类列表失败')
      }
      this.cateList = res.data
      // this.total = res.data.total
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    async getParentCateList(){
      const {data : res } = await this.$http.get('categories',{params:{type:2}})
      if(res.meta.status !== 200){
        return this.$message.error('获取分类列表失败')
      }
      this.parentsCateList = res.data
    },
    showCateDialog(){
      this.getParentCateList()
      this.isCateDialogFormVisible = true
    },
    parentCateChange(){
      console.log(this.selectedKeys,'selectedKeys')
      if(this.selectedKeys.length>0){
       this.cateform.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
       this.cateform.cat_level = this.selectedKeys.length
       return
      }else{
        this.cateform.cat_pid = 0
       this.cateform.cat_level = 0
      }

    },
    addCate(){
      console.log(this.cateform,'cateform')
      this.$refs['cateForm'].validate(async valid=>{
        if(!valid) return
        const {data:res} = await this.$http.post('categories',this.cateform)
        if(res.meta.status !== 201 ){
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功')
        this.getCateList()
        this.isCateDialogFormVisible = false
      })
    },
    closeCateDialogForm(){
      this.$refs['cateForm'].resetFields()
      this.selectedKeys = []
      this.cateform.cat_pid = 0
      this.cateform.cat_level = 0
    }
  }
}
</script>
<style lang="less" scoped>
.tree-table{
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>