import React from 'react'
import ContentBox from '../ContentBox/ContentBox'

export default function ({ remark }) {
    return (
        <ContentBox data={remark} title="评析" spreadable={true} />
    )
}