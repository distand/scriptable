const zhihu = 'https://api.zhihu.com/topstory/hot-lists/total?limit=10&reverse_order=0'

const res = await get(zhihu,'json')
const widget = await createWidget(res)
Script.setWidget(widget)
Script.complete()

async function createWidget(res) {
    const i = random(res.data.length)
    const e = res.data[i]

    const w = new ListWidget()
    w.spacing = 5
    w.backgroundColor = Color.black()
    const url = e.target.url.replace('api','www').replace('questions','question')

    const t = w.addText(e.target.title)
    t.textColor = Color.white()
    t.font = new Font('',17)
    t.url = url

    const s = w.addStack()
    const size = Device.screenSize()
    const width = e.target.excerpt ? 70 : size.width - 80
    if(e.children[0].thumbnail){
        const img = s.addImage(await get(e.children[0].thumbnail,'image'))
        img.imageSize = new Size(width,70)
        img.cornerRadius = 10
        img.applyFillingContentMode()
    }
    s.addSpacer(8)
    const c = s.addText(e.target.excerpt)
    c.font = new Font('',10)

    return w
}

async function get(url,type = '') {
    const request = new Request('')
    request.url = url
    request.method = 'GET'
    request.headers = {
        "Accept": "*/*"
    }
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

function random(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
