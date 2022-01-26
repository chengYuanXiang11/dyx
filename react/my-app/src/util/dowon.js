// import * as JSZip from 'jszip'
// a标签下载
const download = (fileName, buff) => {

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob( [buff], {type: "arraybuffer"}));
    console.log(blob, URL.createObjectURL(new Blob( [buff], {type: "arraybuffer"})))
    link.download = fileName;
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
};

//未正式成为标准 showSaveFilePicker下载
async function saveFile(blob, filename) {
    try {
        const handle = await window.showSaveFilePicker({
            suggestedName: filename,
            types: [
                {
                    description: "PNG file",
                    accept: {
                        "image/png": [".png"],
                    },
                },
                {
                    description: "Jpeg file",
                    accept: {
                        "image/jpeg": [".jpeg"],
                    },
                },
            ],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return handle;
    } catch (err) {
        console.error(err.name, err.message);
    }
}

async function fileZip(){
    return new Promise((res,rej)=>{

    })
}

function getBlob(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function () {
        if (xhr.status === 200) {
            cb(xhr.response);
        }
    };
    xhr.send();
}
getBlob('https://mrppcapiuat.yugu8.com/media/system/2022-01-26/2bc6c548-42c2-4464-93a0-ba1bdb08ee95.txt',function(res){
    console.log(res);
    const reader = new FileReader();
    reader.readAsArrayBuffer(res);
    reader.onload = e => {
        console.log(e)
    }
})
// export { download , saveFile }