import {prisma} from "../lib/prisma";

export const getAllUsers = async ()=>{
    return await prisma.user.findMany();
};
export const createUser = async(
     data:{
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role : "ADMIN" | "USER" | "ORGANIZER";
        }
) => {
    console.log("PRISMA CREATE DATA:", JSON.stringify(data, null, 2));
    return await prisma.user.create({ data });

};