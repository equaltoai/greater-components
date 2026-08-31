
				{
					__sveltekit_1vc1wyk = {
						base: "/greater-components/docs",
						assets: "/greater-components/docs"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("/greater-components/docs/_app/immutable/entry/start.BtEDOmSD.js"),
						import("/greater-components/docs/_app/immutable/entry/app.B_9rLhZ6.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			