import { useContext } from "react";
import UserContext from "../UserContext";
import FriendsList from "./friendsList";
import ModifyFriends from "./modifyFriends";
import Messaging from "./messaging";
export default function Page() {
  //const { user } = useContext(UserContext);
  // console.log(user);
  let friendsList = {
    name: "Christian Zaleski",
    name: "Luke Faulkner",
    name: "Dylan West",
    name: "Joseph Torres",
  };

  return (
    <div className="flex p-10">
      
      <Messaging/>
      {/* <FriendsList friendsList={friendsList}/> */}
      <ModifyFriends/>
    </div>
  );
}
