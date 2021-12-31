<template>
  <van-empty
    class="custom-image"
    image="https://img.yzcdn.cn/vant/custom-empty-image.png"
    :description="description"
  />
</template>

<script lang="ts" setup>
  defineProps({
    description: {
      type: String,
      default: '暂无数据',
    },
  });
</script>

<style lang="scss">
  .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }
</style>
