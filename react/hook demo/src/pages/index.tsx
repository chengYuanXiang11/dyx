import { useDictAsOption, useWindowsSize } from '@/hooks';
import { getHeroList } from '@/services/api';
import { Spin } from 'antd';
import React from 'react';
import { useRequest } from 'umi';
import styles from './index.less';

export default function IndexPage() {

  const { data = [], loading } = useRequest(getHeroList)
  const windowSize = useWindowsSize()
  const tagList = useDictAsOption('tags')
  const brandList = useDictAsOption('brand')

  return (
    <div>
      <div style={{ width: 200, minHeight: 80, margin: 50, border: '1px solid #ddd' }}>
        <Spin spinning={loading}>
          <ul >
            {data.map(item => (
              <li key={item.id}>{item.name} -- {item.price}</li>
            ))}
          </ul>
        </Spin>
      </div>

      <div>
        <h2>当前窗口宽高：</h2>
        <h3>缩放窗口试试^.^</h3>
        <p>width：{windowSize.width}</p>
        <p>height：{windowSize.height}</p>
      </div>

      <div className={styles.flexBox}>
        <div className={styles.cell}>
          <h2>标签分类选项</h2>
          <ul>
            {tagList.map(item => (
              <li key={item.value}>页面显示：{item.label}，对应数据库：{item.value}</li>
            ))}
          </ul>
        </div>
        <div className={styles.cell}>
          <h2>品牌分类选项</h2>
          <ul>
            {brandList.map(item => (
              <li key={item.value}>页面显示：{item.label}，对应数据库：{item.value}</li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
