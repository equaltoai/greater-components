
				{
					__sveltekit_lmu780 = {
						base: "/greater-components/docs",
						assets: "/greater-components/docs"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("/greater-components/docs/_app/immutable/entry/start.Bs_pO8R1.js"),
						import("/greater-components/docs/_app/immutable/entry/app.BmYzuIGf.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			