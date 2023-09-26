import styles from './styles.module.css';

const RequestOutput = ({ output }: any) => {
  return (
    <pre className={styles.output}>{output}</pre>
  )
}

export default RequestOutput;
