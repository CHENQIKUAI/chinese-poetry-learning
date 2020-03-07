import React from 'react'
import ContentBox from '../ContentBox/ContentBox'

export default function Appreciation({ appreciation }) {
    return (
        <ContentBox data={appreciation} title="赏析" spreadable={true}  />
    )
}