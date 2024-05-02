// testing the import function

describe("import", () => {
  test("normal imports expected", async () => {
    const showcaseeditcmp = await import("../components/Showcase/Edit.vue");
    const showcaseviewcmp = await import("../components/Showcase/View.vue");
    // const blogcmp = await import("../components/Blog.vue");
    // const connecteditcmp = await import("../components/Connect/Edit.vue");
    // const connectviewcmp = await import("../components/Connect/View.vue");
    const headercmp = await import("../components/Header.vue");
    const linkiconcmp = await import("../components/LinkIcons.vue");
    const skilllistcmp = await import("../components/SkillList.vue");

    // check if the components are defined
    expect(showcaseeditcmp).toBeDefined();
    expect(showcaseviewcmp).toBeDefined();
    // expect(blogcmp).toBeDefined();
    // expect(connecteditcmp).toBeDefined();
    // expect(connectviewcmp).toBeDefined();
    expect(headercmp).toBeDefined();
    expect(linkiconcmp).toBeDefined();
    expect(skilllistcmp).toBeDefined();
  });

  test("template string imports expected", async () => {
    const showcaseeditcmp = await import("../components/Showcase/Edit.vue");
    const showcaseviewcmp = await import("../components/Showcase/View.vue");
    // const blogcmp = await import("../components/Blog.vue");
    // const connecteditcmp = await import("../components/Connect/Edit.vue");
    // const connectviewcmp = await import("../components/Connect/View.vue");
    const headercmp = await import("../components/Header.vue");
    const linkiconcmp = await import("../components/LinkIcons.vue");
    const skilllistcmp = await import("../components/SkillList.vue");

    // check if the components are defined
    expect(showcaseeditcmp).toBeDefined();
    expect(showcaseviewcmp).toBeDefined();
    // expect(blogcmp).toBeDefined();
    // expect(connecteditcmp).toBeDefined();
    // expect(connectviewcmp).toBeDefined();
    expect(headercmp).toBeDefined();
    expect(linkiconcmp).toBeDefined();
    expect(skilllistcmp).toBeDefined();
  });

  // Not sure about this one
  // test("dynamic imports expected", async () => {
  //   const eshowcase = "Showcase";
  //   const sedit = "Edit";
  //   const showcaseeditcmp = await import(
  //     `../components/${eshowcase}/${sedit}.vue` /* webpackChunkName: "showcase" */
  //   );

  //   const vshowcase = "Showcase";
  //   const vedit = "View";
  //   const showcaseviewcmp = await import(
  //     `../components/${vshowcase}/${vedit}.vue` /* webpackChunkName: "showcaseview" */
  //   );

  //   const blog = "Blog";
  //   const blogcmp = await import(
  //     `../components/${blog}.vue` /* webpackChunkName: "blog" */
  //   );
  //   const econnect = "Connect";
  //   const cedit = "Edit";
  //   const connecteditcmp = await import(
  //     `../components/${econnect}/${cedit}.vue` /* webpackChunkName: "connect" */
  //   );
  //   const connectview = "Connect/View";
  //   const connectviewcmp = await import(
  //     `../components/${connectview}.vue` /* webpackChunkName: "connectview" */
  //   );
  //   const header = "Header";
  //   const headercmp = await import(
  //     `../components/${header}.vue` /* webpackChunkName: "header" */
  //   );
  //   const linkicons = "LinkIcons";
  //   const linkiconcmp = await import(
  //     `../components/${linkicons}.vue` /* webpackChunkName: "linkicons" */
  //   );
  //   const skilllist = "SkillList";
  //   const skilllistcmp = await import(
  //     `../components/${skilllist}.vue` /* webpackChunkName: "skilllist" */
  //   );

  //   // check if the components are defined
  //   expect(showcaseeditcmp).toBeDefined();
  //   expect(showcaseviewcmp).toBeDefined();
  //   expect(blogcmp).toBeDefined();
  //   expect(connecteditcmp).toBeDefined();
  //   expect(connectviewcmp).toBeDefined();
  //   expect(headercmp).toBeDefined();
  //   expect(linkiconcmp).toBeDefined();
  //   expect(skilllistcmp).toBeDefined();
  // });
});
