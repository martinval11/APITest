'use client';

import { FormEvent, useRef, useState } from 'react';
import RequestOutput from '../RequestOutput/Index';
import request from '@/app/lib/request';

const RequestForm = () => {
  const [method, setMethod] = useState('GET');
  const [output, setOutput] = useState('');
  const urlRef = useRef<HTMLInputElement>(null);

  const doRequest = async (event: FormEvent) => {
    event.preventDefault();

    if (method === 'GET') {
      const response: any = await request(urlRef.current?.value || '');
      setOutput(response);
    }

    if (method === 'POST') {
      const response: any = await request(urlRef.current?.value || '', {
        method: 'POST',
      });
      setOutput(response);
    }
  };

  return (
    <>
      <form onSubmit={doRequest}>
        <select
          name="method"
          value={method}
          onChange={(event) => setMethod(event.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>

        <label>
          <span>URL</span>
          <input type="url" name="send request" ref={urlRef} required />
        </label>
        <input type="submit" value="Send" />
      </form>

      <RequestOutput output={output} />
    </>
  );
};

export default RequestForm;
