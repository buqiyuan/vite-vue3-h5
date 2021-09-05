/**
 * @description 按照一定路径规则批量导入文件
 * @param pathRule eg: pathRule =  './modules/*.ts'
 */
export const importAll = (pathRule: string) => {
  const allModules = import.meta.globEager(pathRule)
  const modules = {} as any
  Object.keys(allModules).forEach((path) => {
    const fileName = path.replace(/(.*\/)*([^.]+).*/gi, '$2')
    modules[fileName] = allModules[path].default
  })
  return modules
}
