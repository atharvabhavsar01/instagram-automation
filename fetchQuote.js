import axios from "axios";

const link = "https://zenquotes.io/api/today";

const fetchQuote = async () => {
  try {
    const response = await axios.get(link);
    console.table(response.data);
      console.debug(response.data);
      if (response.status === 200) {
          console.log("ok")
          
      }

    return response.data[0];
  } catch (error) {
    console.error(error);
  }
};

export default fetchQuote;
