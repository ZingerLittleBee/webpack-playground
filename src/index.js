import 'style/style1.css'
import 'style/style2.less'

import math from './math'

console.log('window.ENV', ENV)
function insertImgElem(imgFile) {
    const img = new Image()
    img.src = imgFile
    document.body.appendChild(img)
}

import img1 from './img/img1.jpeg'
import img2 from './img/img2.jpeg'
insertImgElem(img1)
insertImgElem(img2)
