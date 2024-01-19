import { o } from '../jsx/jsx.js'
import { prerender } from '../jsx/html.js'
import SourceCode from '../components/source-code.js'
import { mapArray } from '../components/fragment.js'
import { proxy } from '../../../db/proxy.js'
import { Context } from '../context.js'
import { getAuthUserId } from '../auth/user.js'
import { Link } from '../components/router.js'

// Calling <Component/> will transform the JSX into AST for each rendering.
// You can reuse a pre-compute AST like `let component = <Component/>`.

// If the expression is static (not depending on the render Context),
// you don't have to wrap it by a function at all.

let content = (
  <div id="home">
    <h1>Birthday List</h1>
    <p>
      This site list out the birthday / initial release date of{' '}
      <abbr title="free and libre open source software">FLOSS</abbr>
    </p>
    {proxy.event_list.length == 0 ? (
      <p>No event lists created yet.</p>
    ) : (
      <ul>
        {mapArray(proxy.event_list, event_list => (
          <li>{event_list.title}</li>
        ))}
      </ul>
    )}
    <CreateButton />
    <SourceCode page="home.tsx" />
  </div>
)

function CreateButton(attrs: {}, context: Context) {
  let user_id = getAuthUserId(context)
  return (
    <div style="margin-block: 1rem">
      {user_id ? (
        <Link href="/birthday-list/create">
          <button>Create Birthday List</button>
        </Link>
      ) : (
        <p>
          You can create birthday list after <Link href="/login">login</Link>
        </p>
      )}
    </div>
  )
}

export default content
