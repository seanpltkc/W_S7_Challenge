import React, { useEffect, useState } from 'react';
import e from "cors"
import axios from 'axios';
import * as yup from "yup";
// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const schema = yup.object().shape({
  fullName: yup.string().min(3, validationErrors.fullNameTooShort).max(20, validationErrors.fullNameTooLong).required(),
  size: yup.string().oneOf(["S", "M", "L"], validationErrors.sizeIncorrect).required(),
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]

const initialFormValues = {
  fullName: '',
  size: '',
  toppings: []
}

const initialErrors = {
  fullName: '',
  size: ''
}

export default function Form() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errors, setErrors] = useState(initialErrors);
  const [isDisabled, setIsDisabled] = useState(true);
  const [message, setMessage] = useState("");

  const handleTextChange = (e) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });

    yup
      .reach(schema, id)
      .validate(value.trim())
      .then(() => {
        setErrors({ ...errors, [id]: "" });
      })
      .catch((err) => {
        setErrors({ ...errors, [id]: err.errors[0] });
      });
  };

  useEffect(() => {
    schema.isValid(formValues).then((valid) => setIsDisabled(!valid));
  }, [formValues]);

  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    const newToppings = checked
      ? [...formValues.toppings, name]
      : formValues.toppings.filter((topping) => topping !== name);
    setFormValues({ ...formValues, toppings: newToppings })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("http://localhost:9009/api/order", formValues);
    setMessage(data.message);
    setFormValues(initialFormValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {message && <div className='success'>{message}</div>}


      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input onChange={handleTextChange} value={formValues.fullName} placeholder="Type full name" id="fullName" type="text" />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select value={formValues.size} id="size" onChange={handleTextChange}>
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input onClick={handleCheckBoxChange} checked={formValues.toppings.includes(topping.topping_id)} name={topping.topping_id} type='checkbox' />
            {topping.text}
            <br />
          </label>
        ))}
      </div>
      <input disabled={isDisabled} type="submit" />
    </form>
  )
}
