import { setTitle, asyncSetTitle, setName } from '../../store/action'
import { useSelector, useDispatch, shallowEqual, useStore } from 'react-redux'
import Da from './Da'
import { ref, useState, useRef } from 'react'
import { saveAs } from 'file-saver';
import ajax from '../../util/ajax'
import JSZip from 'jszip'
import StreamSaver from "streamsaver";
import abortableFetch from '../../util/fetch'
import axios from 'axios'
import {
    // download,
    saveFile
} from '../../util/dowon'
//web
function imgToBase64(img) {
    return new Promise((resolve, reject) => {
        const file = img[0];
        //判断浏览器是否支持filereader
        if (typeof FileReader == 'undifined') {
            this.$message.error('抱歉，你的浏览器不支持 FileReader');
            reject();
        }
        //判断获取的是否为图片文件
        if (!/image\/\w+/.test(file.type)) {
            this.$message.error("请确保文件为图像文件");
            reject();
        }
        //主要利用FileReader
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            console.log(reader.result)
            resolve(reader.result);
        }
    })
}
// function getFileContent(fileUrl) {
//     return new JSZip.external.Promise(function (resolve, reject) {
//       // 调用jszip-utils库提供的getBinaryContent方法获取文件内容
//       JSZipUtils.getBinaryContent(fileUrl, function (err, data) {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(data);
//         }
//       });
//     });
//   }
//取消fetch
export default function Dowload() {
    const [abort1, setabort1] = useState({})
    const [axiosQ, setaxiosQ] = useState({})
    const [fileStreamSaver, setFileStreamSaver] = useState([])
    const [file, setFile] = useState([])

    const inputFile = useRef()
    const data = useSelector(state => {
        console.log('state', state);
        return state.nameReducer
    }
        // (oldValue,newValue)=>{
        //     console.log(oldValue,newValue)
        //     return false
        // }
        // shallowEqualajax

    )
    const s = useStore()
    console.log(s)
    const data2 = useSelector(state => {
        return state.nameReducer2
    }, shallowEqual)
    const dispath = useDispatch()
    // const title = useSelector(state=>state.nameReducer)
    // const CancelToken = axios.CancelToken;
    const fileDowon = async () => {
        // ,{'Content-Type':'application/octet-stream'})
        //     ajax({
        //         url: 'http://localhost:7001/api/chunk',
        //         method: 'Get',
        //         responseType: "arraybuffer",
        //         cancelToken: new CancelToken(function executor(c) {
        //             setaxiosQ(state => {
        //                return{
        //                    ...state,'cancel':c
        //                }
        //             });
        //         // 这个参数 c 就是CancelToken构造函数里面自带的取消请求的函数，这里把该函数当参数用
        //     }),
        //     onDownloadProgress: function (progressEvent) {
        //         // 对原生进度事件的处理
        //         // const progressPrecent = (progressEvent.loaded / progressEvent.total * 100);
        //         console.log('progressPrecent',progressEvent.loaded)
        //       },
        //     // headers:{
        //     //    'content-encoding': 'gzip'
        //     // }
        // }
        //     ).then((res) => {
        //     // const myBlob = new Blob(["一文彻底掌握 Blob Web API"], { type: "text/plain" });
        //     // download('PS破解及安装步骤.rar', blob);
        //     // saveFile(blob,'PS破解及安装步骤.rar')
        //     let blob = new Blob([res.data], { type: 'application/octet-stream' });
        //     saveAs(blob, '新建文本文档.txt')

        // }).catch(err=>{
        //     console.log(err)
        // })
        // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
        // saveAs('http://localhost:7001/public/1.txt', "hello world.txt")
        // console.log(controller.signal.aborted = false)

        const ab = abortableFetch("http://localhost:7001/api/zipfile", {
            method: 'Get',
            // headers: {
            // "Content-length": 1212096877568
            // "range":"bytes=0-10000"
            // }
            // responseType: "arraybuffer",
        })

        //         // setabort1(aborts())//变更abort指向或者可以封装一个新的fetch
        setabort1(x => {
            return {
                ...x, ...ab
            }

        })
        //     //    setTimeout(() => {
        //     //        console.log(abort1)
        //     //    }, 1000);
        ab.ready().then(
            (res) => {
                console.log('res', res);
                // download.abort()
                const fileStream = StreamSaver.createWriteStream('PS破解及安装步骤.zip',{
                    size:1183570
                }
                    // ,{
                    // size : res.headers.get("content-length")
                    // size:118357
                    //   }
                )
                const [progressStream, readableStream] = res.body.tee();
                {// const readers =readableStream.getReader();
                    // const total = 1183570
                    // let loaded = 0;
                    // const logProgress = (reader) => {
                    //     return reader.read().then(({ value, done }) => {
                    //         console.log(value, done)
                    //         if (done) {
                    //             console.log('Download completed');
                    //             return;
                    //         }
                    //         loaded += value.length;
                    //         if (total === null) {
                    //             console.log(`Downloaded ${loaded}`);
                    //         } else {
                    //             console.log(`Downloaded ${loaded} of ${total} (${(loaded / total * 100).toFixed(2)}%)`);
                    //         }
                    //         return logProgress(reader);
                    //     });
                    // };
                    // logProgress(readers)
                }
                // ???进度条（错误的）
                // var downloaded =0;
                // var progress = new window.TransformStream({
                //     transform (chunk, ctrl) {
                //       downloaded += chunk.byteLength 
                //       ctrl.enqueue(chunk)
                //       console.log(downloaded)
                //     }
                //   })
                  
                // more optimized
                if (window.WritableStream && readableStream.pipeTo) {
                    return readableStream
                    // .pipeThrough(progress)
                    .pipeTo(fileStream)
                        .then(() => console.log('done writing'))
                }
                window.writer = fileStream.getWriter()
                const reader = res.body.getReader()
                const pump = () => reader.read()
                    .then(res => res.done
                        ? window.writer.close()
                        : window.writer.write(res.value).then(pump))

                pump()
            })
            .catch((err) => {
                console.log('error', err)
            })

    }

    const showSave = async () => {
        const images = ["/body.png", "/eyes.png", "/mouth.png"].map(
            (path) => "../images" + path
        );
        let imgDataUrl = "data:image/png;base64,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"
        function dataUrlToBlob(base64, mimeType) {
            // atob() 方法用于解码使用 base-64 编码的字符串。
            let bytes = window.atob(base64.split(",")[1]);
            let ab = new ArrayBuffer(bytes.length);
            let ia = new Uint8Array(ab);
            for (let i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            return new Blob([ab], { type: mimeType });
        }
        function download() {
            // if (!imgDataUrl) {
            //   alert("请先合成图片");
            //   return;
            // }
            const imgBlob = dataUrlToBlob(imgDataUrl, "image/png");
            saveFile(imgBlob, "face.png");
        }
        download()
    }
    //中断
    const z = () => {
        // fetch中断
        console.log(abort1)
        // setFileStreamSaver(x=>{
        //     return x.push(fileStreamSaver)
        // })
        abort1.abort()
        //axios中断
        //   axiosQ.cancel()
        // console.log('中断');


    }
    return (
        <>
            <button onClick={() => { z() }}>中断</button>
            {/* webkitdirectory="false" */}
            <input type="file" name="" id="" ref={inputFile} accept="image/*" onChange={() => { setFile(inputFile.current.files); }} />
            <button onClick={() => { imgToBase64(file) }}>图片转64</button>
            <button onClick={() => { fileDowon() }}>下载</button>
            <div>
                <button onClick={() => { showSave() }}>showSaveFilePicker下载</button>
            </div>
            <button onClick={() => { dispath(setName('1')) }}>setName</button>
            <button onClick={() => { dispath(setTitle('1')) }}>setTitle</button>
            <button onClick={() => { dispath(asyncSetTitle('1')) }}>asyncSetTitle</button>
            {data2.name}{data2.title}
            {/* <img src="data:image/png;base64,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" alt="" /> */}
            <Da></Da>
            <br />
            {data.name}{data.title}
            <input type="file" name="" id="" />
        </>
    )
}

