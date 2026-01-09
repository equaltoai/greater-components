
				{
					__sveltekit_skxw0i = {
						base: "/greater-components/docs",
						assets: "/greater-components/docs"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("/greater-components/docs/_app/immutable/entry/start.DEnqso52.js"),
						import("/greater-components/docs/_app/immutable/entry/app.CAowXvjm.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			