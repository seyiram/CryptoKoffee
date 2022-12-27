import React from 'react';
import Button from './Button';

const UserInfoPageModal = ({ setPageModalOn, setChoice }) => {

    const handleModalSave = () => {
        console.log("clicked save button")
        setChoice(true);
        setPageModalOn(false);
    }
    const handleImageUpload = () => {
        console.log("Image Upload clicked")
    }
    return (
        <div className="bg-transparent backdrop-blur-[5px] fixed inset-0 z-50 opacity-[98%] border-cryptokoffee-400">
            <div className="flex h-screen justify-center items-center">
                <div className="bg-white py-12 px-24 rounded-xl m-10">
                    <div className="flex-col justify-center items-center">
                        <span onClick={handleImageUpload} className=" text-3xl items-center flex justify-center cursor-pointer rounded-lg  border-3 border-slate-700"><ion-icon className=" " name="camera-outline"></ion-icon></span>
                        <p className="text-sm mt-2 text-red-400 items-center flex justify-center text-center">Please upload a picture/avatar</p>
                    </div>
                    <div className="mt-10">
                        <label className='block '>
                            <span className="after:content-['x] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">CryptoKoffee username </span>
                            <input type="text" name="link" className="form-input mt-1 px-5 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-cryptokoffee-400 focus:ring-cryptokoffee-400 block w-full rounded-md sm:text-sm focus:ring-1" placeholder='cryptokoffee.com/jake123' />
                        </label>
                        <label className='block mt-5'>
                            <span className="after:content-['x] after:ml-0.5 after:text-red-500 block text-sm font-medium text-slate-700">Website or social media link</span>
                            <input type="text" name="link" className="form-input mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-cryptokoffee-400 focus:ring-cryptokoffee-400 block w-full rounded-md sm:text-sm focus:ring-1" placeholder='twitter.com/cryptokoffeee' />
                        </label>
                        <div className="flex justify-center items-center mt-5 w-[90%]">
                            <Button><span onClick={handleModalSave}>Save</span></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfoPageModal;