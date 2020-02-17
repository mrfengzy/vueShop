<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderListData" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle @click="editForm(scope.row)" size="mini"></el-button>
            <el-button type="success" icon="el-icon-position" circle size="mini" @click="showInfo(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="修改" :visible.sync="editDialogFormVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="editAdressForm" ref="editAdressForm" :rules="editAdressFormRules">
        <el-form-item label="省市区/县" label-width="100px" prop="address1">
          <el-cascader
            v-model="editAdressForm.address1">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="100px" prop="address2">
          <el-input v-model="editAdressForm.address2" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 物流信息modal -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%" @close="progressVisibleClosed">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in progressInfoData"
          :key="index"
          :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return{
      queryInfo:{
        query:'',
        pagesize:5,
        pagenum:1,
      },
      total:0,
      orderListData:[],
      editDialogFormVisible:false,
      editAdressForm:{
        address1:[],
        address2:''
      },
      editAdressFormRules:{
        address1:[
          {required:true,message:'请选择省市区',trigger:'blur'}
        ],
         address2:[
          {required:true,message:'请填写详细地址',trigger:'blur'}
        ]
      },
      progressVisible:false,
      progressInfoData:[]
    }
  },
  created(){
    this.getOrderList()
  },
  methods:{
    async getOrderList(){
      const {data:res} = await this.$http.get('orders',{
        params:this.queryInfo
      })
      if(res.meta.status!==200){
        this.$message.error('获取订单失败')
      }
      this.total = res.data.total
      this.orderListData = res.data.goods
      console.log(res.data)
    },
    handleSizeChange(e){
      this.queryInfo.pagesize = e
      this.getOrderList()
    },
    handleCurrentChange(e){
      this.queryInfo.pagenum = e
      this.getOrderList()
    },
    //修改地址modal
    editForm(){
      this.editDialogFormVisible = true
    },
    addressDialogClosed(){
      this.$refs.editAdressForm.resetFields()
    },
    showInfo(){
      this.getProgressData()
      this.progressVisible = true
    },
    progressVisibleClosed(){
      
    },
    async getProgressData(){
      const{data:res} = await this.$http.get(`kuaidi/804909574412544580`)
      if(res.meta.status!==200){
        this.$message.error('物流信息获取失败')
      }
      this.progressInfoData = res.data
    }
  },
}
</script>
<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>