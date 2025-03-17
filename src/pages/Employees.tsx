import { useEffect, useState } from "react";
import employees from "../data/employees.json";
import EmployeeForm from "../pages/EmployeeForm";
import { getEmployees, addEmployee, deleteEmployee } from "../api/employees";
import { Employee } from "../types";

const Employees = () => {
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getEmployees();
      setEmployeeList(data);
    };
    fetchEmployees();
  }, []);

  // Add employee via API
  const handleAddEmployee = async (newEmployee: Omit<Employee, "id">) => {
    const addedEmployee = await addEmployee(newEmployee);
    setEmployeeList([...employeeList, addedEmployee]);
  };

  // Delete employee via API
  const handleDeleteEmployee = async (id: number) => {
    await deleteEmployee(id);
    setEmployeeList(employeeList.filter((emp) => emp.id !== id));
  };

  return (
    <div>
      <h1>Employee Management</h1>

      <EmployeeForm onAddEmployee={handleAddEmployee} />

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Position</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.age}</td>
              <td>{emp.position}</td>
              <td>{emp.department}</td>
              <td>
                <button onClick={() => handleDeleteEmployee(emp.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
