// module.exports = {
//     chainWebpack: (config: { module: { rule: (arg0: string) => { (): any; new(): any; use: { (arg0: string): { (): any; new(): any; tap: { (arg0: (options: any) => any): void; new(): any } }; new(): any } } } }) => {
//       config.module
//         .rule('vue')
//         .use('vue-loader')
//           .tap((options: any) => {
//             // 修改它的选项...
//             options.compilerOptions.isCustomElement  = (tag: string)=>tag === 'piechart'
//             return options
//           })
//     }
//   }
module.exports = {
  // module: {
  //   rules: [
  //     {
  //       test: /\.tsx?$/,
  //       loader: 'ts-loader',
  //       options: {
  //         appendTsSuffixTo: [/\.vue$/],
  //       },
  //       exclude: /node_modules/,
  //     }]
  // },
  // resolve: {
  //   extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  // },
  chainWebpack: (config: { resolve: { alias: { set: (arg0: string, arg1: string) => void } }; module: { rule: (arg0: string) => { (): any; new(): any; use: { (arg0: string): { (): any; new(): any; tap: { (arg0: (options: any) => any): void; new(): any } }; new(): any } } } }) => {
    config.resolve.alias.set('vue', '@vue/compat')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2
            }
          }
        }
      })
  }
}