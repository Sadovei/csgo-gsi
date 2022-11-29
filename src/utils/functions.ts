import fetch from "node-fetch";

export default async function getParserData(link: string) {
  let test = {}
  test = fetch(link)
    .then(response => {
      console.log(response)
      return response.json();
    })
    .then((data: any) => {
      return data
    })
    .catch(e => {
      console.log('There has been a problem with your fetch operation: ' + e.message);
      return null
    });
  return test
}


