import React from 'react';


const UserAccountPage = () => {
  return (
    <div className=" md:mt-20 w-full flex justify-center items-center md:ml-48">
      <div className="md:ml-20 md:mr-20 ml-10 mr-10 w-full">
        <form className="bg-white mt-10 p-5 rounded mb-20 pb-10">
          <div className=" flex flex-col justify-center items-center">
          <div className="flex flex-col gap-5  items-center md:w-[50%]">
            <p className="text-sm text-muted">Your page address</p>
            <p className="md:text-lg text-sm hover:underline hover:decoration-2 hover:decoration-cryptokoffee-purple hover:text-cryptokoffee text-gray-800"><a href="#/">cryptokoffee.com/0x945837</a></p>
          </div>
          <div className="mb-6 mt-10">
            <label className="block text-gray-800 text-sm mb-2 text-center">About</label>
            <textarea className="text-sm border rounded p-1 pl-2 focus:border-cryptokoffee-400 focus:outline-none w-full" rows="5" cols="50" placeholder="Hey, you can support me through cryptokoffee"></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-800 text-sm mb-2 text-center">Website or social link</label>
            <input className="rounded border px-32 pl-1 py-2 focus:outline-none focus:border-cryptokoffee-400 md:w-auto w-full" />
          </div>
          <div className="flex gap-10">
            <button className="border rounded bg-cryptokoffee px-4 py-2 text-white hover:bg-cryptokoffee-400 focus:bg-cryptokoffee-400">Save</button>
            <button className="rounded border px-4 py-2">Cancel</button>
          </div>
          </div>
        </form>
      </div>

    </div>
  )
}

export default UserAccountPage;