import Navigation from "../component/Navigation";

const Home = () => {
  return (
    <div className="flex">
      <Navigation />
      <main className="p-6 flex-1">
        <h2 className="text-2xl font-bold mb-4">Welcome to the Home Page</h2>
        <p>This is the main content area.</p>
      </main>
    </div>
  );
};

export default Home;