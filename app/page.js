"use client"

import Navbar from "@/components/UI/navbar";
import Image from "next/image";
import raffleabi from "@/utils/raffleabi";
import {useAccount} from "wagmi"
import RaffleComponent from "@/components/RaffleStuff/raffleComponent";

export default function Home() {
  const{address, isConnected} = useAccount();

  const raffleAdd = "0x74FE9CDcefff983efd68EE48fB154f6F9444a24C";


  async function raffleContract(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    try {
    const contract = new ethers.Contract(raffleAdd, raffleabi, signer);
    console.log("raffle", raffleAdd);
    return contract;
    }
    catch(err){
      console.log(err);
    }
  }

  async function withdraw(){
    try{
      const contract = await raffleContract();
      const txn = await contract.withdraw();

      txn.wait().then((res)=>{window.location.reload});
    }
    catch(err){

    }
  }

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
      { address == "0x0708a59Ea3d6e8Dd1492fc2bBDC54A82905D9f59" && <button className="bg-red-500 p-4 hover:bg-red-600 border-2 border-white">Withdraw</button>}
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
