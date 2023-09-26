import RequestForm from './components/RequestForm/Index';

const Home = () => {
  return (
    <>
      <header>
        <h1>HTTPX</h1>
        <p>HTTP request maker</p>
      </header>

      <section>
        <RequestForm />
      </section>
    </>
  );
};

export default Home;
