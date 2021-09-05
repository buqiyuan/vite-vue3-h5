<template>
  <van-swipe :autoplay="3000" lazy-render>
    <van-swipe-item v-for="image in images" :key="image">
      <img :src="image" />
    </van-swipe-item>
  </van-swipe>
  <van-swipe lazy-render :loop="false">
    <van-swipe-item v-for="n in 2" :key="n">
      <van-grid square :column-num="5">
        <template
          v-for="item in navList.slice((navList.length * (n - 1)) / 2, (navList.length * n) / 2)"
          :key="item.title"
        >
          <van-grid-item :icon="item.url" :text="item.title" />
        </template>
      </van-grid>
    </van-swipe-item>
  </van-swipe>
  <van-card
    v-for="item in 20"
    :key="item"
    :num="item"
    tag="标签"
    :price="item.toFixed(2)"
    desc="描述信息"
    title="商品标题"
    thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
    :origin-price="(item * 10).toFixed(2)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { navList } from './navList'

export default defineComponent({
  name: 'Home',
  setup() {
    const images = [
      'https://img.yzcdn.cn/vant/apple-1.jpg',
      'https://img.yzcdn.cn/vant/apple-2.jpg'
    ]
    return {
      images,
      navList
    }
  }
})
</script>

<style lang="scss" scoped>
.van-swipe img {
  display: block;
  width: 100%;
  height: px2rem(480);
  padding: 30px 60px;
  pointer-events: none;
  background-color: #fff;
  box-sizing: border-box;
}
</style>
