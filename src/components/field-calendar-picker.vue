<template>
  <van-field
    v-model="state.text"
    v-bind="$attrs"
    readonly
    clickable
    :name="name"
    :label="label"
    :placeholder="placeholder"
    @click="state.showPicker = true"
  />
  <van-calendar
    v-model:show="state.showPicker"
    @confirm="onConfirm"
    @cancel="state.showPicker = false"
  />
</template>

<script lang="ts">
  /**
   * @name: field-picker
   * @author:卜启缘
   * @date: 2021/5/10 13:35
   * @description：field-picker
   * @update: 2021/5/10 13:35
   */
  import { reactive, defineComponent } from 'vue';
  import { useVModel } from '@vueuse/core';
  import dayjs from 'dayjs';

  export default defineComponent({
    name: 'FieldCalendarPicker',
    props: {
      modelValue: Object,
      name: String,
      label: String,
      valueKey: String, // 显示给用户看的值
      fieldKey: String, // 选择某项后label对应的value
      placeholder: String,
    },
    emits: ['update:modelValue', 'confirm'],
    setup(props, { emit }) {
      const state = reactive({
        value: useVModel(props, 'modelValue', emit),
        text: '',
        showPicker: false,
      });

      const onConfirm = (value) => {
        state.text = dayjs(value).format('YYYY-MM-DD');
        state.value = value;
        state.showPicker = false;
        emit('confirm', value);
      };

      return {
        state,
        onConfirm,
      };
    },
  });
</script>

<style scoped></style>
