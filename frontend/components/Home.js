import React from 'react'
import pizza from './images/pizza.jpg'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <div>
      <h2>
        Welcome to Bloom Pizza!
      </h2>

      <img onClick={() => navigate('/order')} alt="order-pizza" style={{ cursor: 'pointer' }} src={pizza} />
    </div>
  )
}

export default Home
