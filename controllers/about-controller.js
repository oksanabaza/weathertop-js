import { accountsController } from "./accounts-controller.js";
export const aboutController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);

    // Check if loggedInUser exists and has the required properties
    if (!loggedInUser || !loggedInUser._id || !loggedInUser.firstName) {
      response.redirect("/login"); // Redirect to login page
      return;
    }
    const viewData = {
      title: "About Playlist",
      loggedInUser: loggedInUser,
    };
    console.log("about rendering");
    response.render("about-view", viewData);
  },
};
