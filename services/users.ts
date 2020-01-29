import { fetchData, persistData } from "./db.ts";
import { User } from "../models/user.ts";
import createId from "../services/createId.ts";

// import {fetch} from "https://denopkg.com/keroxp/deno-fetch/fetch.ts"

type UserData = Pick<User, "name" | "role" | "jiraAdmin">;

export const getUsers = async (): Promise<void> => {

  const users = await fetch('http://10.1.8.31:8080/query', {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({query: `{  ventaGeneral(periodo: "202001" nivelInformacion:"dios" isoPais:"MX"){
      presupuesto_mensual
      venta_mensual
      venta_esperada_mensual
      venta_faltante_mensual
      deficit_superavit
      porcentaje_avance
      porcentaje_ideal
      periodo
      historico_mensual_venta {
        label
        value
      }
      historico_mensual_presupuestado {
        label
        value
      }
    } 
  }`})
  }
  ).then(r => {
   console.log(r)
    r.json()
  })
  .then(data => {
    console.log('data returned:', data)
  });

  // sort by name
  // return 'str';
  // return users.sort((a, b) => a.name.localeCompare(b.name));
};

export const getUser = async (userId: string): Promise<User | undefined> => {
  const users = await fetchData();

  return users.find(({ id }) => id === userId);
};

export const createUser = async (userData: UserData): Promise<string> => {
  const users = await fetchData();

  const newUser: User = {
    id: createId(),
    name: String(userData.name),
    role: String(userData.role),
    jiraAdmin: "jiraAdmin" in userData ? Boolean(userData.jiraAdmin) : false,
    added: new Date()
  };

  await persistData([...users, newUser]);

  return newUser.id;
};

export const updateUser = async (
  userId: string,
  userData: UserData
): Promise<void> => {
  const user = await getUser(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = {
    ...user,
    name: userData.name !== undefined ? String(userData.name) : user.name,
    role: userData.role !== undefined ? String(userData.role) : user.role,
    jiraAdmin:
      userData.jiraAdmin !== undefined
        ? Boolean(userData.jiraAdmin)
        : user.jiraAdmin
  };

  const users = await fetchData();
  const filteredUsers = users.filter(user => user.id !== userId);

  persistData([...filteredUsers, updatedUser]);
};

export const deleteUser = async (userId: string): Promise<void> => {
  const users = await getUsers();
  // const filteredUsers = users.filter(user => user.id !== userId);

  // persistData(filteredUsers);
};