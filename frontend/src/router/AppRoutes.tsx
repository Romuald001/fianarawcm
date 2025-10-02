const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Routes publiques */}
                <Route path="/login" element={<Login />}/>
            </Routes>
        </Router>
    );
};

export defaults AppRoutes;