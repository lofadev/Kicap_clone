import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.scss';
import { axiosJWT } from './api/apiConfig';
import DefaultLayout from './layouts/DefaultLayout';
import NotFound from './pages/NotFound/NotFound';
import { resetToast } from './redux/slides/ToastSlide';
import { resetUser, updateUser } from './redux/slides/UserSlide';
import { privateRoutes, publicRoutes } from './routes';
import UserService from './services/UserService';
import { getDecodedRfToken, getDecodedToken, getRfToken, getToken } from './utils';

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetToast());
    const token = getToken();
    if (token && !user.accessToken) {
      const decoded = getDecodedToken();
      handleGetDetailsUser(decoded?.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  axiosJWT.interceptors.request.use(
    async (config) => {
      // Do something before request is sent
      const currentTime = new Date();
      const decodedAccessToken = getDecodedToken();
      if (decodedAccessToken?.exp < currentTime.getTime() / 1000) {
        const decodedRefreshToken = getDecodedRfToken();
        if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
          const refreshToken = getRfToken();
          const data = await UserService.refreshToken(refreshToken, dispatch);
          config.headers['Authorization'] = `Bearer ${data?.accessToken}`;
          localStorage.setItem('accessToken', JSON.stringify(data?.accessToken));
          dispatch(updateUser({ ...user, accessToken: data?.accessToken }));
        } else {
          localStorage.clear();
          dispatch(resetUser());
          navigate('/account/login');
        }
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  const handleGetDetailsUser = async (id) => {
    const refreshToken = getRfToken();
    const res = await UserService.getDetailsUser(id, dispatch);
    if (res.data) dispatch(updateUser({ ...res.data, refreshToken }));
  };

  return (
    <div className='app'>
      <Routes>
        <Route
          path='*'
          element={
            <DefaultLayout>
              <NotFound />
            </DefaultLayout>
          }
        />
        {publicRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = DefaultLayout;

          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}

        {privateRoutes.map((route, index) => {
          const Page = route.component;
          let Layout = DefaultLayout;

          if (route.layout) {
            Layout = route.layout;
          } else if (route.layout === null) {
            Layout = Fragment;
          }

          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          );
        })}
      </Routes>
    </div>
  );
}

export default App;
