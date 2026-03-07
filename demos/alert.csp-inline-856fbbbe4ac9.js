
				{
					__sveltekit_1oh32yn = {
						base: new URL("..", location).pathname.slice(0, -1),
						assets: "/greater-components"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("../_app/immutable/entry/start.lNopRzjj.js"),
						import("../_app/immutable/entry/app.Bz1HdKg5.js")
					]).then(([kit, app]) => {
						kit.start(app, element, {
							node_ids: [0, 17],
							data: [{type:"data",data:{testTheme:null,testDensity:null},uses:{}},null],
							form: null,
							error: null
						});
					});
				}
			