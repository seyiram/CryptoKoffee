import React, { useState } from 'react'
import Button from 'components/Button/Button';
import logo from '../../assets/img/cryptokoffee.svg'
// import { useModal } from '../contexts/ModalContext';
// import WalletModal from './WalletModal';


const Navbar = ({ connectToWallet }) => {
    const [openMenu, setOpenMenu] = useState(false);
    // const { walletModalOn, setWalletModalOn, setChoice, handleWalletToggleModal } = useModal();

    let Links = [
        { name: "Home", link: "/#" },
        { name: "About Us", link: "/about-us" },
        { name: "Dashboard", link: "/dashboard" }
    ]

    return (
        <nav className="shadow-sm w-full fixed flex-between z-20">
            <div className='md:flex md:bg-white bg-cryptokoffee-400 py-4 md:px-10 '>
                <div className='cursor-pointer flex items-center mx-5'>
                    <img className='w-36' src={logo} alt="logo" />
                </div>
                <div onClick={() => setOpenMenu(!openMenu)} className='text-2xl absolute right-8 top-6 cursor-pointer md:hidden'>
                    <ion-icon name={openMenu ? 'close' : 'menu'}></ion-icon>
                </div>
                <div className={`md:flex items-center justify-between w-full md:static md:bg-inherit bg-cryptokoffee-400 md:pb-0 pb-12 absolute md:z-auto z-[-1] left-0 md:pl-0 pl-9 transition-all duration-500 ease-in ${openMenu ? 'top-20 opacity-100' : 'top-[-490px] '} md:opacity-100`}>
                    <ul className=" md:flex text-md ">
                        {Links.map(link => (
                            <li key={link.name} className="md:ml-8 md:my-0 my-5">
                                <a href={link.link} className="text-slate-600 hover:text-cryptokoffee duration-500 antialiased">{link.name}</a>
                            </li>
                        ))}
                    </ul>
                    <div className="md:flex md:items-center md:flex-nowrap flex-wrap ">
                        <div className="md:text-md md:my-0 my-7">
                            <Button><span onClick={connectToWallet}>Connect Wallet</span></Button>
                        </div>
                        <div className="text-2xl md:ml-5">
                            <ion-icon name="moon-outline"></ion-icon>
                        </div>
                    </div>
                </div>
            </div>
            {/* {walletModalOn && <WalletModal setWalletModalOn={setWalletModalOn} setChoice={setChoice} />} */}
        </nav>
    )
}

export default Navbar