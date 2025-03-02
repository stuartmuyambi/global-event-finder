import Hero from '../components/Hero';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen pt-16"> {/* Add padding-top to account for fixed navbar */}
      <Hero />
      
      {/* Additional sections can be added here */}
    </div>
  );
};

export default Home;