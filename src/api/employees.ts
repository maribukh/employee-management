import axios from "axios";
import { Employee } from "../types";

const API_URL = "http://localhost:5000/employees";

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await axios.get<Employee[]>(API_URL);
  return response.data;
};

export const addEmployee = async (
  employee: Omit<Employee, "id">
): Promise<Employee> => {
  const response = await axios.post<Employee>(API_URL, employee);
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
