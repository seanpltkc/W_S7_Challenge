import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <h1>Home</h1>
      <img
        onClick={() => navigate("/information")}
        src="data:image/"


      />

    </>
  )
}