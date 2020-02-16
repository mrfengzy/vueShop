<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
       <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
        >
      </el-alert>
      <el-steps :space="200" :active="stepsActiveIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="stepsActiveIndex" :before-leave="beforeTabLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat" clearable>
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="item" v-for="(item,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,i) in onlyTableData" :key="i">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :headers="headerObj"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :on-success="successPic"
              :on-error="errorPic">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addForm.goods_introduce">
          </quill-editor>
          <el-button type="primary" @click="submitFood" class="btnAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%">
      <img :src="previewPath" class="previewImg"/>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data(){
    return{
      stepsActiveIndex: '0',
      addForm:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        goods_cat:[],
        pics:[],
        goods_introduce:'',
        attrs:[]
      },
      addFormRules:{
        goods_name:[
          {required:true,message:'请输入商品名称',trigger:'blur'},
        ],
        goods_price:[
          {required:true,message:'请输入商品价格',trigger:'blur'},
        ],
        goods_weight:[
          {required:true,message:'请输入商品重量',trigger:'blur'},
        ],
        goods_number:[
          {required:true,message:'请输入商品数量',trigger:'blur'},
        ],
        goods_cat:[
          {required:true,message:'请选择商品分类',trigger:'blur'},
        ]
      },
      cateList:[],
      cateProps:{ 
        expandTrigger: 'hover',
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      manyTableData:[],
      paramsCheckList:[],
      onlyTableData:[],
      uploadUrl:'https://www.liulongbin.top:8888/api/private/v1/upload',
      headerObj:{
        Authorization : window.sessionStorage.getItem('token')
      },
      previewPath:'',
      previewDialogVisible:false
    }
  },
  created(){
    this.getCatList()
  },
  methods:{
    async getCatList(){
      const{data:res} =  await this.$http.get(`categories`)
      if(res.meta.status !==200){
        return this.$message.error('获取失败')
      }
      this.cateList = res.data
    },
    //级联选择器
    handleChange(){
      if(this.addForm.goods_cat.length !== 3){
        this.addForm.goods_cat = []
      }
      console.log(this.addForm.goods_cat)
    },
    beforeTabLeave(activeName,oldActiveName){
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
        this.$message.error('请选择商品分类')
        return false
      }
      this.manyTableData =[]
    },
    async tabClick(){
      if(this.stepsActiveIndex ==='1'){
        console.log('1dongtaicanshu')
        const{data:res} =  await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}})
        if(res.meta.status !== 200){
          this.$message.error('获取动态参数失败')
        }
        res.data.forEach(item =>{
          item.attr_vals = item.attr_vals.length>0? item.attr_vals.split(' ') : []
        })
        this.manyTableData = res.data
        
      }else if(this.stepsActiveIndex ==='2'){
        const{data:res} =  await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}})
        if(res.meta.status !== 200){
          this.$message.error('获取静态属性失败')
        }
        // res.data.forEach(item =>{
        //   item.attr_vals = item.attr_vals.length>0? item.attr_vals.split(' ') : []
        // })
        this.onlyTableData = res.data
      }
    },
    handleRemove(file) {
      // console.log(file.response.data.tmp_path);
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i,1)
      console.log(this.addForm.pics)
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewDialogVisible = true
    },
    successPic(res){
      this.$message.success('上传图片成功')
      let picObj={}
      picObj.pic = res.data.tmp_path
      this.addForm.pics.push(picObj)
      console.log(this.addForm.pics)
    },
    errorPic(){
      this.$message.error('上传图片失败')
    },
    submitFood(){
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid){
          this.$message.error('请填写必填项')
        }
        //lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        //处理动态参数，静态属性
        this.manyTableData.forEach(item=>{
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })

        this.onlyTableData.forEach(item=>{
          const newInfo = {
            attr_id:item.attr_id,
            attr_value:item.attr_vals,
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        //发起请求，商品名称唯一
        const {data : res } = await this.$http.post(`goods`,form)
        if(res.meta.status !== 201){
          this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    }
  },
  computed:{
    cateId(){
      if(this.addForm.goods_cat.length === 3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style scoped>
.previewImg{
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>