import React from 'react';
import logo from '../../assets/img/cryptokoffee_cup.png'

const UserProfilePage = () => {
  return (
    <div className=" md:w-[80%] w-full rounded flex justify-center items-center overflow-hidden mt-10 md:ml-32 ">
      <span className="absolute md:top-40 md:right-[15%] right-14 top-[42rem]  px-3 py-3 shadow-lg  text-xl rounded-full flex justify-center items-center cursor-pointer"><ion-icon name="share-outline"></ion-icon></span>
      <div className="bg-white md:p-3 md:w-[80%] rounded  mt-20  md:ml-48 shadow flex justify-center items-center flex-col w-full m-10">
        <div className="flex flex-col justify-center items-center md:mt-10 mb-6 mt-5">
          <p className="text-lg text-gray-800 mt-5 hover:underline hover:decoration-2 hover:decoration-cryptokoffee-purple hover:text-cryptokoffee"><a href="#/">cryptokoffee.co/0x94374</a></p>
          <span className="mt-5 text-3xl text-cryptokoffee rotate-45 hover:text-cryptokoffee-purple"><a href="http://twitter.com/cryptokoffeee"><ion-icon name="link-outline"></ion-icon></a></span>
        </div>
        <div className="flex flex-col items-center justify-center md:m-5 m-5 gap-10">
          <div className="md:w-[50%] w-full border border-1 border-slate-100 h-auto rounded p-5">
            <p className="text-gray-500 ">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi distinctio, ab totam alias aspernatur facilis nihil voluptatem sint commodi obcaecati quod qui fugiat quibusdam, ad deleniti quos sequi possimus at! Lorem</p>
          </div>
          <div className=" md:w-[60%] w-full p-1 flex md:justify-evenly gap-2 md:flex-row md:flex-nowrap flex-wrap justify-center items-center">
            <button className="bg-cryptokoffee-400 md:w-24 w-32 rounded-sm p-2 text-center cursor-pointer shadow hover:bg-cryptokoffee focus:bg-cryptokoffee focus:text-white hover:text-white text-slate-900 ">
              <span className="text-xs ">Platinum Fan</span>
              <p className="text-lg ">$50</p>
            </button>
            <button className="bg-cryptokoffee-400 md:w-24 w-32 rounded p-2 text-center cursor-pointer shadow focus:bg-cryptokoffee focus:text-white hover:text-white hover:bg-cryptokoffee text-slate-900">
              <span className="text-xs">Gold Fan</span>
              <p className="text-lg">$25</p>
            </button>
            <button className="bg-cryptokoffee-400 hover:bg-cryptokoffee focus:bg-cryptokoffee text-slate-900 focus:text-white hover:text-white md:w-24 w-32 rounded p-2 text-center cursor-pointer shadow">
              <span className="text-xs">Silver Fan</span>
              <p className="text-lg ">$10</p>
            </button>
            <button className="bg-cryptokoffee-400 hover:bg-cryptokoffee focus:bg-cryptokoffee text-slate-900 focus:text-white hover:text-white md:w-24 w-32 rounded p-2 text-center shadow cursor-pointer">
              <span className="text-xs ">Bronze Fan</span>
              <p className="text-lg">$5</p>
            </button>
          </div>
          <div>
            <div className="mb-5">
              <p className="mb-2 text-slate-900 text-sm">Enter a custom amount or select a donation level above</p>
              <label htmlFor="#custom-amount" className="mr-5">Custom Amount</label>
              <span className="absolute px-4 md:mt-4 mt-10 items-center text-sm">$</span>
              <input id="custom-amount" placeholder=" 0.00" className="px-4 py-1 pl-4 border rounded-md m-2 focus:border-cryptokoffee focus:outline-none " />
            </div>
            <div>
              <label className=" mr-[6.8rem]">Name</label>
              <input placeholder="(Optional)" className="border rounded focus:border-cryptokoffee-400 outline-none px-4 py-1" />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-gray-800 text-sm mb-2">Message to Creator (optional)</label>
            <textarea className="text-sm border rounded p-1 focus:border-cryptokoffee-400 focus:outline-none md:max-w-[95%] w-full pl-2" rows="5" cols="50" placeholder="Hey, good job!"></textarea>
          </div>
          <button className="border bg-cryptokoffee text-white rounded px-4 py-2 focus:bg-cryptokoffee-400 hover:bg-cryptokoffee-400">Donate</button>
          
          <div className="mt-10 ">
          <p className="mb-6">Recent Supporters</p>
            <div className="flex gap-5 border items-center p-5 rounded ">
            <img className="w-5" src={logo} alt="logo" />
            <p><span className="text-blue-400 mr-5">0x96838</span> Donated $5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePage