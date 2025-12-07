import React, { useEffect, useState } from "react"
import api from "../../assets/api/api"
import "../../styles/orders.css"

const PartnerOrders = () => {
  const [orders, setOrders] = useState([])

  const fetchOrders = async () => {
    try {
      const res = await api.get("/order/partner")
      setOrders(res.data.orders || [])
    } catch {
      setOrders([])
    }
  }

  const updateStatus = async (orderId, status) => {
    const prev = [...orders]
    setOrders(prev.map(o => o._id === orderId ? { ...o, status } : o))

    try {
      await api.patch("/order/status", { orderId, status })
    } catch (err) {
      console.log("Fail", err)
      setOrders(prev)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div className="orders-page">
      <h2>Incoming Orders</h2>

      {orders.length === 0 ? (
        <p className="empty-text">No orders from customers</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td>{o.food.name}</td>
                <td>{o.user.name}</td>
                <td>{o.status.toUpperCase()}</td>
                <td>
                  {o.status === "pending" && (
                    <>
                      <button
                        className="green"
                        onClick={() => updateStatus(o._id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="red"
                        onClick={() => updateStatus(o._id, "cancelled")}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div>
  )
}

export default PartnerOrders
