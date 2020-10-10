const menu_url = 'https://raw.githubusercontent.com/distand/scriptable/main/menu.json'
const fm = FileManager.iCloud()
const confirm = await _alert('确认要更新脚本吗？', ['确认','取消'])
if(confirm === 0) await sync()
async function sync() {
    const menu = await _get(menu_url,'json')
    if(!menu){
        await _alert('获取目录失败', ['确认'])
        return
    }
    let succ = 0
    for(let i=0;i<menu.length;i++){
        const s = menu[i]
        const data = await _get(s.url)
        if(data){
            _write(s.name, data)
            succ++
        }
    }
    await _alert('更新了'+succ+'个脚本', ['确认'])
}
async function _get(url, type=''){
    const request = new Request('')
    request.url = url
    request.method = 'GET'
    let data
    if(type == 'json'){
        data = request.loadJSON()
    }else{
        data = request.loadString()
    }
    return data
}
async function _alert(message, options){
    let alert = new Alert()
    alert.message = message
    for (const option of options) {
        alert.addAction(option)
    }
    return await alert.presentAlert()
}
function _write(fileName, content){
    fileName = fileName.lastIndexOf('.') < 0 ? fileName + '.js' : fileName
    fm.writeString(fm.documentsDirectory() + '/' + fileName, content)
}