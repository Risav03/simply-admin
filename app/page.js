import Navbar from "@/components/UI/navbar";
import Image from "next/image";
import RaffleComponent from "@/components/RaffleStuff/raffleComponent";

export default function Home() {
  return (
    <main className=" p-12 text-white">
      <Navbar/>
      <h1 className="text-6xl font-bold">SIMPLY Raffle Panel</h1>

    <div className="mt-5">
      <h1 className="text-white text-3xl font-bold">$SIMPLE Raffle</h1>
      <div className="grid grid-flow-col grid-cols-4 gap-5 mt-5">
        <RaffleComponent number={1} />
        <RaffleComponent number={2} />
        <RaffleComponent number={3} />
        <RaffleComponent number={4} />
      </div>
<hr className="my-10 border-4 border-white"></hr>
      <h1 className="text-white text-3xl mt-5 font-bold">$MATIC Raffle</h1>
      <div className="grid grid-flow-col grid-cols-4 gap-5 mt-5">
        <RaffleComponent number={5} />
        <RaffleComponent number={6} />
        <RaffleComponent number={7} />
        <RaffleComponent number={8} />
      </div>
    </div>


    </main>
  );
}
