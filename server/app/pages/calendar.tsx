import { proxy } from '../../../db/proxy.js'
import { apiEndpointTitle, title } from '../../config.js'
import { getAuthUserId } from '../auth/user.js'
import { renderError } from '../components/error.js'
import { mapArray } from '../components/fragment.js'
import { Link } from '../components/router.js'
import Style from '../components/style.js'
import {
  Context,
  DynamicContext,
  WsContext,
  getContextFormBody,
} from '../context.js'
import { o } from '../jsx/jsx.js'
import { Routes } from '../routes.js'
import { filter } from 'better-sqlite3-proxy'
import { string, date, inferFromSampleValue, object, id } from 'cast.ts'
import { UpdateIn } from '../components/update.js'

let style = Style(/* css */ `
#Calendar th {
  text-transform: capitalize;
}
#Calendar th,td {
  padding: 0.25rem 1rem;
}
`)

let content = (
  <div id="Calendar">
    {style}
    <h1>Calendar</h1>
    <h2>My events</h2>
    <table>
      <thead>
        <tr>
          <th>date</th>
          <th>title</th>
        </tr>
      </thead>
      <TBody />
    </table>
    <h2>New events</h2>
    <form onsubmit="emitForm(event)" action="/calendar/submit" method="POST">
      <label>
        Date: <input type="date" name="date" />
      </label>
      <br />
      <label>
        Title: <input type="text" name="title" />
      </label>
      <br />
      <input type="submit" value="Submit" />
    </form>
  </div>
)

function TBody(_attrs: {}, context: Context) {
  let user_id = getAuthUserId(context)
  if (!user_id) {
    return (
      <tbody>
        <tr>
          <td colspan="2">
            Please <Link href="/login">login</Link> to access the calendar
            function.
          </td>
        </tr>
      </tbody>
    )
  }
  return (
    <tbody>
      {mapArray(filter(proxy.calendar_event, { user_id }), row => (
        <tr>
          <td>{row.date}</td>
          <td>
            <input value={row.title} />
            <button
              onclick={`emit('/calendar/title',${row.id},this.closest('td').querySelector('input').value)`}
            >
              save
            </button>
            <span id={`update_event_msg_${row.id}`}></span>
          </td>
        </tr>
      ))}
    </tbody>
  )
}

let submitParser = object({
  date: string({ match: /^\d{4}-\d{2}-\d{2}$/ }),
  title: string({ nonEmpty: true }),
})

function Submit(attrs: {}, context: Context) {
  try {
    let user_id = getAuthUserId(context)
    if (!user_id)
      return (
        <div>
          Please <Link href="/login">login</Link> before submitting calendar
          events.
        </div>
      )
    let body = getContextFormBody(context)
    let input = submitParser.parse(body)
    let id = proxy.calendar_event.push({
      user_id,
      date: input.date,
      title: input.title,
    })
    return (
      <div>
        <h1>Submit calendar result</h1>
        <p>saved as item #{id}</p>
        <p>
          Back to <Link href="/calendar">Calendar</Link>
        </p>
      </div>
    )
  } catch (error) {
    return (
      <div>
        <p>Failed to submit the calendar event</p>
        {renderError(error, context)}
        <Link href="/calendar">
          <button>Submit again</button>
        </Link>
      </div>
    )
  }
}

let updateParser = object({
  0: id(),
  1: string({ nonEmpty: true }),
})

function UpdateTitle(attrs: {}, context: WsContext) {
  try {
    console.log('args:', context.args)
    let input = updateParser.parse(context.args)
    let id = input[0]
    let title = input[1]
    let user_id = getAuthUserId(context)
    if (!user_id)
      return (
        <div>
          Please <Link href="/login">login</Link> before submitting calendar
          events.
        </div>
      )
    let event = proxy.calendar_event[id]
    event.title = title
    // return <div>updated</div>
    // return content
    return (
      <UpdateIn
        selector={`#update_event_msg_${id}`}
        to="/calendar"
        title="Updated Calendar"
        content={<span style="color:green"> updated title </span>}
      ></UpdateIn>
    )
  } catch (error) {
    return (
      <div>
        <p>Failed to update calendar event title</p>
        {renderError(error, context)}
        <Link href="/calendar">
          <button>Submit again</button>
        </Link>
      </div>
    )
  }
}

let routes: Routes = {
  '/calendar': {
    title: title('Calendar'),
    description: 'Public Calendar of programming languages and frameworks',
    menuText: 'Calendar',
    node: content,
  },
  '/calendar/submit': {
    title: apiEndpointTitle,
    description: 'create new calendar event by user',
    node: <Submit />,
  },
  '/calendar/title': {
    title: apiEndpointTitle,
    description: 'update calendar event title by id',
    node: <UpdateTitle />,
  },
}

export default { routes }
