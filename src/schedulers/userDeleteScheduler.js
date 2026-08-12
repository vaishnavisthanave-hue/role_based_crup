const cron = require("node-cron");

const {
  processAllUserDeleteRequests,
} = require("../service/userDeleteService");

const processUserDeleteRequests = async () => {
  try {
    console.log("User delete scheduler started");

    await processOneUserDelete();

  } catch (error) {
    console.error(
      "User delete scheduler error:",
      error.message
    );
  }
};

// Every 5 minutes
cron.schedule(
  "*/5 * * * *",
  processUserDeleteRequests
);

module.exports = processUserDeleteRequests;