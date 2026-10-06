import React, { createContext, useContext, useState } from "react";
const DEFAULT_PROFILE= {
  id: 'usr-default',
  email: 'johndoe@gmail.com',
  fullName: 'John Doe',
  companyName: 'Services Pvt Ltd.',
  role: 'Administrator',
  phone: '+91 98765 43210',
  gstin: '29AAAAA0000A1Z5',
};
const AuthContext= createContext();
export const useAuth= ()=> useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(DEFAULT_PROFILE);
    const updateProfile = (data)=> {
        setProfile((prev) => ({ ...prev, ...data }));
    };
    return (
        <AuthContext.Provider value={{ user, setUser, profile, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
