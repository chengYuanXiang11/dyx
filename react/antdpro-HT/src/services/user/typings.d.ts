declare namespace API{
    type User = {
        // 权限 (老板 | 董事 | 管理 | 用户)
        power: 'boss' | 'director' | 'admin' | 'user',
        userName: string,
        passWord: string,
    }
}