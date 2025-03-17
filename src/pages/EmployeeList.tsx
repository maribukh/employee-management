import { useEffect, useState } from "react";
import { Employee } from "../types";
import "../styles.css"; 

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetch("/data/employees.json")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error loading employees:", error));
  }, []);

  return (
    <div className="container">
      <h1>Employee Management</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.name}</td>
              <td>{employee.department}</td>
              <td>{employee.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
