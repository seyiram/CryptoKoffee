import React from 'react'

const TransactionsTable = () => {
    return (
        <div className="mt-5 mx-5">
            <p className="text-lg mb-5 mt-10">Recent Transactions</p>
            <div className="w-full overflow-hidden rounded-lg shadow-xs">
                <div className="w-full overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                <th className="px-4 py-3">DATE</th>
                                <th className="px-4 py-3">TYPE</th>
                                <th className="px-4 py-3">TRANSACTION</th>
                                <th className="px-4 py-3">AMOUNT</th>
                                <th className="px-4 py-3">STATUS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                                <td className="px-4 py-3 text-sm">June 1st 2022, 5:35PM GMT-2</td>
                                <td className="px-4 py-3 text-sm">Donation</td>
                                <td className='px-4 py-3 text-sm text-blue-400'><a href="http://etherscan.io" target="_blank" rel='noreferrer'>0x9737732..3215</a></td>
                                <td className="px-4 py-3 text-sm">$855.85</td>
                                <td className="px-4 py-3 text-xs">
                                    <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">Completed </span>
                                </td>
                            </tr>
                            <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                                <td className="px-4 py-3 text-sm">June 3rd 2022, 4:20PM GMT-2</td>
                                <td className="px-4 py-3 text-sm">Donation</td>
                                <td className='px-4 py-3 text-sm text-blue-400'><a href="http://etherscan.io" target="_blank" rel='noreferrer'>0x9537724..1133</a></td>
                                <td className="px-4 py-3 text-sm">$369.75</td>
                                <td className="px-4 py-3 text-xs">
                                    <span className="px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full">Pending</span>
                                </td>
                            </tr>
                            <tr className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                                <td className="px-4 py-3 text-sm">August 15th 2022, 9:20PM GMT-2</td>
                                <td className="px-4 py-3 text-sm">Donation</td>
                                <td className='px-4 py-3 text-sm text-blue-400'><a href="https://etherscan.io" target="_blank" rel='noreferrer'>0x9537724..1133</a></td>
                                <td className="px-4 py-3 text-sm">$775.45</td>
                                <td className="px-4 py-3 text-xs">
                                    <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">Completed </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                    <span className="flex items-center col-span-3"> Showing 1-3 of 20 </span>
                    <span className="col-span-2 text-cryptokoffee text-center"><a href="/#">view more</a></span>
                </div>
            </div>
        </div>
    )
}

export default TransactionsTable;