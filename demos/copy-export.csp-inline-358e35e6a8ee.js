
				{
					__sveltekit_11zess5 = {
						base: new URL("..", location).pathname.slice(0, -1),
						assets: "/greater-components"
					};

					const element = document.currentScript.parentElement;

					Promise.all([
						import("../_app/immutable/entry/start.BrI5n1da.js"),
						import("../_app/immutable/entry/app.Cmb11UDy.js")
					]).then(([kit, app]) => {
						kit.start(app, element, {
							node_ids: [0, 21],
							data: [{type:"data",data:{testTheme:null,testDensity:null},uses:{}},null],
							form: null,
							error: null
						});
					});
				}
			