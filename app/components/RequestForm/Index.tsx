'use client';

import { FormEvent, useRef, useState } from 'react';
import RequestOutput from '../RequestOutput/Index';
import request from '@/app/lib/request';

import styles from './styles.module.css';

const RequestForm = () => {
  const [method, setMethod] = useState('GET');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  // Params
  const [params, setParams]: any = useState([]);
  const paramName = useRef<HTMLInputElement>(null);
  const paramValue = useRef<HTMLInputElement>(null);

  // Body
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Headers
  //const [headers, setHeaders]: any = useState([]);
  const headerName = useRef<HTMLInputElement>(null);
  const headerValue = useRef<HTMLInputElement>(null);

  const urlRef = useRef<HTMLInputElement>(null);

  const doRequest = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

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
    setLoading(false);
  };

  const addParams = () => {
    setParams([...params, {
      name: paramName.current?.value,
      value: paramValue.current?.value,
    }]);
  };

  return (
    <>
      <div className={styles.formContainer}>
        <form className={styles.form} onSubmit={doRequest}>
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

          <input
            type="url"
            name="send request"
            placeholder="URL"
            className={styles.urlInput}
            ref={urlRef}
            required
          />

          <input
            type="submit"
            value="Send"
            className={styles.sendRequestButton}
          />
        </form>

        <details>
          <summary>Parameters</summary>
          <header>
            <small>Query Parameters</small>
            <button className={styles.addParamButton} onClick={addParams}>
              +
            </button>
          </header>

          <div>
            <input type="text" placeholder="Parameter Name" ref={paramName} />
            <input type="text" placeholder="Value" ref={paramValue} />
          </div>
        </details>
        <details>
          <summary>Body</summary>
          <textarea className={styles.bodyRequest} ref={bodyRef}></textarea>
        </details>
        <details>
          <summary>Headers</summary>
          <header>
            <small>Header List</small>
            <button className={styles.addParamButton}>
              +
            </button>
          </header>

          <div>
            <input type="text" placeholder="Header Name" ref={headerName} />
            <input type="text" placeholder="Value" ref={headerValue} />
          </div>
        </details>
      </div>

      {loading && <span className={styles.loader}></span>}
      {output && <RequestOutput output={output} />}
    </>
  );
};

export default RequestForm;
