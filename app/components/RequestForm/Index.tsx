'use client';

import { FormEvent, useRef, useState } from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { Toaster, toast } from 'sonner';

import RequestOutput from '../RequestOutput/Index';
import request from '@/app/lib/request';

import styles from './styles.module.css';

const RequestForm = () => {
  const [method, setMethod] = useState('GET');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  // Params
  //const [params, setParams]: any = useState([]);
  const paramName = useRef<HTMLInputElement>(null);
  const paramValue = useRef<HTMLInputElement>(null);

  // Body
  const bodyRef: any = useRef<HTMLTextAreaElement>(null);

  // Headers
  const [headers, setHeaders]: any = useState([]);
  const headerName: any = useRef<HTMLInputElement>(null);
  const headerValue: any = useRef<HTMLInputElement>(null);

  const urlRef: any = useRef<HTMLInputElement>(null);

  async function req(url: string, method: string) {
    try {
      const data = JSON.parse(bodyRef.current?.value || null);
      const response: any = await request(url, {
        method: method,
        headers: { ...(headers || undefined) },
        body: JSON.stringify(data || undefined),
      });
      setOutput(response);
    } catch (error) {
      alert('Invalid Request');
    }
  }

  const doRequest = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // if the user has written a body, then set the Content-Type to application/json automatically
    if (bodyRef.current?.value !== '') {
      setHeaders({
        ...headers,
        'Content-Type': 'application/json',
      });
    }

    switch (method) {
      case 'GET':
        req(urlRef.current?.value, 'GET');
        break;
      case 'POST':
        req(urlRef.current?.value, 'POST');
        break;
      case 'PUT':
        req(urlRef.current?.value, 'PUT');
        break;
      case 'DELETE':
        req(urlRef.current?.value, 'DELETE');
        break;
      case 'PATCH':
        req(urlRef.current?.value, 'PATCH');
        break;
      default:
        toast.error('Request type error');
        break;
    }
    setLoading(false);
  };

  const addHeader = () => {
    setHeaders({
      ...headers,
      [headerName.current?.value]: headerValue.current?.value,
    });
    toast.success('Header added!');
  };

  const addParams = () => {
    if (urlRef.current.value.includes('?')) {
      urlRef.current.value = urlRef.current?.value.concat(
        `&${paramName.current?.value}=${paramValue.current?.value}`
      );
      toast.success('Param added!');
      return;
    }
    urlRef.current.value = urlRef.current?.value.concat(
      `?${paramName.current?.value}=${paramValue.current?.value}`
    );
    toast.success('Param added!');
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    bodyRef.current = editor;
  };

  return (
    <>
      <Toaster richColors />
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

        <details className={styles.details}>
          <summary>Parameters</summary>
          <header>
            <small>Query Parameters</small>
            <button className={styles.addParamButton} onClick={addParams}>
              Add Parameter
            </button>
          </header>

          <div>
            <input type="text" placeholder="Parameter Name" ref={paramName} />
            <input type="text" placeholder="Value" ref={paramValue} />
          </div>
        </details>
        <details className={styles.monacoDetailsContainer}>
          <summary>Body</summary>
          <Editor
            width="100%"
            height="250px"
            defaultLanguage="json"
            onMount={handleEditorDidMount}
            theme="vs-dark"
            value={bodyRef.current?.value || null}
            onChange={(value) => {
              bodyRef.current.value = value;
            }}
            options={{
              minimap: { enabled: false },
              tabSize: 2,
            }}
          />
        </details>

        <details className={styles.details}>
          <summary>Headers</summary>
          <header>
            <small>Header List</small>
            <button className={styles.addParamButton} onClick={addHeader}>
              Add Header
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
