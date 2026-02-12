
				{
					__sveltekit_1vsalcs = {
						base: "/greater-components/docs",
						assets: "/greater-components/docs"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("/greater-components/docs/_app/immutable/entry/start.CWiCoEvA.js"),
						import("/greater-components/docs/_app/immutable/entry/app.N466byJY.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			