import { App } from 'vue'
// import 'vant/lib/index.css';
import '@vant/touch-emulator' // 桌面端touch适配
import {
  Button,
  List,
  Cell,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  NavBar,
  Icon,
  Sticky,
  Card,
  Sidebar,
  SidebarItem
} from 'vant'

const plugins = [
  Button,
  List,
  Cell,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  NavBar,
  Icon,
  Sticky,
  Card,
  Sidebar,
  SidebarItem
]

export const vantPlugins = {
  install: function (app: App) {
    plugins.forEach((item) => {
      // app.component(item.name, item);
      app.use(item)
    })
  }
}
