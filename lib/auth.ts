import { stackServerApp } from "@/stack/server"; // stack configuration එක import කරන්න
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    // User login වෙලා නැත්නම් login page එකට redirect කරනවා
    redirect("/handler/sign-in"); 
    return null;
  }

  return user;
}