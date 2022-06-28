<template>
  <router-view #="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup lang="ts"></script>

<style lang="scss">
  @import './styles/common';

  html {
    @include root-font-size();
  }
</style>
