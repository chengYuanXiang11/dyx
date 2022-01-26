/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
 console.log('执行access.tsx')

export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser } = initialState || {};
  console.log(currentUser)
  console.log(currentUser?.access)

  return {
    // canAdmin: currentUser && currentUser.access === 'admin',
    canUser:(): boolean=>{
      if(currentUser?.access === 'admin' || currentUser?.access === 'user'){
          return true
      }
      return false
    } ,
    canAdmin:(): boolean=>{
      if(currentUser?.access === 'admin'){
        return true
    }
    return false
    }
  };
}
console.log('access.tsx执行完毕')
