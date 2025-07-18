import useStore from '@/stores/useStore';
import AuthPage from './AuthPage';
import MainLayout from '@/components/Layout/MainLayout';

const Index = () => {
  const { isAuthenticated } = useStore();

  return (
    <>
      {!isAuthenticated ? (
        <AuthPage />
      ) : (
        <MainLayout />
      )}
    </>
  );
};

export default Index;
