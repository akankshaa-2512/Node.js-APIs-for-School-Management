const db = require("../config/db");

function isValidLatitude(lat) {
  return !isNaN(lat) && lat >= -90 && lat <= 90;
}

function isValidLongitude(lng) {
  return !isNaN(lng) && lng >= -180 && lng <= 180;
}

exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (
    !name ||
    !address ||
    !isValidLatitude(latitude) ||
    !isValidLongitude(longitude)
  ) {
    return res.status(400).json({ message: "Invalid input data." });
  }

  const query =
    "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: "School added successfully",
      schoolId: result.insertId,
    });
  });
};

exports.listSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  if (!isValidLatitude(latitude) || !isValidLongitude(longitude)) {
    return res.status(400).json({ message: "Invalid coordinates" });
  }

  const userLat = parseFloat(latitude);
  const userLng = parseFloat(longitude);

  const query = "SELECT * FROM schools";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // Earth radius in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const schoolsWithDistance = results.map((school) => ({
      ...school,
      distance: calculateDistance(
        userLat,
        userLng,
        school.latitude,
        school.longitude
      ),
    }));

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  });
};
