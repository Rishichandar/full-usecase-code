import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();
  return (
    <div className="text-center my-40 ">
      {error && (
        <>
          <p>{error.message}</p>
        </>
      )}
      {!error && (
        <>
          <h1> 404 Page Not Found</h1>
          <p>The page you are looking for cannot be found.</p>
        </>
      )}
    </div>
  );
};
