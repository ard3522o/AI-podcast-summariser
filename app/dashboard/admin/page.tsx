"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield, Users, Crown, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserData {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  lastSignInAt: number | null;
  isAdmin: boolean;
}

export default function AdminPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userEmail = user?.emailAddresses?.[0]?.emailAddress;
  const isUserAdmin = userEmail === "apsingh.6423@gmail.com";

  useEffect(() => {
    if (!isUserAdmin) {
      router.push("/dashboard/projects");
    }
  }, [isUserAdmin, router]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserAdmin) {
      fetchUsers();
    }
  }, [isUserAdmin]);

  if (!isUserAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen mesh-background-subtle">
      {/* Header */}
      <div className="glass-nav border-b">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl gradient-emerald">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-emerald-text">
                Admin Panel
              </h1>
              <p className="text-gray-400">Manage users and permissions</p>
            </div>
          </div>
          <Button
            onClick={fetchUsers}
            disabled={loading}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-emerald-400" />
              <span className="text-gray-400">Total Users</span>
            </div>
            <p className="text-3xl font-bold mt-2">{users.length}</p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-emerald-400" />
              <span className="text-gray-400">Admins</span>
            </div>
            <p className="text-3xl font-bold mt-2">
              {users.filter((u) => u.isAdmin).length}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Crown className="h-5 w-5 text-emerald-400" />
              <span className="text-gray-400">Regular Users</span>
            </div>
            <p className="text-3xl font-bold mt-2">
              {users.filter((u) => !u.isAdmin).length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">All Users</h2>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 text-red-600 text-sm">{error}</div>
          )}

          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No users found</div>
          ) : (
            <div className="divide-y">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full gradient-emerald flex items-center justify-center text-white font-semibold">
                      {u.name?.charAt(0) || u.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{u.name || "Unknown"}</p>
                      <p className="text-sm text-gray-400">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {u.isAdmin && (
                      <Badge className="gradient-emerald text-white">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400">
                      Joined {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
