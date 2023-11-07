import { ConfigEnv, loadEnv } from 'vite';
import alias from './vite/alias';
import { parseEnv } from './vite/util';
import setupPlugins from './vite/plugins';

export default ({ command, mode }: ConfigEnv) => {
  const isBuild = command === 'build';
  // 获取项目根目录
  const root = process.cwd();
  // 解析env文件
  const env = parseEnv(loadEnv(mode, root));
  return {
    base: "./",
    plugins: setupPlugins(isBuild, env),
    resolve: {
      alias,
    },
    build: {
      rollupOptions: {
        // emptyOutDir: true,
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL,
          // 携带cookie
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
  };
};
