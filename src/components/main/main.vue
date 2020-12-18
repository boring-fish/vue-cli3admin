
<template>
    <div class="layout">
        <Layout>
            <Sider ref="side1" class="layout-side-bar" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <div class="logo">
                    <img src="../../assets/images/logo-white.png"/>
                </div>
                <Menu active-name="dashboard" theme="dark" width="auto" :class="menuitemClasses">
                    <MenuItem name="dashboard" to="home">
                        <img class="menuside-icon" src="../../assets/icon/panel.svg" /> 
                        看板
                    </MenuItem>
                     <Submenu name="task">
                        <template slot="title">
                           <img  class="menuside-icon" src="../../assets/icon/task.svg" /> 
                            任务配置
                        </template>
                        <MenuItem name="task-list" to="taskList">任务列表</MenuItem>
                        <MenuItem name="task-Class" to="taskClass">任务分类</MenuItem>

                    </Submenu>
                      <Submenu name="material">
                        <template slot="title">
                           <img  class="menuside-icon" src="../../assets/icon/image.svg" /> 
                            素材管理
                        </template>
                        <MenuItem name="material-list" to="material">素材库</MenuItem>
                    </Submenu>
                     <Submenu name="client">
                        <template slot="title">
                           <img  class="menuside-icon" src="../../assets/icon/client.svg" /> 
                            客户管理
                        </template>
                        <!-- <MenuItem name="task-list" to="taskList">任务列表</MenuItem>
                        <MenuItem name="task-Class" to="taskClass">任务分类</MenuItem> -->

                    </Submenu>
                    

                </Menu>
            </Sider>
            <Layout>
                <Header class="layout-header-bar">
                    <!-- <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon> -->
                    <div>
                        您好！
                        <span class="login-username">
                            <ww-open-data type="userName" :openid="userid"></ww-open-data>
                        </span>
                    </div>
                     <Tooltip  content="Bottom Right text" placement="bottom-end"  theme="light" offset="8">
                    <Icon class="user-icon" type="md-contact" color="rgba(0, 10, 20, 0.1)" size="32"/>
                        <div slot="content" class="logout-content" @click="handdleLogout">
                            <img class="logout-icon" src="../../assets/icon/logout.svg" />                            登出
                        </div>
                    </Tooltip>
                </Header>
                <Content>
                    <keep-alive>
                        <router-view />
                    </keep-alive>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import{ bindWxOpenData }from '../../utils/utils.js'

    export default {
        data () {
            return {
                userid: this.$userInfo.userid,
                isCollapsed: false,
                activeName: 'taskList'
            }
        },
        computed: {
            rotateIcon () {
                return [
                    'menu-icon',
                    this.isCollapsed ? 'rotate-icon' : ''
                ];
            },
            menuitemClasses () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        methods: {
            collapsedSider () {
                this.$refs.side1.toggleCollapse();
            },
            handdleLogout(){
                this.$router.push('login')
            }, 
        },
        mounted(){
            // this.$bus.$on('userInfo', (userInfo)=>{
            //     debugger
            //     this.userInfo = userInfo;
            // });
           
            // const { name } = this.$route;
            // console.log( name , 'name')
            // this.activeName = name === 'taskRule'? 'taskList' : name;
            // console.log( this.activeName, 'activeName')
            bindWxOpenData(this.$corpid, this.$agentid);
        }
    }
</script>

<style lang="less">
    .layout{
        background: #f5f7f9;
        position: relative;
        overflow: hidden;
        height: 100%;
        .ivu-layout{
        height: 100%;
        }
        .ivu-layout-sider {
            width: 220px;
            max-width: 220px;
            min-width: 220px;
            background: #1A2025;
        }
        .layout-header-bar{
            background: #fff;
            box-shadow: 0 1px 1px rgba(0,0,0,.1);
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
        }
        .login-username{
            color: #2F7DCD;
        }
    
        .layout-logo-left{
            width: 90%;
            height: 30px;
            background: #5b6270;
            border-radius: 3px;
            margin: 15px auto;
        }
        .logo{
            width:100%;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .logout-content{
            width: 140px;
            padding-left: 22px; 
            cursor: pointer;
        }
        .logout-content:hover {
            background:rgba(238, 244, 251, 1);
        }
        .user-icon{
            vertical-align: middle;
              cursor: pointer;
        }
        .logout-icon{
            vertical-align: text-bottom;
            margin-right: 12px;
        }
        .menuside-icon{
            width: 16px;
            height: 16px;
            vertical-align: text-bottom;

        }
        .menu-icon{
            transition: all .3s;
        }
        .rotate-icon{
            transform: rotate(-90deg);
        }
        .menu-item span{
            display: inline-block;
            overflow: hidden;
            width: 69px;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
            transition: width .2s ease .2s;
        }
       
        .ivu-menu-dark{
            background: none;
        }
        // .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover{
        //     background: #2F7DCD;
        // }
        .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover {
            background: none;
        }
        .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu) {
        color: #fff;
       
        }
        .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu):hover, .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu), .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover{
             background: #2F7DCD;
        }
    
        .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened {
            background: none;
        }
        .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened  .ivu-menu-submenu-title {
        background: none ;
        }
        .layout-header-bar .ivu-tooltip-rel{
            height: 48px;
        }
        .ivu-tooltip-light .ivu-tooltip-inner{
            padding: 8px 0;
        }
        // .ivu-tooltip-light.ivu-tooltip-popper{
        //     left:
        // }
    }
     .menu-item i{
            transform: translateX(0px);
            transition: font-size .2s ease, transform .2s ease;
            vertical-align: middle;
            font-size: 16px;
        }
        .collapsed-menu span{
            width: 0px;
            transition: width .2s ease;
        }
        .collapsed-menu i{
            transform: translateX(5px);
            transition: font-size .2s ease .2s, transform .2s ease .2s;
            vertical-align: middle;
            font-size: 22px;
        }
    
  

</style>
