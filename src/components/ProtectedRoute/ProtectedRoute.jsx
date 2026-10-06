import React, {useState,useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session);
            setLoading(false);
        });
    }, []);

    if (loading) return null;

    return session ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
