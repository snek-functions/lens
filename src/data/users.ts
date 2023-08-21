export interface User {
  id: number;
  name: string;
  email: string;
}

export const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
  },
];
