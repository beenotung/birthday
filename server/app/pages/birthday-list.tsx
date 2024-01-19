import { o } from '../jsx/jsx.js'
import { Routes } from '../routes.js'
import { apiEndpointTitle, title } from '../../config.js'
import Style from '../components/style.js'
import { Context, getContextFormBody } from '../context.js'
import { mapArray } from '../components/fragment.js'
import { IonBackButton } from '../components/ion-back-button.js'
import { LayoutType, config } from '../../config.js'
import { object, string } from 'cast.ts'
import { proxy } from '../../../db/proxy.js'
import { getAuthUserId } from '../auth/user.js'
import { renderError } from '../components/error.js'
import { Link } from '../components/router.js'

let createPageStyle = Style(/* css */ `
#CreateBirthdayList .field {
  margin-block: 1rem;
}
#CreateBirthdayList .field label {
  display: flex;
}
#CreateBirthdayList .field label::after {
  content: ':';
}
`)

let createPage = (
  <>
    {createPageStyle}
    <div id="CreateBirthdayList">
      <h1>Create Birthday List</h1>
      <p>
        Create a category of birthday list, e.g. for programming languages,
        frameworks, and serialization formats.
      </p>
      <CreateForm />
    </div>
  </>
)

let createForm = (
  <form
    method="POST"
    action="/birthday-list/create/submit"
    onsubmit="emitForm(event)"
  >
    <div class="field">
      <label>Title</label>
      <input name="title" placeholder="e.g. programming languages" />
    </div>
    <div>
      <input type="submit" value="Submit" />
    </div>
  </form>
)

let guestView = (
  <p>
    Please <Link href="/login">login</Link> to create birthday list
  </p>
)

function CreateForm(attrs: {}, context: Context) {
  let user_id = getAuthUserId(context)
  return user_id ? createForm : guestView
}

let submitParser = object({
  title: string({ nonEmpty: true }),
})
function Submit(attrs: {}, context: Context) {
  let user_id = getAuthUserId(context)
  if (!user_id) {
    return guestView
  }
  let body = getContextFormBody(context)
  let input = submitParser.parse(body)
  let id = proxy.event_list.push({ title: input.title, user_id })
  return 'TODO'
}

let routes: Routes = {
  '/birthday-list/create': {
    title: title('Create Birthday List'),
    description:
      'Create a category of birthday list, e.g. for programming languages, frameworks, and serialization formats',
    node: createPage,
  },
  '/birthday-list/submit': {
    title: apiEndpointTitle,
    description: 'TODO',
    node: <Submit />,
    streaming: false,
  },
}

export default { routes }
