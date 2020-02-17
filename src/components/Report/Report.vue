<template>
  <div>
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
// no.1
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data(){
    return{
      options:{
        title:{
          text:'用户来源'
        },
        tooltip:{
          trigger:'axis',
          axisPointer:{
            type:'cross',
            label:{
              backgroundColor:'#e9eef3'
            }
          }
        },
        grid:{
          left:'3%',
          right:'4%',
          bottom:'3%',
          containLabel:true
        },
        xAxis:[
          {
            boundaryGap:false
          }
        ],
        yAxis:[
          {
            type:'value'
          }
        ]
      }
    }
  },
  created(){
  this.getReportList()
  },
  methods:{
    setEchart(option){
      // 基于准备好的dom，初始化echarts实例
     var myChart = echarts.init(document.getElementById('main'));
     myChart.setOption(option);
    },
    async getReportList(){
      const{data:res} = await this.$http.get('reports/type/1')
      if(res.meta.status !== 200){
        this.$message.error('获取数据失败')
      }
      //4.准备数据合并
     const result = _.merge(res.data,this.options)
      this.setEchart(result)
    }
  },
  mounted(){
   
  }
}
</script>
<style lang="less" scoped>

</style>