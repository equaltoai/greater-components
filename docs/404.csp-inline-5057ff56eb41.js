
				{
					__sveltekit_1ejq96n = {
						base: "/greater-components/docs",
						assets: "/greater-components/docs"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("/greater-components/docs/_app/immutable/entry/start.CE6Vsit6.js"),
						import("/greater-components/docs/_app/immutable/entry/app.fsWIetty.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			