export const utils = {
    data() {
        return {
            fields: [],
        };
    },
    methods: {
        genID() {
            let qutient = (new Date() - new Date('2020-08-01'))
            qutient += Math.ceil(Math.random() * 1000) // 防止重複
            const chars = '0123456789ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz';
            const charArr = chars.split("")
            const radix = chars.length;
            const res = []
            do {
                let mod = qutient % radix;
                qutient = (qutient - mod) / radix;
                res.push(charArr[mod])
            } while (qutient);
            return res.join('')
        },
    }
}
