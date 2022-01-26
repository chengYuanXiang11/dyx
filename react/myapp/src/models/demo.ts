import { useState, useCallback } from 'react';

export default () => {
  const [counter2, setCounter2] = useState('全局简单数据流');
  const [counter, setCounter] = useState(0);
  const increment = useCallback(() => setCounter((c) => c + 1), []);
  const decrement = useCallback(() => setCounter((c) => c - 1), []);
  return { counter,counter2, increment, decrement };
};