import React from 'react'
import ContentBox from '../ContentBox/ContentBox'

export default function ({ translation }) {
    return (
        <ContentBox data={translation} title="翻译" spreadable={true} />
    )
}