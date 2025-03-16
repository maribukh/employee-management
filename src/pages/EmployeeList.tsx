import { useEffect, useState } from "react";
import { Employee } from "../types";
import React from "react";

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Load data from JSON file
  useEffect(() => {
    fetch("/data/employees.json")
      .then((response) => response.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error loading employee data:", error));
  }, []);

  return (
    <div>
      <h1>Employee Management</h1>
      <table border={1} cellPadding={10}>
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
