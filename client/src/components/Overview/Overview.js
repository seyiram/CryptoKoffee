import React from 'react'
import TransactionsTable from 'components/TransactionsTable/TransactionsTable';

const Overview = () => {
    return (
        <div className="md:ml-60 w-full overflow-hidden ">
            <div className="md:mt-36 mt-10 md:ml-5 md:flex md:flex-row gap-10 justify-evenly">
                <div className="bg-purple-400 shadow-lg md:w-60 rounded-md h-40 text-white md:m-0 m-5 hover:shadow-xl">
                    <p className="flex items-center m-5"><span className="md:m-2 m-5"><ion-icon name="cash-outline"></ion-icon></span> Earnings</p>
                    <p className="text-3xl mt-5 text-center">$400.00</p>
                </div>
                <div className="bg-pink-300 text-white shadow-lg md:w-60 rounded-md h-40 md:m-0 m-5 hover:shadow-xl">
                    <p className="flex items-center m-5"><span className="md:m-2 m-5"><ion-icon name="people-outline"></ion-icon></span> Donations</p>
                    <p className="text-3xl mt-5 text-center">15</p>
                </div>
            </div>
            <TransactionsTable />
        </div>

    )
}

export default Overview;