import axios from "axios";

export const callHyperClova = async (payload) => {

  const response = await axios.post(process.env.CLOVA_API_URL, payload,
    {
      headers: {
        "Authorization": `Bearer ${process.env.CLOVA_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};
