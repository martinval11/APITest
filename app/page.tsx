import Nav from './components/Nav/Nav';
import RequestForm from './components/RequestForm/Index';
import styles from './page.module.css';

const Home = () => {
  return (
    <>
      <Nav />
      <main className={styles.container}>
        <section className={styles.section}>
          <RequestForm />
        </section>
      </main>
    </>
  );
};

export default Home;
