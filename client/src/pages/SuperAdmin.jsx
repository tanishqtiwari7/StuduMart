import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getStats,
  getBranches,
  getClubs,
  getAdmins,
  resetSuperAdmin,
} from "../features/superadmin/superAdminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  Users,
  Building,
  Briefcase,
  Shield,
  School,
  Activity,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import BranchTab from "../components/superadmin/BranchTab";
import ClubTab from "../components/superadmin/ClubTab";
import AdminTab from "../components/superadmin/AdminTab";

const SuperAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const {
    stats,
    branches,
    clubs,
    admins,
    isLoading,
    isError,
    isSuccess,
    message,
  } = useSelector((state) => state.superadmin);

  useEffect(() => {
    if (!user || user.role !== "superadmin") {
      navigate("/");
    } else {
      dispatch(getStats());
      dispatch(getBranches());
      dispatch(getClubs());
      dispatch(getAdmins());
    }

    return () => {
      dispatch(resetSuperAdmin());
    };
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess && message) toast.success(message);
    if (
      isSuccess &&
      (message.includes("created") || message.includes("deleted"))
    ) {
      // Refresh data on success
      dispatch(getStats());
      dispatch(getBranches());
      dispatch(getClubs());
      dispatch(getAdmins());
      dispatch(resetSuperAdmin());
    }
  }, [isError, isSuccess, message, dispatch]);

  if (isLoading && !stats) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 pt-32">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Super Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Manage university structure, organizations, and administrators.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <School size={16} /> University Settings
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.users?.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.users?.students || 0} Students,{" "}
                    {stats?.users?.admins || 0} Admins
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Branches
                  </CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.branches || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active Departments
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clubs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.clubs || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Student Organizations
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Events
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.events?.total || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.events?.upcoming || 0} Upcoming
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="branches">
            <BranchTab branches={branches} />
          </TabsContent>

          <TabsContent value="clubs">
            <ClubTab clubs={clubs} branches={branches} />
          </TabsContent>

          <TabsContent value="admins">
            <AdminTab admins={admins} branches={branches} clubs={clubs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdmin;
