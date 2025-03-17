import { useState } from "react";
import employeesData from "../data/employees.json"; 
import "../styles.css";

const EmployeeList = () => {
  const [employees] = useState(
    employeesData.Employees.map((emp) => ({
      name: emp.preferredFullName, 
      department: emp.region || "Unknown", 
      role: emp.jobTitleName,
    }))
  );

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
