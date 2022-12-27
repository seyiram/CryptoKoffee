import React from 'react'
import aboutImg from '../../assets/img/about_img.jpg'
const About = () => {
    return (
        <div className="p-20 flex justify-center ">
            <div className="bg-white max-w-xl shadow-lg mt-10 flex md:flex-row flex-col rounded  ">
                <img className="min-w-[50%] rounded-tl md:rounded-bl md:rounded-tr-none rounded-tr object-cover" src={aboutImg} alt="about" />
                <div className=" md:w-[50%] flex flex-col justify-center items-center p-10 m-2">
                    <p className="font-rouge-script font-semibold text-3xl">Hey!</p>
                    <p className=" text-lg mt-5 md:whitespace-nowrap ">Welcome to CryptoKoffee</p>
                    <p className="text-sm mt-5 ">We're driven by the idea that fans should be able to support their favorite creators with cryptocurrency in just a couple of clicks, and CryptoKoffee is our contribution to this cause.</p>
                    <p className="text-sm mt-5 ">If you want to help us in any way or just want to chat, send an email to cryptokoffee2@gmail.com and we'll respond promptly.</p>
                </div>
            </div>
        </div>
    )
}

export default About