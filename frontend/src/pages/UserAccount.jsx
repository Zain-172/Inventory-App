import { FaEnvelope, FaIdBadge, FaKey, FaPowerOff, FaUserCircle } from "react-icons/fa";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import { useEffect, useState } from "react";
import { useAlertBox } from "../component/Alerts";
import { getMpinStatus, setMpin } from "../api/Login";
import { useNavigate } from "react-router-dom";

export default function UserAccount() {
  const storedUser = localStorage.getItem("inventory_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { alertBox } = useAlertBox();
  const navigate = useNavigate();
  const [statusLoading, setStatusLoading] = useState(true);
  const [isMpinSet, setIsMpinSet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mpin, setMpinValue] = useState("");
  const [confirmMpin, setConfirmMpin] = useState("");

  useEffect(() => {
    async function loadMpinStatus() {
      if (!user?.id) {
        setStatusLoading(false);
        return;
      }

      try {
        const response = await getMpinStatus(user.id);
        if (response.success) {
          setIsMpinSet(response.isSet);
        }
      } catch (error) {
        console.error("Failed to fetch MPIN status:", error);
      } finally {
        setStatusLoading(false);
      }
    }

    loadMpinStatus();
  }, [user?.id]);

  const handleSetMpin = async (e) => {
    e.preventDefault();

    if (!/^\d{4}$/.test(mpin)) {
      await alertBox("MPIN must be exactly 4 digits", "Invalid MPIN", <FaKey />);
      return;
    }

    if (mpin !== confirmMpin) {
      await alertBox("MPIN and confirm MPIN do not match", "Invalid MPIN", <FaKey />);
      return;
    }

    try {
      setSaving(true);
      const response = await setMpin(user.id, mpin);
      if (response.success) {
        setIsMpinSet(true);
        setMpinValue("");
        setConfirmMpin("");
        await alertBox("MPIN set successfully", "Success", <FaKey />);
      } else {
        await alertBox(response.message || "Unable to set MPIN", "Failed", <FaKey />);
      }
    } catch (error) {
      console.error("Failed to set MPIN:", error);
      await alertBox("Something went wrong while setting MPIN", "Failed", <FaKey />);
    } finally {
      setSaving(false);
    }
  };

    const handleLogout = async () => {
        // Clear any authentication tokens or user data here
        const reponse = await alertBox("Are you want to Log out", "Success", <FaPowerOff />);
        console.log(reponse);
        if (reponse) {
            localStorage.removeItem("inventory_user");
            navigate("/");
        }
    }
  return (
    <div className="grid min-h-screen">
      <nav>
        <Navigation />
      </nav>
      <TopBar>
        <h1 className="text-2xl font-bold flex gap-2 items-center py-2">
          <FaUserCircle />
          User Account
        </h1>
      </TopBar>

      <main className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <section className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-[0_0px_1px] dark:shadow-white shadow-black p-6 sm:p-8 relative">
          <h2 className="text-xl font-semibold mb-6">Profile Details</h2>

          {user ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-700 pb-3">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                  <FaUserCircle />
                  <span>Username</span>
                </div>
                <span className="font-semibold">{user.username || "-"}</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-700 pb-3">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                  <FaEnvelope />
                  <span>Email</span>
                </div>
                <span className="font-semibold break-all text-right">{user.email || "-"}</span>
              </div>

              <div className="flex items-center justify-between gap-4 pb-1">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                  <FaIdBadge />
                  <span>MPIN</span>
                </div>
                <span className="font-semibold">
                  {statusLoading ? "Checking..." : isMpinSet ? "...." : "--"}
                </span>
              </div>

              {!statusLoading && !isMpinSet && (
                <form onSubmit={handleSetMpin} className="mt-4 space-y-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
                  <h3 className="font-semibold">Set MPIN</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    You can set your MPIN only once.
                  </p>

                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={mpin}
                    onChange={(e) => setMpinValue(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 4-digit MPIN"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />

                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={confirmMpin}
                    onChange={(e) => setConfirmMpin(e.target.value.replace(/\D/g, ""))}
                    placeholder="Confirm 4-digit MPIN"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                  />

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    {saving ? "Setting..." : "Set MPIN"}
                  </button>
                </form>
              )}

              {!statusLoading && isMpinSet && (
                <p className="mt-4 text-sm text-green-600 dark:text-green-400">
                  MPIN is already set for this account.
                </p>
              )}
            </div>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-300">
              No user details found. Please log in to view your account information.
            </p>
          )}
          <button
            onClick={handleLogout}
            className="absolute right-4 bottom-4 mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors flex gap-2 items-center justify-center"
          >
            <FaPowerOff />
            Log Out
          </button>
        </section>
      </main>
    </div>
  );
}
