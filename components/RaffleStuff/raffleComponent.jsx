"use client"

import {ethers} from "ethers"
import { useState, useEffect } from 'react'
import raffleabi from "@/utils/raffleabi";
import erc721abi from "@/utils/erc721abi";
import { InfinitySpin, MutatingDots } from "react-loader-spinner"


import Image from "next/image"


export default function RaffleComponent({number}){

    const raffleAdd = "0xe3B1ccCA0eA2B8461B2976618Aa667d6254B5609";

    const[contractAdd, setContractAdd] = useState("");
    const[tokenId, setTokenId] = useState(null);
    const [limitPerWallet, setLimitPerWallet] = useState(null);
    const [allowedTickets, setAllowedTickets] = useState(null);
    const [cost, setcost] = useState(null);

    const [loading, setLoading] = useState(false);

    const [winner, setWinner] = useState("");

    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [ticketsSold, setTicketsSold] = useState(0);
    const [entrants, setEntrants] = useState(0);
    const [itemExists, setItemExists] = useState(false);

    function handleContractAddress(e){
        setContractAdd(e.target.value);
    }

    function handleTokenId(e){
        setTokenId(e.target.value);
    }

    function handleLimitPerWallet(e){
      setLimitPerWallet(e.target.value);
  }

  function handleAllowedTickets(e){
    setAllowedTickets(e.target.value);
}

function handleCost(e){
  setcost(e.target.value);
}

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

    async function setRaffle(number){
      try{
        const contract = await raffleContract();

        if(number < 5){
            const txn = contract.setSimpleRaffleItem(number, contractAdd, limitPerWallet, tokenId, allowedTickets, ethers.utils.parseEther(String(cost)));
            txn.wait().then(()=>{
              setLoading(false);
              window.location.reload();
            })
        }

        else{
          const txn = contract.setMaticRaffleItem(number, contractAdd, limitPerWallet, tokenId, allowedTickets, ethers.utils.parseEther(String(cost)));
          txn.wait().then(()=>{
            setLoading(false);
            window.location.reload();

          });
        }
      }
      catch(err){
        console.log(err);
      }
    }

    async function setERC721Contract(){
      try{

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const contract1 = new ethers.Contract(raffleAdd, raffleabi, signer);
        const address = await contract1?.raffleContract(number);
        console.log(address);
        if(address.toUpperCase() == "0X0000000000000000000000000000000000000000"){
          const contract = new ethers.Contract(contractAdd, erc721abi, signer);
          return contract
        }

        else{
          const contract = new ethers.Contract(address, erc721abi, signer)
          return contract;

        }
      }
      catch(err){
        console.log(err);
      }
    }

    async function deleteRaffle(){
      try{
        const contract = await raffleContract();
        console.log(number);
        contract.deleteRaffle(number);

      }
      catch(err){
        console.log(err);
      }
    }

    async function declareWinner(){
      try{ 
        
        const contract = await raffleContract();

        if(Number(await contract?.totalEntrants(number)) > 0){
  
            const winner = await contract?.declareWinner(number);
            winner.wait().then(async (res)=>{

              setWinner(await contract?.winningAddress(number));
            });  
    
          }
      

        
      }
      catch(err){
        console.log(err);
      }
    }

    async function checkRaffleItem(number){
      try{
        const contract1 = await raffleContract();
        console.log(contract1);

        const limit = Number(await contract1?.ticketLimitPerWallet(number));
        if(limit != 0){
          setItemExists(true);
          
          const contract2 = await setERC721Contract();
          console.log(contract2);
          setWinner(await contract1.winningAddress(number));
          const tokenId = Number(await contract1?.raffleTokenId(number)) ;
          const tokenURI = await contract2.tokenURI(tokenId);

          if(tokenURI[0] == "h"){

                    const metadata = tokenURI;

                    const meta = await fetch(metadata);
                    const json = await meta.json();
                    const name = json["name"];
                    const image = json["image"];
                    const newimage = `https://ipfs.io/ipfs/${image.substr(7)}`
    
                    console.log(newimage);
        
                    setWinner(await contract1.winningAddress(number));
                    setTicketsSold(Number(await contract1?.ticketsSold(number)));
                    setEntrants(Number(await contract1?.totalEntrants(number)));
                    setName(name);
                    setImage(newimage);

                }

                else{
                    const metadata = `https://ipfs.io/ipfs/${tokenURI.substr(7)}`;
                    
                    const meta = await fetch(metadata);
                    const json = await meta.json();
                    const name = json["name"];
                    const image = json["image"];
                    const newimage = `https://ipfs.io/ipfs/${image.substr(7)}`
    
                    console.log(newimage);
        
                    setWinner(await contract1.winningAddress(number));
                    setTicketsSold(Number(await contract1?.ticketsSold(number)));
                    setEntrants(Number(await contract1?.totalEntrants(number)));
                    setName(name);
                    setImage(newimage);
                }
        }

      }
      catch(err){
        console.log(err);
      }
    }


    async function approval(){
      setLoading(true);
        try {
        const contract = await setERC721Contract();
        const approval = await contract?.approve(raffleAdd, tokenId);

        approval.wait().then((res)=>{
            setRaffle(number);
        });



        }
        catch (err) {
        console.log("Error", err);
        setLoading(false);
        //   Swal.fire({
        //     title: 'Error!',
        //     text: 'Couldn\'t get fetching contract',
        //     imageUrl: error,
        //     imageWidth: 200,
        //     imageHeight: 200,
        //     imageAlt: "Taco OOPS!",
        //     confirmButtonText: 'Bruh 😭',
        //     confirmButtonColor: "#facc14",
        //     customClass: {
        //       container: "border-8 border-black",
        //       popup: "bg-white rounded-2xl border-8 border-black",
        //       image: "-mb-5",
        //       confirmButton: "w-40 text-black"
        //     }
        //   })
        }

    }

    useEffect(()=>{
      checkRaffleItem(number);
    },[])


    return(
        <div className=" text-black">
            <h1 className='text-white text-2xl font-bold py-2 bg-blue-500 px-6  w-fit mx-auto border-b-0 '>RAFFLE - {number}</h1>
            <div className='  bg-amber-400 p-5 w-full flex flex-col items-center justify-center '>


          {itemExists ?<div className='w-[100%] text-center'>
            <div className="w-60 h-60 mb-5 mx-auto border-2 border-white bg-white">
                <Image width={1920} height={1080} className=' mb-4 mx-auto' alt='Raffle Item' src={image}></Image>
                </div>
            <h2 className='text-black text-3xl'>{name}</h2>
            <div>
              <h2>Entrants: {entrants} </h2>
              <h2>Tickets Sold: {ticketsSold}</h2>
              <h2 className='text-sm truncate'>{winner}</h2>
              <button onClick={declareWinner} className='bg-blue-400 mx-2 text-white py-2 px-4  my-2 text-[1.5rem]'>Declare Winner!</button>
              <button onClick={deleteRaffle} className='bg-red-400 mx-2 text-white py-2 px-4  my-2 text-[1.5rem]'>Delete Raffle</button>
            </div>

          </div> :  <div>
            
              <div className='flex flex-wrap flex-row items-center w-full gap-5'>
                  <div className='w-full'>
                      <h3 className='text-black text-base font-bold'>Contract Add.</h3>
                      <input onChange={handleContractAddress} value={contractAdd} type="text" className='px-4 h-12 w-full bg-white text-lg ' />
                  </div>

                  <div className='w-full'>
                      <h3 className='text-black text-base font-bold'>TokenID</h3>
                      <input onChange={handleTokenId} value={tokenId} type="text" className='px-4 h-12 w-full bg-white text-lg ' />
                  </div>

                  <div className='w-full'>
                      <h3 className='text-black text-base font-bold'>Limit Per Wallet</h3>
                      <input onChange={handleLimitPerWallet} value={limitPerWallet} type="text" className='px-4 h-12 w-full bg-white text-lg ' />
                  </div>

                  <div className='w-full'>
                      <h3 className='text-black text-base font-bold'>Total Allowed Tickets</h3>
                      <input onChange={handleAllowedTickets} value={allowedTickets} type="text" className='px-4 h-12 w-full  bg-white text-lg ' />
                  </div>

                  <div className='w-full'>
                      <h3 className='text-black text-base font-bold'>{number > 4 ? "$MATIC": "$SIMPLE"} Cost per Ticket</h3>
                      <input onChange={handleCost} value={cost} type="text" className='px-4 h-12 w-full bg-white text-lg ' />
                  </div>
              </div>
              {loading ? <InfinitySpin className="mx-auto" visible={true} width="200" color="#0bb502" ariaLabel="infinity-spin-loading" /> : <button onClick={()=>{
                
                  approval();
              }} className=' mt-5 font-bold w-full text-xl hover:bg-green-500 transition-all scale-110 duration-300 cursor-pointer bg-green-600 text-white px-4 py-2 '>Set Raffle</button>}
              
          </div>}
            </div>
{}
        </div>
    )
}