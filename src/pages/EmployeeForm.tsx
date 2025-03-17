import { useState } from "react";
import employees from "../data/employees.json";
import { Employee } from "../types";

type EmployeeFormProps = {
  onAddEmployee: (newEmployee: Omit<Employee, "id">) => void;
};

const EmployeeForm = ({ onAddEmployee }: EmployeeFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    position: "",
    department: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.age ||
      !formData.position ||
      !formData.department
    )
      return;

    onAddEmployee({
        name: formData.name,
        age: Number(formData.age),
        position: formData.position,
        department: formData.department,
        role: ""
    });

    setFormData({ name: "", age: "", position: "", department: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="position"
        placeholder="Position"
        value={formData.position}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="department"
        placeholder="Department"
        value={formData.department}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Employee</button>
    </form>
  );
};

export default EmployeeForm;
