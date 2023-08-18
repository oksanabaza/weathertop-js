import { accountsController } from "./accounts-controller.js";
import { userStore } from "../models/user-store.js";

export const userController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);

    // Check if loggedInUser exists and has the required properties
    if (!loggedInUser || !loggedInUser._id || !loggedInUser.firstName) {
      response.redirect("/login"); // Redirect to login page
      return;
    }
    const getUserById = await userStore.getUserById(loggedInUser._id);
    const viewData = {
      loggedInUser: loggedInUser,
      userId: getUserById._id,
      userName: getUserById.firstName,
      userLastName: getUserById.lastName,
      userEmail: getUserById.email,
      userPassword: getUserById.password,
    };
    // console.log(viewData, "getUserById");
    // console.log("user view rendering");
    response.render("user-view", viewData);
  },
  async editUser(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser || !loggedInUser._id || !loggedInUser.firstName) {
      response.redirect("/login");
      return;
    }
    const updatedUserData = {
      firstName,
      lastName,
      email,
      password,
    };
    const updatedUser = await userStore.updateUserInfo(loggedInUser._id, updatedUserData);
    console.log("user info updated");
    const viewData = {
      user: updatedUser,
    };
    response.render("user-view", viewData);
  },
};
