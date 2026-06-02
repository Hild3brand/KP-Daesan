export const logMetric = (reqMessage, aiResponse, time) => {
  console.log("===== CHATBOT LOG =====");
  console.log("User Message:", reqMessage);
  console.log("AI Response:", aiResponse);
  console.log("Response Time:", time + "ms");
};