import axios from "axios";


const API = "http://localhost:8080/api/appoimentBooking";

export const getAllAppointments = () => axios.get(API);

export const createAppointment = (data: any) =>
axios.post(API, data);

export const getAppointmentById = (id: string) =>
axios.get(`${API}/${id}`);

export const getPatientAppointments = (patientId: string) =>
axios.get(`${API}/patient/${patientId}`);

export const getDoctorAppointments = (doctorId: string) =>
axios.get(`${API}/doctor/${doctorId}`);

export const updateAppointmentStatus = (
id: string,
status: string
) =>
axios.put(`${API}/${id}/status?status=${status}`);

export const checkInAppointment = (
id: string,
checkedInBy: string
) =>
axios.put(
`${API}/${id}/checkin?checkedInBy=${checkedInBy}`
);

export const deleteAppointment = (id: string) =>
axios.delete(`${API}/${id}`);