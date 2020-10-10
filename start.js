const saver = 1     //存储位置1.本机 2.icloud
const menu_url = 'https://raw.githubusercontent.com/distand/scriptable/main/menu.json'

const fm = saver == 1 ? FileManager.local() : FileManager.iCloud()
const dict = fm.documentsDirectory()

let confirm = await _alert('确认要更新脚本吗？', ['确认','取消'])
if (confirm == '确认'){
    await sync()
}

async function sync() {
    log('更新开始');
    const menu = await _get(menu_url,'json')
    if(!menu){
        log('获取目录失败')
        return
    }
    let data
    menu.forEach((s) => {
        data = await _get(s.url)
        _write(s.name, data)
        log(s.name)
    });
    log('更新结束')
}

const _get = async (url, type='') => {
    const request = new Re
    request.url = url
    request.method = 'GET'
    let data
    switch (type) {
        case "json":
            data = request.loadJSON()
            break
        case "image":
            data = request.loadImage()
            break
        default:
            data = request.loadString()
    }
    return data
}

const _write = (fileName, content) => {
    let filePath = dict + '/' + initFile(fileName)
    fm.writeString(filePath, content)
    return true
}

const initFile = (fileName) => {
    return fileName.lastIndexOf('.') < 0 ? fileName + '.js' : fileName
}

const _alert = async (message, options) => {
    let alert = new Alert()
    alert.message = message
    for (const option of options) {
        alert.addAction(option)
    }
    return await alert.presentAlert()
}

module.exports = {
    _get,
    _write,
    _alert,
}