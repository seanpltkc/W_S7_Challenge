import axios from "axios";
import { useEffect, useState } from "react";
import * as yup from "yup";

const schema = yup.object().shape({
    fullName: yup
        .string()
        .min(3, "Full name must be at least 3 characters")
        .max(20, "Full name must be at most 20 characters")
        .required("Full name is required"),
    shirtsize: yup
        .string()
        .oneOf(["S", "M", "L"], "Shirt size must be one of the following: S, M, L")
        .required("Shirt size is required"),
});

const initialFormValues = {
    fullName: "",
    shirtsize: "",
    animals: [],
};

const initialErrors = {
    fullName: "",
    shirtsize: "",
};

const animals = [
    { animal_id: "1", animal_name: "cat" },
    { animal_id: "2", animal_name: "dog" },
    { animal_id: "3", animal_name: "bird" },
    { animal_id: "4", animal_name: "fish" },
];

export const Information = () => {
    const [formValues, setFormValues] = useState(initialFormValues);
    const [errors, setErrors] = useState(initialErrors);
    const [isDisabled, setIsDisabled] = useState(true);
    const [message, setMessage] = useState("");

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });

        yup
            .reach(schema, name)
            .validate(value)
            .then(() => setErrors({ ...errors, [name]: "" }))
            .catch((error) => setErrors({ ...errors, [name]: error.errors[0] }));
    };

    const handleCheckboxChange = (e) => {
        const { checked, name } = e.target;
        if (checked) {
            setFormValues({ ...formValues, animals: [...formValues.animals, name] });
        } else {
            setFormValues({
                ...formValues,
                animals: formValues.animals.filter((aId) => aId !== name),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: response } = await axios.post(
                "http://localhost:9000/form-submission",
                formValues
            );
            setMessage(response.message);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    useEffect(() => {
        schema.isValid(formValues).then((valid) => setIsDisabled(!valid));
    }, [formValues]);

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg space-y-4"
        >
            {message && (
                <p className="text-center text-green-600 font-semibold">{message}</p>
            )}

            <div>
                <input
                    value={formValues.fullName}
                    name="fullName"
                    onChange={handleTextChange}
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                />
                {errors.fullName && (
                    <p className="text-red-500 text-sm">{errors.fullName}</p>
                )}
            </div>

            <div>
                <select
                    value={formValues.shirtsize}
                    name="shirtsize"
                    onChange={handleTextChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
                >
                    <option value="">Select Size</option>
                    <option value="S">Small</option>
                    <option value="M">Medium</option>
                    <option value="L">Large</option>
                </select>
                {errors.shirtsize && (
                    <p className="text-red-500 text-sm">{errors.shirtsize}</p>
                )}
            </div>

            <div className="space-y-2">
                {animals.map((animal) => (
                    <div key={animal.animal_id} className="flex items-center">
                        <input
                            onChange={handleCheckboxChange}
                            name={animal.animal_id}
                            checked={formValues.animals.includes(animal.animal_id)}
                            type="checkbox"
                            className="mr-2"
                        />
                        <label>{animal.animal_name}</label>
                    </div>
                ))}
            </div>

            <button
                disabled={isDisabled}
                className={`w-full px-4 py-2 rounded-md ${isDisabled
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
            >
                Submit
            </button>
        </form>
    );
};
