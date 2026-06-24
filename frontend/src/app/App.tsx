import { useEffect } from "react";
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider } from './store/AppContext';

export default function App() {

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL;

    fetch(`${API}/api/products`)
      .then(res => res.json())
      .then(data => {
        console.log("Produtos:", data);
      })
      .catch(err => {
        console.log("Erro:", err);
      });
  }, []);

  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}