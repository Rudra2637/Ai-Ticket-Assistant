import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CheckAuth({ children }) {
    // Auth bypassed: always allow direct access to workspace
    return children;
}

export default CheckAuth;