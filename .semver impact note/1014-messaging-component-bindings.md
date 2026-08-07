# Minor — expose explicit messaging component intent

`Messages.Composer` can now target an explicit conversation without changing global selection.
`Messages.NewConversation` adds bindable visibility plus open-intent and visibility callbacks for
consumer-owned navigation and deep-link flows. Existing implicit-selection behavior remains intact.
