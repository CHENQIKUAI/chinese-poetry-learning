import React, { useEffect, useState } from 'react'
import { notification } from "antd";

export default function ({ crons }) {
    useEffect(() => {
        for (let i = 0; i < crons.length; ++i) {
            const cron = crons[i];
            if (cron.notCheckInNum) {
                setTimeout(() => {
                    const { title, notCheckInNum, total, checkInNum } = cron;
                    notification.info({
                        message: "诗词学习提醒",
                        description: (<div>
                            在 <span style={{ fontWeight: "bold" }}>{title}</span> 学习集中，您还有 <span style={{ fontWeight: "bold", color: "red" }}>{notCheckInNum}</span> 首诗词没有打卡，请及时学习打卡。该学习集总共 <span style={{ fontWeight: "bold", color: "blue" }}>{total}</span> 首，目前您已学 <span style={{ fontWeight: "bold", color: "green" }}>{checkInNum}</span> 首！
                        </div>),
                        duration: 3
                    })
                }, (i + 1) * 100)
            }
        }

        return () => {
        }
    }, [crons])

    return null;
}