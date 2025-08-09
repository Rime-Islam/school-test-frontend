
import { Outlet, useNavigate } from 'react-router-dom';
import { DashboardSidebar } from '../../components/DashboardSidebar';
import { DashboardHeader } from '../../components/DashboardHeader';
import { toast } from 'sonner';
import { logout } from '../../redux/features/auth/authSlice';
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useAppDispatch } from '../../redux/hook';

const AdminDashboard = () => {
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const res = await logoutUser().unwrap();
      dispatch(logout());
      console.log(res);
      toast.success("Logged out successfully");
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <DashboardHeader />
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          <aside className="md:sticky md:top-6 md:self-start">
            <DashboardSidebar />
          </aside>

          <main className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <button
                onClick={handleLogout}
                className="inline-flex h-9 items-center rounded-md bg-emerald-600 px-3 text-sm font-medium text-white shadow hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                type="button"
              >
                LogOut
              </button>
            </div>

            {/* <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="New Users"
                value="1,248"
                delta="+8.2%"
                intent="positive"
                icon="Users"
              />
              <MetricCard
                title="Active Sessions"
                value="3,902"
                delta="+2.1%"
                intent="neutral"
                icon="Activity"
              />
              <MetricCard
                title="Bounce Rate"
                value="28.4%"
                delta="-1.3%"
                intent="positive"
                icon="BarChart3"
              />
              <MetricCard
                title="Errors"
                value="17"
                delta="+3"
                intent="negative"
                icon="AlertTriangle"
              />
            </section> */}

            <section className="">
              <Outlet />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
export default AdminDashboard;