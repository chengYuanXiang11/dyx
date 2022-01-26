import React,{useState } from 'react';
import { useRequest } from 'ahooks';
import * as ajx from '../common/Api/modules/api'
export default function Hook() {
    const [state, setState] = useState('');
    const { loading, run } = useRequest(ajx.sendSms, {
        manual: true,
        onSuccess: (result, params) => {
            console.table(result)
            console.log(params)
        },
    });
    return (
        <div>
            <input
                onChange={(e) => setState(e.target.value)}
                value={state}
                placeholder="Please enter username"
                style={{ width: 240, marginRight: 16 }}
            />
            <button disabled={loading} type="button" onClick={() => run(state)}>
                {loading ? 'loading' : 'Edit'}
            </button>
        </div>
    );
}
