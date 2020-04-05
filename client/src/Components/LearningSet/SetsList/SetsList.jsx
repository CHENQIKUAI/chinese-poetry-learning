import React from 'react'
import SetDescription from '../SetDescription/SetDescription'

export default function SetsList({ list, handleGoToSet, setSelectedSet, refreshFunction }) {

    return (
        <div>
            {
                list.map((set, index) => {
                    return <SetDescription
                        type="list"
                        refreshFunction={refreshFunction}
                        setSelectedSet={setSelectedSet}
                        hasArrow={true}
                        key={index}
                        {...set}
                        handleGoToSet={handleGoToSet} />
                })
            }
        </div>
    )

}