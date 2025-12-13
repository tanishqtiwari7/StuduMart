import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getStats,
  getBranches,
  createBranch,
  getClubs,
  createClub,
  getAdmins,
  createAdmin,
  resetSuperAdmin,
} from "../features/superadmin/superAdminSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { 
  BarChart, 
  Building, 
  Briefcase, 
  Shield, 
  Plus, 
  Users, 
  Search,
  School,
  LogOut
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

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

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  // Form States
  const [branchForm, setBranchForm] = useState({ name: "", code: "", degree: "B.Tech" });
  const [clubForm, setClubForm] = useState({ name: "", code: "", branch: "", description: "" });
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    organizationType: "none",
    organizationId: "",
  });

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
    if (isSuccess && (message.includes("created") || message.includes("deleted"))) {
      setShowModal(false);
      resetSuperAdmin();
      // Refresh data
      dispatch(getStats());
      dispatch(getBranches());
      dispatch(getClubs());
      dispatch(getAdmins());
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleCreateBranch = (e) => {
    e.preventDefault();
    dispatch(createBranch(branchForm));
  };

  const handleCreateClub = (e) => {
    e.preventDefault();
    const payload = { ...clubForm };
    if (payload.branch === "") payload.branch = null;
    dispatch(createClub(payload));
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    const payload = { ...adminForm };
    if (payload.organizationType === "none") payload.organizationId = null;
    dispatch(createAdmin(payload));
  };

  if (isLoading && !showModal) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a0a38]">Dashboard</h1>
            <p className="text-slate-500">Welcome back, Super Admin</p>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" className="gap-2">
                <School size={16} /> University Settings
             </Button>
          </div>
        </div>

        {/* Analytic Cards (Always Visible) */}
        {stats && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.users.total}</div>
                <p className="text-xs text-slate-500">
                    {stats.users.students} students, {stats.users.admins} admins
                </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Branches</CardTitle>
                <Building className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.branches}</div>
                <p className="text-xs text-slate-500">Active departments</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clubs</CardTitle>
                <Briefcase className="h-4 w-4 text-slate-500" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{stats.clubs}</div>
                <p className="text-xs text-slate-500">Registered student clubs</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Shield className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold text-green-600">Good</div>
                <p className="text-xs text-slate-500">All services operational</p>
                </CardContent>
            </Card>
            </div>
        )}

        {/* Main Interface Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
                <TabsTrigger value="dashboard">Overview</TabsTrigger>
                <TabsTrigger value="branches">Branches ({branches?.length || 0})</TabsTrigger>
                <TabsTrigger value="clubs">Clubs ({clubs?.length || 0})</TabsTrigger>
                <TabsTrigger value="admins">Admins ({admins?.length || 0})</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks for managing the system</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                         <Button 
                            className="bg-white border text-slate-900 hover:bg-slate-50 justify-start h-24 flex-col items-start gap-2"
                            onClick={() => { setModalType("branch"); setShowModal(true); }}
                         >
                            <Building className="h-6 w-6 text-indigo-600" />
                            <span className="font-semibold">Add New Branch</span>
                         </Button>
                         <Button 
                            className="bg-white border text-slate-900 hover:bg-slate-50 justify-start h-24 flex-col items-start gap-2"
                            onClick={() => { setModalType("club"); setShowModal(true); }}
                         >
                            <Briefcase className="h-6 w-6 text-indigo-600" />
                             <span className="font-semibold">Create Club</span>
                         </Button>
                         <Button 
                            className="bg-white border text-slate-900 hover:bg-slate-50 justify-start h-24 flex-col items-start gap-2"
                            onClick={() => { setModalType("admin"); setShowModal(true); }}
                         >
                            <Shield className="h-6 w-6 text-indigo-600" />
                             <span className="font-semibold">Register Admin</span>
                         </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="branches">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Departments & Branches</CardTitle>
                            <CardDescription>Manage academic branches</CardDescription>
                        </div>
                        <Button onClick={() => { setModalType("branch"); setShowModal(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Branch
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Degree</TableHead>
                                    <TableHead className="text-right">Admin</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {branches.map((branch) => (
                                    <TableRow key={branch._id}>
                                        <TableCell className="font-medium">{branch.code}</TableCell>
                                        <TableCell>{branch.name}</TableCell>
                                        <TableCell>{branch.degree}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline">Engineering</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="clubs">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Student Clubs</CardTitle>
                            <CardDescription>Manage extracurricular organizations</CardDescription>
                        </div>
                        <Button onClick={() => { setModalType("club"); setShowModal(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Club
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Affiliation</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clubs.map((club) => (
                                    <TableRow key={club._id}>
                                        <TableCell className="font-medium">{club.code}</TableCell>
                                        <TableCell>{club.name}</TableCell>
                                        <TableCell>
                                            {club.branch ? (
                                                <Badge variant="secondary">{club.branch.code}</Badge> 
                                            ) : (
                                                <Badge className="bg-[#0a0a38]">University</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="success">Active</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="admins">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>System Administrators</CardTitle>
                            <CardDescription>Manage admin access for clubs and departments</CardDescription>
                        </div>
                        <Button onClick={() => { setModalType("admin"); setShowModal(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Create Admin
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role Scope</TableHead>
                                    <TableHead className="text-right">Organization</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {admins.map((admin) => (
                                    <TableRow key={admin._id}>
                                        <TableCell className="font-medium">{admin.name}</TableCell>
                                        <TableCell>{admin.email}</TableCell>
                                        <TableCell className="capitalize">{admin.organizationType}</TableCell>
                                        <TableCell className="text-right">
                                            {admin.organizationId ? (
                                                <Badge variant="outline">{admin.organizationId.name || admin.organizationId.code}</Badge>
                                            ) : (
                                                <span className="text-slate-400 text-sm">General</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>

       {/* Forms Dialog */}
       <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                         {modalType === "branch" && "Add New Branch"}
                         {modalType === "club" && "Add New Club"}
                         {modalType === "admin" && "Create New Admin"}
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                
                {modalType === "branch" && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                             <label>Branch Name</label>
                             <Input 
                                placeholder="e.g. Computer Science" 
                                value={branchForm.name}
                                onChange={(e) => setBranchForm({...branchForm, name: e.target.value})}
                             />
                        </div>
                        <div className="grid gap-2">
                             <label>Code</label>
                             <Input 
                                placeholder="e.g. CSE" 
                                value={branchForm.code}
                                onChange={(e) => setBranchForm({...branchForm, code: e.target.value})}
                             />
                        </div>
                        <div className="grid gap-2">
                             <label>Degree</label>
                             <select 
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                value={branchForm.degree}
                                onChange={(e) => setBranchForm({...branchForm, degree: e.target.value})}
                             >
                                <option value="B.Tech">B.Tech</option>
                                <option value="M.Tech">M.Tech</option>
                             </select>
                        </div>
                        <Button onClick={handleCreateBranch}>Save Branch</Button>
                    </div>
                )}

                {modalType === "club" && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                             <label>Club Name</label>
                             <Input 
                                placeholder="e.g. Coding Club" 
                                value={clubForm.name}
                                onChange={(e) => setClubForm({...clubForm, name: e.target.value})}
                             />
                        </div>
                        <div className="grid gap-2">
                             <label>Code</label>
                             <Input 
                                placeholder="e.g. CC" 
                                value={clubForm.code}
                                onChange={(e) => setClubForm({...clubForm, code: e.target.value})}
                             />
                        </div>
                        <div className="grid gap-2">
                             <label>Affiliation</label>
                             <select 
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                value={clubForm.branch}
                                onChange={(e) => setClubForm({...clubForm, branch: e.target.value})}
                             >
                                <option value="">University Wide</option>
                                {branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name} ({b.code})</option>
                                ))}
                             </select>
                        </div>
                         <div className="grid gap-2">
                             <label>Description</label>
                             <textarea 
                                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                placeholder="..." 
                                value={clubForm.description}
                                onChange={(e) => setClubForm({...clubForm, description: e.target.value})}
                             />
                        </div>
                        <Button onClick={handleCreateClub}>Save Club</Button>
                    </div>
                )}

                {modalType === "admin" && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                             <label>Full Name</label>
                             <Input 
                                value={adminForm.name}
                                onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                             />
                        </div>
                        <div className="grid gap-2">
                             <label>Email</label>
                             <Input 
                                type="email"
                                value={adminForm.email}
                                onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                             />
                        </div>
                        <div className="grid gap-2">
                             <label>Phone</label>
                             <Input 
                                type="tel"
                                value={adminForm.phone}
                                onChange={(e) => setAdminForm({...adminForm, phone: e.target.value})}
                             />
                        </div>
                        <div className="grid gap-2">
                             <label>Password</label>
                             <Input 
                                type="password"
                                value={adminForm.password}
                                onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                             />
                        </div>
                        <div className="grid gap-2">
                             <label>Role Scope</label>
                             <select 
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                value={adminForm.organizationType}
                                onChange={(e) => setAdminForm({...adminForm, organizationType: e.target.value})}
                             >
                                <option value="none">General Admin</option>
                                <option value="club">Club Admin</option>
                                <option value="department">Department Admin</option>
                             </select>
                        </div>
                        
                        {adminForm.organizationType === "club" && (
                            <div className="grid gap-2">
                                <label>Select Club</label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    value={adminForm.organizationId}
                                    onChange={(e) => setAdminForm({...adminForm, organizationId: e.target.value})}
                                >
                                    <option value="">Select...</option>
                                    {clubs.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {adminForm.organizationType === "department" && (
                            <div className="grid gap-2">
                                <label>Select Branch</label>
                                <select 
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                                    value={adminForm.organizationId}
                                    onChange={(e) => setAdminForm({...adminForm, organizationId: e.target.value})}
                                >
                                    <option value="">Select...</option>
                                    {branches.map(b => (
                                        <option key={b._id} value={b._id}>{b.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <Button onClick={handleCreateAdmin}>Create Admin</Button>
                    </div>
                )}

            </DialogContent>
       </Dialog>
    </div>
  );
};

export default SuperAdmin;
