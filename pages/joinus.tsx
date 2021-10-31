import type { NextPage } from 'next'
import { useEffect, useState } from 'react';
import { Home } from '../containers/Home';
import { Register } from '../containers/Register';

const JoinUs: NextPage = () => {
  const [accessToken, setToken] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        setToken(token);
      }
    }
  }, []);

  return (accessToken ? <Home setToken={setToken} /> : <Register setToken={setToken} />)
}

export default JoinUs