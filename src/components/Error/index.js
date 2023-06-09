import { Alert } from 'antd'
import React from 'react'

const Error = () => {
  return (
    <Alert
      style={{
        width: 400,
        height: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 50,
        paddingTop: 13,
        textAlign: 'center',
      }}
      description="
    Something went wrong. Please, try again..."
      type="error"
    ></Alert>
  )
}

export default Error
