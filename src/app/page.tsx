import { Hero, Features, HowItWorks } from "@/components/home";

const Home = () => {
  return (
    <div className="w-full max-w-screen-lg relative flex-1 flex flex-col items-center gap-8 py-5">
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default Home;
