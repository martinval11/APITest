'use client';

import { FormEvent, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

import RequestOutput from '../RequestOutput/Index';
import { req } from '@/app/lib/reqFrontend';

import styles from './styles.module.css';
import DelIcon from '../DelIcon';

const RequestForm = () => {
  const [method, setMethod] = useState('GET');
  const [output, setOutput]: any = useState('');
  const [loading, setLoading] = useState(false);

  // Params
  const [params, setParams]: any = useState([]);
  const paramName: any = useRef<HTMLInputElement>(null);
  const paramValue: any = useRef<HTMLInputElement>(null);

  // Body
  const bodyRef: any = useRef<HTMLTextAreaElement>(null);

  // Headers
  const [headers, setHeaders]: any = useState([]);
  const [headerList, setHeaderList]: any = useState([]);
  const headerName: any = useRef<HTMLInputElement>(null);
  const headerValue: any = useRef<HTMLInputElement>(null);

  const urlRef: any = useRef<HTMLInputElement>(null);

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

    const currentUrl = urlRef.current.value;
    const body = bodyRef.current?.value;

    const response = await req(currentUrl, method, headers, body);
    try {
      const formattedResponse = JSON.stringify(
        JSON.parse(response),
        undefined,
        2
      );
      setOutput(formattedResponse);
    } catch {
      setOutput(response);
    }

    setLoading(false);
  };

  const addHeader = () => {
    setHeaderList([
      ...headerList,
      { [headerName.current?.value]: headerValue.current?.value },
    ]);
  };

  const addParams = () => {
    setParams([
      ...params,
      { [paramName.current?.value]: paramValue.current?.value },
    ]);
  };

  const handleEditorDidMount = (editor: any) => {
    bodyRef.current = editor;
  };

  return (
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

        {params.map((index: number) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Parameter Name"
              ref={paramName}
              className={urlRef.current?.value}
              onChange={(event) => {
                // cache the url
                let url = event.target.className;
                if (url.includes('?')) {
                  url = url.concat('&');
                  urlRef.current.value = `${url}${paramName.current?.value}`;
                  return
                }
                url = url.concat('?');
                console.log('url:', url);
                urlRef.current.value = `${url}${paramName.current?.value}`;
              }}
            />
            <input
              type="text"
              placeholder="Value"
              ref={paramValue}
              className={urlRef.current.value}
              onChange={(event) => {
                // cache the url
                let url = event.target.className
                if (url.includes('?')) {
                  url = url.concat('&');
                  urlRef.current.value = `${url}${paramName.current?.value}=${paramValue.current?.value}`;
                  return
                }
                url = url.concat('?');
                console.log('url:', url);
                urlRef.current.value = `${url}${paramName.current?.value}=${paramValue.current?.value}`;
              }}
            />
            <button
              className={styles.addParamButton}
              onClick={() => {
                setParams(params.filter((item: any) => item !== index));
              }}
            >
              <DelIcon />
            </button>
          </div>
        ))}
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

        {headerList.map((index: number) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Header Name"
              ref={headerName}
              onBlur={() => {
                setHeaders([
                  ...headers,
                  { [headerName.current?.value]: headerValue.current?.value },
                ]);
              }}
            />
            <input
              type="text"
              placeholder="Value"
              ref={headerValue}
              id={urlRef.current.value}
              onBlur={() => {
                setHeaders([
                  ...headers,
                  { [headerName.current?.value]: headerValue.current?.value },
                ]);
              }}
            />
            <button
              className={styles.addParamButton}
              onClick={() => {
                setHeaderList(headerList.filter((item: any) => item !== index));
                setHeaders([headers].filter((item: any) => item !== index));
              }}
            >
              <DelIcon />
            </button>
          </div>
        ))}
      </details>
      <div className={styles.loaderContainer}>
        {loading && <span className={styles.loader}></span>}
      </div>

      {output && <RequestOutput output={output} />}
    </div>
  );
};

export default RequestForm;
