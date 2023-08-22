import { accountsController } from "./accounts-controller.js";
export const aboutController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);

    // Check if loggedInUser exists and has the required properties
    if (!loggedInUser || !loggedInUser._id || !loggedInUser.firstName) {
      response.redirect("/login"); // Redirect to login page
      return;
    }
    const res = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Tramore,Ireland&appid=1034f20414a780ad33f80a0fca6c250d"
    );
    const json = await res.json();
    console.log(json);
    const viewData = {
      title: "About Playlist",
      loggedInUser: loggedInUser,
      json: json,
    };
    console.log("about rendering");
    response.render("about-view", viewData);
  },
};
