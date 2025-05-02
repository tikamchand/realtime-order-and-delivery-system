import routes from "./helpers/routes";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "./components/layouts/Layout";
import { PrivateRoute } from "./routers/PrivateRoute";

const Router = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Routes>
      {location.pathname === "/" ? (
        <Route
          path="/"
          element={
            <div className="flex justify-center items-center w-full h-vh">
              <button
                type="button"
                className="rounded-lg bg-cyan-200 p-2 text-[#333333]"
                onClick={() => navigate("/register")}
              >
                Navigate to Register
              </button>
            </div>
          }
        />
      ) : null}
      {routes.map((route) => {
        if (!route?.isPrivate) {
          return (
            <Route
              key={route.key}
              path={route.path as string}
              element={
                <Layout layout={route.layout!}>
                  <route.Component />
                </Layout>
              }
            />
          );
        } else {
          return (
            <Route
              key={route.key}
              path={route.path as string}
              element={
                <PrivateRoute>
                  <Layout layout={route.layout!}>
                    <route.Component />
                  </Layout>
                </PrivateRoute>
              }
            />
          );
        }
      })}
      <Route path="*" element={<h1>Page not found</h1>} />
    </Routes>
  );
};
export default Router;
