# Minor — expose explicit messaging component intent

`Messages.Composer` can now target an explicit conversation without changing global selection.
`Messages.NewConversation` adds bindable visibility plus open-intent and visibility callbacks for
consumer-owned navigation and deep-link flows. Messaging handlers additionally preserve message
connection pagination, expose by-id conversation fetching, retain exact unread counts, surface
realtime event failures, and reconcile selected state after transport reconnects. Array-returning
consumer handlers remain supported, so existing implicit-selection behavior remains intact.
