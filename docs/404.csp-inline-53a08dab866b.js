
				{
					__sveltekit_1o6vjqw = {
						base: "/greater-components/docs",
						assets: "/greater-components/docs"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("/greater-components/docs/_app/immutable/entry/start.4n-83G3I.js"),
						import("/greater-components/docs/_app/immutable/entry/app.CwxSq401.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			