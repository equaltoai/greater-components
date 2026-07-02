
				{
					__sveltekit_1rdikhm = {
						base: "/greater-components/docs",
						assets: "/greater-components/docs"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("/greater-components/docs/_app/immutable/entry/start.B_10pugK.js"),
						import("/greater-components/docs/_app/immutable/entry/app.4ps6Lss1.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			