
				{
					__sveltekit_1kxrn03 = {
						base: "/greater-components/docs",
						assets: "/greater-components/docs"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("/greater-components/docs/_app/immutable/entry/start.t5yVhaj6.js"),
						import("/greater-components/docs/_app/immutable/entry/app.BTY6cQh_.js")
					]).then(([kit, app]) => {
						kit.start(app, element);
					});
				}
			