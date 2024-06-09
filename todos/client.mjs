import fetch from "node-fetch";

export class JSONPlaceholderClient {
  async get() {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos = await response.json();
    return todos;
  }
}
