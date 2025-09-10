import { v4 as uuid } from "uuid";

export async function hello() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hola desde card-service 🚀",
      requestId: uuid(),
    }),
  };
}


if (require.main === module) {
  hello().then((res) => console.log(res));
}
