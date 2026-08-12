const { User } = require("../models");

const processAllUserDeleteRequests = async () => {
  try {
    const users = await User.findAll({
      where: {
        is_request: 1,
        active: 1,
        deletedAt: null,
      },
      order: [["id", "ASC"]],
    });

    if (users.length === 0) {
      console.log("No pending user delete request");
      return;
    }

    console.log(`Found ${users.length} pending users`);

    for (const user of users) {
      try {
        await user.update({
          deletedAt: new Date(),
          is_request: 0,
          active: 0,
        });

        console.log(
          `User ${user.id} is soft deleted successfully`
        );
      } catch (error) {
        console.error(
          `Failed to delete user ${user.id}:`,
          error.message
        );
      }
    }

    return users;
  } catch (error) {
    console.error(
      "User delete scheduler error:",
      error.message
    );
  }
};

module.exports = {
  processAllUserDeleteRequests,
};