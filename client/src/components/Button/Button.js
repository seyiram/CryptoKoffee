import React from 'react'

const Button = (props) => {
    return (
        <button className='bg-cryptokoffee text-white py-2 px-6 rounded-3xl md:ml-8 hover:bg-cryptokoffee-400 duration-500'><a href="/#">{props.children}</a></button>
    )
}

export default Button