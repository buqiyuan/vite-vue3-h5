<template>
  <van-sticky ref="stickyRef">
    <van-nav-bar :title="$route.meta?.title">
      <template #left>
        <van-icon name="wap-nav" size="18" />
      </template>
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
  </van-sticky>
  <div class="container">
    <router-view />
  </div>
  <van-tabbar ref="tabbarRef" route>
    <template v-for="item in main" :key="item.name">
      <van-tabbar-item :to="item.path" :icon="item.meta?.icon">{{
        item.meta?.title
      }}</van-tabbar-item>
    </template>
  </van-tabbar>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from 'vue'
import { main } from '@/router/modules/main'
import { Sticky, Tabbar } from 'vant'

export default defineComponent({
  setup() {
    const stickyRef = ref<InstanceType<typeof Sticky>>()
    const tabbarRef = ref<InstanceType<typeof Tabbar>>()
    const containerHeight = ref('')

    nextTick(() => {
      containerHeight.value =
        stickyRef.value?.$el?.offsetHeight + tabbarRef.value?.$el.offsetHeight + 'px'
    })

    return {
      main,
      stickyRef,
      tabbarRef,
      containerHeight
    }
  }
})
</script>

<style lang="scss">
.container {
  --height: v-bind('containerHeight');
  --container-height: calc(100vh - var(--height));

  height: calc(100vh - var(--height));
  overflow: auto;
}
</style>
