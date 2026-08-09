# Patch — preserve Lesser viewer interaction state

The Lesser object mapper now carries the authenticated viewer's favourite, boost, bookmark, and
pin state from the pinned GraphQL projection instead of resetting every flag to false. No public
type is removed or renamed.
