import { Hero, Features, HowItWorks } from "@/components/home";

const Home = () => {
  return (
    <div className="w-full max-w-screen-lg relative flex-1 flex flex-col items-center gap-32 pt-8 pb-16">
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
};

export default Home;
