import type { UserConfig, ConfigEnv } from 'vite';
import { loadEnv } from 'vite';
import vueJsx from '@vitejs/plugin-vue-jsx';
import legacy from '@vitejs/plugin-legacy';
// import { VantResolver } from 'unplugin-vue-components/resolvers';
// import AutoImport from 'unplugin-auto-import/vite';
// import Components from 'unplugin-vue-components/vite';
import styleImport from 'vite-plugin-style-import';
import { viteMockServe } from 'vite-plugin-mock';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

const CWD = process.cwd();

export default ({ command, mode }: ConfigEnv): UserConfig => {
  // 环境变量
  const { VITE_BASE_URL, VITE_DROP_CONSOLE } = loadEnv(mode, CWD);

  const isBuild = command === 'build';

  return {
    base: VITE_BASE_URL,
    esbuild: {
      // target: 'es2015'
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src'),
        },
      ],
    },
    plugins: [
      vue(),
      vueJsx({
        // options are passed on to @vue/babel-plugin-jsx
      }),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      // AutoImport({
      //   resolvers: [VantResolver()],
      // }),
      // Components({
      //   resolvers: [VantResolver()],
      // }),
      styleImport({
        // 一、手动的按需导入，需手动import组件
        libs: [
          {
            libraryName: 'vant',
            esModule: true,
            resolveStyle: (name) => `vant/es/${name}/style`,
          },
        ],
      }),
      viteMockServe({
        ignore: /^\_/,
        mockPath: 'mock',
        localEnabled: !isBuild,
        prodEnabled: isBuild,
        logger: true,
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';

          setupProdMockServer();
          `,
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {},
          javascriptEnabled: true,
        },
        scss: {
          additionalData: `@import "src/styles/vw-rem/_util.scss";
                       @import "src/styles/vw-rem/_border.scss";
                       @import "src/styles/func.scss";`,
        },
      },
      // TODO 构建包含@charset问题 https://github.com/vitejs/vite/issues/5833
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === 'charset') {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    server: {
      port: 8888,
      proxy: {
        '/api': {
          // 免费的在线REST API
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    optimizeDeps: {
      include: ['vant', '@vant/touch-emulator'],
      exclude: ['vue-demi'],
    },
    build: {
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: Object.is(VITE_DROP_CONSOLE, 'true'),
        },
      },
    },
  };
};
