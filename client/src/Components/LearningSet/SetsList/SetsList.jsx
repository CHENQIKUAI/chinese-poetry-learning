import React from 'react'
import SetDescription from '../SetDescription/SetDescription'

export default function SetsList({ list, handleGoToSet, setIdAndTitle, refreshFunction }) {
    return (
        <div>
            {
                list.map((set, index) => {
                    return <SetDescription type="list" refreshFunction={refreshFunction} setIdAndTitle={setIdAndTitle} hasArrow={true} key={index} {...set} handleGoToSet={handleGoToSet} />
                })
            }
        </div>
    )

}