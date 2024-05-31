import { useSelector } from "react-redux";
import Title from "../Title/title";
import Rightdiv from "../rightdiv/right-cont";

export const Home = () => {
  const email = useSelector((state) => state.auth.user.Email);
  const auth = useSelector((state) => state.auth.isAuthenticated);
  console.log(email);
  console.log(auth);
  return (
    <>
    {/* <h1>{email}</h1> */}
      <Title />
      <Rightdiv />
    </>
  );
};
