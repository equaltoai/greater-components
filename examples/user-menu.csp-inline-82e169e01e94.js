
				{
					__sveltekit_1wae2pg = {
						base: new URL("..", location).pathname.slice(0, -1),
						assets: "/greater-components"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("../_app/immutable/entry/start.L157W4N9.js"),
						import("../_app/immutable/entry/app.Bz8-Af6K.js")
					]).then(([kit, app]) => {
						kit.start(app, element, {
							node_ids: [0, 36],
							data: [{type:"data",data:{testTheme:null,testDensity:null},uses:{}},null],
							form: null,
							error: null
						});
					});
				}
			