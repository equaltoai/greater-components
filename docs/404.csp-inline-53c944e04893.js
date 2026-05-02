
				{
					__sveltekit_gotiph = {
						base: "/greater-components/docs",
						assets: "/greater-components/docs"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("/greater-components/docs/_app/immutable/entry/start.C2_KcdEw.js"),
						import("/greater-components/docs/_app/immutable/entry/app.DibPvN75.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			