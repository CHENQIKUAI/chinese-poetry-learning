import React from 'react'
import { Button, Input, message } from "antd"
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from "crypto-js/hmac-sha256"
import "./style.less"
import textContent from "./transformpcm.worker"
import LearnPoetryService from '../../../../services/LearnPoetryService';

var blob = new Blob([textContent]); // textContent为字符串脚本
var url = window.URL.createObjectURL(blob);

// 音频转码worker
let recorderWorker = new Worker(url)
// 记录处理的缓存音频
let buffer = []
let AudioContext = window.AudioContext || window.webkitAudioContext
let notSupportTip = '请试用chrome浏览器且域名为localhost或127.0.0.1测试'
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

recorderWorker.onmessage = function (e) {
    buffer.push(...e.data.buffer)
}

class IatRecorder {
    constructor(config) {
        this.config = config
        this.state = 'ing'
        this.language = config.language || 'zh_cn'
        this.accent = config.accent || 'mandarin'

        //以下信息在控制台-我的应用-语音听写（流式版）页面获取
        this.appId = '5c0bad93'
        this.apiKey = '59ce0202bdcf50d9be1593ef0e94e35b'
        this.apiSecret = '5c48e33e53391f0f53e03343374d28ea'
    }

    start() {
        this.stop()
        if (navigator.getUserMedia && AudioContext) {
            this.state = 'ing'
            if (!this.recorder) {
                var context = new AudioContext()
                this.context = context
                this.recorder = context.createScriptProcessor(0, 1, 1)

                var getMediaSuccess = (stream) => {
                    var mediaStream = this.context.createMediaStreamSource(stream)
                    this.mediaStream = mediaStream
                    this.recorder.onaudioprocess = (e) => {
                        this.sendData(e.inputBuffer.getChannelData(0))
                    }
                    this.connectWebsocket()
                }
                var getMediaFail = (e) => {
                    this.recorder = null
                    this.mediaStream = null
                    this.context = null
                    console.log('请求麦克风失败')
                }
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false
                    }).then((stream) => {
                        getMediaSuccess(stream)
                    }).catch((e) => {
                        getMediaFail(e)
                    })
                } else {
                    navigator.getUserMedia({
                        audio: true,
                        video: false
                    }, (stream) => {
                        getMediaSuccess(stream)
                    }, function (e) {
                        getMediaFail(e)
                    })
                }
            } else {
                this.connectWebsocket()
            }
        } else {
            var isChrome = navigator.userAgent.toLowerCase().match(/chrome/)
            alert(notSupportTip)
        }
    }

    stop() {
        this.state = 'end'
        try {
            this.mediaStream.disconnect(this.recorder)
            this.recorder.disconnect()
        } catch (e) { }
    }

    sendData(buffer) {
        recorderWorker.postMessage({
            command: 'transform',
            buffer: buffer
        })
    }
    connectWebsocket() {
        var url = 'wss://iat-api.xfyun.cn/v2/iat'
        var host = 'iat-api.xfyun.cn'
        var apiKey = this.apiKey
        var apiSecret = this.apiSecret
        var date = new Date().toGMTString()
        var algorithm = 'hmac-sha256'
        var headers = 'host date request-line'
        var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`
        var signatureSha = HmacSHA256(signatureOrigin, apiSecret)
        var signature = Base64.stringify(signatureSha)
        var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
        var authorization = btoa(authorizationOrigin)
        url = `${url}?authorization=${authorization}&date=${date}&host=${host}`

        console.log('see: ', 'WebSocket' in window);

        if ('WebSocket' in window) {
            this.ws = new WebSocket(url)
        } else if ('MozWebSocket' in window) {
            // this.ws = new MozWebSocket(url)
        } else {
            alert(notSupportTip)
            return null
        }
        this.ws.onopen = (e) => {
            this.mediaStream.connect(this.recorder)
            this.recorder.connect(this.context.destination)
            setTimeout(() => {
                this.wsOpened(e)
            }, 500)
            this.config.onStart && this.config.onStart(e)
        }
        this.ws.onmessage = (e) => {
            this.config.onMessage && this.config.onMessage(e)
            this.wsOnMessage(e)
        }
        this.ws.onerror = (e) => {
            this.stop()
            this.config.onError && this.config.onError(e)
        }
        this.ws.onclose = (e) => {
            this.stop()
            this.config.onClose && this.config.onClose(e)
        }
    }

    wsOpened() {
        if (this.ws.readyState !== 1) {
            return
        }
        var audioData = buffer.splice(0, 1280)
        console.log('audioData', audioData.length)
        var params = {
            'common': {
                'app_id': this.appId
            },
            'business': {
                'language': this.language, //小语种可在控制台--语音听写（流式）--方言/语种处添加试用
                'domain': 'iat',
                'accent': this.accent, //中文方言可在控制台--语音听写（流式）--方言/语种处添加试用
                'vad_eos': 5000,
                'dwa': 'wpgs' //为使该功能生效，需到控制台开通动态修正功能（该功能免费）
            },
            'data': {
                'status': 0,
                'format': 'audio/L16;rate=16000',
                'encoding': 'raw',
                'audio': this.ArrayBufferToBase64(audioData)
            }
        }
        this.ws.send(JSON.stringify(params))
        this.handlerInterval = setInterval(() => {
            // websocket未连接
            if (this.ws.readyState !== 1) {
                clearInterval(this.handlerInterval)
                return
            }
            if (buffer.length === 0) {
                if (this.state === 'end') {
                    this.ws.send(JSON.stringify({
                        'data': {
                            'status': 2,
                            'format': 'audio/L16;rate=16000',
                            'encoding': 'raw',
                            'audio': ''
                        }
                    }))
                    clearInterval(this.handlerInterval)
                }
                return false
            }
            audioData = buffer.splice(0, 1280)
            // 中间帧
            this.ws.send(JSON.stringify({
                'data': {
                    'status': 1,
                    'format': 'audio/L16;rate=16000',
                    'encoding': 'raw',
                    'audio': this.ArrayBufferToBase64(audioData)
                }
            }))
        }, 40)
    }

    wsOnMessage(e) {
        let jsonData = JSON.parse(e.data)
        // 识别结束
        if (jsonData.code === 0 && jsonData.data.status === 2) {
            this.ws.close()
        }
        if (jsonData.code !== 0) {
            this.ws.close()
            console.log(`${jsonData.code}:${jsonData.message}`)
        }
    }

    ArrayBufferToBase64(buffer) {
        var binary = ''
        var bytes = new Uint8Array(buffer)
        var len = bytes.byteLength
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i])
        }
        return window.btoa(binary)
    }
}


const RECITE = "开始背诵"
const STOP = "停止背诵"

const STATE_STOP = "It is Stoped";
const STATE_RECODING = "It is Recoding now!";


class Recite extends React.Component {

    state = {
        mode: STATE_STOP,
        reciteValue: "",
        counterDownTime: 0,
        a: "",
        b: "",
        output: "",
        poetry: null,
        contentVisible: false,
    }

    fetchPoetry = () => {
        const id = window.location.href.match(/_id=(.*)/)[1];
        LearnPoetryService.getPoetry(id).then(ret => {
            if (ret && ret.code === 1) {
                const { title, dynasty, writer, content } = ret.result;
                this.setState({
                    poetry: { title, dynasty, writer, content }
                })
            }
        })
    }

    componentDidMount() {
        var iatRecorder = new IatRecorder({
            onClose: () => {
                this.stop()
                this.reset()
            },
            onError: (data) => {
                this.stop()
                this.reset()
                alert('WebSocket连接失败')
            },
            onMessage: (e) => {
                let jsonData = JSON.parse(e.data)
                if (jsonData.data && jsonData.data.result) {
                    this.setResult(jsonData.data.result)
                }
            },
            onStart: () => {
                this.counterDown()
            }
        })
        this.iatRecorder = iatRecorder
        this.resultText = "";

        this.fetchPoetry();
    }

    start = () => {
        this.iatRecorder.start()
    }

    stop = () => {
        this.iatRecorder.stop()
    }

    reset = () => {
        this.setState({
            counterDownTime: 0,
            mode: STATE_STOP,
        })
        clearTimeout(this.counterDownTimeout)
        buffer = []
    }

    setResult = (data) => {
        var str = ''
        var resultStr = ''
        let ws = data.ws
        for (let i = 0; i < ws.length; i++) {
            str = str + ws[i].cw[0].w
        }

        // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
        // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段

        if (data.pgs === 'apd') {
            this.resultText = this.state.reciteValue;
        }

        resultStr = this.resultText + str;

        this.setState({
            reciteValue: resultStr
        })
    }

    counterDown() {
        const { counterDownTime } = this.state;
        if (counterDownTime === 60) {
            // this.counterDownDOM.text('01: 00')
            this.stop()
        } else if (counterDownTime > 60) {
            this.reset()
            return false
        } else if (counterDownTime >= 0 && counterDownTime < 10) {
            // this.counterDownDOM.text('00: 0' + this.counterDownTime)
        } else {
            // this.counterDownDOM.text('00: ' + this.counterDownTime)
        }
        this.setState((state) => ({
            counterDownTime: state.counterDownTime + 1,
        }))
        this.counterDownTimeout = setTimeout(() => {
            this.counterDown()
        }, 1000)
    }

    handleStop = () => {
        this.reset();
        this.stop();
        this.setState({
            mode: STATE_STOP,
        })
    }

    handleStart = () => {
        if (navigator.getUserMedia && AudioContext && recorderWorker) {
            this.start()
        } else {
            alert(notSupportTip)
        }
        this.resultText = "";
        this.setState({
            mode: STATE_RECODING,
            reciteValue: ""
        })
    }

    handleClickBtn = () => {
        const { mode } = this.state;
        if (mode === STATE_RECODING) { //当前状态是正在录制，点击后需要停止录制
            this.handleStop();
        } else if (mode === STATE_STOP) { //当前状态是停止，点击后需要开始录制
            this.handleStart();
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleCompute = () => {
        LearnPoetryService.compute(this.state.reciteValue, this.state.poetry.content).then(ret => {
            if (ret && ret.code === 1) {
                this.setState({
                    output: ret.result
                })
            }
        })
    }

    handleShowContent = () => {
        this.setState((state) => {
            return {
                contentVisible: !state.contentVisible
            }
        })
    }

    render() {
        const { mode, poetry } = this.state;
        const { title, dynasty, writer, content } = poetry || {};

        return (
            <div className="recite-box">
                <div className="first-line">
                    <div className="title">{title}</div>
                    <div className="time">倒计时: {60 - this.state.counterDownTime}s</div>
                    <div className="record">
                        <Button onClick={this.handleClickBtn}>{mode === STATE_RECODING ? STOP : RECITE}</Button>
                    </div>
                    <div className="mark">
                        <Button type={this.state.output ? "primary" : "default"} onClick={this.handleCompute}>打分</Button>
                        <span>{this.state.output} {this.state.output ? "分" : null}</span>
                    </div>
                    <Button onClick={this.handleShowContent} type={this.state.contentVisible ? "primary" : "default"}>原文</Button>
                </div>
                <div>
                    <span>{dynasty}: </span>
                    <span>{writer}</span>
                </div>
                <div className="content">
                    <div className="content-input">
                        {this.state.reciteValue}
                    </div>
                    <div className="content-original">
                        {this.state.contentVisible && content}
                    </div>
                </div>
            </div>
        )
    }
}


export default Recite;