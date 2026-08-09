# Minor — compose Timeline.LoadMore with virtualized timelines

`Timeline.LoadMore` now accepts optional standalone pagination props and no longer requires
`Timeline.Root` context. Existing compound-timeline usage remains unchanged, while virtualized
consumers can reuse the same accessible load-more control.
