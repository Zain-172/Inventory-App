import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaUserCheck } from "react-icons/fa";
import Navigation from "../component/Navigation";
import TopBar from "../component/TopBar";
import { useAppData } from "../context/AppDataContext";
import {
	getAttendenceByDate,
	upsertAttendence,
} from "../api/Attendence";

const defaultDate = new Date().toISOString().split("T")[0];

const statusStyles = {
	Present: "bg-green-800 text-white",
	Absent: "bg-red-600 text-white",
	Leave: "bg-yellow-500 text-black",
	"Half Day": "bg-orange-500 text-white",
	Late: "bg-purple-500 text-white",
};

const nextStatus = {
	Present: "Absent",
	Absent: "Leave",
	Leave: "Half Day",
	"Half Day": "Late",
	Late: "Present"
};

const Attendence = () => {
	const { loading, employees } = useAppData();
	const [selectedDate, setSelectedDate] = useState(defaultDate);
	const [attendanceData, setAttendanceData] = useState({});
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		const fetchAttendence = async () => {
			try {
				const records = await getAttendenceByDate(selectedDate);
				const mapped = {};

				records.forEach((record) => {
					mapped[`${selectedDate}-${record.employee_id}`] = {
						status: record.status,
						time: record.time,
					};
				});

				setAttendanceData((prev) => ({
					...prev,
					...mapped,
				}));
			} catch (error) {
				console.error("Failed to fetch attendence", error);
			}
		};

		fetchAttendence();
	}, [selectedDate]);

	const rows = useMemo(() => {
		return employees.map((employee) => {
			const key = `${selectedDate}-${employee.id}`;
			const saved = attendanceData[key] || {};

			return {
				...employee,
				status: saved.status || "Present",
				time: saved.time || "09:00",
			};
		});
	}, [employees, selectedDate, attendanceData]);

	const updateAttendance = async (employeeId, updates) => {
		const key = `${selectedDate}-${employeeId}`;
		const nextRecord = {
			status: updates.status || attendanceData[key]?.status || "Present",
			time: updates.time || attendanceData[key]?.time || "09:00",
		};

		setAttendanceData((prev) => ({
			...prev,
			[key]: {
				...nextRecord,
			},
		}));

		setIsSaving(true);
		try {
			await upsertAttendence({
				employee_id: employeeId,
				date: selectedDate,
				status: nextRecord.status,
				time: nextRecord.time,
			});
		} catch (error) {
			console.error("Failed to save attendence", error);
		} finally {
			setIsSaving(false);
		}
	};

	const toggleStatus = async (employeeId) => {
		const key = `${selectedDate}-${employeeId}`;
		const currentStatus = attendanceData[key]?.status || "Present";

		await updateAttendance(employeeId, { status: nextStatus[currentStatus] });
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">Loading...</div>
		);
	}

	return (
		<div className="grid">
			<nav>
				<Navigation />
			</nav>

			<TopBar>
				<div className="flex items-center gap-4 py-2 text-2xl font-bold">
					<FaUserCheck />
					Attendence
				</div>
			</TopBar>

			<main className="flex flex-col my-16 w-screen">
				<div className="px-2 py-6 flex flex-wrap items-center justify-between gap-4">
					<h2 className="text-2xl font-bold">Daily Attendence</h2>

					<label className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold">
						<FaCalendarAlt />
						<span>Date</span>
						<input
							type="date"
							value={selectedDate}
                            className="rounded-lg"
							onChange={(e) => setSelectedDate(e.target.value)}
						/>
					</label>
				</div>

				<div className="px-2 pb-3 text-sm font-semibold text-green-700 dark:text-green-400">
					{isSaving ? "Saving attendence..." : "All changes saved"}
				</div>

				<div className="px-2 mb-8 overflow-auto">
					{rows.length ? (
						<table className="min-w-full border rounded-lg overflow-hidden">
							<thead className="text-sm font-medium uppercase">
								<tr>
									<th className="px-4 py-2 border text-left">ID</th>
									<th className="px-4 py-2 border text-left">Name</th>
									<th className="px-4 py-2 border text-left">Phone</th>
									<th className="px-4 py-2 border text-left">Role</th>
									<th className="px-4 py-2 border text-left">Status</th>
									<th className="px-4 py-2 border text-left">Time</th>
								</tr>
							</thead>

							<tbody>
								{rows.map((row) => (
									<tr key={row.id} className="border">
										<td className="border p-2 bg-green-600 text-center w-8">
											{row.id}
										</td>
										<td className="border p-2 min-w-[160px] bg-green-600">{row.name || "-"}</td>
										<td className="border p-2 min-w-[140px] bg-green-600">{row.phone || "-"}</td>
										<td className="border p-2 min-w-[140px] bg-green-600">{row.position || "-"}</td>
										<td className="border p-2 min-w-[140px] bg-green-600">
											<button
												type="button"
												className={`w-full px-3 py-1 rounded-md font-semibold transition-colors border shadow-[0_0_10px] shadow-black/40 ${statusStyles[row.status]}`}
												onClick={() => toggleStatus(row.id)}
											>
												{row.status}
											</button>
										</td>
										<td className="border p-2 min-w-[130px] bg-green-600">
											<input
												type="time"
												value={row.time}
												onChange={async (e) =>
													updateAttendance(row.id, { time: e.target.value })
												}
												className="w-full border rounded-md px-2 py-1"
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<div className="border rounded-lg p-6 text-center font-semibold text-neutral-600 dark:text-neutral-300">
							No employee data available.
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default Attendence;

