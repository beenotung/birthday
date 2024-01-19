import { o } from '../jsx/jsx.js'
import { Routes } from '../routes.js'
import { apiEndpointTitle, title } from '../../config.js'
import Style from '../components/style.js'
import { Context, DynamicContext, getContextFormBody } from '../context.js'
import { mapArray } from '../components/fragment.js'
import { IonBackButton } from '../components/ion-back-button.js'
import { LayoutType, config } from '../../config.js'
import { object, string } from 'cast.ts'
import { getAuthUserId } from '../auth/user.js'
import { Link } from '../components/router.js'

let pageTitle = '__title__'

let style = Style(/* css */ `
#__id__ {

}
`)

let page = (
  <>
    {style}
    <div id="__id__">
      <h1>{pageTitle}</h1>
      <Main />
    </div>
  </>
)

function Main(attrs: {}, context: Context) {
  let items = [1, 2, 3]
  return (
    <ul>
      {mapArray(items, item => (
        <li>item {item}</li>
      ))}
    </ul>
  )
}

let submitParser = object({
  title: string({ nonEmpty: true }),
  slug: string({ nonEmpty: true, match: /^[\w-]$/ }),
})
function Submit(attrs: {}, context: DynamicContext) {
  let user_id = getAuthUserId(context)
  if (!user_id)
    return (
      <p class="error">
        Please <Link href="/login">login</Link> to submit __title__.
      </p>
    )
  let body = getContextFormBody(context)
  let input = submitParser.parse(body)
  return 'TODO'
}

let routes: Routes = {
  '/__url__': {
    title: title(pageTitle),
    description: 'TODO',
    menuText: pageTitle,
    node: page,
  },
  '/__url__/submit': {
    title: apiEndpointTitle,
    description: 'TODO',
    node: <Submit />,
    streaming: false,
  },
}

export default { routes }
