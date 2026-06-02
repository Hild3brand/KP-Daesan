export const processClovaResponse = (data) => {
  return {
    message: data.result.message.content,
    usage: data.result.usage
  };
};