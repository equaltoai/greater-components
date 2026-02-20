
				{
					__sveltekit_1xl87z2 = {
						base: "/greater-components/docs",
						assets: "/greater-components/docs"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("/greater-components/docs/_app/immutable/entry/start.DZxZ6kAe.js"),
						import("/greater-components/docs/_app/immutable/entry/app.BmSxIUO-.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			