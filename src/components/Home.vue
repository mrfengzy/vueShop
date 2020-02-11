<template>
    <el-container class="home-container">
      <el-header>
        <div class="">
          <img src="../assets/logo.png" alt="" width="50">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-btn" @click="toggleSide">|||</div>
          <el-menu
            :default-active="childPath"
            :router="true"
            :collapse-transition="false"
            :collapse="isCollapse"
            :unique-opened="true"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff">
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="savePath('/'+subItem.path)">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
              </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>
<script>
export default {
  data(){
    return{
      menulist:[],
      iconObj:{
        '125':'iconfont icon-bussiness-man',
        '103':'iconfont icon-integral',
        '101':'iconfont icon-bags',
        '102':'iconfont icon-feeds',
        '145':'iconfont icon-tradingvolume'
      },
      isCollapse:false,
      childPath:''
    }
  },
  created(){
    this.getMenuList()
    this.getPath()
  },
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200){
        this.$notify.error({
          message: res.meta.msg,
        });
      }else{
        this.menulist = res.data
        console.log(this.menulist)
      }

    },
    toggleSide(){
      this.isCollapse = !this.isCollapse;
    },
    savePath(e){
      window.sessionStorage.setItem('childPath',e)
      this.childPath = e
    },
    getPath(){
      const childPath = window.sessionStorage.getItem('childPath')
      this.childPath = childPath
    }
  },
  
}
</script>
<style lang="less" scoped>
 .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    > div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  
  .el-aside {
    background-color: #333744;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .home-container{
    height: 100%;
  }
  .iconfont{
    margin-right:10px;
  }
  .el-menu{
    border-right: 0;
    text-align: left;
  }
  .toggle-btn{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: .2em;
    cursor: pointer;
  }
</style>