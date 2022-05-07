import dynamic from 'next/dynamic';
import {AppContextProvider} from "../store/State";

const App = dynamic(() => import('../components/AppShell'), {
  ssr: false,
});

export default function Index() {
  return (
      <AppContextProvider>
        <App />
      </AppContextProvider>
  );
}
