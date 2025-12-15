<div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <Header />
    <main>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/map" element={<Map />} />
            <Route path="/pharmacies" element={<AllPharmacies />} />
            <Route path="/pharmacy/:id" element={<PharmacyDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/pharmacies" element={<PharmaciesManagement />} />
            <Route path="/admin/schedule" element={<ScheduleManagement />} />
            <Route path="/admin/neighborhoods" element={<NeighborhoodsManagement />} />
            <Route path="/admin/reviews" element={<ReviewsManagement />} />
            <Route path="/admin/settings" element={<Settings />} />
        </Routes>
    </main>
    <Footer />
</div>
  );
}
