/********************************自动导包 start********************************/
const allModules = import.meta.globEager('./*/index.ts')
const modules = {} as any
Object.keys(allModules).forEach((path) => {
  const fileName = path.split('/')[1]
  modules[fileName] = allModules[path][fileName] || allModules[path].default || allModules[path]
})

console.log(modules, 'vuex自动导包')
/********************************自动导包 end********************************/

// export default modules
import user from './user'

export default {
  user
}
