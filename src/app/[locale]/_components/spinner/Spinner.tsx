import React from 'react'
const Spinner = () => {
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className="pinwheel">
                <div className="pinwheel__line"></div>
                <div className="pinwheel__line"></div>
                <div className="pinwheel__line"></div>
                <div className="pinwheel__line"></div>
                <div className="pinwheel__line"></div>
                <div className="pinwheel__line"></div>
            </div>
        </div>
    )
}

export default Spinner