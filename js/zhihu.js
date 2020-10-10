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
    w.backgroundColor = new Color("#3C3F41",0.85)

    const t = w.addText(e.target.title)
    t.font = new Font('',20-Math.min(3,Math.ceil(e.target.title.length / 16)))
    t.textColor = Color.white()
    t.url = e.target.url.replace('api','www').replace('questions','question')

    const s = w.addStack()
    if(e.children[0].thumbnail){
        const size = Device.screenSize()
        const width = e.target.excerpt ? 72 : size.width - 100
        const img = s.addImage(await get(e.children[0].thumbnail,'image'))
        img.imageSize = new Size(width,72)
        img.cornerRadius = 10
        img.applyFillingContentMode()
    }
    if(e.target.excerpt) {
        s.addSpacer(8)
        const c = s.addText(e.target.excerpt)
        c.font = new Font('', 13 - Math.min(3, Math.floor(e.target.excerpt.length / 21)))
        c.textColor = Color.white()
    }
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
