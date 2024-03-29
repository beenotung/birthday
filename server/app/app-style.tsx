import { ErrorStyle } from './components/error.js'
import { SourceCodeStyle } from './components/source-code.js'
import Style from './components/style.js'
import { UpdateMessageStyle } from './components/update-message.js'
import { CommonStyle } from './styles/common-style.js'
import { FormStyle } from './styles/form-style.js'
import { WebStyle } from './styles/web-style.js'

export let appStyle = Style(/* css */ `
${SourceCodeStyle}
${ErrorStyle}
${UpdateMessageStyle}
${CommonStyle}
${FormStyle}
${WebStyle}
`)
