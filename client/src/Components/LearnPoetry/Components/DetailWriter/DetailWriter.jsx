import React from 'react'
import ContentBox from '../ContentBox/ContentBox'

export default function ({ detailIntro }) {

    if (!detailIntro) {
        return null;
    }
    const keys = Object.keys(detailIntro)
    return (
        <div>
            {
                keys.map((key) =>
                    <ContentBox key={key} data={detailIntro[key]} title={key} spreadable={true} />
                )
            }
        </div>
    )
}
