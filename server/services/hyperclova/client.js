import axios from "axios";

export const callHyperClova = async ({
  systemPrompt,
  userPrompt,
}) => {

  try {

    console.log(
      "CLOVA URL:",
      process.env.CLOVA_API_URL
    );

    const response = await axios.post(
      process.env.CLOVA_API_URL,
      {
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],

        topP: 0.8,
        topK: 0,
        maxTokens: 2048,
        temperature: 0.3,
        repeatPenalty: 2.0,
      },
      {
        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${process.env.CLOVA_API_KEY}`,
        },
      }
    );

    return (
      response.data?.result?.message?.content ||
      "No response"
    );

  } catch (err) {

    console.error(
      "HYPERCLOVA ERROR:",
      err.response?.data ||
      err.message
    );

    throw err;
  }
};