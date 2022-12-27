
import cardImg from '../../assets/img/card__image.jpg'
import Button from 'components/Button/Button';
import { connectToWallet } from 'hooks/Wallet';

/* import WalletModal from './WalletModal';
 import { useModal } from '../contexts/ModalContext';
 import PersonalPageModal from '../../components/UserInfoPageModal/UserInfoPageModal';
**/

const WelcomeCard = () => {
    /* const { walletModalOn, pageModalOn, setWalletModalOn, setPageModalOn, setChoice, handleWalletToggleModal, handlePageToggleModal } = useModal();
    */

    return (
        <div className='p-10 flex justify-center '>
            <div className='rounded overflow-hidden shadow-lg mt-20 bg-white'>
                <img src={cardImg} alt="card" className="w-full object-cover h-32 sm:h-48" />
                <div className='flex justify-center items-center flex-col m-3'>
                    <div className=" md:text-3xl mb-2 text-center text-slate-900 font-Gilroy-Black antialised">Welcome to CryptoKoffee</div>
                    <p className='text-zinc-500 md:text-base text-sm text-center m-2'>Receive support from your fans </p>
                    <p className="text-zinc-500 md:text-base text-sm text-center w-[90%]">Accept donations directly to your wallet with CryptoKoffee</p>
                </div>
                <div className="grid md:grid-cols-2 gap-2 justify-center place-items-center m-8 text-sm ">
                    <span className="px-1 md:whitespace-nowrap"> <Button ><span onClick={connectToWallet}>Connect Wallet</span></Button></span>
                    <span className='px-1 md:whitespace-nowrap'><Button><span>Start My Page</span></Button></span>
                </div>
            </div>
            {/* {walletModalOn && <WalletModal setWalletModalOn={setWalletModalOn} setChoice={setChoice} />}
            {pageModalOn && <PersonalPageModal setPageModalOn={setPageModalOn} setChoice={setChoice} />} */}
        </div>
    )
}

export default WelcomeCard