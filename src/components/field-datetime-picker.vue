<template>
  <van-field
    v-model="text"
    v-bind="$attrs"
    readonly
    clickable
    :name="name"
    :label="label"
    :placeholder="placeholder"
    @click="state.showPicker = true"
  >
    <template #button>
      <div v-if="timeBucket" @click.stop.prevent>
        <field-picker
          v-model="state.apValue"
          v-bind="$attrs"
          :default-value="state.apValue"
          :required="false"
          :border="false"
          value-key="label"
          field-key="value"
          :columns="timeBucketColumns"
          placeholder="请选择时间段"
        />
      </div>
    </template>
  </van-field>

  <van-popup v-model:show="state.showPicker" position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      v-bind="$attrs"
      :type="type"
      :formatter="formatter"
      @confirm="onConfirm"
      @cancel="state.showPicker = false"
    />
  </van-popup>
</template>

<script lang="ts">
  /**
   * @name: field-picker
   * @author:卜启缘
   * @date: 2021/5/10 13:35
   * @description：field-picker
   * @update: 2021/5/10 13:35
   */
  import { reactive, defineComponent, PropType, computed, watch } from 'vue';
  import { useVModel } from '@vueuse/core';
  import dayjs from 'dayjs';
  import FieldPicker from '@/components/field-picker.vue';

  interface ColumnsKV {
    label: string;
    value: string;
  }

  export default defineComponent({
    name: 'FieldDatetimePicker',
    components: { FieldPicker },
    props: {
      modelValue: [String, Date],
      timeBucket: [String], // 时间段，上下午
      type: String as PropType<
        'date' | 'time' | 'year-month' | 'month-day' | 'datehour' | 'datetime'
      >,
      name: String,
      label: String,
      valueKey: String, // 显示给用户看的值
      fieldKey: String, // 选择某项后label对应的value
      placeholder: String,
      format: String,
      isShowWeek: Boolean,
      timeBucketColumns: {
        // 时间段columns
        type: Array as PropType<ColumnsKV[]>,
        default: () => [
          {
            label: '上午',
            value: 'AM',
          },
          {
            label: '下午',
            value: 'PM',
          },
        ],
      },
    },
    emits: ['update:modelValue', 'update:timeBucket', 'confirm'],
    setup(props, { emit }) {
      const state = reactive({
        value: useVModel(props, 'modelValue', emit),
        apValue: useVModel(props, 'timeBucket', emit),
        text: '',
        showPicker: false,
      });
      const currentDate = computed({
        get: () => new Date(props.modelValue || Date.now()),
        set: () => ({}),
      });
      console.log(props.modelValue + ':', currentDate.value);

      const formatDate = (value) => (props.format ? dayjs(value).format(props.format) : value);

      const text = computed(() => {
        return props.isShowWeek && state.text
          ? `${state.text}（星期${'天一二三四五六'.charAt(
              new Date(state.text.replace(/-/g, '/')).getDay(),
            )}）`
          : state.text;
      });

      watch(
        () => props.modelValue,
        (value) => {
          state.text = value ? formatDate(value) : '';
        },
        { immediate: true },
      );

      const formatter = (type, val) => {
        if (type === 'year') {
          return val + '年';
        }
        if (type === 'month') {
          return val + '月';
        }
        if (type === 'day') {
          return val + '日';
        }
        if (type === 'hour') {
          return val + '时';
        }
        if (type === 'minute') {
          return val + '分';
        }
        return val;
      };

      const onConfirm = (value) => {
        state.text = props.format ? dayjs(value).format(props.format) : value;
        state.value = state.text;
        state.showPicker = false;
        emit('confirm', state.text);
      };

      return {
        state,
        currentDate,
        text,
        formatter,
        onConfirm,
      };
    },
  });
</script>

<style lang="scss" scoped>
  :deep(.van-field__button) {
    flex-shrink: unset;
    .van-field {
      padding: 0;
    }
  }
</style>
